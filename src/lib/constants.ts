export const SITE_NAME = "LUXE Fashion";
export const SITE_DESCRIPTION =
    "Hệ thống bán quần áo trực tuyến - Thời trang cao cấp";

/** Single source for chatbot + contact pages (địa chỉ, hotline, email, giờ làm việc). */
export const SITE_CONTACT = {
    address: "123 Nguyễn Văn Linh, Quận 7, TP.HCM",
    mapQueryUrl:
        "https://maps.google.com/?q=123+Nguyen+Van+Linh+District+7+HCMC",
    hotline: "0896 002 085",
    zalo: "0896002085",
    email: "maitrongquang.ptt@gmail.com",
    facebook: "https://www.facebook.com/profile.php?id=61575360646065",
    hours: "T2 – T7: 8:00 – 21:00 · CN: 9:00 – 18:00",
} as const;

export const ORDER_STATUS_MAP: Record<
    string,
    { label: string; color: string }
> = {
    pending: { label: "Chờ xử lý", color: "bg-yellow-100 text-yellow-800" },
    awaiting_payment: {
        label: "Chờ thanh toán",
        color: "bg-orange-100 text-orange-800",
    },
    paid: { label: "Đã thanh toán", color: "bg-blue-100 text-blue-800" },
    processing: { label: "Đang xử lý", color: "bg-indigo-100 text-indigo-800" },
    shipping: {
        label: "Đang giao hàng",
        color: "bg-purple-100 text-purple-800",
    },
    completed: { label: "Hoàn thành", color: "bg-green-100 text-green-800" },
    cancelled: { label: "Đã hủy", color: "bg-red-100 text-red-800" },
    payment_failed: {
        label: "Thanh toán thất bại",
        color: "bg-red-100 text-red-800",
    },
};

export const PAYMENT_METHOD_MAP: Record<string, string> = {
    cod: "Thanh toán khi nhận hàng (COD)",
    vnpay: "Thanh toán qua VNPay",
};

export const DEFAULT_SHIPPING_FEE = 30000;

export const PRODUCT_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "3XL"];

export const PRODUCT_COLORS = [
    { name: "Đen", hex: "#1a1a1a" },
    { name: "Trắng", hex: "#ffffff" },
    { name: "Xám", hex: "#6b7280" },
    { name: "Đỏ", hex: "#ef4444" },
    { name: "Xanh dương", hex: "#3b82f6" },
    { name: "Xanh lá", hex: "#22c55e" },
    { name: "Vàng", hex: "#eab308" },
    { name: "Hồng", hex: "#ec4899" },
    { name: "Tím", hex: "#8b5cf6" },
    { name: "Cam", hex: "#f97316" },
    { name: "Nâu", hex: "#92400e" },
    { name: "Be", hex: "#d4c5a9" },
    { name: "Navy", hex: "#1e3a5f" },
];

export const NAV_LINKS = [
    { href: "/", label: "Trang chủ" },
    { href: "/products", label: "Sản phẩm" },
    { href: "/collections/nam", label: "Nam" },
    { href: "/collections/nu", label: "Nữ" },
    { href: "/collections/sale", label: "Sale", highlight: true },
    { href: "/about", label: "Giới thiệu" },
    { href: "/contact", label: "Liên hệ" },
];

export const FOOTER_LINKS = {
    about: [
        { href: "/about", label: "Về chúng tôi" },
        { href: "/contact", label: "Liên hệ" },
    ],
    policy: [
        { href: "/policies/shipping", label: "Chính sách vận chuyển" },
        { href: "/policies/return", label: "Chính sách đổi trả" },
        { href: "/policies/privacy", label: "Chính sách bảo mật" },
        { href: "/policies/terms", label: "Điều khoản sử dụng" },
    ],
    account: [
        { href: "/account", label: "Tài khoản" },
        { href: "/account/orders", label: "Đơn hàng" },
        { href: "/account/wishlist", label: "Yêu thích" },
        { href: "/cart", label: "Giỏ hàng" },
    ],
};
