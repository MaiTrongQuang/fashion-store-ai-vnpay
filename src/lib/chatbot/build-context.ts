import type { SupabaseClient } from "@supabase/supabase-js";
import {
    DEFAULT_SHIPPING_FEE,
    FOOTER_LINKS,
    NAV_LINKS,
    ORDER_STATUS_MAP,
    PAYMENT_METHOD_MAP,
    PRODUCT_COLORS,
    PRODUCT_SIZES,
    SITE_CONTACT,
    SITE_DESCRIPTION,
    SITE_NAME,
} from "@/lib/constants";

const MAX_PRODUCTS = 40;
const MAX_DESC_CHARS = 200;

/** Card metadata returned alongside reply for rich product rendering. */
export type ChatbotProductCard = {
    slug: string;
    name: string;
    basePrice: number;
    salePrice: number | null;
    imageUrl: string | null;
    imageAlt: string | null;
    url: string;
};

export type ChatbotFaqRow = {
    question: string;
    answer: string;
    category: string | null;
};

export type ChatbotProductRow = {
    name: string;
    slug: string;
    base_price: number;
    sale_price: number | null;
    description: string | null;
    category: { name: string } | null;
};

export type ChatbotCategoryRow = {
    name: string;
    slug: string;
};

function truncateText(text: string, max: number): string {
    const t = text.trim();
    if (t.length <= max) return t;
    return `${t.slice(0, max)}…`;
}

function formatStaticSiteKnowledge(): string {
    const nav = NAV_LINKS.map((l) => `- ${l.label}: ${l.href}`).join("\n");
    const policies = FOOTER_LINKS.policy
        .map((l) => `- ${l.label}: ${l.href}`)
        .join("\n");
    const account = FOOTER_LINKS.account
        .map((l) => `- ${l.label}: ${l.href}`)
        .join("\n");
    const payments = Object.entries(PAYMENT_METHOD_MAP)
        .map(([k, v]) => `- ${k}: ${v}`)
        .join("\n");
    const orderStatuses = Object.entries(ORDER_STATUS_MAP)
        .map(([k, v]) => `- ${k}: ${v.label}`)
        .join("\n");

    return `Cửa hàng: ${SITE_NAME}
Mô tả: ${SITE_DESCRIPTION}

Liên hệ (chỉ dùng các thông tin sau khi cần hướng khách):
- Địa chỉ: ${SITE_CONTACT.address}
- Hotline: ${SITE_CONTACT.hotline}
- Email: ${SITE_CONTACT.email}
- Giờ làm việc: ${SITE_CONTACT.hours}
- Trang liên hệ: /contact

Phí ship mặc định (tham khảo): ${DEFAULT_SHIPPING_FEE.toLocaleString("vi-VN")}đ — chi tiết xem /policies/shipping

Thanh toán hỗ trợ:
${payments}

Trạng thái đơn hàng (tên kỹ thuật → hiển thị):
${orderStatuses}

Điều hướng chính:
${nav}

Chính sách & điều khoản:
${policies}

Tài khoản & giỏ:
${account}

Size phổ biến: ${PRODUCT_SIZES.join(", ")}
Màu (một phần): ${PRODUCT_COLORS.map((c) => c.name).join(", ")}`;
}

function formatFaqBlock(faqs: ChatbotFaqRow[]): string {
    if (!faqs?.length) return "(Chưa có FAQ trong hệ thống.)";
    return faqs
        .map(
            (f) =>
                `[${f.category || "chung"}] Q: ${f.question}\nA: ${f.answer}`,
        )
        .join("\n\n");
}

function formatCategoriesBlock(cats: ChatbotCategoryRow[]): string {
    if (!cats?.length) return "(Không có danh mục.)";
    return cats
        .map((c) => `- ${c.name} — /collections hoặc lọc theo slug: ${c.slug}`)
        .join("\n");
}

function formatProductsBlock(products: ChatbotProductRow[]): string {
    if (!products?.length) return "(Không có sản phẩm active.)";
    return products
        .map((p) => {
            const cat = p.category?.name || "";
            const price =
                p.sale_price != null
                    ? `Giá ${p.sale_price.toLocaleString("vi-VN")}đ (giảm từ ${p.base_price.toLocaleString("vi-VN")}đ)`
                    : `Giá ${p.base_price.toLocaleString("vi-VN")}đ`;
            const desc = p.description
                ? truncateText(p.description, MAX_DESC_CHARS)
                : "";
            const path = `/products/${p.slug}`;
            return `- ${p.name} (${cat}) — ${price}${desc ? ` — Mô tả rút gọn: ${desc}` : ""} — Link: ${path}`;
        })
        .join("\n");
}

/** Ghép khối dữ liệu động (FAQ, danh mục, sản phẩm) cho system instruction. */
export function buildDynamicStoreContext(
    faqs: ChatbotFaqRow[],
    categories: ChatbotCategoryRow[],
    products: ChatbotProductRow[],
): string {
    return `## FAQ (ưu tiên khi trùng câu hỏi)
${formatFaqBlock(faqs)}

## Danh mục
${formatCategoriesBlock(categories)}

## Sản phẩm đang bán (danh sách rút gọn, có thể không đủ toàn bộ catalog)
${formatProductsBlock(products)}`;
}

const SYSTEM_RULES_VI = `Bạn là trợ lý mua sắm AI của ${SITE_NAME}, trả lời bằng tiếng Việt, ngắn gọn, thân thiện.

QUY TẮC CHỐNG ẢO GIÁC (bắt buộc):
- Chỉ khẳng định số tiền, mã giảm giá, thời gian giao hàng cụ thể, hoặc chi tiết chính sách nếu thông tin đó xuất hiện trong phần "DỮ LIỆU CỬA HÀNG" bên dưới hoặc trong FAQ.
- Nếu khách hỏi thông tin không có trong dữ liệu: nói rõ bạn không thấy trong hệ thống, và hướng dẫn xem trang chính sách tương ứng (/policies/...) hoặc liên hệ ${SITE_CONTACT.hotline} / ${SITE_CONTACT.email} / trang /contact.
- Không đóng vai như bạn biết trạng thái đơn hàng, mã đơn, hoặc giỏ hàng của khách (không có dữ liệu tài khoản trong cuộc trò chuyện). Gợi ý vào mục "Đơn hàng" trong tài khoản (/account/orders).
- Không bịa mã khuyến mãi, % giảm, hoặc cam kết giao trong X ngày nếu không có trong FAQ/dữ liệu.
- Có thể gợi ý sản phẩm và đường dẫn /products/{slug} dựa trên danh sách sản phẩm được cung cấp.`;

/** System instruction đầy đủ cho một request (tĩnh + động). */
export function buildFullSystemInstruction(dynamicBlock: string): string {
    return `${SYSTEM_RULES_VI}

--- DỮ LIỆU CỬA HÀNG (chỉ được coi là đúng trong phạm vi này) ---

${formatStaticSiteKnowledge()}

${dynamicBlock}`;
}

export type ChatbotContextPayload = {
    faqs: ChatbotFaqRow[];
    categories: ChatbotCategoryRow[];
    products: ChatbotProductRow[];
};

/** Page context from client; slug is always re-validated on the server. */
export type ChatbotClientPageContext =
    | { type: "home" }
    | { type: "product"; slug: string };

function mapProductRow(p: Record<string, unknown>): ChatbotProductRow {
    const c = p.category;
    const catObj = Array.isArray(c) ? c[0] : c;
    const name =
        catObj &&
        typeof catObj === "object" &&
        catObj !== null &&
        "name" in catObj
            ? String((catObj as { name: string }).name)
            : "";
    return {
        name: String(p.name),
        slug: String(p.slug),
        base_price: Number(p.base_price),
        sale_price: p.sale_price == null ? null : Number(p.sale_price),
        description: p.description == null ? null : String(p.description),
        category: name ? { name } : null,
    };
}

export async function fetchActiveProductForChatbot(
    supabase: SupabaseClient,
    slug: string,
): Promise<ChatbotProductRow | null> {
    const trimmed = slug.trim();
    if (!trimmed) return null;

    const { data, error } = await supabase
        .from("products")
        .select(
            "name, slug, base_price, sale_price, description, category:categories(name)",
        )
        .eq("slug", trimmed)
        .eq("is_active", true)
        .maybeSingle();

    if (error || !data) {
        if (error) console.warn("chatbot active product:", error.message);
        return null;
    }

    return mapProductRow(data as Record<string, unknown>);
}

export function formatActiveProductContextBlock(p: ChatbotProductRow): string {
    const cat = p.category?.name || "—";
    const priceLine =
        p.sale_price != null
            ? `Giá ${p.sale_price.toLocaleString("vi-VN")}đ (giảm từ ${p.base_price.toLocaleString("vi-VN")}đ)`
            : `Giá ${p.base_price.toLocaleString("vi-VN")}đ`;
    const desc = p.description
        ? truncateText(p.description, MAX_DESC_CHARS * 2)
        : "";
    const link = `/products/${p.slug}`;
    const lines: string[] = [
        "## Ngữ cảnh: khách đang ở trang chi tiết sản phẩm (ưu tiên trả lời về SP này nếu câu hỏi liên quan).",
        `- Tên SP: ${p.name}`,
        `- Danh mục: ${cat}`,
        `- Giá (VND, hiển thị): ${priceLine}`,
        `- Đường dẫn: ${link}`,
    ];
    if (desc) lines.push(`- Mô tả rút gọn: ${desc}`);
    lines.push("");
    lines.push(
        "Nếu hỏi chung hoặc so sánh SP khác, có thể dùng thêm danh mục sản phẩm trong dữ liệu cửa hàng.",
    );
    return lines.join("\n");
}

export function normalizeChatbotPageContext(
    raw: unknown,
): ChatbotClientPageContext {
    if (!raw || typeof raw !== "object") return { type: "home" };
    const o = raw as Record<string, unknown>;
    if (o.type === "product" && typeof o.slug === "string" && o.slug.trim()) {
        return { type: "product", slug: o.slug.trim() };
    }
    return { type: "home" };
}

/** Load FAQ, categories, products from Supabase for the chatbot. */
export async function fetchChatbotContextData(
    supabase: SupabaseClient,
): Promise<ChatbotContextPayload> {
    const [faqRes, catRes, prodRes] = await Promise.all([
        supabase
            .from("chatbot_faqs")
            .select("question, answer, category")
            .eq("is_active", true)
            .order("sort_order"),
        supabase.from("categories").select("name, slug").order("name"),
        supabase
            .from("products")
            .select(
                "name, slug, base_price, sale_price, description, category:categories(name)",
            )
            .eq("is_active", true)
            .limit(MAX_PRODUCTS),
    ]);

    const faqs = (faqRes.error ? [] : faqRes.data ?? []) as ChatbotFaqRow[];
    const categories = (catRes.error ? [] : catRes.data ?? []) as ChatbotCategoryRow[];
    const rawProducts = prodRes.error ? [] : (prodRes.data ?? []);
        const products: ChatbotProductRow[] = rawProducts.map((p) =>
        mapProductRow(p as Record<string, unknown>),
    );

    if (faqRes.error) console.warn("chatbot_faqs:", faqRes.error.message);
    if (catRes.error) console.warn("categories:", catRes.error.message);
    if (prodRes.error) console.warn("products:", prodRes.error.message);

    return { faqs, categories, products };
}

// ---------------------------------------------------------------------------
// Product card enrichment — parse reply for /products/{slug} and fetch images
// ---------------------------------------------------------------------------

const PRODUCT_LINK_RE = /\/products\/([a-z0-9]+(?:-[a-z0-9]+)*)/gi;

/** Extract unique product slugs mentioned in a Gemini reply. */
export function extractProductSlugs(reply: string): string[] {
    const seen = new Set<string>();
    let m: RegExpExecArray | null;
    while ((m = PRODUCT_LINK_RE.exec(reply)) !== null) {
        seen.add(m[1]);
    }
    return [...seen];
}

/** Fetch product cards (name, price, primary image) for a list of slugs. */
export async function fetchProductCardsForReply(
    supabase: SupabaseClient,
    slugs: string[],
): Promise<ChatbotProductCard[]> {
    if (!slugs.length) return [];

    const { data, error } = await supabase
        .from("products")
        .select(
            "name, slug, base_price, sale_price, images:product_images(url, alt, is_primary)",
        )
        .eq("is_active", true)
        .in("slug", slugs);

    if (error) {
        console.warn("fetchProductCardsForReply:", error.message);
        return [];
    }

    return (data ?? []).map((p) => {
        const imgs = Array.isArray(p.images) ? p.images : [];
        const primary =
            imgs.find(
                (i: { is_primary?: boolean }) => i.is_primary,
            ) || imgs[0];
        return {
            slug: String(p.slug),
            name: String(p.name),
            basePrice: Number(p.base_price),
            salePrice: p.sale_price == null ? null : Number(p.sale_price),
            imageUrl: primary?.url ?? null,
            imageAlt: primary?.alt ?? null,
            url: `/products/${p.slug}`,
        };
    });
}