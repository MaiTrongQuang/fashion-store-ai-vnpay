import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { MessageSquareQuote, Star } from "lucide-react";
import { cn, formatDate } from "@/lib/utils";

export default async function AccountReviewsPage() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    const { data: reviews } = await supabase
        .from("reviews")
        .select(
            `
      id,
      rating,
      comment,
      is_visible,
      created_at,
      product:products(name, slug, images:product_images(url, is_primary, alt))
    `,
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

    const list = reviews || [];

    return (
        <div className="space-y-6">
            <p className="text-sm text-muted-foreground">
                Xem lại đánh giá đã gửi và trạng thái hiển thị trên trang sản
                phẩm.
            </p>

            {list.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 bg-muted/20 px-6 py-16 text-center">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                        <MessageSquareQuote
                            className="h-8 w-8 text-muted-foreground"
                            aria-hidden
                        />
                    </div>
                    <h2 className="text-lg font-semibold text-foreground">
                        Chưa có đánh giá
                    </h2>
                    <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                        Sau khi mua hàng, bạn có thể đánh giá sản phẩm từ trang
                        chi tiết đơn hàng hoặc sản phẩm.
                    </p>
                    <Link href="/products" className="mt-6">
                        <Button className="min-h-11 cursor-pointer">
                            Xem sản phẩm
                        </Button>
                    </Link>
                </div>
            ) : (
                <ul className="space-y-4">
                    {list.map((r: any) => {
                        const p = r.product;
                        const images = p?.images ?? [];
                        const img =
                            images.find((i: any) => i.is_primary) || images[0];

                        return (
                            <li key={r.id}>
                                <Card className="border-border/50 bg-background/60 shadow-none">
                                    <CardHeader className="flex flex-col gap-4 pb-2 sm:flex-row sm:items-start">
                                        {p ? (
                                            <Link
                                                href={`/products/${p.slug}`}
                                                className="relative h-24 w-20 shrink-0 overflow-hidden rounded-lg border border-border/60 bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                            >
                                                {img ? (
                                                    <Image
                                                        src={img.url}
                                                        alt={
                                                            img.alt || p.name
                                                        }
                                                        fill
                                                        className="object-cover"
                                                        sizes="80px"
                                                    />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center text-[10px] text-muted-foreground">
                                                        —
                                                    </div>
                                                )}
                                            </Link>
                                        ) : null}
                                        <div className="min-w-0 flex-1 space-y-2">
                                            {p ? (
                                                <Link
                                                    href={`/products/${p.slug}`}
                                                    className="font-semibold text-foreground hover:text-primary hover:underline"
                                                >
                                                    {p.name}
                                                </Link>
                                            ) : (
                                                <p className="text-sm text-muted-foreground">
                                                    Sản phẩm đã gỡ
                                                </p>
                                            )}
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span
                                                    className="flex items-center gap-0.5"
                                                    aria-label={`${r.rating} trên 5 sao`}
                                                >
                                                    {Array.from({
                                                        length: 5,
                                                    }).map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            className={cn(
                                                                "h-4 w-4",
                                                                i < r.rating
                                                                    ? "fill-amber-400 text-amber-400"
                                                                    : "text-muted-foreground/35",
                                                            )}
                                                            aria-hidden
                                                        />
                                                    ))}
                                                </span>
                                                <Badge
                                                    variant={
                                                        r.is_visible
                                                            ? "secondary"
                                                            : "outline"
                                                    }
                                                    className="text-xs"
                                                >
                                                    {r.is_visible
                                                        ? "Đang hiển thị"
                                                        : "Đang ẩn"}
                                                </Badge>
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                {formatDate(r.created_at)}
                                            </p>
                                        </div>
                                    </CardHeader>
                                    {r.comment ? (
                                        <CardContent className="pt-0">
                                            <p className="rounded-lg border border-border/40 bg-muted/20 p-3 text-sm leading-relaxed text-foreground">
                                                {r.comment}
                                            </p>
                                        </CardContent>
                                    ) : null}
                                </Card>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}
