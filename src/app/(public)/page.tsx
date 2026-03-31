import { createClient } from "@/lib/supabase/server";
import HeroBanner from "@/components/home/HeroBanner";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import CategoryGrid from "@/components/home/CategoryGrid";
import NewArrivals from "@/components/home/NewArrivals";
import PromoSection from "@/components/home/PromoSection";
import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
    title: `Trang chủ | ${SITE_NAME}`,
    description:
        "Khám phá bộ sưu tập thời trang mới nhất tại LUXE Fashion - Thời trang cao cấp, giá cả hợp lý",
};

export default async function HomePage() {
    const supabase = await createClient();

    const [bannersRes, featuredRes, newRes, categoriesRes] = await Promise.all([
        supabase
            .from("banners")
            .select("*")
            .eq("is_active", true)
            .order("sort_order"),
        supabase
            .from("products")
            .select(
                "*, category:categories(*), brand:brands(*), images:product_images(*)",
            )
            .eq("is_active", true)
            .eq("is_featured", true)
            .order("created_at", { ascending: false })
            .limit(8),
        supabase
            .from("products")
            .select(
                "*, category:categories(*), brand:brands(*), images:product_images(*)",
            )
            .eq("is_active", true)
            .eq("is_new", true)
            .order("created_at", { ascending: false })
            .limit(8),
        supabase
            .from("categories")
            .select("*")
            .eq("is_active", true)
            .is("parent_id", null)
            .order("sort_order"),
    ]);

    return (
        <div className="flex flex-col">
            <HeroBanner banners={bannersRes.data || []} />
            <CategoryGrid categories={categoriesRes.data || []} />
            <FeaturedProducts products={featuredRes.data || []} />
            <PromoSection />
            <NewArrivals products={newRes.data || []} />
        </div>
    );
}
