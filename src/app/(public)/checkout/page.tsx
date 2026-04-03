"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
    CheckCircle2,
    CreditCard,
    MapPin,
    Plus,
    Tag,
    Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { createClient } from "@/lib/supabase/client";
import { formatPrice } from "@/lib/utils";
import { DEFAULT_SHIPPING_FEE } from "@/lib/constants";
import { toast } from "sonner";
import type { Address } from "@/lib/types";

const addressSchema = z.object({
    full_name: z.string().min(2, "Họ tên tối thiểu 2 ký tự"),
    phone: z.string().min(10, "SĐT tối thiểu 10 số"),
    province: z.string().min(1, "Vui lòng nhập tỉnh/thành"),
    district: z.string().min(1, "Vui lòng nhập quận/huyện"),
    ward: z.string().min(1, "Vui lòng nhập phường/xã"),
    street: z.string().min(1, "Vui lòng nhập địa chỉ cụ thể"),
});

function toastAddressSaved(addr: Address) {
    const fullLine = `${addr.street}, ${addr.ward}, ${addr.district}, ${addr.province}`;
    toast.custom(
        () => (
            <div
                role="status"
                aria-live="polite"
                className="flex w-[min(100vw-2rem,22rem)] gap-3 rounded-xl border border-border/90 bg-card p-4 text-left text-card-foreground shadow-lg ring-1 ring-black/5 dark:ring-white/10"
            >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 ring-1 ring-primary/15">
                    <MapPin className="h-5 w-5 text-primary" aria-hidden />
                </div>
                <div className="min-w-0 flex-1 pt-0.5">
                    <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-semibold leading-snug tracking-tight text-foreground">
                            Đã lưu địa chỉ giao hàng
                        </p>
                        <CheckCircle2
                            className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                            aria-hidden
                        />
                    </div>
                    <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground line-clamp-2">
                        {fullLine}
                    </p>
                    <p className="mt-2 text-xs text-muted-foreground">
                        <span className="font-medium text-foreground">
                            {addr.full_name}
                        </span>
                        <span className="text-muted-foreground/60"> · </span>
                        <span className="tabular-nums">{addr.phone}</span>
                    </p>
                    <p className="mt-2 text-[11px] leading-tight text-muted-foreground">
                        {addr.is_default
                            ? "Đặt làm địa chỉ mặc định — đã chọn cho đơn này."
                            : "Đã chọn làm địa chỉ giao hàng cho đơn hiện tại."}
                    </p>
                </div>
            </div>
        ),
        { duration: 5200 },
    );
}

export default function CheckoutPage() {
    const router = useRouter();
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [selectedAddress, setSelectedAddress] = useState<string>("");
    const [paymentMethod, setPaymentMethod] = useState<string>("cod");
    const [voucherCode, setVoucherCode] = useState("");
    const [note, setNote] = useState("");
    const [subtotal, setSubtotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [addingAddress, setAddingAddress] = useState(false);
    const supabase = createClient();

    const form = useForm({
        resolver: zodResolver(addressSchema),
        defaultValues: {
            full_name: "",
            phone: "",
            province: "",
            district: "",
            ward: "",
            street: "",
        },
    });

    const loadData = useCallback(async () => {
        const {
            data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
            router.push("/login?redirect=/checkout");
            return;
        }

        const { data: addrs } = await supabase
            .from("addresses")
            .select("*")
            .eq("user_id", user.id)
            .order("is_default", { ascending: false });

        setAddresses(addrs || []);
        if (addrs && addrs.length > 0) {
            setSelectedAddress(addrs[0].id);
        }

        const { data: cart } = await supabase
            .from("carts")
            .select("id")
            .eq("user_id", user.id)
            .single();

        if (cart) {
            const { data: items } = await supabase
                .from("cart_items")
                .select("quantity, variant:product_variants(price)")
                .eq("cart_id", cart.id);

            if (items) {
                const total = (items as any[]).reduce(
                    (sum, item) => sum + item.variant.price * item.quantity,
                    0,
                );
                setSubtotal(total);
            }
        }
    }, [supabase, router]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const shippingFee = subtotal >= 500000 ? 0 : DEFAULT_SHIPPING_FEE;
    const total = subtotal + shippingFee;

    const handleAddAddress = async (data: z.infer<typeof addressSchema>) => {
        const {
            data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;

        const { data: addr } = await supabase
            .from("addresses")
            .insert({
                user_id: user.id,
                ...data,
                is_default: addresses.length === 0,
            })
            .select()
            .single();

        if (addr) {
            setAddresses([...addresses, addr]);
            setSelectedAddress(addr.id);
            setAddingAddress(false);
            form.reset();
            toastAddressSaved(addr);
        }
    };

    const handleCheckout = async () => {
        if (!selectedAddress) {
            toast.error("Vui lòng chọn địa chỉ giao hàng");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    addressId: selectedAddress,
                    paymentMethod,
                    voucherCode: voucherCode || undefined,
                    note: note || undefined,
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                toast.error(result.error || "Đặt hàng thất bại");
                return;
            }

            if (result.paymentUrl) {
                window.location.href = result.paymentUrl;
            } else {
                toast.success("Đặt hàng thành công!");
                router.push(
                    `/checkout/result?status=success&order=${result.orderNumber}`,
                );
            }
        } catch {
            toast.error("Có lỗi xảy ra");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-8">Thanh Toán</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    {/* Shipping Address */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Truck className="h-5 w-5" />
                                Địa chỉ giao hàng
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {addresses.length > 0 ? (
                                <RadioGroup
                                    value={selectedAddress}
                                    onValueChange={setSelectedAddress}
                                >
                                    <div className="space-y-3">
                                        {addresses.map((addr) => (
                                            <label
                                                key={addr.id}
                                                className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                                                    selectedAddress === addr.id
                                                        ? "border-primary bg-primary/5"
                                                        : "border-border hover:border-primary/50"
                                                }`}
                                            >
                                                <RadioGroupItem
                                                    value={addr.id}
                                                    className="mt-1"
                                                />
                                                <div>
                                                    <p className="font-medium">
                                                        {addr.full_name} -{" "}
                                                        {addr.phone}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {addr.street},{" "}
                                                        {addr.ward},{" "}
                                                        {addr.district},{" "}
                                                        {addr.province}
                                                    </p>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </RadioGroup>
                            ) : (
                                <p className="text-muted-foreground text-sm">
                                    Chưa có địa chỉ nào
                                </p>
                            )}

                            <Dialog
                                open={addingAddress}
                                onOpenChange={setAddingAddress}
                            >
                                <DialogTrigger
                                    render={
                                        <Button
                                            variant="outline"
                                            className="mt-4 w-full"
                                            size="sm"
                                        >
                                            <Plus className="h-4 w-4 mr-2" />
                                            Thêm địa chỉ mới
                                        </Button>
                                    }
                                />
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>
                                            Thêm Địa Chỉ Mới
                                        </DialogTitle>
                                    </DialogHeader>
                                    <form
                                        onSubmit={form.handleSubmit(
                                            handleAddAddress,
                                        )}
                                        className="space-y-4"
                                    >
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label>Họ tên</Label>
                                                <Input
                                                    {...form.register(
                                                        "full_name",
                                                    )}
                                                />
                                            </div>
                                            <div>
                                                <Label>Số điện thoại</Label>
                                                <Input
                                                    {...form.register("phone")}
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-3 gap-4">
                                            <div>
                                                <Label>Tỉnh/Thành</Label>
                                                <Input
                                                    {...form.register(
                                                        "province",
                                                    )}
                                                />
                                            </div>
                                            <div>
                                                <Label>Quận/Huyện</Label>
                                                <Input
                                                    {...form.register(
                                                        "district",
                                                    )}
                                                />
                                            </div>
                                            <div>
                                                <Label>Phường/Xã</Label>
                                                <Input
                                                    {...form.register("ward")}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <Label>Địa chỉ cụ thể</Label>
                                            <Input
                                                {...form.register("street")}
                                            />
                                        </div>
                                        <Button
                                            type="submit"
                                            className="w-full"
                                        >
                                            Lưu địa chỉ
                                        </Button>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </CardContent>
                    </Card>

                    {/* Payment Method */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CreditCard className="h-5 w-5" />
                                Phương thức thanh toán
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <RadioGroup
                                value={paymentMethod}
                                onValueChange={setPaymentMethod}
                            >
                                <div className="space-y-3">
                                    <label
                                        className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                                            paymentMethod === "cod"
                                                ? "border-primary bg-primary/5"
                                                : "border-border hover:border-primary/50"
                                        }`}
                                    >
                                        <RadioGroupItem value="cod" />
                                        <div>
                                            <p className="font-medium">
                                                Thanh toán khi nhận hàng (COD)
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                Thanh toán bằng tiền mặt khi
                                                nhận hàng
                                            </p>
                                        </div>
                                    </label>
                                    <label
                                        className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                                            paymentMethod === "vnpay"
                                                ? "border-primary bg-primary/5"
                                                : "border-border hover:border-primary/50"
                                        }`}
                                    >
                                        <RadioGroupItem value="vnpay" />
                                        <div>
                                            <p className="font-medium">VNPay</p>
                                            <p className="text-sm text-muted-foreground">
                                                Thanh toán online qua VNPay
                                                (ATM, Visa, MasterCard, QR Code)
                                            </p>
                                        </div>
                                    </label>
                                </div>
                            </RadioGroup>
                        </CardContent>
                    </Card>

                    {/* Note */}
                    <Card>
                        <CardContent className="pt-6">
                            <Label>Ghi chú đơn hàng</Label>
                            <Textarea
                                placeholder="Ghi chú thêm cho đơn hàng (không bắt buộc)"
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                className="mt-2"
                            />
                        </CardContent>
                    </Card>
                </div>

                {/* Order Summary */}
                <div>
                    <Card className="sticky top-24">
                        <CardHeader>
                            <CardTitle>Tóm Tắt Đơn Hàng</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Voucher */}
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Mã giảm giá"
                                        value={voucherCode}
                                        onChange={(e) =>
                                            setVoucherCode(
                                                e.target.value.toUpperCase(),
                                            )
                                        }
                                        className="pl-10"
                                    />
                                </div>
                                <Button variant="outline" size="sm">
                                    Áp dụng
                                </Button>
                            </div>

                            <Separator />

                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                        Tạm tính
                                    </span>
                                    <span>{formatPrice(subtotal)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                        Phí vận chuyển
                                    </span>
                                    <span
                                        className={
                                            shippingFee === 0
                                                ? "text-emerald-600"
                                                : ""
                                        }
                                    >
                                        {shippingFee === 0
                                            ? "Miễn phí"
                                            : formatPrice(shippingFee)}
                                    </span>
                                </div>
                            </div>

                            <Separator />

                            <div className="flex justify-between font-bold text-lg">
                                <span>Tổng cộng</span>
                                <span className="text-primary">
                                    {formatPrice(total)}
                                </span>
                            </div>

                            <Button
                                className="w-full h-12 text-base font-semibold"
                                size="lg"
                                onClick={handleCheckout}
                                disabled={loading || !selectedAddress}
                            >
                                {loading
                                    ? "Đang xử lý..."
                                    : paymentMethod === "vnpay"
                                      ? "Thanh toán qua VNPay"
                                      : "Đặt Hàng"}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
