import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { verifyReturnUrl } from "@/lib/vnpay";

export async function GET(request: NextRequest) {
    try {
        const searchParams = Object.fromEntries(request.nextUrl.searchParams);
        const { isValid, responseCode } = verifyReturnUrl(searchParams);

        if (!isValid) {
            return NextResponse.redirect(
                new URL("/checkout/result?status=invalid", request.url),
            );
        }

        const orderNumber = searchParams["vnp_TxnRef"];
        const transactionNo = searchParams["vnp_TransactionNo"];
        const supabase = await createAdminClient();

        // Get order
        const { data: order } = await supabase
            .from("orders")
            .select("id, status")
            .eq("order_number", orderNumber)
            .single();

        if (!order) {
            return NextResponse.redirect(
                new URL("/checkout/result?status=not_found", request.url),
            );
        }

        // Prevent duplicate updates
        if (order.status !== "awaiting_payment") {
            return NextResponse.redirect(
                new URL(
                    `/checkout/result?status=already_processed&order=${orderNumber}`,
                    request.url,
                ),
            );
        }

        if (responseCode === "00") {
            // Payment successful
            await supabase
                .from("orders")
                .update({ status: "paid" })
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

            return NextResponse.redirect(
                new URL(
                    `/checkout/result?status=success&order=${orderNumber}`,
                    request.url,
                ),
            );
        } else {
            // Payment failed
            await supabase
                .from("orders")
                .update({ status: "payment_failed" })
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
                    const { data: variant } = await supabase
                        .from("product_variants")
                        .select("stock")
                        .eq("id", item.variant_id)
                        .single();
                    if (variant) {
                        await supabase
                            .from("product_variants")
                            .update({ stock: variant.stock + item.quantity })
                            .eq("id", item.variant_id);
                    }
                }
            }

            return NextResponse.redirect(
                new URL(
                    `/checkout/result?status=failed&order=${orderNumber}`,
                    request.url,
                ),
            );
        }
    } catch (error) {
        console.error("VNPay callback error:", error);
        return NextResponse.redirect(
            new URL("/checkout/result?status=error", request.url),
        );
    }
}
