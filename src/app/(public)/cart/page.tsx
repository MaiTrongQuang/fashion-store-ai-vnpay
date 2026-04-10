"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";

interface CartItemFull {
    id: string;
    quantity: number;
    variant: {
        id: string;
        size: string;
        color: string;
        price: number;
        stock: number;
        product: {
            id: string;
            name: string;
            slug: string;
            base_price: number;
            sale_price: number | null;
            images: { url: string; is_primary: boolean }[];
        };
    };
}

export default function CartPage() {
    const router = useRouter();
    const [items, setItems] = useState<CartItemFull[]>([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState<string | null>(null);
    const supabase = createClient();

    const fetchCart = useCallback(async () => {
        const {
            data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
            setLoading(false);
            return;
        }

        const { data: cart } = await supabase
            .from("carts")
            .select("id")
            .eq("user_id", user.id)
            .single();

        if (!cart) {
            setLoading(false);
            return;
        }

        const { data: cartItems } = await supabase
            .from("cart_items")
            .select(
                `
        id, quantity,
        variant:product_variants(
          id, size, color, price, stock,
          product:products(id, name, slug, base_price, sale_price, images:product_images(url, is_primary))
        )
      `,
            )
            .eq("cart_id", cart.id);

        setItems((cartItems as unknown as CartItemFull[]) || []);
        setLoading(false);
    }, [supabase]);

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    const updateQuantity = async (itemId: string, newQty: number) => {
        setUpdating(itemId);
        if (newQty <= 0) {
            await supabase.from("cart_items").delete().eq("id", itemId);
            setItems(items.filter((i) => i.id !== itemId));
            toast.success("Đã xóa khỏi giỏ hàng");
        } else {
            await supabase
                .from("cart_items")
                .update({ quantity: newQty })
                .eq("id", itemId);
            setItems(
                items.map((i) =>
                    i.id === itemId ? { ...i, quantity: newQty } : i,
                ),
            );
        }
        setUpdating(null);
        router.refresh();
    };

    const removeItem = async (itemId: string) => {
        await supabase.from("cart_items").delete().eq("id", itemId);
        setItems(items.filter((i) => i.id !== itemId));
        toast.success("Đã xóa khỏi giỏ hàng");
        router.refresh();
    };

    // Use sale_price from product level if available, otherwise variant price
    const getEffectivePrice = (item: CartItemFull) =>
        item.variant.product.sale_price ?? item.variant.price;

    const subtotal = items.reduce(
        (sum, item) => sum + getEffectivePrice(item) * item.quantity,
        0,
    );

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <p className="text-muted-foreground">Đang tải giỏ hàng...</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-8">Giỏ Hàng</h1>

            {items.length === 0 ? (
                <div className="text-center py-20 space-y-4">
                    <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground/50" />
                    <p className="text-lg text-muted-foreground">
                        Giỏ hàng của bạn đang trống
                    </p>
                    <Link href="/products">
                        <Button>Tiếp tục mua sắm</Button>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {items.map((item) => {
                            const product = item.variant.product;
                            const primaryImage =
                                product.images?.find((img) => img.is_primary) ||
                                product.images?.[0];
                            const effectivePrice = getEffectivePrice(item);
                            const hasDiscount =
                                product.sale_price != null &&
                                product.sale_price < item.variant.price;

                            return (
                                <Card key={item.id} className="overflow-hidden">
                                    <CardContent className="p-4">
                                        <div className="flex gap-4">
                                            <Link
                                                href={`/products/${product.slug}`}
                                                className="relative w-24 h-24 md:w-28 md:h-28 rounded-lg overflow-hidden shrink-0 bg-muted"
                                            >
                                                {primaryImage && (
                                                    <Image
                                                        src={primaryImage.url}
                                                        alt={product.name}
                                                        fill
                                                        className="object-cover"
                                                        sizes="112px"
                                                    />
                                                )}
                                            </Link>

                                            <div className="flex-1 min-w-0">
                                                <Link
                                                    href={`/products/${product.slug}`}
                                                >
                                                    <h3 className="font-medium text-sm md:text-base line-clamp-2 hover:text-primary transition-colors">
                                                        {product.name}
                                                    </h3>
                                                </Link>
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    {item.variant.color} /{" "}
                                                    {item.variant.size}
                                                </p>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <p className="font-semibold text-primary">
                                                        {formatPrice(effectivePrice)}
                                                    </p>
                                                    {hasDiscount && (
                                                        <p className="text-sm text-muted-foreground line-through">
                                                            {formatPrice(item.variant.price)}
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="flex items-center justify-between mt-3">
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            className="h-8 w-8"
                                                            onClick={() =>
                                                                updateQuantity(
                                                                    item.id,
                                                                    item.quantity -
                                                                        1,
                                                                )
                                                            }
                                                            disabled={
                                                                updating ===
                                                                item.id
                                                            }
                                                        >
                                                            <Minus className="h-3 w-3" />
                                                        </Button>
                                                        <span className="w-8 text-center text-sm font-medium">
                                                            {item.quantity}
                                                        </span>
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            className="h-8 w-8"
                                                            onClick={() =>
                                                                updateQuantity(
                                                                    item.id,
                                                                    item.quantity +
                                                                        1,
                                                                )
                                                            }
                                                            disabled={
                                                                updating ===
                                                                    item.id ||
                                                                item.quantity >=
                                                                    item.variant
                                                                        .stock
                                                            }
                                                        >
                                                            <Plus className="h-3 w-3" />
                                                        </Button>
                                                    </div>

                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-destructive hover:text-destructive"
                                                        onClick={() =>
                                                            removeItem(item.id)
                                                        }
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <Card className="sticky top-24">
                            <CardHeader>
                                <CardTitle>Tóm Tắt Đơn Hàng</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">
                                        Tạm tính (
                                        {items.reduce(
                                            (s, i) => s + i.quantity,
                                            0,
                                        )}{" "}
                                        sản phẩm)
                                    </span>
                                    <span className="font-medium">
                                        {formatPrice(subtotal)}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">
                                        Phí vận chuyển
                                    </span>
                                    <span className="font-medium text-emerald-600">
                                        {subtotal >= 500000
                                            ? "Miễn phí"
                                            : formatPrice(30000)}
                                    </span>
                                </div>
                                <Separator />
                                <div className="flex justify-between font-bold text-lg">
                                    <span>Tổng cộng</span>
                                    <span className="text-primary">
                                        {formatPrice(
                                            subtotal +
                                                (subtotal >= 500000
                                                    ? 0
                                                    : 30000),
                                        )}
                                    </span>
                                </div>

                                <Link href="/checkout" className="block">
                                    <Button
                                        className="w-full h-12 text-base font-semibold"
                                        size="lg"
                                    >
                                        Tiến Hành Thanh Toán
                                        <ArrowRight className="h-4 w-4 ml-2" />
                                    </Button>
                                </Link>

                                <Link href="/products" className="block">
                                    <Button
                                        variant="outline"
                                        className="w-full"
                                        size="sm"
                                    >
                                        Tiếp tục mua sắm
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    );
}
