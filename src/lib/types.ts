// ===== User & Auth =====
export type UserRole = "customer" | "admin";

export interface Profile {
    id: string;
    email: string;
    full_name: string | null;
    phone: string | null;
    avatar_url: string | null;
    role: UserRole;
    created_at: string;
    updated_at: string;
}

export interface Address {
    id: string;
    user_id: string;
    full_name: string;
    phone: string;
    province: string;
    district: string;
    ward: string;
    street: string;
    is_default: boolean;
    created_at: string;
}

// ===== Catalog =====
export interface Category {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    image_url: string | null;
    parent_id: string | null;
    is_active: boolean;
    sort_order: number;
    created_at: string;
    updated_at: string;
}

export interface Brand {
    id: string;
    name: string;
    slug: string;
    logo_url: string | null;
    description: string | null;
    is_active: boolean;
    created_at: string;
}

export interface Product {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    category_id: string | null;
    brand_id: string | null;
    base_price: number;
    sale_price: number | null;
    is_active: boolean;
    is_featured: boolean;
    is_new: boolean;
    tags: string[];
    created_at: string;
    updated_at: string;
    // Relations
    category?: Category;
    brand?: Brand;
    variants?: ProductVariant[];
    images?: ProductImage[];
    reviews?: Review[];
}

export interface ProductVariant {
    id: string;
    product_id: string;
    size: string;
    color: string;
    color_hex: string | null;
    price: number;
    stock: number;
    sku: string;
    is_active: boolean;
    created_at: string;
}

export interface ProductImage {
    id: string;
    product_id: string;
    url: string;
    alt: string | null;
    is_primary: boolean;
    sort_order: number;
    created_at: string;
}

// ===== Cart =====
export interface Cart {
    id: string;
    user_id: string | null;
    session_id: string | null;
    created_at: string;
    updated_at: string;
    items?: CartItem[];
}

export interface CartItem {
    id: string;
    cart_id: string;
    variant_id: string;
    quantity: number;
    created_at: string;
    variant?: ProductVariant & { product?: Product };
}

// ===== Wishlist =====
export interface WishlistItem {
    id: string;
    user_id: string;
    product_id: string;
    created_at: string;
    product?: Product;
}

// ===== Orders =====
export type OrderStatus =
    | "pending"
    | "awaiting_payment"
    | "paid"
    | "processing"
    | "shipping"
    | "completed"
    | "cancelled"
    | "payment_failed";

export type PaymentMethod = "cod" | "vnpay";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export interface Order {
    id: string;
    user_id: string;
    order_number: string;
    status: OrderStatus;
    subtotal: number;
    discount: number;
    shipping_fee: number;
    total: number;
    payment_method: PaymentMethod;
    shipping_name: string;
    shipping_phone: string;
    shipping_address: string;
    voucher_id: string | null;
    note: string | null;
    created_at: string;
    updated_at: string;
    items?: OrderItem[];
    payment?: Payment;
}

export interface OrderItem {
    id: string;
    order_id: string;
    variant_id: string;
    product_name: string;
    product_image: string | null;
    size: string;
    color: string;
    price: number;
    quantity: number;
    created_at: string;
}

export interface Payment {
    id: string;
    order_id: string;
    method: PaymentMethod;
    status: PaymentStatus;
    amount: number;
    vnpay_txn_ref: string | null;
    vnpay_transaction_no: string | null;
    vnpay_response_code: string | null;
    paid_at: string | null;
    created_at: string;
}

// ===== Voucher =====
export type VoucherType = "percentage" | "fixed";

export interface Voucher {
    id: string;
    code: string;
    type: VoucherType;
    value: number;
    min_order: number;
    max_discount: number | null;
    usage_limit: number;
    used_count: number;
    starts_at: string;
    expires_at: string;
    is_active: boolean;
    created_at: string;
}

// ===== Review =====
export interface Review {
    id: string;
    user_id: string;
    product_id: string;
    order_id: string;
    rating: number;
    comment: string | null;
    is_visible: boolean;
    created_at: string;
    profile?: Profile;
}

// ===== Banner =====
export interface Banner {
    id: string;
    title: string;
    subtitle: string | null;
    image_url: string;
    link_url: string | null;
    is_active: boolean;
    sort_order: number;
    created_at: string;
}

// ===== Chatbot =====
export interface ChatbotFAQ {
    id: string;
    question: string;
    answer: string;
    category: string | null;
    sort_order: number;
    is_active: boolean;
    created_at: string;
}

export interface ChatbotConversation {
    id: string;
    user_id: string | null;
    session_id: string | null;
    created_at: string;
}

export interface ChatbotMessage {
    id: string;
    conversation_id: string;
    role: "user" | "assistant";
    content: string;
    created_at: string;
}
