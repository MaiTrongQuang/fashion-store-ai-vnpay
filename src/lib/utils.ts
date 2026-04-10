import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(price);
}

export function formatDate(dateStr: string): string {
    return new Intl.DateTimeFormat("vi-VN", {
        timeZone: "Asia/Ho_Chi_Minh",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(dateStr));
}

export function generateOrderNumber(): string {
    const now = new Date();
    const prefix = "LX";
    const vnParts = new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Ho_Chi_Minh",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).format(now); // "2026-04-11"
    const date = vnParts.slice(2).replace(/-/g, ""); // "260411"
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${prefix}${date}${random}`;
}

export function slugify(text: string): string {
    return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/Đ/g, "D")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
}

export function getDiscountPercent(
    originalPrice: number,
    salePrice: number,
): number {
    if (!salePrice || salePrice >= originalPrice) return 0;
    return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
}
