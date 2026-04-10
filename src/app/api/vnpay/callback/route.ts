import { NextRequest, NextResponse } from "next/server";
import { verifyReturnUrl } from "@/lib/vnpay";
import { createAdminClient } from "@/lib/supabase/server";

/**
 * VNPay Return URL — client redirect after payment.
 *
 * For sandbox mode (no IPN configuration available), this handler also
 * updates payment/order status in the database with idempotency checks.
 * If the IPN handler has already processed this order, the DB updates
 * are safely skipped.
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
        const url = new URL("/checkout/result", appUrl);

        if (!isValid) {
            url.searchParams.set("status", "invalid");
            return NextResponse.redirect(url);
        }

        // Update payment status in DB (idempotent — safe if IPN already processed)
        const supabase = await createAdminClient();
        const { data: order } = await supabase
            .from("orders")
            .select("id, status")
            .eq("order_number", orderNumber)
            .single();

        if (responseCode === "00" && transactionStatus === "00") {
            url.searchParams.set("status", "success");

            // Only update if not already processed by IPN
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

                console.info(
                    `[VNPay Callback] Payment SUCCESS for order ${orderNumber}`,
                );
            }
        } else {
            url.searchParams.set("status", "failed");
            url.searchParams.set("code", responseCode);

            // Only update if not already processed by IPN
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

                console.info(
                    `[VNPay Callback] Payment FAILED for order ${orderNumber}, code=${responseCode}`,
                );
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
