"use client";

import { Button } from "@/components/ui/button";
import { updateOrderStatus } from "@/app/admin/actions";
import { useTransition } from "react";
import { toast } from "sonner";

const STATUS_TRANSITIONS: Record<
    string,
    { next: string; label: string; variant: "default" | "destructive" }[]
> = {
    pending: [
        { next: "processing", label: "Xác nhận xử lý", variant: "default" },
        { next: "cancelled", label: "Huỷ đơn", variant: "destructive" },
    ],
    awaiting_payment: [
        { next: "paid", label: "Đánh dấu đã thanh toán", variant: "default" },
        { next: "cancelled", label: "Huỷ đơn", variant: "destructive" },
    ],
    paid: [
        { next: "processing", label: "Bắt đầu xử lý", variant: "default" },
    ],
    processing: [
        { next: "shipping", label: "Giao hàng", variant: "default" },
    ],
    shipping: [
        { next: "completed", label: "Hoàn thành", variant: "default" },
    ],
};

export function OrderStatusActions({
    orderId,
    currentStatus,
}: {
    orderId: string;
    currentStatus: string;
}) {
    const [isPending, startTransition] = useTransition();
    const transitions = STATUS_TRANSITIONS[currentStatus] || [];

    if (transitions.length === 0) return null;

    const handleUpdate = (newStatus: string) => {
        startTransition(async () => {
            try {
                await updateOrderStatus(orderId, newStatus);
                toast.success("Đã cập nhật trạng thái đơn hàng");
            } catch {
                toast.error("Lỗi khi cập nhật trạng thái");
            }
        });
    };

    return (
        <div className="flex flex-wrap gap-2">
            <span className="text-sm text-muted-foreground self-center mr-2">
                Cập nhật:
            </span>
            {transitions.map((t) => (
                <Button
                    key={t.next}
                    variant={t.variant}
                    size="sm"
                    disabled={isPending}
                    onClick={() => handleUpdate(t.next)}
                >
                    {isPending ? "Đang xử lý..." : t.label}
                </Button>
            ))}
        </div>
    );
}
