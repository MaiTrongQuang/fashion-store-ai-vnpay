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
    revalidatePath("/admin/products");
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
