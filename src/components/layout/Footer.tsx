import Link from "next/link";
import { Mail, Phone, MapPin, Globe, Camera } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { SITE_CONTACT, SITE_NAME, FOOTER_LINKS } from "@/lib/constants";

export default function Footer() {
    return (
        <footer className="mt-auto bg-primary text-primary-foreground">
            <div className="mx-auto w-full max-w-7xl px-6 py-12 sm:px-8 lg:px-10">
                <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-x-16 lg:grid-cols-[1.25fr_0.75fr_1fr_1.3fr] lg:gap-x-20">
                    {/* Brand */}
                    <div className="max-w-sm">
                        <h3 className="mb-4 text-2xl font-bold tracking-tight">
                            {SITE_NAME}
                        </h3>
                        <p className="mb-6 text-sm leading-7 opacity-75">
                            Hệ thống thời trang trực tuyến hàng đầu. Mang đến
                            cho bạn những sản phẩm chất lượng với giá cả hợp lý.
                        </p>
                        <div className="flex gap-3">
                            <a
                                href="#"
                                aria-label="Website Nana Store"
                                className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-foreground/10 transition-colors hover:bg-primary-foreground/20"
                            >
                                <Globe className="h-4 w-4" />
                            </a>
                            <a
                                href="#"
                                aria-label="Instagram Nana Store"
                                className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-foreground/10 transition-colors hover:bg-primary-foreground/20"
                            >
                                <Camera className="h-4 w-4" />
                            </a>
                        </div>
                    </div>

                    {/* About Links */}
                    <div>
                        <h4 className="mb-4 text-base font-semibold">
                            Về chúng tôi
                        </h4>
                        <ul className="space-y-3">
                            {FOOTER_LINKS.about.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="inline-flex text-sm opacity-75 transition-opacity hover:opacity-100"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Policy Links */}
                    <div>
                        <h4 className="mb-4 text-base font-semibold">
                            Chính sách
                        </h4>
                        <ul className="space-y-3">
                            {FOOTER_LINKS.policy.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="inline-flex text-sm opacity-75 transition-opacity hover:opacity-100"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="lg:justify-self-end">
                        <h4 className="mb-4 text-base font-semibold">
                            Liên hệ
                        </h4>
                        <ul className="space-y-4">
                            <li className="flex max-w-xs items-start gap-3 text-sm leading-6 opacity-75">
                                <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                                <span>{SITE_CONTACT.address}</span>
                            </li>
                            <li className="flex items-center gap-3 text-sm opacity-75">
                                <Phone className="h-4 w-4 shrink-0" />
                                <span>{SITE_CONTACT.hotline}</span>
                            </li>
                            <li className="flex items-center gap-3 text-sm opacity-75">
                                <Mail className="h-4 w-4 shrink-0" />
                                <span className="break-all">
                                    {SITE_CONTACT.email}
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>

                <Separator className="my-8 bg-primary-foreground/10" />

                <div className="flex flex-col items-start justify-between gap-3 text-sm leading-6 opacity-60 sm:flex-row sm:items-center">
                    <p>© 2026 {SITE_NAME}. Tất cả quyền được bảo lưu.</p>
                    <p>Đồ án tốt nghiệp - Mai Trọng Quang</p>
                </div>
            </div>
        </footer>
    );
}
