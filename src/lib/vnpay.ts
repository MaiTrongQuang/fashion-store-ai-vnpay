import crypto from "crypto";
import querystring from "qs";

export interface VNPayConfig {
    tmnCode: string;
    hashSecret: string;
    vnpUrl: string;
    returnUrl: string;
}

function getConfig(): VNPayConfig {
    return {
        tmnCode: process.env.VNPAY_TMN_CODE!,
        hashSecret: process.env.VNPAY_HASH_SECRET!,
        vnpUrl: process.env.VNPAY_URL!,
        returnUrl: process.env.VNPAY_RETURN_URL!,
    };
}

function sortObject(obj: Record<string, string>) {
    const sorted: Record<string, string> = {};
    const keys = Object.keys(obj).sort();
    for (const key of keys) {
        sorted[key] = obj[key];
    }
    return sorted;
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
    const date = new Date();

    const createDate = date
        .toISOString()
        .replace(/[-:T.Z]/g, "")
        .slice(0, 14);

    const vnpParams: Record<string, string> = {
        vnp_Version: "2.1.0",
        vnp_Command: "pay",
        vnp_TmnCode: config.tmnCode,
        vnp_Locale: locale,
        vnp_CurrCode: "VND",
        vnp_TxnRef: orderId,
        vnp_OrderInfo: orderInfo,
        vnp_OrderType: "other",
        vnp_Amount: (amount * 100).toString(),
        vnp_ReturnUrl: config.returnUrl,
        vnp_IpAddr: ipAddr,
        vnp_CreateDate: createDate,
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
    };
}
