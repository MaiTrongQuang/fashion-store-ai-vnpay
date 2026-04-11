import Link from "next/link";
import { Mail, Phone, MapPin, Globe, Camera } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { SITE_NAME, FOOTER_LINKS } from "@/lib/constants";

export default function Footer() {
    return (
        <footer className="bg-primary text-primary-foreground mt-auto">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div>
                        <h3 className="text-xl font-bold mb-4">{SITE_NAME}</h3>
                        <p className="text-sm opacity-80 mb-4 leading-relaxed">
                            Hệ thống thời trang trực tuyến hàng đầu. Mang đến
                            cho bạn những sản phẩm chất lượng với giá cả hợp lý.
                        </p>
                        <div className="flex gap-3">
                            <a
                                href="#"
                                className="w-9 h-9 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 flex items-center justify-center transition-colors"
                            >
                                <Globe className="h-4 w-4" />
                            </a>
                            <a
                                href="#"
                                className="w-9 h-9 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 flex items-center justify-center transition-colors"
                            >
                                <Camera className="h-4 w-4" />
                            </a>
                        </div>
                    </div>

                    {/* About Links */}
                    <div>
                        <h4 className="font-semibold mb-4">Về chúng tôi</h4>
                        <ul className="space-y-2">
                            {FOOTER_LINKS.about.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm opacity-80 hover:opacity-100 transition-opacity"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Policy Links */}
                    <div>
                        <h4 className="font-semibold mb-4">Chính sách</h4>
                        <ul className="space-y-2">
                            {FOOTER_LINKS.policy.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm opacity-80 hover:opacity-100 transition-opacity"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-semibold mb-4">Liên hệ</h4>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-2 text-sm opacity-80">
                                <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                                <span>123 Nguyễn Văn Linh, Quận 7, TP.HCM</span>
                            </li>
                            <li className="flex items-center gap-2 text-sm opacity-80">
                                <Phone className="h-4 w-4 shrink-0" />
                                <span>1900-xxxx</span>
                            </li>
                            <li className="flex items-center gap-2 text-sm opacity-80">
                                <Mail className="h-4 w-4 shrink-0" />
                                <span>support@Nanafashion.vn</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <Separator className="my-8 bg-primary-foreground/10" />

                <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm opacity-60">
                    <p>© 2025 {SITE_NAME}. Tất cả quyền được bảo lưu.</p>
                    <p>Đồ án tốt nghiệp - Mai Trọng Quang</p>
                </div>
            </div>
        </footer>
    );
}
