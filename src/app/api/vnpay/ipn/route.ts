import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { verifyReturnUrl } from "@/lib/vnpay";


/**
 * VNPay IPN (Instant Payment Notification) — server-to-server.
 *
 * This is the authoritative endpoint for payment status updates.
 * VNPay calls this URL to notify us of the payment result.
 * We MUST respond with { RspCode, Message } JSON.
 *
 * VNPay IPN retry policy:
 *   - RspCode 00, 02 → VNPay stops retrying
 *   - RspCode 01, 04, 97, 99 or timeout → VNPay retries up to 10 times, every 5 min
 */
export async function GET(request: NextRequest) {
    try {
        const searchParams = Object.fromEntries(request.nextUrl.searchParams);

        // 1. Verify checksum
        const { isValid, responseCode, transactionStatus } =
            verifyReturnUrl(searchParams);

        if (!isValid) {
            console.error("[VNPay IPN] Invalid checksum");
            return NextResponse.json(
                { RspCode: "97", Message: "Invalid signature" },
                { status: 200 },
            );
        }

        const orderNumber = searchParams["vnp_TxnRef"];
        const transactionNo = searchParams["vnp_TransactionNo"];
        const vnpAmount = parseInt(searchParams["vnp_Amount"] || "0") / 100;

        const supabase = await createAdminClient();

        // 2. Find the order
        const { data: order } = await supabase
            .from("orders")
            .select("id, status, total")
            .eq("order_number", orderNumber)
            .single();

        if (!order) {
            console.error(
                `[VNPay IPN] Order not found: ${orderNumber}`,
            );
            return NextResponse.json(
                { RspCode: "01", Message: "Order not found" },
                { status: 200 },
            );
        }

        // 3. Validate amount
        if (order.total !== vnpAmount) {
            console.error(
                `[VNPay IPN] Amount mismatch: order=${order.total}, vnpay=${vnpAmount}`,
            );
            return NextResponse.json(
                { RspCode: "04", Message: "Invalid amount" },
                { status: 200 },
            );
        }

        // 4. Check if already processed (idempotency)
        if (order.status !== "awaiting_payment") {
            console.info(
                `[VNPay IPN] Order ${orderNumber} already processed (status: ${order.status})`,
            );
            return NextResponse.json(
                { RspCode: "02", Message: "Order already confirmed" },
                { status: 200 },
            );
        }

        // 5. Process payment result
        if (responseCode === "00" && transactionStatus === "00") {
            // Payment successful
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
                `[VNPay IPN] Payment SUCCESS for order ${orderNumber}, txn=${transactionNo}`,
            );

        } else {
            // Payment failed
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

            // Restore stock atomically using RPC or sequential updates
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
                `[VNPay IPN] Payment FAILED for order ${orderNumber}, code=${responseCode}`,
            );

        }

        return NextResponse.json(
            { RspCode: "00", Message: "Confirm Success" },
            { status: 200 },
        );
    } catch (error) {
        console.error("[VNPay IPN] Error:", error);
        return NextResponse.json(
            { RspCode: "99", Message: "Unknown error" },
            { status: 200 },
        );
    }
}
