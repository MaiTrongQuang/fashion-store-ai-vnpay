import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Liên hệ",
    description: "Liên hệ với LUXE Fashion - Hệ thống bán quần áo trực tuyến",
};

export default function ContactPage() {
    return (
        <div className="container mx-auto px-4 py-12">
            <div className="text-center mb-12">
                <h1 className="text-3xl font-bold mb-4">
                    Liên Hệ Với Chúng Tôi
                </h1>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                    Bất kỳ câu hỏi hay thắc mắc nào, đừng ngần ngại liên hệ với
                    chúng tôi. Đội ngũ LUXE Fashion luôn sẵn sàng hỗ trợ bạn.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                <div className="space-y-6">
                    {[
                        {
                            icon: MapPin,
                            title: "Địa chỉ",
                            detail: "123 Nguyễn Văn Linh, Quận 7, TP.HCM",
                        },
                        { icon: Phone, title: "Hotline", detail: "1900-xxxx" },
                        {
                            icon: Mail,
                            title: "Email",
                            detail: "support@luxefashion.vn",
                        },
                        {
                            icon: Clock,
                            title: "Giờ làm việc",
                            detail: "T2 - T7: 8:00 - 21:00",
                        },
                    ].map((item, i) => (
                        <div key={i} className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                <item.icon className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <p className="font-medium text-sm">
                                    {item.title}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {item.detail}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <Card className="md:col-span-2 border-0 shadow-lg">
                    <CardHeader>
                        <CardTitle>Gửi Tin Nhắn</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Họ tên</Label>
                                    <Input placeholder="Nguyễn Văn A" />
                                </div>
                                <div>
                                    <Label>Email</Label>
                                    <Input
                                        type="email"
                                        placeholder="your@email.com"
                                    />
                                </div>
                            </div>
                            <div>
                                <Label>Chủ đề</Label>
                                <Input placeholder="Hỗ trợ đơn hàng, tư vấn sản phẩm..." />
                            </div>
                            <div>
                                <Label>Nội dung</Label>
                                <Textarea
                                    rows={5}
                                    placeholder="Mô tả chi tiết vấn đề của bạn..."
                                />
                            </div>
                            <Button className="w-full">Gửi Tin Nhắn</Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
