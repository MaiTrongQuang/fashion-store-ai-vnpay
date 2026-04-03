"use client";

import Link from "next/link";
import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

const markdownComponents: Components = {
    a: ({ href, children }) => {
        if (!href) return <span>{children}</span>;
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

type ChatMessageMarkdownProps = {
    content: string;
    className?: string;
};

/** Render Markdown an toàn cho tin nhắn assistant (GFM: list, link, bảng, …). */
export function ChatMessageMarkdown({
    content,
    className,
}: ChatMessageMarkdownProps) {
    return (
        <div
            className={cn(
                "min-w-0 wrap-break-word text-[0.8125rem] leading-relaxed",
                className,
            )}
        >
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={markdownComponents}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}
