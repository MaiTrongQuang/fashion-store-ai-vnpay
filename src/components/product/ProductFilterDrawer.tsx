"use client";

import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import ProductFilters from "@/components/product/ProductFilters";
import type { Brand, Category } from "@/lib/types";

interface ProductFilterDrawerProps {
    categories: Category[];
    brands: Brand[];
    basePath?: string;
}

export default function ProductFilterDrawer({
    categories,
    brands,
    basePath = "/products",
}: ProductFilterDrawerProps) {
    return (
        <Sheet>
            <SheetTrigger
                render={
                    <Button
                        variant="outline"
                        className="h-11 w-full justify-center rounded-md font-semibold sm:w-auto lg:hidden"
                    >
                        <SlidersHorizontal className="h-4 w-4" />
                        Bộ lọc
                    </Button>
                }
            />
            <SheetContent side="left" className="w-[88vw] max-w-sm overflow-y-auto">
                <SheetHeader className="border-b px-5 py-4">
                    <SheetTitle>Bộ lọc sản phẩm</SheetTitle>
                </SheetHeader>
                <div className="px-5 py-5">
                    <ProductFilters
                        categories={categories}
                        brands={brands}
                        basePath={basePath}
                    />
                </div>
            </SheetContent>
        </Sheet>
    );
}
