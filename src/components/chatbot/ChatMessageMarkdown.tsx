"use client";

import Image from "next/image";
import Link from "next/link";
import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ShoppingBag, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ChatbotProductCard } from "@/lib/chatbot/build-context";

// ---------------------------------------------------------------------------
// Inline Product Card (rendered inside chat bubble)
// ---------------------------------------------------------------------------

function ChatProductCard({ card }: { card: ChatbotProductCard }) {
    const hasDiscount = card.salePrice != null && card.salePrice < card.basePrice;
    const displayPrice = hasDiscount ? card.salePrice! : card.basePrice;

    return (
        <Link
            href={card.url}
            className="group/card my-2 flex gap-2.5 rounded-xl border border-border/60 bg-muted/30 p-2 no-underline transition-colors hover:border-primary/30 hover:bg-muted/50"
        >
            {/* Product image */}
            <div className="relative size-[72px] shrink-0 overflow-hidden rounded-lg bg-muted">
                {card.imageUrl ? (
                    <Image
                        src={card.imageUrl}
                        alt={card.imageAlt || card.name}
                        fill
                        sizes="72px"
                        className="object-cover transition-transform duration-200 group-hover/card:scale-105"
                    />
                ) : (
                    <div className="flex size-full items-center justify-center text-muted-foreground/40">
                        <ShoppingBag className="size-6" />
                    </div>
                )}
                {/* Overlay button on image */}
                <span className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-1 bg-primary/85 py-1 text-[10px] font-semibold uppercase tracking-wide text-primary-foreground opacity-0 backdrop-blur-sm transition-opacity group-hover/card:opacity-100">
                    <Eye className="size-3" />
                    Xem
                </span>
            </div>

            {/* Info */}
            <div className="flex min-w-0 flex-1 flex-col justify-center gap-0.5">
                <span className="line-clamp-2 text-xs font-medium leading-snug text-foreground">
                    {card.name}
                </span>
                <div className="flex items-baseline gap-1.5">
                    <span className="text-xs font-bold text-primary">
                        {displayPrice.toLocaleString("vi-VN")}đ
                    </span>
                    {hasDiscount && (
                        <span className="text-[10px] text-muted-foreground line-through">
                            {card.basePrice.toLocaleString("vi-VN")}đ
                        </span>
                    )}
                </div>
                <span className="mt-0.5 inline-flex w-fit items-center gap-1 rounded-md bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                    <ShoppingBag className="size-2.5" />
                    Mua ngay
                </span>
            </div>
        </Link>
    );
}

// ---------------------------------------------------------------------------
// Markdown Components
// ---------------------------------------------------------------------------

function buildMarkdownComponents(
    cardMap: Map<string, ChatbotProductCard>,
): Components {
    return {
        a: ({ href, children }) => {
            if (!href) return <span>{children}</span>;

            // Check if this is a product link with a card
            const match = href.match(/^\/products\/([a-z0-9]+(?:-[a-z0-9]+)*)$/i);
            if (match) {
                const card = cardMap.get(match[1]);
                if (card) {
                    return <ChatProductCard card={card} />;
                }
            }

            const internal = href.startsWith("/") || href.startsWith("#");
            if (internal) {
                return (
                    <Link
                        href={href}
                        className="font-medium text-primary underline decoration-primary/40 underline-offset-2 transition-colors hover:text-primary/90"
                    >
                        {children}
                    </Link>
                );
            }
            return (
                <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-primary underline decoration-primary/40 underline-offset-2"
                >
                    {children}
                </a>
            );
        },
        p: ({ children }) => (
            <p className="mb-2 text-[0.8125rem] leading-relaxed last:mb-0">{children}</p>
        ),
        ul: ({ children }) => (
            <ul className="mb-2 ml-0.5 list-disc space-y-1 pl-4 text-[0.8125rem] leading-relaxed">
                {children}
            </ul>
        ),
        ol: ({ children }) => (
            <ol className="mb-2 ml-0.5 list-decimal space-y-1 pl-4 text-[0.8125rem] leading-relaxed">
                {children}
            </ol>
        ),
        li: ({ children }) => <li className="leading-relaxed">{children}</li>,
        strong: ({ children }) => (
            <strong className="font-semibold text-foreground">{children}</strong>
        ),
        em: ({ children }) => <em className="italic">{children}</em>,
        h1: ({ children }) => (
            <h3 className="mb-1.5 mt-2 text-[0.8125rem] font-semibold first:mt-0">
                {children}
            </h3>
        ),
        h2: ({ children }) => (
            <h3 className="mb-1.5 mt-2 text-[0.8125rem] font-semibold first:mt-0">
                {children}
            </h3>
        ),
        h3: ({ children }) => (
            <h4 className="mb-1.5 mt-1.5 text-[0.8125rem] font-semibold first:mt-0">
                {children}
            </h4>
        ),
        h4: ({ children }) => (
            <h4 className="mb-1 mt-1 text-[0.8125rem] font-semibold first:mt-0">
                {children}
            </h4>
        ),
        blockquote: ({ children }) => (
            <blockquote className="my-2 border-l-2 border-primary/35 pl-3 text-muted-foreground italic">
                {children}
            </blockquote>
        ),
        hr: () => <hr className="my-3 border-border/60" />,
        code: ({ className, children, ...props }) => {
            const isInline = !className;
            if (isInline) {
                return (
                    <code
                        className="rounded bg-muted px-1 py-0.5 font-mono text-[0.8em] text-foreground"
                        {...props}
                    >
                        {children}
                    </code>
                );
            }
            return (
                <code
                    className={cn(
                        "block whitespace-pre-wrap break-all font-mono text-xs leading-relaxed text-foreground",
                        className,
                    )}
                    {...props}
                >
                    {children}
                </code>
            );
        },
        pre: ({ children }) => (
            <pre className="mb-2 max-w-full overflow-x-auto rounded-lg border border-border/50 bg-muted/60 p-2.5">
                {children}
            </pre>
        ),
        table: ({ children }) => (
            <div className="mb-2 max-w-full overflow-x-auto rounded-md border border-border/50">
                <table className="w-full min-w-[200px] border-collapse text-left text-[0.75rem]">
                    {children}
                </table>
            </div>
        ),
        thead: ({ children }) => (
            <thead className="bg-muted/50">{children}</thead>
        ),
        tbody: ({ children }) => <tbody>{children}</tbody>,
        tr: ({ children }) => (
            <tr className="border-b border-border/40 last:border-0">{children}</tr>
        ),
        th: ({ children }) => (
            <th className="px-2 py-1.5 font-semibold">{children}</th>
        ),
        td: ({ children }) => (
            <td className="px-2 py-1.5 align-top text-muted-foreground">{children}</td>
        ),
    };
}

// ---------------------------------------------------------------------------
// Public component
// ---------------------------------------------------------------------------

type ChatMessageMarkdownProps = {
    content: string;
    className?: string;
    productCards?: ChatbotProductCard[];
};

/** Render Markdown an toàn cho tin nhắn assistant (GFM: list, link, bảng, …). */
export function ChatMessageMarkdown({
    content,
    className,
    productCards,
}: ChatMessageMarkdownProps) {
    // Build a slug → card map for O(1) lookup inside the link renderer
    const cardMap = new Map<string, ChatbotProductCard>();
    if (productCards?.length) {
        for (const card of productCards) {
            cardMap.set(card.slug, card);
        }
    }

    const components = buildMarkdownComponents(cardMap);

    return (
        <div
            className={cn(
                "min-w-0 wrap-break-word text-[0.8125rem] leading-relaxed",
                className,
            )}
        >
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={components}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}
