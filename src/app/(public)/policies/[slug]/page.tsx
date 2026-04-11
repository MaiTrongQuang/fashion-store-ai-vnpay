import { notFound } from "next/navigation";
import { POLICIES } from "@/lib/policies-data";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "lucide-react";
import type { Metadata } from "next";

type Props = {
    params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
    return POLICIES.map((policy) => ({
        slug: policy.id,
    }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const policy = POLICIES.find((p) => p.id === slug);
    
    if (!policy) {
        return {
            title: "Không tìm thấy chính sách",
        };
    }

    return {
        title: policy.title,
        description: policy.description,
    };
}

export default async function PolicyPage({ params }: Props) {
    const { slug } = await params;
    const policy = POLICIES.find((p) => p.id === slug);

    if (!policy) {
        notFound();
    }

    return (
        <article className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-6 md:mb-8">
                <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                    {policy.title}
                </h2>
                <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 shrink-0" />
                    <span>Cập nhật lần cuối: {policy.updatedAt}</span>
                </div>
            </div>

            <Card className="overflow-hidden border-border/60 shadow-sm">
                <CardContent className="p-6 md:p-8">
                    <div className="space-y-10">
                        {policy.sections.map((section, index) => (
                            <div key={index} className="scroll-mt-24">
                                <h3 className="mb-4 text-lg font-bold tracking-tight text-foreground md:text-xl">
                                    {section.title}
                                </h3>
                                <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
                                    {section.content.split('\n').map((paragraph, pIndex) => (
                                        <p key={pIndex}>{paragraph}</p>
                                    ))}
                                </div>
                                {index < policy.sections.length - 1 && (
                                    <Separator className="mt-10 bg-border/50" />
                                )}
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </article>
    );
}
