import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createPaymentUrl } from "@/lib/vnpay";
import { generateOrderNumber } from "@/lib/utils";
import { DEFAULT_SHIPPING_FEE } from "@/lib/constants";

export async function POST(request: Request) {
    try {
        const supabase = await createClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 },
            );
        }

        const body = await request.json();
        const { addressId, paymentMethod, voucherCode, note } = body;

        // Get cart
        const { data: cart } = await supabase
            .from("carts")
            .select("id")
            .eq("user_id", user.id)
            .single();

        if (!cart) {
            return NextResponse.json(
                { error: "Cart is empty" },
                { status: 400 },
            );
        }

        // Get cart items with product info
        const { data: cartItems } = await supabase
            .from("cart_items")
            .select(
                `
        id, quantity,
        variant:product_variants(
          id, size, color, price, stock,
          product:products(id, name, base_price, sale_price, images:product_images(url, is_primary))
        )
      `,
            )
            .eq("cart_id", cart.id);

        if (!cartItems || cartItems.length === 0) {
            return NextResponse.json(
                { error: "Cart is empty" },
                { status: 400 },
            );
        }

        // Validate stock
        for (const item of cartItems as any[]) {
            if (item.quantity > item.variant.stock) {
                return NextResponse.json(
                    {
                        error: `${item.variant.product.name} (${item.variant.size}/${item.variant.color}) không đủ hàng`,
                    },
                    { status: 400 },
                );
            }
        }

        // Get address
        const { data: address } = await supabase
            .from("addresses")
            .select("*")
            .eq("id", addressId)
            .eq("user_id", user.id)
            .single();

        if (!address) {
            return NextResponse.json(
                { error: "Address not found" },
                { status: 400 },
            );
        }

        // Calculate totals — use product-level sale_price when available
        const getEffectivePrice = (item: any): number =>
            item.variant.product?.sale_price ?? item.variant.price;

        const subtotal = (cartItems as any[]).reduce(
            (sum: number, item: any) =>
                sum + getEffectivePrice(item) * item.quantity,
            0,
        );

        let discount = 0;
        let voucherId = null;

        // Validate voucher
        if (voucherCode) {
            const { data: voucher } = await supabase
                .from("vouchers")
                .select("*")
                .eq("code", voucherCode)
                .eq("is_active", true)
                .single();

            if (voucher) {
                const now = new Date();
                const start = new Date(voucher.starts_at);
                const end = new Date(voucher.expires_at);

                if (
                    now >= start &&
                    now <= end &&
                    voucher.used_count < voucher.usage_limit &&
                    subtotal >= voucher.min_order
                ) {
                    if (voucher.type === "percentage") {
                        discount = Math.floor(subtotal * (voucher.value / 100));
                        if (
                            voucher.max_discount &&
                            discount > voucher.max_discount
                        ) {
                            discount = voucher.max_discount;
                        }
                    } else {
                        discount = voucher.value;
                    }
                    voucherId = voucher.id;
                }
            }
        }

        const shippingFee = subtotal >= 500000 ? 0 : DEFAULT_SHIPPING_FEE;
        const total = subtotal - discount + shippingFee;

        const orderNumber = generateOrderNumber();
        const shippingAddress = `${address.street}, ${address.ward}, ${address.district}, ${address.province}`;

        // Create order
        const { data: order, error: orderError } = await supabase
            .from("orders")
            .insert({
                user_id: user.id,
                order_number: orderNumber,
                status:
                    paymentMethod === "vnpay" ? "awaiting_payment" : "pending",
                subtotal,
                discount,
                shipping_fee: shippingFee,
                total,
                payment_method: paymentMethod,
                shipping_name: address.full_name,
                shipping_phone: address.phone,
                shipping_address: shippingAddress,
                voucher_id: voucherId,
                note,
            })
            .select("id")
            .single();

        if (orderError || !order) {
            return NextResponse.json(
                { error: "Failed to create order" },
                { status: 500 },
            );
        }

        // Create order items
        const orderItems = (cartItems as any[]).map((item: any) => {
            const primaryImage = item.variant.product.images?.find(
                (img: any) => img.is_primary,
            );
            return {
                order_id: order.id,
                variant_id: item.variant.id,
                product_name: item.variant.product.name,
                product_image: primaryImage?.url || null,
                size: item.variant.size,
                color: item.variant.color,
                price: getEffectivePrice(item),
                quantity: item.quantity,
            };
        });

        await supabase.from("order_items").insert(orderItems);

        // Create payment record
        await supabase.from("payments").insert({
            order_id: order.id,
            method: paymentMethod,
            status: "pending",
            amount: total,
        });

        // Update stock atomically via RPC
        for (const item of cartItems as any[]) {
            const { error: stockError } = await supabase.rpc("deduct_variant_stock", {
                p_variant_id: item.variant.id,
                p_quantity: item.quantity,
            });
            if (stockError) {
                console.error("Stock deduction failed:", stockError);
                // Order already created — mark it as failed and restore previous items
                await supabase
                    .from("orders")
                    .update({ status: "cancelled", updated_at: new Date().toISOString() })
                    .eq("id", order.id);
                return NextResponse.json(
                    { error: `${item.variant.product.name} (${item.variant.size}/${item.variant.color}) đã hết hàng` },
                    { status: 400 },
                );
            }
        }

        // Update voucher usage
        if (voucherId) {
            await supabase.rpc("increment_voucher_usage", {
                voucher_id: voucherId,
            });
        }

        // Clear cart
        await supabase.from("cart_items").delete().eq("cart_id", cart.id);

        // VNPay payment
        if (paymentMethod === "vnpay") {
            const ipAddr =
                request.headers.get("x-forwarded-for") ||
                request.headers.get("x-real-ip") ||
                "127.0.0.1";

            const paymentUrl = createPaymentUrl({
                orderId: orderNumber,
                amount: total,
                orderInfo: `Thanh toan don hang ${orderNumber}`,
                ipAddr,
            });

            return NextResponse.json({
                success: true,
                orderId: order.id,
                orderNumber,
                paymentUrl,
            });
        }

        return NextResponse.json({
            success: true,
            orderId: order.id,
            orderNumber,
        });
    } catch (error) {
        console.error("Checkout error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 },
        );
    }
}
