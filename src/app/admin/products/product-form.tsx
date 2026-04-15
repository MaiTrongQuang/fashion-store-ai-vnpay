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
import { Plus, Edit, Trash2, X, ImagePlus } from "lucide-react";
import { upsertProduct, deleteProduct } from "@/app/admin/actions";
import { FileUpload } from "@/components/admin/file-upload";
import { slugify } from "@/lib/utils";
import { toast } from "sonner";

interface Variant {
    id?: string;
    size: string;
    color: string;
    color_hex: string;
    price: number;
    stock: number;
    sku: string;
    is_active: boolean;
}

interface ProductImage {
    url: string;
    alt: string;
    is_primary: boolean;
    sort_order: number;
}

interface ProductFormProps {
    categories: { id: string; name: string }[];
    brands: { id: string; name: string }[];
    editItem?: any;
}

export function ProductForm({ categories, brands, editItem }: ProductFormProps) {
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const isEdit = !!editItem;

    // ── Basic fields ──
    const [name, setName] = useState(editItem?.name || "");
    const [slug, setSlug] = useState(editItem?.slug || "");
    const [description, setDescription] = useState(editItem?.description || "");
    const [categoryId, setCategoryId] = useState(editItem?.category_id || "none");
    const [brandId, setBrandId] = useState(editItem?.brand_id || "none");
    const [basePrice, setBasePrice] = useState<number>(editItem?.base_price || 0);
    const [salePrice, setSalePrice] = useState<number>(editItem?.sale_price || 0);
    const [isActive, setIsActive] = useState(editItem?.is_active !== false);
    const [isFeatured, setIsFeatured] = useState(editItem?.is_featured || false);
    const [isNew, setIsNew] = useState(editItem?.is_new !== false);
    const [tags, setTags] = useState(editItem?.tags?.join(", ") || "");

    // ── Images ──
    const [images, setImages] = useState<ProductImage[]>(
        editItem?.images?.map((img: any, idx: number) => ({
            url: img.url,
            alt: img.alt || "",
            is_primary: img.is_primary || false,
            sort_order: img.sort_order ?? idx,
        })) || []
    );

    // ── Variants ──
    const [variants, setVariants] = useState<Variant[]>(
        editItem?.variants?.map((v: any) => ({
            id: v.id,
            size: v.size,
            color: v.color,
            color_hex: v.color_hex || "",
            price: v.price,
            stock: v.stock,
            sku: v.sku,
            is_active: v.is_active !== false,
        })) || []
    );

    // Reset form when dialog reopens for a new item
    const handleOpenChange = (isOpen: boolean) => {
        setOpen(isOpen);
        if (isOpen && !isEdit) {
            setName("");
            setSlug("");
            setDescription("");
            setCategoryId("none");
            setBrandId("none");
            setBasePrice(0);
            setSalePrice(0);
            setIsActive(true);
            setIsFeatured(false);
            setIsNew(true);
            setTags("");
            setImages([]);
            setVariants([]);
        }
    };

    const addImage = (url: string) => {
        if (!url) return;
        setImages((prev) => [
            ...prev,
            {
                url,
                alt: "",
                is_primary: prev.length === 0,
                sort_order: prev.length,
            },
        ]);
    };

    const removeImage = (index: number) => {
        setImages((prev) => {
            const next = prev.filter((_, i) => i !== index);
            // Ensure at least one primary if images exist
            if (next.length > 0 && !next.some((img) => img.is_primary)) {
                next[0].is_primary = true;
            }
            return next;
        });
    };

    const setPrimaryImage = (index: number) => {
        setImages((prev) =>
            prev.map((img, i) => ({ ...img, is_primary: i === index }))
        );
    };

    const addVariant = () => {
        setVariants((prev) => [
            ...prev,
            {
                size: "",
                color: "",
                color_hex: "",
                price: basePrice || 0,
                stock: 0,
                sku: "",
                is_active: true,
            },
        ]);
    };

    const updateVariant = (index: number, field: keyof Variant, value: any) => {
        setVariants((prev) =>
            prev.map((v, i) => (i === index ? { ...v, [field]: value } : v))
        );
    };

    const removeVariant = (index: number) => {
        setVariants((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = () => {
        if (!name.trim() || !slug.trim()) {
            toast.error("Vui lòng nhập tên và slug sản phẩm");
            return;
        }
        if (basePrice <= 0) {
            toast.error("Giá sản phẩm phải lớn hơn 0");
            return;
        }

        startTransition(async () => {
            try {
                await upsertProduct({
                    id: editItem?.id,
                    name: name.trim(),
                    slug: slug.trim(),
                    description: description.trim() || undefined,
                    category_id: categoryId === "none" ? undefined : categoryId,
                    brand_id: brandId === "none" ? undefined : brandId,
                    base_price: Number(basePrice),
                    sale_price: salePrice > 0 ? Number(salePrice) : null,
                    is_active: isActive,
                    is_featured: isFeatured,
                    is_new: isNew,
                    tags: tags
                        .split(",")
                        .map((t: string) => t.trim())
                        .filter(Boolean),
                    images,
                    variants,
                });
                toast.success(
                    isEdit ? "Đã cập nhật sản phẩm" : "Đã thêm sản phẩm"
                );
                setOpen(false);
            } catch (e: any) {
                toast.error(e.message);
            }
        });
    };

    const handleDelete = () => {
        if (!editItem || !confirm("Xóa sản phẩm này? Thao tác này không thể hoàn tác."))
            return;
        startTransition(async () => {
            try {
                await deleteProduct(editItem.id);
                toast.success("Đã xóa sản phẩm");
                setOpen(false);
            } catch (e: any) {
                toast.error(e.message);
            }
        });
    };

    return (
        <div className="flex items-center gap-1">
            <Dialog open={open} onOpenChange={handleOpenChange}>
                <DialogTrigger
                    render={
                        isEdit ? (
                            <Button variant="ghost" size="icon">
                                <Edit className="h-4 w-4" />
                            </Button>
                        ) : (
                            <Button>
                                <Plus className="h-4 w-4 mr-2" />
                                Thêm sản phẩm
                            </Button>
                        )
                    }
                />
                <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            {isEdit ? "Sửa sản phẩm" : "Thêm sản phẩm mới"}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-6">
                        {/* ── Basic Info ── */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                                Thông tin cơ bản
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="p-name">Tên sản phẩm *</Label>
                                    <Input
                                        id="p-name"
                                        value={name}
                                        onChange={(e) => {
                                            setName(e.target.value);
                                            if (!isEdit)
                                                setSlug(
                                                    slugify(e.target.value)
                                                );
                                        }}
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="p-slug">Slug *</Label>
                                    <Input
                                        id="p-slug"
                                        value={slug}
                                        onChange={(e) =>
                                            setSlug(e.target.value)
                                        }
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="p-desc">Mô tả</Label>
                                <Textarea
                                    id="p-desc"
                                    value={description}
                                    onChange={(e) =>
                                        setDescription(e.target.value)
                                    }
                                    rows={3}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Danh mục</Label>
                                    <Select
                                        value={categoryId}
                                        onValueChange={setCategoryId}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Chọn danh mục" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">
                                                Không có
                                            </SelectItem>
                                            {categories.map((c) => (
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
                                    <Label>Thương hiệu</Label>
                                    <Select
                                        value={brandId}
                                        onValueChange={setBrandId}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Chọn thương hiệu" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">
                                                Không có
                                            </SelectItem>
                                            {brands.map((b) => (
                                                <SelectItem
                                                    key={b.id}
                                                    value={b.id}
                                                >
                                                    {b.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="p-base">Giá gốc *</Label>
                                    <Input
                                        id="p-base"
                                        type="number"
                                        min={0}
                                        value={basePrice}
                                        onChange={(e) =>
                                            setBasePrice(Number(e.target.value))
                                        }
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="p-sale">Giá sale</Label>
                                    <Input
                                        id="p-sale"
                                        type="number"
                                        min={0}
                                        value={salePrice}
                                        onChange={(e) =>
                                            setSalePrice(Number(e.target.value))
                                        }
                                    />
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="p-tags">Tags (phân cách bằng dấu phẩy)</Label>
                                <Input
                                    id="p-tags"
                                    value={tags}
                                    onChange={(e) => setTags(e.target.value)}
                                    placeholder="nam, áo, mùa hè"
                                />
                            </div>
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-2">
                                    <Switch
                                        checked={isActive}
                                        onCheckedChange={setIsActive}
                                    />
                                    <Label>Kích hoạt</Label>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Switch
                                        checked={isFeatured}
                                        onCheckedChange={setIsFeatured}
                                    />
                                    <Label>Nổi bật</Label>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Switch
                                        checked={isNew}
                                        onCheckedChange={setIsNew}
                                    />
                                    <Label>Hàng mới</Label>
                                </div>
                            </div>
                        </div>

                        {/* ── Images ── */}
                        <div className="space-y-3">
                            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                                Hình ảnh sản phẩm
                            </h3>
                            <div className="flex flex-wrap gap-3">
                                {images.map((img, idx) => (
                                    <div
                                        key={idx}
                                        className={`relative group w-24 h-24 rounded-lg overflow-hidden border-2 transition-colors ${
                                            img.is_primary
                                                ? "border-primary"
                                                : "border-transparent hover:border-muted-foreground/30"
                                        }`}
                                    >
                                        <img
                                            src={img.url}
                                            alt={img.alt}
                                            className="w-full h-full object-cover cursor-pointer"
                                            onClick={() =>
                                                setPrimaryImage(idx)
                                            }
                                        />
                                        {img.is_primary && (
                                            <span className="absolute bottom-0 left-0 right-0 bg-primary text-primary-foreground text-[10px] text-center py-0.5">
                                                Chính
                                            </span>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => removeImage(idx)}
                                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <FileUpload
                                onChange={(url) => addImage(url)}
                                label="Thêm ảnh sản phẩm"
                                folder="products"
                                accept="image/*"
                            />
                        </div>

                        {/* ── Variants ── */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                                    Biến thể ({variants.length})
                                </h3>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={addVariant}
                                >
                                    <Plus className="h-3 w-3 mr-1" />
                                    Thêm biến thể
                                </Button>
                            </div>

                            {variants.length === 0 && (
                                <p className="text-sm text-muted-foreground py-2">
                                    Chưa có biến thể nào. Thêm biến thể để quản
                                    lý size, màu sắc, tồn kho.
                                </p>
                            )}

                            {variants.map((variant, idx) => (
                                <div
                                    key={idx}
                                    className="relative border rounded-lg p-3 space-y-3"
                                >
                                    <button
                                        type="button"
                                        onClick={() => removeVariant(idx)}
                                        className="absolute top-2 right-2 text-red-400 hover:text-red-600"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                    <div className="grid grid-cols-3 gap-3">
                                        <div>
                                            <Label className="text-xs">
                                                Size
                                            </Label>
                                            <Input
                                                value={variant.size}
                                                onChange={(e) =>
                                                    updateVariant(
                                                        idx,
                                                        "size",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="M, L, XL..."
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-xs">
                                                Màu
                                            </Label>
                                            <Input
                                                value={variant.color}
                                                onChange={(e) =>
                                                    updateVariant(
                                                        idx,
                                                        "color",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Đen, Trắng..."
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-xs">
                                                Mã màu
                                            </Label>
                                            <div className="flex gap-1">
                                                <Input
                                                    value={variant.color_hex}
                                                    onChange={(e) =>
                                                        updateVariant(
                                                            idx,
                                                            "color_hex",
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="#000000"
                                                    className="flex-1"
                                                />
                                                <input
                                                    type="color"
                                                    value={
                                                        variant.color_hex ||
                                                        "#000000"
                                                    }
                                                    onChange={(e) =>
                                                        updateVariant(
                                                            idx,
                                                            "color_hex",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-8 h-8 rounded border cursor-pointer"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-3">
                                        <div>
                                            <Label className="text-xs">
                                                Giá
                                            </Label>
                                            <Input
                                                type="number"
                                                min={0}
                                                value={variant.price}
                                                onChange={(e) =>
                                                    updateVariant(
                                                        idx,
                                                        "price",
                                                        Number(e.target.value)
                                                    )
                                                }
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-xs">
                                                Tồn kho
                                            </Label>
                                            <Input
                                                type="number"
                                                min={0}
                                                value={variant.stock}
                                                onChange={(e) =>
                                                    updateVariant(
                                                        idx,
                                                        "stock",
                                                        Number(e.target.value)
                                                    )
                                                }
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-xs">
                                                SKU
                                            </Label>
                                            <Input
                                                value={variant.sku}
                                                onChange={(e) =>
                                                    updateVariant(
                                                        idx,
                                                        "sku",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="SKU-001"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Switch
                                            checked={variant.is_active}
                                            onCheckedChange={(checked) =>
                                                updateVariant(
                                                    idx,
                                                    "is_active",
                                                    checked
                                                )
                                            }
                                        />
                                        <Label className="text-xs">
                                            Kích hoạt
                                        </Label>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* ── Actions ── */}
                        <div className="flex gap-3 pt-2">
                            <Button
                                type="button"
                                className="flex-1"
                                disabled={isPending}
                                onClick={handleSubmit}
                            >
                                {isPending
                                    ? "Đang xử lý..."
                                    : isEdit
                                      ? "Cập nhật sản phẩm"
                                      : "Thêm sản phẩm"}
                            </Button>
                            {isEdit && (
                                <Button
                                    type="button"
                                    variant="destructive"
                                    disabled={isPending}
                                    onClick={handleDelete}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
