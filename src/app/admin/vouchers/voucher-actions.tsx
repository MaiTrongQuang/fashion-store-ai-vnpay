"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Plus, Edit, Trash2 } from "lucide-react";
import { upsertVoucher, deleteVoucher } from "@/app/admin/actions";
import { toast } from "sonner";

export function VoucherActions({ editItem }: { editItem?: any }) {
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const isEdit = !!editItem;

    const handleSubmit = (formData: FormData) => {
        if (editItem) formData.set("id", editItem.id);
        startTransition(async () => {
            try {
                await upsertVoucher(formData);
                toast.success(isEdit ? "Đã cập nhật" : "Đã thêm voucher");
                setOpen(false);
            } catch (e: any) { toast.error(e.message); }
        });
    };

    const handleDelete = () => {
        if (!editItem || !confirm("Xóa voucher này?")) return;
        startTransition(async () => {
            try { await deleteVoucher(editItem.id); toast.success("Đã xóa"); }
            catch (e: any) { toast.error(e.message); }
        });
    };

    // Format dates for input[type=datetime-local]
    const formatForInput = (d: string) => d ? new Date(d).toISOString().slice(0, 16) : "";

    return (
        <div className="flex items-center gap-1">
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger
                    render={isEdit ? (
                        <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                    ) : (
                        <Button><Plus className="h-4 w-4 mr-2" />Thêm voucher</Button>
                    )}
                >
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>{isEdit ? "Sửa voucher" : "Thêm voucher mới"}</DialogTitle>
                    </DialogHeader>
                    <form action={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="code">Mã voucher</Label>
                                <Input id="code" name="code" defaultValue={editItem?.code || ""} required className="uppercase" />
                            </div>
                            <div>
                                <Label htmlFor="type">Loại</Label>
                                <Select name="type" defaultValue={editItem?.type || "percentage"}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="percentage">Phần trăm (%)</SelectItem>
                                        <SelectItem value="fixed">Cố định (VND)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="value">Giá trị</Label>
                                <Input id="value" name="value" type="number" defaultValue={editItem?.value || ""} required />
                            </div>
                            <div>
                                <Label htmlFor="max_discount">Giảm tối đa</Label>
                                <Input id="max_discount" name="max_discount" type="number" defaultValue={editItem?.max_discount || ""} />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="min_order">Đơn tối thiểu</Label>
                                <Input id="min_order" name="min_order" type="number" defaultValue={editItem?.min_order || 0} />
                            </div>
                            <div>
                                <Label htmlFor="usage_limit">Giới hạn sử dụng</Label>
                                <Input id="usage_limit" name="usage_limit" type="number" defaultValue={editItem?.usage_limit || 1} />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="starts_at">Bắt đầu</Label>
                                <Input id="starts_at" name="starts_at" type="datetime-local" defaultValue={formatForInput(editItem?.starts_at)} required />
                            </div>
                            <div>
                                <Label htmlFor="expires_at">Kết thúc</Label>
                                <Input id="expires_at" name="expires_at" type="datetime-local" defaultValue={formatForInput(editItem?.expires_at)} required />
                            </div>
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
