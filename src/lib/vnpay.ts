import crypto from "crypto";
import querystring from "qs";

export interface VNPayConfig {
    tmnCode: string;
    hashSecret: string;
    vnpUrl: string;
    returnUrl: string;
}

function getConfig(): VNPayConfig {
    const appUrl = (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(/\/+$/, "");
    return {
        tmnCode: process.env.VNPAY_TMN_CODE!,
        hashSecret: process.env.VNPAY_HASH_SECRET!,
        vnpUrl: process.env.VNPAY_URL!,
        returnUrl: process.env.VNPAY_RETURN_URL || `${appUrl}/api/vnpay/callback`,
    };
}

function sortObject(obj: Record<string, string>) {
    const sorted: Record<string, string> = {};
    const keys = Object.keys(obj)
        .map((key) => encodeURIComponent(key))
        .sort();

    for (const key of keys) {
        // VNPay expects spaces to be encoded as '+' in the signature building process
        const val = obj[decodeURIComponent(key)];
        if (val !== undefined && val !== null) {
            sorted[key] = encodeURIComponent(val.toString()).replace(/%20/g, "+");
        }
    }
    return sorted;
}

/**
 * Remove Vietnamese diacritics to satisfy VNPay's
 * "Tiếng Việt không dấu và không bao gồm các ký tự đặc biệt" requirement.
 */
function removeVietnameseTones(str: string): string {
    return str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/Đ/g, "D")
        .replace(/[^a-zA-Z0-9 ]/g, "");
}

/**
 * Format a Date into VNPay's yyyyMMddHHmmss format using Asia/Ho_Chi_Minh timezone.
 */
function formatVNPayDate(date: Date): string {
    const pad = (n: number) => n.toString().padStart(2, "0");
    // Use Vietnam timezone (UTC+7) explicitly
    const vnDate = new Date(
        date.toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" }),
    );
    return (
        vnDate.getFullYear().toString() +
        pad(vnDate.getMonth() + 1) +
        pad(vnDate.getDate()) +
        pad(vnDate.getHours()) +
        pad(vnDate.getMinutes()) +
        pad(vnDate.getSeconds())
    );
}

export function createPaymentUrl({
    orderId,
    amount,
    orderInfo,
    ipAddr,
    locale = "vn",
}: {
    orderId: string;
    amount: number;
    orderInfo: string;
    ipAddr: string;
    locale?: string;
}): string {
    const config = getConfig();
    const now = new Date();

    const createDate = formatVNPayDate(now);
    // Expire after 15 minutes (VNPay recommended)
    const expireDate = formatVNPayDate(
        new Date(now.getTime() + 15 * 60 * 1000),
    );

    const vnpParams: Record<string, string> = {
        vnp_Version: "2.1.0",
        vnp_Command: "pay",
        vnp_TmnCode: config.tmnCode,
        vnp_Locale: locale,
        vnp_CurrCode: "VND",
        vnp_TxnRef: orderId,
        vnp_OrderInfo: removeVietnameseTones(orderInfo),
        vnp_OrderType: "other",
        vnp_Amount: (amount * 100).toString(),
        vnp_ReturnUrl: config.returnUrl,
        vnp_IpAddr: ipAddr,
        vnp_CreateDate: createDate,
        vnp_ExpireDate: expireDate,
    };

    const sorted = sortObject(vnpParams);
    const signData = querystring.stringify(sorted, { encode: false });
    const hmac = crypto.createHmac("sha512", config.hashSecret);
    const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

    sorted["vnp_SecureHash"] = signed;

    return `${config.vnpUrl}?${querystring.stringify(sorted, { encode: false })}`;
}

export function verifyReturnUrl(vnpParams: Record<string, string>): {
    isValid: boolean;
    responseCode: string;
    transactionStatus: string;
} {
    const config = getConfig();
    const secureHash = vnpParams["vnp_SecureHash"];

    const params = { ...vnpParams };
    delete params["vnp_SecureHash"];
    delete params["vnp_SecureHashType"];

    const sorted = sortObject(params);
    const signData = querystring.stringify(sorted, { encode: false });
    const hmac = crypto.createHmac("sha512", config.hashSecret);
    const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

    return {
        isValid: secureHash === signed,
        responseCode: vnpParams["vnp_ResponseCode"] || "",
        transactionStatus: vnpParams["vnp_TransactionStatus"] || "",
    };
}

/** VNPay response code descriptions (Vietnamese) */
export const VNPAY_RESPONSE_CODES: Record<string, string> = {
    "00": "Giao dịch thành công",
    "07": "Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường).",
    "09": "Thẻ/Tài khoản chưa đăng ký dịch vụ InternetBanking tại ngân hàng.",
    "10": "Xác thực thông tin thẻ/tài khoản không đúng quá 3 lần.",
    "11": "Đã hết hạn chờ thanh toán. Xin quý khách vui lòng thực hiện lại giao dịch.",
    "12": "Thẻ/Tài khoản bị khóa.",
    "13": "Quý khách nhập sai mật khẩu xác thực giao dịch (OTP).",
    "24": "Khách hàng hủy giao dịch.",
    "51": "Tài khoản không đủ số dư để thực hiện giao dịch.",
    "65": "Tài khoản đã vượt quá hạn mức giao dịch trong ngày.",
    "75": "Ngân hàng thanh toán đang bảo trì.",
    "79": "Nhập sai mật khẩu thanh toán quá số lần quy định.",
    "99": "Lỗi không xác định.",
};
