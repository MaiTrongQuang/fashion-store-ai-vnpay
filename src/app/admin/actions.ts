"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// ── Helper: verify admin ──
async function requireAdmin() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (profile?.role !== "admin") throw new Error("Forbidden");
    return supabase;
}

// ═══════════════════════════════════════════════════════════════
// ORDERS
// ═══════════════════════════════════════════════════════════════
export async function updateOrderStatus(orderId: string, newStatus: string) {
    const supabase = await requireAdmin();
    const { error } = await supabase
        .from("orders")
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq("id", orderId);

    if (error) throw new Error(error.message);

    // If marking as paid, update payment status too
    if (newStatus === "paid" || newStatus === "completed") {
        await supabase
            .from("payments")
            .update({
                status: "paid",
                paid_at: new Date().toISOString(),
            })
            .eq("order_id", orderId)
            .eq("status", "pending");
    }

    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${orderId}`);
    revalidatePath("/admin");
}

// ═══════════════════════════════════════════════════════════════
// PRODUCTS
// ═══════════════════════════════════════════════════════════════
export async function toggleProductActive(productId: string) {
    const supabase = await requireAdmin();
    const { data: product } = await supabase
        .from("products")
        .select("is_active")
        .eq("id", productId)
        .single();

    if (!product) throw new Error("Product not found");

    const { error } = await supabase
        .from("products")
        .update({ is_active: !product.is_active })
        .eq("id", productId);

    if (error) throw new Error(error.message);
    // Note: no revalidatePath here — the client uses optimistic local state
    // so the row stays in place. The page will refresh on next navigation.
}

export async function upsertProduct(payload: {
    id?: string;
    name: string;
    slug: string;
    description?: string;
    category_id?: string;
    brand_id?: string;
    base_price: number;
    sale_price?: number | null;
    is_active: boolean;
    is_featured: boolean;
    is_new: boolean;
    tags: string[];
    images: { url: string; alt?: string; is_primary: boolean; sort_order: number }[];
    variants: {
        id?: string;
        size: string;
        color: string;
        color_hex?: string;
        price: number;
        stock: number;
        sku: string;
        is_active: boolean;
    }[];
}) {
    const supabase = await requireAdmin();

    const productData = {
        name: payload.name,
        slug: payload.slug,
        description: payload.description || null,
        category_id: payload.category_id || null,
        brand_id: payload.brand_id || null,
        base_price: payload.base_price,
        sale_price: payload.sale_price || null,
        is_active: payload.is_active,
        is_featured: payload.is_featured,
        is_new: payload.is_new,
        tags: payload.tags,
        updated_at: new Date().toISOString(),
    };

    let productId = payload.id;

    if (productId) {
        // Update existing product
        const { error } = await supabase
            .from("products")
            .update(productData)
            .eq("id", productId);
        if (error) throw new Error(error.message);
    } else {
        // Insert new product
        const { data, error } = await supabase
            .from("products")
            .insert(productData)
            .select("id")
            .single();
        if (error) throw new Error(error.message);
        productId = data.id;
    }

    // ── Images: delete old, insert new ──
    await supabase.from("product_images").delete().eq("product_id", productId);
    if (payload.images.length > 0) {
        const { error: imgError } = await supabase.from("product_images").insert(
            payload.images.map((img, idx) => ({
                product_id: productId,
                url: img.url,
                alt: img.alt || null,
                is_primary: img.is_primary,
                sort_order: img.sort_order ?? idx,
            }))
        );
        if (imgError) throw new Error(imgError.message);
    }

    // ── Variants: delete removed, upsert existing + new ──
    // Get current variant IDs
    const { data: existingVariants } = await supabase
        .from("product_variants")
        .select("id")
        .eq("product_id", productId);

    const existingIds = new Set<string>((existingVariants || []).map((v: any) => v.id));
    const incomingIds = new Set<string | undefined>(payload.variants.filter((v) => v.id).map((v) => v.id));

    // Delete variants that are no longer present
    const toDelete = [...existingIds].filter((id) => !incomingIds.has(id));
    if (toDelete.length > 0) {
        await supabase.from("product_variants").delete().in("id", toDelete);
    }

    // Upsert each variant
    for (const variant of payload.variants) {
        const variantData = {
            product_id: productId,
            size: variant.size,
            color: variant.color,
            color_hex: variant.color_hex || null,
            price: variant.price,
            stock: variant.stock,
            sku: variant.sku,
            is_active: variant.is_active,
        };

        if (variant.id && existingIds.has(variant.id)) {
            const { error } = await supabase
                .from("product_variants")
                .update(variantData)
                .eq("id", variant.id);
            if (error) throw new Error(`Variant error: ${error.message}`);
        } else {
            const { error } = await supabase
                .from("product_variants")
                .insert(variantData);
            if (error) throw new Error(`Variant error: ${error.message}`);
        }
    }

    revalidatePath("/admin/products");
    revalidatePath("/admin");
}

export async function deleteProduct(productId: string) {
    const supabase = await requireAdmin();

    // Delete related data first (cascading may not be set up)
    await supabase.from("product_images").delete().eq("product_id", productId);
    await supabase.from("product_variants").delete().eq("product_id", productId);

    const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", productId);

    if (error) throw new Error(error.message);
    revalidatePath("/admin/products");
    revalidatePath("/admin");
}

// ═══════════════════════════════════════════════════════════════
// CATEGORIES
// ═══════════════════════════════════════════════════════════════
export async function upsertCategory(formData: FormData) {
    const supabase = await requireAdmin();
    const id = formData.get("id") as string | null;
    const data = {
        name: formData.get("name") as string,
        slug: formData.get("slug") as string,
        description: (formData.get("description") as string) || null,
        image_url: (formData.get("image_url") as string) || null,
        parent_id: (formData.get("parent_id") as string) || null,
        is_active: formData.get("is_active") === "true",
        sort_order: Number(formData.get("sort_order")) || 0,
    };

    if (id) {
        const { error } = await supabase
            .from("categories")
            .update({ ...data, updated_at: new Date().toISOString() })
            .eq("id", id);
        if (error) throw new Error(error.message);
    } else {
        const { error } = await supabase.from("categories").insert(data);
        if (error) throw new Error(error.message);
    }

    revalidatePath("/admin/categories");
}

export async function deleteCategory(id: string) {
    const supabase = await requireAdmin();
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) throw new Error(error.message);
    revalidatePath("/admin/categories");
}

// ═══════════════════════════════════════════════════════════════
// BRANDS
// ═══════════════════════════════════════════════════════════════
export async function upsertBrand(formData: FormData) {
    const supabase = await requireAdmin();
    const id = formData.get("id") as string | null;
    const data = {
        name: formData.get("name") as string,
        slug: formData.get("slug") as string,
        logo_url: (formData.get("logo_url") as string) || null,
        description: (formData.get("description") as string) || null,
        is_active: formData.get("is_active") === "true",
    };

    if (id) {
        const { error } = await supabase
            .from("brands")
            .update(data)
            .eq("id", id);
        if (error) throw new Error(error.message);
    } else {
        const { error } = await supabase.from("brands").insert(data);
        if (error) throw new Error(error.message);
    }

    revalidatePath("/admin/brands");
}

export async function deleteBrand(id: string) {
    const supabase = await requireAdmin();
    const { error } = await supabase.from("brands").delete().eq("id", id);
    if (error) throw new Error(error.message);
    revalidatePath("/admin/brands");
}

// ═══════════════════════════════════════════════════════════════
// REVIEWS
// ═══════════════════════════════════════════════════════════════
export async function toggleReviewVisibility(reviewId: string) {
    const supabase = await requireAdmin();
    const { data: review } = await supabase
        .from("reviews")
        .select("is_visible")
        .eq("id", reviewId)
        .single();

    if (!review) throw new Error("Review not found");

    const { error } = await supabase
        .from("reviews")
        .update({ is_visible: !review.is_visible })
        .eq("id", reviewId);

    if (error) throw new Error(error.message);
    revalidatePath("/admin/reviews");
}

// ═══════════════════════════════════════════════════════════════
// VOUCHERS
// ═══════════════════════════════════════════════════════════════
export async function upsertVoucher(formData: FormData) {
    const supabase = await requireAdmin();
    const id = formData.get("id") as string | null;
    const data = {
        code: (formData.get("code") as string).toUpperCase(),
        type: formData.get("type") as string,
        value: Number(formData.get("value")),
        min_order: Number(formData.get("min_order")) || 0,
        max_discount: formData.get("max_discount")
            ? Number(formData.get("max_discount"))
            : null,
        usage_limit: Number(formData.get("usage_limit")) || 1,
        starts_at: formData.get("starts_at") as string,
        expires_at: formData.get("expires_at") as string,
        is_active: formData.get("is_active") === "true",
    };

    if (id) {
        const { error } = await supabase
            .from("vouchers")
            .update(data)
            .eq("id", id);
        if (error) throw new Error(error.message);
    } else {
        const { error } = await supabase.from("vouchers").insert(data);
        if (error) throw new Error(error.message);
    }

    revalidatePath("/admin/vouchers");
}

export async function deleteVoucher(id: string) {
    const supabase = await requireAdmin();
    const { error } = await supabase.from("vouchers").delete().eq("id", id);
    if (error) throw new Error(error.message);
    revalidatePath("/admin/vouchers");
}

// ═══════════════════════════════════════════════════════════════
// BANNERS
// ═══════════════════════════════════════════════════════════════
export async function upsertBanner(formData: FormData) {
    const supabase = await requireAdmin();
    const id = formData.get("id") as string | null;
    const data = {
        title: formData.get("title") as string,
        subtitle: (formData.get("subtitle") as string) || null,
        image_url: formData.get("image_url") as string,
        link_url: (formData.get("link_url") as string) || null,
        is_active: formData.get("is_active") === "true",
        sort_order: Number(formData.get("sort_order")) || 0,
    };

    if (id) {
        const { error } = await supabase
            .from("banners")
            .update(data)
            .eq("id", id);
        if (error) throw new Error(error.message);
    } else {
        const { error } = await supabase.from("banners").insert(data);
        if (error) throw new Error(error.message);
    }

    revalidatePath("/admin/banners");
}

export async function deleteBanner(id: string) {
    const supabase = await requireAdmin();
    const { error } = await supabase.from("banners").delete().eq("id", id);
    if (error) throw new Error(error.message);
    revalidatePath("/admin/banners");
}

// ═══════════════════════════════════════════════════════════════
// CHATBOT FAQ
// ═══════════════════════════════════════════════════════════════
export async function upsertFAQ(formData: FormData) {
    const supabase = await requireAdmin();
    const id = formData.get("id") as string | null;
    const data = {
        question: formData.get("question") as string,
        answer: formData.get("answer") as string,
        category: (formData.get("category") as string) || null,
        sort_order: Number(formData.get("sort_order")) || 0,
        is_active: formData.get("is_active") === "true",
    };

    if (id) {
        const { error } = await supabase
            .from("chatbot_faqs")
            .update(data)
            .eq("id", id);
        if (error) throw new Error(error.message);
    } else {
        const { error } = await supabase.from("chatbot_faqs").insert(data);
        if (error) throw new Error(error.message);
    }

    revalidatePath("/admin/chatbot");
}

export async function deleteFAQ(id: string) {
    const supabase = await requireAdmin();
    const { error } = await supabase.from("chatbot_faqs").delete().eq("id", id);
    if (error) throw new Error(error.message);
    revalidatePath("/admin/chatbot");
}
