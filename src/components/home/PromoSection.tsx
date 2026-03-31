import { Truck, Shield, RotateCcw, Headphones } from "lucide-react";

const features = [
    {
        icon: Truck,
        title: "Giao Hàng Toàn Quốc",
        description: "Miễn phí ship cho đơn từ 500K",
    },
    {
        icon: Shield,
        title: "Cam Kết Chính Hãng",
        description: "100% sản phẩm chất lượng",
    },
    {
        icon: RotateCcw,
        title: "Đổi Trả Dễ Dàng",
        description: "Đổi trả trong 7 ngày",
    },
    {
        icon: Headphones,
        title: "Hỗ Trợ 24/7",
        description: "Tư vấn nhiệt tình",
    },
];

export default function PromoSection() {
    return (
        <section className="py-12 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="flex flex-col items-center text-center space-y-3 group"
                        >
                            <div className="w-14 h-14 rounded-2xl bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center transition-colors duration-300">
                                <feature.icon className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="font-semibold text-sm md:text-base">
                                {feature.title}
                            </h3>
                            <p className="text-xs md:text-sm text-muted-foreground">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
