import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    Store, Truck, Phone, Globe, Shield,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Cài đặt hệ thống" };

export default function AdminSettingsPage() {
    return (
        <div className="space-y-6 max-w-3xl">
            <div>
                <h1 className="text-2xl font-bold">Cài Đặt Hệ Thống</h1>
                <p className="text-muted-foreground">
                    Cấu hình thông tin cửa hàng
                </p>
            </div>

            {/* Store Info */}
            <Card className="border-0 shadow-sm">
                <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                        <Store className="h-4 w-4 text-muted-foreground" />
                        <CardTitle className="text-base">Thông tin cửa hàng</CardTitle>
                    </div>
                    <CardDescription>Thông tin hiển thị trên website</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label>Tên cửa hàng</Label>
                        <Input defaultValue="Nana Store" disabled />
                    </div>
                    <div>
                        <Label>Mô tả</Label>
                        <Input defaultValue="Thời trang cao cấp — Phong cách đẳng cấp" disabled />
                    </div>
                    <div>
                        <Label>Website</Label>
                        <Input defaultValue="https://Nanafashion.store" disabled />
                    </div>
                </CardContent>
            </Card>

            {/* Shipping */}
            <Card className="border-0 shadow-sm">
                <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                        <Truck className="h-4 w-4 text-muted-foreground" />
                        <CardTitle className="text-base">Phí giao hàng</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Phí giao hàng mặc định</Label>
                            <Input defaultValue="30000" type="number" disabled />
                            <p className="text-xs text-muted-foreground mt-1">VNĐ</p>
                        </div>
                        <div>
                            <Label>Miễn phí vận chuyển từ</Label>
                            <Input defaultValue="500000" type="number" disabled />
                            <p className="text-xs text-muted-foreground mt-1">VNĐ</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Contact */}
            <Card className="border-0 shadow-sm">
                <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <CardTitle className="text-base">Thông tin liên hệ</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label>Email hỗ trợ</Label>
                        <Input defaultValue="support@Nanafashion.store" disabled />
                    </div>
                    <div>
                        <Label>Hotline</Label>
                        <Input defaultValue="1900-xxxx" disabled />
                    </div>
                    <div>
                        <Label>Địa chỉ</Label>
                        <Input defaultValue="TP. Hồ Chí Minh, Việt Nam" disabled />
                    </div>
                </CardContent>
            </Card>

            {/* System Info */}
            <Card className="border-0 shadow-sm">
                <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-muted-foreground" />
                        <CardTitle className="text-base">Thông tin hệ thống</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center justify-between p-3 bg-accent/30 rounded-lg">
                            <span className="text-muted-foreground">Framework</span>
                            <Badge variant="outline">Next.js 15</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-accent/30 rounded-lg">
                            <span className="text-muted-foreground">Database</span>
                            <Badge variant="outline">Supabase</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-accent/30 rounded-lg">
                            <span className="text-muted-foreground">Thanh toán</span>
                            <Badge variant="outline">VNPay</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-accent/30 rounded-lg">
                            <span className="text-muted-foreground">AI</span>
                            <Badge variant="outline">Google Gemini</Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
