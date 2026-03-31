import { createClient } from "@/lib/supabase/server";
import ProductCard from "@/components/product/ProductCard";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Tìm kiếm sản phẩm" };

interface Props {
    searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: Props) {
    const params = await searchParams;
    const query = params?.q || "";
    const supabase = await createClient();

    let products = null;
    if (query) {
        const { data } = await supabase
            .from("products")
            .select(
                "*, category:categories(*), brand:brands(*), images:product_images(*)",
            )
            .eq("is_active", true)
            .ilike("name", `%${query}%`)
            .limit(20);
        products = data;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto mb-10">
                <h1 className="text-2xl font-bold text-center mb-6">
                    Tìm Kiếm Sản Phẩm
                </h1>
                <form action="/search" method="GET" className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                        name="q"
                        defaultValue={query}
                        placeholder="Áo thun, quần jean, đầm..."
                        className="pl-12 h-12 text-base rounded-full"
                    />
                </form>
            </div>

            {query && products && (
                <div>
                    <p className="text-muted-foreground mb-6">
                        Tìm thấy{" "}
                        <span className="font-semibold text-foreground">
                            {products.length}
                        </span>{" "}
                        kết quả cho &quot;{query}&quot;
                    </p>
                    {products.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                            {products.map((product: any) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <p className="text-lg text-muted-foreground">
                                Không tìm thấy sản phẩm nào
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
