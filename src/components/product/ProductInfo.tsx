"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Star,
    Minus,
    Plus,
    ShoppingBag,
    Heart,
    Truck,
    RotateCcw,
    Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatPrice, getDiscountPercent } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import type { Product, ProductVariant } from "@/lib/types";

interface ProductInfoProps {
    product: Product;
    avgRating: number;
    reviewCount: number;
}

export default function ProductInfo({
    product,
    avgRating,
    reviewCount,
}: ProductInfoProps) {
    const router = useRouter();
    const [selectedSize, setSelectedSize] = useState<string>("");
    const [selectedColor, setSelectedColor] = useState<string>("");
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(false);
    const supabase = createClient();

    const variants = product.variants || [];

    // Get unique sizes and colors
    const sizes = [
        ...new Set(variants.filter((v) => v.is_active).map((v) => v.size)),
    ];
    const colors = variants
        .filter((v) => v.is_active)
        .reduce(
            (acc, v) => {
                if (!acc.find((c) => c.name === v.color)) {
                    acc.push({ name: v.color, hex: v.color_hex || "#ccc" });
                }
                return acc;
            },
            [] as { name: string; hex: string }[],
        );

    // Get selected variant
    const selectedVariant = variants.find(
        (v) =>
            v.size === selectedSize && v.color === selectedColor && v.is_active,
    );

    const currentPrice = selectedVariant
        ? selectedVariant.price
        : product.sale_price || product.base_price;

    const discount = product.sale_price
        ? getDiscountPercent(product.base_price, product.sale_price)
        : 0;

    const handleAddToCart = async () => {
        if (!selectedSize || !selectedColor) {
            toast.error("Vui lòng chọn size và màu sắc");
            return;
        }

        if (!selectedVariant || selectedVariant.stock < quantity) {
            toast.error("Sản phẩm đã hết hàng hoặc không đủ số lượng");
            return;
        }

        setLoading(true);
        try {
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (!user) {
                toast.error("Vui lòng đăng nhập để thêm vào giỏ hàng");
                router.push("/login");
                return;
            }

            // Get or create cart
            let { data: cart } = await supabase
                .from("carts")
                .select("id")
                .eq("user_id", user.id)
                .single();

            if (!cart) {
                const { data: newCart } = await supabase
                    .from("carts")
                    .insert({ user_id: user.id })
                    .select("id")
                    .single();
                cart = newCart;
            }

            if (!cart) {
                toast.error("Không thể tạo giỏ hàng");
                return;
            }

            // Check existing item
            const { data: existingItem } = await supabase
                .from("cart_items")
                .select("id, quantity")
                .eq("cart_id", cart.id)
                .eq("variant_id", selectedVariant.id)
                .single();

            if (existingItem) {
                const newQty = existingItem.quantity + quantity;
                if (newQty > selectedVariant.stock) {
                    toast.error("Không đủ hàng trong kho");
                    return;
                }
                await supabase
                    .from("cart_items")
                    .update({ quantity: newQty })
                    .eq("id", existingItem.id);
            } else {
                await supabase.from("cart_items").insert({
                    cart_id: cart.id,
                    variant_id: selectedVariant.id,
                    quantity,
                });
            }

            toast.success("Đã thêm vào giỏ hàng!");
            router.refresh();
        } catch {
            toast.error("Có lỗi xảy ra");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Brand & Name */}
            <div>
                {product.brand && (
                    <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider mb-1">
                        {product.brand.name}
                    </p>
                )}
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                    {product.name}
                </h1>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
                <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                            key={star}
                            className={`h-4 w-4 ${
                                star <= Math.round(avgRating)
                                    ? "fill-amber-400 text-amber-400"
                                    : "text-muted"
                            }`}
                        />
                    ))}
                </div>
                <span className="text-sm text-muted-foreground">
                    {avgRating.toFixed(1)} ({reviewCount} đánh giá)
                </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-primary">
                    {formatPrice(currentPrice)}
                </span>
                {discount > 0 && (
                    <>
                        <span className="text-lg text-muted-foreground line-through">
                            {formatPrice(product.base_price)}
                        </span>
                        <Badge variant="destructive" className="text-xs">
                            -{discount}%
                        </Badge>
                    </>
                )}
            </div>

            <Separator />

            {/* Color Select */}
            {colors.length > 0 && (
                <div className="space-y-3">
                    <Label className="text-sm font-medium">
                        Màu sắc:{" "}
                        <span className="text-muted-foreground">
                            {selectedColor || "Chưa chọn"}
                        </span>
                    </Label>
                    <div className="flex gap-2 flex-wrap">
                        {colors.map((color) => (
                            <button
                                key={color.name}
                                onClick={() => setSelectedColor(color.name)}
                                className={`w-10 h-10 rounded-full border-2 transition-all ${
                                    selectedColor === color.name
                                        ? "border-primary scale-110 shadow-lg"
                                        : "border-muted hover:border-primary/50"
                                }`}
                                style={{ backgroundColor: color.hex }}
                                title={color.name}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Size Select */}
            {sizes.length > 0 && (
                <div className="space-y-3">
                    <Label className="text-sm font-medium">
                        Size:{" "}
                        <span className="text-muted-foreground">
                            {selectedSize || "Chưa chọn"}
                        </span>
                    </Label>
                    <div className="flex gap-2 flex-wrap">
                        {sizes.map((size) => {
                            const variantForSize = variants.find(
                                (v) =>
                                    v.size === size &&
                                    (selectedColor
                                        ? v.color === selectedColor
                                        : true) &&
                                    v.is_active,
                            );
                            const isOutOfStock =
                                !variantForSize || variantForSize.stock === 0;

                            return (
                                <button
                                    key={size}
                                    onClick={() =>
                                        !isOutOfStock && setSelectedSize(size)
                                    }
                                    disabled={isOutOfStock}
                                    className={`min-w-[48px] h-11 px-4 rounded-lg border text-sm font-medium transition-all ${
                                        selectedSize === size
                                            ? "border-primary bg-primary text-primary-foreground"
                                            : isOutOfStock
                                              ? "border-muted bg-muted text-muted-foreground cursor-not-allowed line-through"
                                              : "border-border hover:border-primary"
                                    }`}
                                >
                                    {size}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Stock info */}
            {selectedVariant && (
                <p className="text-sm text-muted-foreground">
                    Còn lại:{" "}
                    <span className="font-semibold text-foreground">
                        {selectedVariant.stock}
                    </span>{" "}
                    sản phẩm
                </p>
            )}

            {/* Quantity */}
            <div className="space-y-3">
                <Label className="text-sm font-medium">Số lượng</Label>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                            quantity > 1 && setQuantity(quantity - 1)
                        }
                        disabled={quantity <= 1}
                    >
                        <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-14 text-center font-medium">
                        {quantity}
                    </span>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setQuantity(quantity + 1)}
                        disabled={
                            selectedVariant
                                ? quantity >= selectedVariant.stock
                                : false
                        }
                    >
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
                <Button
                    size="lg"
                    className="flex-1 h-12 text-base font-semibold"
                    onClick={handleAddToCart}
                    disabled={loading}
                >
                    <ShoppingBag className="h-5 w-5 mr-2" />
                    {loading ? "Đang thêm..." : "Thêm vào giỏ hàng"}
                </Button>
                <Button variant="outline" size="lg" className="h-12">
                    <Heart className="h-5 w-5" />
                </Button>
            </div>

            <Separator />

            {/* Policies */}
            <div className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-3">
                    <Truck className="h-4 w-4 text-primary" />
                    <span>Miễn phí vận chuyển đơn từ 500.000đ</span>
                </div>
                <div className="flex items-center gap-3">
                    <RotateCcw className="h-4 w-4 text-primary" />
                    <span>Đổi trả miễn phí trong 7 ngày</span>
                </div>
                <div className="flex items-center gap-3">
                    <Shield className="h-4 w-4 text-primary" />
                    <span>Cam kết hàng chính hãng 100%</span>
                </div>
            </div>
        </div>
    );
}

function Label({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return <p className={className}>{children}</p>;
}
