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
import { upsertFAQ, deleteFAQ } from "@/app/admin/actions";
import { toast } from "sonner";

export function FAQActions({ editItem }: { editItem?: any }) {
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const isEdit = !!editItem;

    const handleSubmit = (formData: FormData) => {
        if (editItem) formData.set("id", editItem.id);
        startTransition(async () => {
            try {
                await upsertFAQ(formData);
                toast.success(isEdit ? "Đã cập nhật" : "Đã thêm FAQ");
                setOpen(false);
            } catch (e: any) { toast.error(e.message); }
        });
    };

    const handleDelete = () => {
        if (!editItem || !confirm("Xóa FAQ này?")) return;
        startTransition(async () => {
            try { await deleteFAQ(editItem.id); toast.success("Đã xóa"); }
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
                        <Button><Plus className="h-4 w-4 mr-2" />Thêm FAQ</Button>
                    )}
                >
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{isEdit ? "Sửa FAQ" : "Thêm FAQ mới"}</DialogTitle>
                    </DialogHeader>
                    <form action={handleSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="question">Câu hỏi</Label>
                            <Input id="question" name="question" defaultValue={editItem?.question || ""} required />
                        </div>
                        <div>
                            <Label htmlFor="answer">Câu trả lời</Label>
                            <Textarea id="answer" name="answer" defaultValue={editItem?.answer || ""} rows={4} required />
                        </div>
                        <div>
                            <Label htmlFor="category">Danh mục</Label>
                            <Input id="category" name="category" defaultValue={editItem?.category || ""} />
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
