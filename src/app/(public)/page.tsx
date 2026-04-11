import { createClient } from "@/lib/supabase/server";
import HeroBanner from "@/components/home/HeroBanner";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import CategoryGrid from "@/components/home/CategoryGrid";
import NewArrivals from "@/components/home/NewArrivals";
import PromoSection from "@/components/home/PromoSection";
import FlashSale from "@/components/home/FlashSale";
import BestSellers from "@/components/home/BestSellers";
import BrandShowcase from "@/components/home/BrandShowcase";
import Newsletter from "@/components/home/Newsletter";
import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
    title: `Trang chủ | ${SITE_NAME}`,
    description:
        "Khám phá bộ sưu tập thời trang mới nhất tại Nana Store - Thời trang cao cấp, giá cả hợp lý",
};

export default async function HomePage() {
    const supabase = await createClient();

    // Optimized: chỉ select fields cần thiết để giảm data transfer
    const productSelect =
        "id, name, slug, base_price, sale_price, is_new, is_featured, tags, category:categories(name, slug), brand:brands(name, slug), images:product_images(url, alt, is_primary, sort_order)";

    const [bannersRes, featuredRes, newRes, categoriesRes, saleRes, bestRes] =
        await Promise.all([
            supabase
                .from("banners")
                .select("id, title, subtitle, image_url, link_url, sort_order")
                .eq("is_active", true)
                .order("sort_order"),
            supabase
                .from("products")
                .select(productSelect)
                .eq("is_active", true)
                .eq("is_featured", true)
                .order("created_at", { ascending: false })
                .limit(8),
            supabase
                .from("products")
                .select(productSelect)
                .eq("is_active", true)
                .eq("is_new", true)
                .order("created_at", { ascending: false })
                .limit(8),
            supabase
                .from("categories")
                .select("id, name, slug, image_url, sort_order")
                .eq("is_active", true)
                .is("parent_id", null)
                .order("sort_order"),
            // Sale products: có sale_price
            supabase
                .from("products")
                .select(productSelect)
                .eq("is_active", true)
                .not("sale_price", "is", null)
                .order("created_at", { ascending: false })
                .limit(8),
            // Best sellers: lấy theo updated_at (giả lập popular)
            supabase
                .from("products")
                .select(productSelect)
                .eq("is_active", true)
                .order("updated_at", { ascending: false })
                .limit(8),
        ]);

    return (
        <div className="flex flex-col">
            <HeroBanner banners={bannersRes.data || []} />
            <CategoryGrid categories={categoriesRes.data || []} />
            <FlashSale products={saleRes.data || []} />
            <FeaturedProducts products={featuredRes.data || []} />
            <PromoSection />
            <BestSellers products={bestRes.data || []} />
            <NewArrivals products={newRes.data || []} />
            <BrandShowcase />
            <Newsletter />
        </div>
    );
}
