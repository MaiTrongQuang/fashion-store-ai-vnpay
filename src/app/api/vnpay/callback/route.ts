import { NextRequest, NextResponse } from "next/server";
import { verifyReturnUrl, VNPAY_RESPONSE_CODES } from "@/lib/vnpay";
import { createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

/**
 * VNPay Return URL — client redirect after payment.
 *
 * Per VNPay documentation:
 *   - This URL only verifies checksum and displays result to the customer.
 *   - Do NOT update payment status here — that's handled by the IPN URL.
 *
 * We verify the hash, then redirect to /checkout/result with appropriate status params.
 */
export async function GET(request: NextRequest) {
    try {
        const searchParams = Object.fromEntries(request.nextUrl.searchParams);
        const { isValid, responseCode, transactionStatus } =
            verifyReturnUrl(searchParams);

        const orderNumber = searchParams["vnp_TxnRef"] || "";
        const transactionNo = searchParams["vnp_TransactionNo"] || "";
        const vnpAmount = searchParams["vnp_Amount"]
            ? (parseInt(searchParams["vnp_Amount"]) / 100).toString()
            : "0";
        const bankCode = searchParams["vnp_BankCode"] || "";

        const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

        if (!isValid) {
            const url = new URL("/checkout/result", appUrl);
            url.searchParams.set("status", "invalid");
            return NextResponse.redirect(url);
        }

        const supabase = await createAdminClient();
        const url = new URL("/checkout/result", appUrl);

        // Fetch order to verify idempotency (don't update if already processed by IPN)
        const { data: order } = await supabase
            .from("orders")
            .select("id, status")
            .eq("order_number", orderNumber)
            .single();

        if (responseCode === "00" && transactionStatus === "00") {
            // Payment success
            url.searchParams.set("status", "success");

            if (order && order.status === "awaiting_payment") {
                await supabase
                    .from("orders")
                    .update({ status: "paid", updated_at: new Date().toISOString() })
                    .eq("id", order.id);

                await supabase
                    .from("payments")
                    .update({
                        status: "paid",
                        vnpay_transaction_no: transactionNo,
                        vnpay_response_code: responseCode,
                        vnpay_txn_ref: orderNumber,
                        paid_at: new Date().toISOString(),
                    })
                    .eq("order_id", order.id);

                revalidatePath("/account/orders");
                revalidatePath(`/account/orders/${order.id}`);
            }
        } else {
            // Payment failed
            url.searchParams.set("status", "failed");
            url.searchParams.set("code", responseCode);

            if (order && order.status === "awaiting_payment") {
                await supabase
                    .from("orders")
                    .update({ status: "payment_failed", updated_at: new Date().toISOString() })
                    .eq("id", order.id);

                await supabase
                    .from("payments")
                    .update({
                        status: "failed",
                        vnpay_response_code: responseCode,
                        vnpay_txn_ref: orderNumber,
                    })
                    .eq("order_id", order.id);

                // Restore stock
                const { data: orderItems } = await supabase
                    .from("order_items")
                    .select("variant_id, quantity")
                    .eq("order_id", order.id);

                if (orderItems) {
                    for (const item of orderItems) {
                        await supabase.rpc("restore_variant_stock", {
                            p_variant_id: item.variant_id,
                            p_quantity: item.quantity,
                        });
                    }
                }

                revalidatePath("/account/orders");
                revalidatePath(`/account/orders/${order.id}`);
            }
        }

        url.searchParams.set("order", orderNumber);
        url.searchParams.set("txn", transactionNo);
        url.searchParams.set("amount", vnpAmount);
        url.searchParams.set("bank", bankCode);

        return NextResponse.redirect(url);
    } catch (error) {
        console.error("VNPay callback error:", error);
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
        return NextResponse.redirect(
            new URL("/checkout/result?status=error", appUrl),
        );
    }
}
