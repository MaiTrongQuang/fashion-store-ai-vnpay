import { NextRequest, NextResponse } from "next/server";
import { verifyReturnUrl, VNPAY_RESPONSE_CODES } from "@/lib/vnpay";

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

        const url = new URL("/checkout/result", appUrl);

        if (responseCode === "00" && transactionStatus === "00") {
            url.searchParams.set("status", "success");
        } else {
            url.searchParams.set("status", "failed");
            url.searchParams.set("code", responseCode);
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
