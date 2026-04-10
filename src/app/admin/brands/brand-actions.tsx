"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Edit, Trash2 } from "lucide-react";
import { upsertBrand, deleteBrand } from "@/app/admin/actions";
import { slugify } from "@/lib/utils";
import { toast } from "sonner";

export function BrandActions({ editItem }: { editItem?: any }) {
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [name, setName] = useState(editItem?.name || "");
    const [slug, setSlug] = useState(editItem?.slug || "");
    const isEdit = !!editItem;

    const handleSubmit = (formData: FormData) => {
        if (editItem) formData.set("id", editItem.id);
        startTransition(async () => {
            try {
                await upsertBrand(formData);
                toast.success(isEdit ? "Đã cập nhật" : "Đã thêm thương hiệu");
                setOpen(false);
            } catch (e: any) { toast.error(e.message); }
        });
    };

    const handleDelete = () => {
        if (!editItem || !confirm("Xóa thương hiệu này?")) return;
        startTransition(async () => {
            try { await deleteBrand(editItem.id); toast.success("Đã xóa"); }
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
                        <Button><Plus className="h-4 w-4 mr-2" />Thêm thương hiệu</Button>
                    )}
                >
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{isEdit ? "Sửa thương hiệu" : "Thêm thương hiệu"}</DialogTitle>
                    </DialogHeader>
                    <form action={handleSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="name">Tên</Label>
                            <Input id="name" name="name" value={name} onChange={(e) => { setName(e.target.value); if (!isEdit) setSlug(slugify(e.target.value)); }} required />
                        </div>
                        <div>
                            <Label htmlFor="slug">Slug</Label>
                            <Input id="slug" name="slug" value={slug} onChange={(e) => setSlug(e.target.value)} required />
                        </div>
                        <div>
                            <Label htmlFor="logo_url">URL Logo</Label>
                            <Input id="logo_url" name="logo_url" defaultValue={editItem?.logo_url || ""} />
                        </div>
                        <div>
                            <Label htmlFor="description">Mô tả</Label>
                            <Textarea id="description" name="description" defaultValue={editItem?.description || ""} />
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
