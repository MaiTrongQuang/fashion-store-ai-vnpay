"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Edit, Trash2 } from "lucide-react";
import { upsertBanner, deleteBanner } from "@/app/admin/actions";
import { toast } from "sonner";

export function BannerActions({ editItem }: { editItem?: any }) {
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const isEdit = !!editItem;

    const handleSubmit = (formData: FormData) => {
        if (editItem) formData.set("id", editItem.id);
        startTransition(async () => {
            try {
                await upsertBanner(formData);
                toast.success(isEdit ? "Đã cập nhật" : "Đã thêm banner");
                setOpen(false);
            } catch (e: any) { toast.error(e.message); }
        });
    };

    const handleDelete = () => {
        if (!editItem || !confirm("Xóa banner này?")) return;
        startTransition(async () => {
            try { await deleteBanner(editItem.id); toast.success("Đã xóa"); }
            catch (e: any) { toast.error(e.message); }
        });
    };

    return (
        <div className="flex items-center gap-1">
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger
                    render={isEdit ? (
                        <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                    ) : (
                        <Button><Plus className="h-4 w-4 mr-2" />Thêm banner</Button>
                    )}
                >
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{isEdit ? "Sửa banner" : "Thêm banner mới"}</DialogTitle>
                    </DialogHeader>
                    <form action={handleSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="title">Tiêu đề</Label>
                            <Input id="title" name="title" defaultValue={editItem?.title || ""} required />
                        </div>
                        <div>
                            <Label htmlFor="subtitle">Phụ đề</Label>
                            <Input id="subtitle" name="subtitle" defaultValue={editItem?.subtitle || ""} />
                        </div>
                        <div>
                            <Label htmlFor="image_url">URL hình ảnh</Label>
                            <Input id="image_url" name="image_url" defaultValue={editItem?.image_url || ""} required />
                        </div>
                        <div>
                            <Label htmlFor="link_url">URL liên kết</Label>
                            <Input id="link_url" name="link_url" defaultValue={editItem?.link_url || ""} />
                        </div>
                        <div>
                            <Label htmlFor="sort_order">Thứ tự</Label>
                            <Input id="sort_order" name="sort_order" type="number" defaultValue={editItem?.sort_order || 0} />
                        </div>
                        <div className="flex items-center gap-2">
                            <Switch id="is_active" name="is_active" value="true" defaultChecked={editItem?.is_active !== false} />
                            <Label htmlFor="is_active">Kích hoạt</Label>
                        </div>
                        <Button type="submit" className="w-full" disabled={isPending}>
                            {isPending ? "Đang xử lý..." : isEdit ? "Cập nhật" : "Thêm mới"}
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
            {isEdit && (
                <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={handleDelete} disabled={isPending}>
                    <Trash2 className="h-4 w-4" />
                </Button>
            )}
        </div>
    );
}
