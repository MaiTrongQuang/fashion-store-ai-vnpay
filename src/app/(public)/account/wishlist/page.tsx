import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { formatPrice, getDiscountPercent } from "@/lib/utils";

const productSelect = `
  id,
  name,
  slug,
  base_price,
  sale_price,
  images:product_images(url, is_primary, alt)
`;

export default async function WishlistPage() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    let rows: { id: string; created_at: string; product: any }[] = [];

    const primary = await supabase
        .from("wishlist_items")
        .select(`id, created_at, product:products(${productSelect})`)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

    if (!primary.error && primary.data) {
        rows = primary.data as typeof rows;
    } else {
        const fallback = await supabase
            .from("wishlist")
            .select(`id, created_at, product:products(${productSelect})`)
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });
        if (!fallback.error && fallback.data) {
            rows = fallback.data as typeof rows;
        }
    }

    return (
        <div className="space-y-6">
            <p className="text-sm text-muted-foreground">
                Các sản phẩm bạn đã lưu — mở chi tiết để thêm vào giỏ bất cứ
                lúc nào.
            </p>

            {rows.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 bg-muted/20 px-6 py-16 text-center">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                        <Heart
                            className="h-8 w-8 text-muted-foreground"
                            aria-hidden
                        />
                    </div>
                    <h2 className="text-lg font-semibold text-foreground">
                        Danh sách trống
                    </h2>
                    <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                        Lưu sản phẩm yêu thích khi duyệt cửa hàng để xem lại tại
                        đây.
                    </p>
                    <Link href="/products" className="mt-6">
                        <Button className="min-h-11 cursor-pointer">
                            Khám phá sản phẩm
                        </Button>
                    </Link>
                </div>
            ) : (
                <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {rows.map((row) => {
                        const p = row.product;
                        if (!p) {
                            return (
                                <li
                                    key={row.id}
                                    className="rounded-2xl border border-border/50 bg-muted/30 p-4 text-sm text-muted-foreground"
                                >
                                    Sản phẩm không còn hiển thị.
                                </li>
                            );
                        }
                        const images = p.images ?? [];
                        const primaryImage =
                            images.find((img: any) => img.is_primary) ||
                            images[0];
                        const salePrice = p.sale_price ?? null;
                        const currentPrice = salePrice ?? p.base_price;
                        const discount = salePrice
                            ? getDiscountPercent(p.base_price, salePrice)
                            : 0;

                        return (
                            <li key={row.id}>
                                <Link
                                    href={`/products/${p.slug}`}
                                    className="group/card flex h-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm transition-[box-shadow] duration-200 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                >
                                    <div className="relative aspect-3/4 bg-muted">
                                        {primaryImage ? (
                                            <Image
                                                src={primaryImage.url}
                                                alt={
                                                    primaryImage.alt || p.name
                                                }
                                                fill
                                                className="object-cover transition-transform duration-300 group-hover/card:scale-[1.02] motion-reduce:group-hover/card:scale-100"
                                                sizes="(max-width: 640px) 100vw, 33vw"
                                            />
                                        ) : (
                                            <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                                                Không có ảnh
                                            </div>
                                        )}
                                        {discount > 0 ? (
                                            <span className="absolute left-2 top-2 rounded-md bg-red-600 px-2 py-0.5 text-xs font-bold text-white">
                                                −{discount}%
                                            </span>
                                        ) : null}
                                    </div>
                                    <div className="flex flex-1 flex-col p-4">
                                        <p className="line-clamp-2 font-medium leading-snug text-foreground group-hover/card:text-primary">
                                            {p.name}
                                        </p>
                                        <div className="mt-auto pt-3">
                                            {salePrice ? (
                                                <p className="flex flex-wrap items-baseline gap-2">
                                                    <span className="text-lg font-bold tabular-nums text-foreground">
                                                        {formatPrice(
                                                            currentPrice,
                                                        )}
                                                    </span>
                                                    <span className="text-sm text-muted-foreground line-through tabular-nums">
                                                        {formatPrice(
                                                            p.base_price,
                                                        )}
                                                    </span>
                                                </p>
                                            ) : (
                                                <p className="text-lg font-bold tabular-nums">
                                                    {formatPrice(p.base_price)}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}
