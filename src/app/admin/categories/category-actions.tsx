"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Plus, Edit, Trash2 } from "lucide-react";
import { upsertCategory, deleteCategory } from "@/app/admin/actions";
import { FileUpload } from "@/components/admin/file-upload";
import { slugify } from "@/lib/utils";
import { toast } from "sonner";

export function CategoryActions({
    categories,
    editItem,
}: {
    categories: any[];
    editItem?: any;
}) {
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [name, setName] = useState(editItem?.name || "");
    const [slug, setSlug] = useState(editItem?.slug || "");
    const [imageUrl, setImageUrl] = useState(editItem?.image_url || "");

    const isEdit = !!editItem;

    const handleSubmit = (formData: FormData) => {
        if (editItem) formData.set("id", editItem.id);
        formData.set("image_url", imageUrl);
        startTransition(async () => {
            try {
                await upsertCategory(formData);
                toast.success(
                    isEdit ? "Đã cập nhật danh mục" : "Đã thêm danh mục"
                );
                setOpen(false);
            } catch (e: any) {
                toast.error(e.message);
            }
        });
    };

    const handleDelete = () => {
        if (!editItem || !confirm("Xóa danh mục này?")) return;
        startTransition(async () => {
            try {
                await deleteCategory(editItem.id);
                toast.success("Đã xóa danh mục");
            } catch (e: any) {
                toast.error(e.message);
            }
        });
    };

    return (
        <div className="flex items-center gap-1">
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger
                    render={
                        isEdit ? (
                            <Button variant="ghost" size="icon">
                                <Edit className="h-4 w-4" />
                            </Button>
                        ) : (
                            <Button>
                                <Plus className="h-4 w-4 mr-2" />
                                Thêm danh mục
                            </Button>
                        )
                    }
                />
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {isEdit ? "Sửa danh mục" : "Thêm danh mục mới"}
                        </DialogTitle>
                    </DialogHeader>
                    <form action={handleSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="name">Tên danh mục</Label>
                            <Input
                                id="name"
                                name="name"
                                value={name}
                                onChange={(e) => {
                                    setName(e.target.value);
                                    if (!isEdit)
                                        setSlug(slugify(e.target.value));
                                }}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="slug">Slug</Label>
                            <Input
                                id="slug"
                                name="slug"
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="description">Mô tả</Label>
                            <Textarea
                                id="description"
                                name="description"
                                defaultValue={editItem?.description || ""}
                            />
                        </div>
                        <FileUpload
                            value={imageUrl}
                            onChange={setImageUrl}
                            label="Hình ảnh danh mục"
                            folder="categories"
                            accept="image/*"
                        />
                        <input type="hidden" name="image_url" value={imageUrl} />
                        <div>
                            <Label htmlFor="parent_id">Danh mục cha</Label>
                            <Select
                                name="parent_id"
                                defaultValue={editItem?.parent_id || "none"}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn danh mục cha" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">
                                        Không có
                                    </SelectItem>
                                    {categories
                                        .filter((c) => c.id !== editItem?.id)
                                        .map((c) => (
                                            <SelectItem
                                                key={c.id}
                                                value={c.id}
                                            >
                                                {c.name}
                                            </SelectItem>
                                        ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="sort_order">Thứ tự sắp xếp</Label>
                            <Input
                                id="sort_order"
                                name="sort_order"
                                type="number"
                                defaultValue={editItem?.sort_order || 0}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Switch
                                id="is_active"
                                name="is_active"
                                value="true"
                                defaultChecked={editItem?.is_active !== false}
                            />
                            <Label htmlFor="is_active">Kích hoạt</Label>
                        </div>
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isPending}
                        >
                            {isPending
                                ? "Đang xử lý..."
                                : isEdit
                                  ? "Cập nhật"
                                  : "Thêm mới"}
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
            {isEdit && (
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={handleDelete}
                    disabled={isPending}
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            )}
        </div>
    );
}
