"use client";

import { Switch } from "@/components/ui/switch";
import { toggleReviewVisibility } from "@/app/admin/actions";
import { useTransition } from "react";
import { toast } from "sonner";

export function ReviewToggle({ reviewId, isVisible }: { reviewId: string; isVisible: boolean }) {
    const [isPending, startTransition] = useTransition();

    return (
        <Switch
            checked={isVisible}
            disabled={isPending}
            onCheckedChange={() => {
                startTransition(async () => {
                    try {
                        await toggleReviewVisibility(reviewId);
                        toast.success("Đã cập nhật");
                    } catch { toast.error("Lỗi"); }
                });
            }}
        />
    );
}
