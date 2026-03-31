import { Card, CardContent } from "@/components/ui/card";
import { Heart, Award, Users, Sparkles } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Về chúng tôi",
    description:
        "Câu chuyện LUXE Fashion - Thương hiệu thời trang hàng đầu Việt Nam",
};

export default function AboutPage() {
    return (
        <div className="container mx-auto px-4 py-12">
            {/* Hero */}
            <div className="text-center mb-16 max-w-3xl mx-auto">
                <h1 className="text-3xl md:text-4xl font-bold mb-4">
                    Về{" "}
                    <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                        LUXE Fashion
                    </span>
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed">
                    LUXE Fashion được thành lập với sứ mệnh mang đến những sản
                    phẩm thời trang chất lượng cao, phong cách hiện đại với giá
                    cả hợp lý cho người Việt. Chúng tôi tin rằng mỗi người đều
                    xứng đáng được tự tin với phong cách riêng.
                </p>
            </div>

            {/* Values */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                {[
                    {
                        icon: Heart,
                        title: "Tận Tâm",
                        desc: "Đặt khách hàng lên hàng đầu, phục vụ bằng cả tấm lòng",
                    },
                    {
                        icon: Award,
                        title: "Chất Lượng",
                        desc: "Cam kết 100% sản phẩm đạt tiêu chuẩn chất lượng cao",
                    },
                    {
                        icon: Users,
                        title: "Cộng Đồng",
                        desc: "Xây dựng cộng đồng yêu thời trang, chia sẻ phong cách",
                    },
                    {
                        icon: Sparkles,
                        title: "Đổi Mới",
                        desc: "Không ngừng đổi mới, cập nhật xu hướng mới nhất",
                    },
                ].map((item, i) => (
                    <Card key={i} className="border-0 shadow-sm text-center">
                        <CardContent className="pt-8 pb-6">
                            <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                                <item.icon className="h-7 w-7 text-primary" />
                            </div>
                            <h3 className="font-semibold text-lg mb-2">
                                {item.title}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                {item.desc}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Story */}
            <div className="max-w-3xl mx-auto text-center space-y-6">
                <h2 className="text-2xl font-bold">Câu Chuyện Của Chúng Tôi</h2>
                <div className="text-muted-foreground space-y-4 leading-relaxed">
                    <p>
                        LUXE Fashion ra đời từ niềm đam mê thời trang và mong
                        muốn mang đến trải nghiệm mua sắm trực tuyến tốt nhất.
                        Với đội ngũ thiết kế sáng tạo và quy trình sản xuất
                        nghiêm ngặt, mỗi sản phẩm của chúng tôi đều là kết tinh
                        của sự tỉ mỉ và tâm huyết.
                    </p>
                    <p>
                        Từ những chiếc áo thun basic đến những bộ sưu tập cao
                        cấp, LUXE Fashion luôn đồng hành cùng bạn trong mọi
                        khoảnh khắc cuộc sống - từ ngày đi làm năng động đến
                        những buổi hẹn hò lãng mạn.
                    </p>
                </div>
            </div>
        </div>
    );
}
