"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { usePathname } from "next/navigation";
import { MessageCircle, X, Send, Bot, User, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
} from "@/components/ui/input-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { ChatMessageMarkdown } from "@/components/chatbot/ChatMessageMarkdown";
import { SITE_NAME } from "@/lib/constants";
import { getSuggestedChatPrompts } from "@/lib/chatbot/suggested-prompts";

interface Message {
    role: "user" | "assistant";
    content: string;
}

const CHAT_PANEL_ID = "luxe-chat-widget-panel";

type ServerHealthStatus = "ok" | "degraded";

function chatThreadKey(pathname: string): string {
    const m = pathname.match(/^\/products\/([^/]+)\/?$/);
    return m ? `pdp:${m[1]}` : "general";
}

function welcomeForThread(isPdp: boolean, productName: string | null): string {
    if (isPdp) {
        if (productName) {
            return `Bạn đang xem sản phẩm "${productName}". Chọn một câu gợi ý bên dưới hoặc nhập tin nhắn.`;
        }
        return "Bạn đang xem trang chi tiết sản phẩm. Chọn một câu gợi ý bên dưới hoặc nhập tin nhắn.";
    }
    return `Xin chào! Mình là trợ lý mua sắm AI của ${SITE_NAME}. Chọn một câu gợi ý bên dưới hoặc nhập tin nhắn.`;
}

export default function ChatWidget() {
    const pathname = usePathname() ?? "";
    const threadKey = useMemo(() => chatThreadKey(pathname), [pathname]);

    const [open, setOpen] = useState(false);
    const [productDisplayName, setProductDisplayName] = useState<string | null>(
        null,
    );
    const [messages, setMessages] = useState<Message[]>(() => [
        {
            role: "assistant",
            content: welcomeForThread(threadKey.startsWith("pdp:"), null),
        },
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [conversationId, setConversationId] = useState<string | null>(null);
    const [clientOnline, setClientOnline] = useState(true);
    const [serverHealth, setServerHealth] = useState<ServerHealthStatus | null>(
        null,
    );
    const [healthReasons, setHealthReasons] = useState<string[]>([]);
    const [healthFetchFailed, setHealthFetchFailed] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);

    const refreshHealth = useCallback(async () => {
        try {
            const res = await fetch("/api/chatbot/health");
            if (!res.ok) throw new Error("health");
            const data = (await res.json()) as {
                status: ServerHealthStatus;
                reasons?: string[];
            };
            setServerHealth(data.status);
            setHealthReasons(data.reasons ?? []);
            setHealthFetchFailed(false);
        } catch {
            setHealthFetchFailed(true);
            setServerHealth("degraded");
            setHealthReasons([
                "Không kiểm tra được máy chủ. Bạn vẫn có thể thử gửi tin nhắn.",
            ]);
        }
    }, []);

    useEffect(() => {
        const sync = () =>
            setClientOnline(
                typeof navigator !== "undefined" ? navigator.onLine : true,
            );
        sync();
        window.addEventListener("online", sync);
        window.addEventListener("offline", sync);
        return () => {
            window.removeEventListener("online", sync);
            window.removeEventListener("offline", sync);
        };
    }, []);

    useEffect(() => {
        void refreshHealth();
    }, [refreshHealth]);

    useEffect(() => {
        if (open) void refreshHealth();
    }, [open, refreshHealth]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, [messages, loading, open]);

    useEffect(() => {
        setConversationId(null);
        setProductDisplayName(null);
        const isPdp = threadKey.startsWith("pdp:");
        setMessages([
            { role: "assistant", content: welcomeForThread(isPdp, null) },
        ]);
    }, [threadKey]);

    useEffect(() => {
        if (!threadKey.startsWith("pdp:")) return;
        const slug = threadKey.slice(4);
        let cancelled = false;
        void (async () => {
            try {
                const res = await fetch(
                    `/api/chatbot/product-summary?slug=${encodeURIComponent(slug)}`,
                );
                if (!res.ok) return;
                const data = (await res.json()) as { name: string };
                if (!cancelled) setProductDisplayName(data.name);
            } catch {
                /* ignore */
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [threadKey]);

    useEffect(() => {
        if (!threadKey.startsWith("pdp:") || !productDisplayName) return;
        setMessages((prev) => {
            if (prev.length !== 1 || prev[0].role !== "assistant") return prev;
            const next = welcomeForThread(true, productDisplayName);
            if (prev[0].content === next) return prev;
            return [{ role: "assistant", content: next }];
        });
    }, [productDisplayName, threadKey]);

    const pageContext = useMemo(
        () =>
            threadKey.startsWith("pdp:")
                ? { type: "product" as const, slug: threadKey.slice(4) }
                : { type: "home" as const },
        [threadKey],
    );

    const suggestionPrompts = useMemo(
        () =>
            getSuggestedChatPrompts({
                scope: threadKey.startsWith("pdp:") ? "product" : "home",
                productName: productDisplayName ?? undefined,
            }),
        [threadKey, productDisplayName],
    );

    const inputDisabled = loading || !clientOnline;

    const sendUserMessage = async (userMessage: string) => {
        const trimmed = userMessage.trim();
        if (!trimmed || loading || !clientOnline) return;

        setMessages((prev) => [...prev, { role: "user", content: trimmed }]);
        setLoading(true);

        try {
            const response = await fetch("/api/chatbot", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: trimmed,
                    conversationId,
                    pageContext,
                }),
            });

            const data = await response.json();
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content:
                        data.reply ||
                        "Xin lỗi, mình chưa hiểu ý bạn.",
                },
            ]);
            if (data.conversationId) {
                setConversationId(data.conversationId);
            }
            void refreshHealth();
        } catch {
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content:
                        "Xin lỗi, hệ thống đang bận. Vui lòng thử lại sau!",
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleSend = async () => {
        if (!input.trim() || loading || !clientOnline) return;
        const userMessage = input.trim();
        setInput("");
        await sendUserMessage(userMessage);
    };
    const badgeMeta = (() => {
        if (!clientOnline) {
            return {
                label: "Ngoại tuyến",
                dot: "bg-red-500",
                tooltip: "Mất kết nối mạng. Kiểm tra Wi‑Fi hoặc dữ liệu di động.",
            };
        }
        if (healthFetchFailed) {
            return {
                label: "Không xác định",
                dot: "bg-amber-500",
                tooltip:
                    healthReasons[0] ??
                    "Không kiểm tra được trạng thái máy chủ.",
            };
        }
        if (serverHealth === "ok") {
            return {
                label: "Trực tuyến",
                dot: "bg-emerald-500",
                tooltip: "AI Gemini sẵn sàng (hoặc cấu hình đầy đủ).",
            };
        }
        return {
            label: "Hạn chế",
            dot: "bg-amber-500",
            tooltip:
                healthReasons.length > 0
                    ? healthReasons.join(" ")
                    : "Chế độ FAQ / trả lời mẫu — có thể chưa cấu hình GEMINI_API_KEY.",
        };
    })();

    return (
        <TooltipProvider delay={200}>
            {/* FAB — shadcn Button + Tooltip */}
            <Tooltip open={open ? false : undefined}>
                <TooltipTrigger
                    render={(triggerProps) => (
                        <Button
                            {...triggerProps}
                            type="button"
                            variant={open ? "secondary" : "default"}
                            size="icon"
                            aria-expanded={open}
                            aria-controls={CHAT_PANEL_ID}
                            aria-label={
                                open
                                    ? "Đóng cửa sổ chat"
                                    : "Mở trợ lý mua sắm AI"
                            }
                            onClick={(e) => {
                                triggerProps.onClick?.(e);
                                setOpen(!open);
                            }}
                            className={cn(
                                triggerProps.className,
                                "fixed bottom-6 right-6 z-50 size-14 min-h-11 min-w-11 rounded-full shadow-lg transition-[transform,box-shadow] duration-200",
                                "focus-visible:ring-3 focus-visible:ring-ring/50",
                                !open &&
                                    "hover:scale-105 hover:shadow-xl active:scale-95",
                                open && "scale-95 shadow-md",
                            )}
                        >
                            {open ? (
                                <X className="size-6" aria-hidden />
                            ) : (
                                <MessageCircle
                                    className="size-6"
                                    aria-hidden
                                />
                            )}
                        </Button>
                    )}
                />
                <TooltipContent side="left" className="max-w-[220px]">
                    Chat với trợ lý LUXE — gợi ý size, phối đồ, khuyến mãi
                </TooltipContent>
            </Tooltip>

            {/* Panel — shadcn Card */}
            {open && (
                <Card
                    id={CHAT_PANEL_ID}
                    role="dialog"
                    aria-label="Trợ lý mua sắm LUXE"
                    aria-modal="false"
                    size="sm"
                    className={cn(
                        "fixed bottom-24 right-6 z-50 flex h-[min(520px,calc(100vh-8rem))] w-[min(380px,calc(100vw-3rem))] flex-col gap-0 overflow-hidden py-0",
                        "rounded-xl shadow-lg ring-1 ring-border/80",
                        "animate-in slide-in-from-bottom-4 fade-in-0 duration-200 motion-reduce:animate-none motion-reduce:duration-0",
                    )}
                >
                    <CardHeader className="shrink-0 space-y-0 border-b bg-muted/40 px-4 py-3 [.border-b]:pb-3">
                        <div className="flex items-start gap-3">
                            <Avatar className="size-10 shrink-0 ring-2 ring-background">
                                <AvatarFallback className="bg-primary/15 text-primary">
                                    <Bot className="size-5" aria-hidden />
                                </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0 flex-1 space-y-0.5">
                                <div className="flex flex-wrap items-center gap-2">
                                    <CardTitle className="text-sm font-semibold tracking-tight">
                                        LUXE AI Assistant
                                    </CardTitle>
                                    <Tooltip>
                                        <TooltipTrigger
                                            render={(p) => (
                                                <Badge
                                                    {...p}
                                                    variant="secondary"
                                                    className="h-5 gap-1 px-2 text-[10px] font-medium uppercase"
                                                >
                                                    <span
                                                        className={cn(
                                                            "size-1.5 rounded-full",
                                                            badgeMeta.dot,
                                                        )}
                                                        aria-hidden
                                                    />
                                                    {badgeMeta.label}
                                                </Badge>
                                            )}
                                        />
                                        <TooltipContent
                                            side="bottom"
                                            className="max-w-[260px] text-xs"
                                        >
                                            {badgeMeta.tooltip}
                                        </TooltipContent>
                                    </Tooltip>
                                </div>
                                <CardDescription className="flex items-center gap-1.5 text-xs">
                                    <Sparkles
                                        className="size-3.5 shrink-0 text-primary/70"
                                        aria-hidden
                                    />
                                    {!clientOnline
                                        ? "Không có mạng — không thể gửi tin nhắn."
                                        : "Tư vấn thời trang 24/7"}
                                </CardDescription>
                            </div>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon-sm"
                                className="shrink-0 text-muted-foreground hover:text-foreground"
                                aria-label="Đóng chat"
                                onClick={() => setOpen(false)}
                            >
                                <X className="size-4" aria-hidden />
                            </Button>
                        </div>
                    </CardHeader>

                    <CardContent className="flex min-h-0 flex-1 flex-col p-0">
                        <ScrollArea className="min-h-0 flex-1">
                            <div
                                className="space-y-4 p-4"
                                role="log"
                                aria-live="polite"
                                aria-relevant="additions"
                            >
                                {messages.map((msg, index) => (
                                    <div
                                        key={index}
                                        className={cn(
                                            "flex gap-2",
                                            msg.role === "user"
                                                ? "justify-end"
                                                : "justify-start",
                                        )}
                                    >
                                        {msg.role === "assistant" && (
                                            <Avatar className="mt-0.5 size-8 shrink-0">
                                                <AvatarFallback className="bg-muted text-muted-foreground">
                                                    <Bot
                                                        className="size-4"
                                                        aria-hidden
                                                    />
                                                </AvatarFallback>
                                            </Avatar>
                                        )}
                                        <div
                                            className={cn(
                                                "max-w-[min(92%,300px)] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-sm",
                                                msg.role === "user"
                                                    ? "rounded-br-md bg-primary text-primary-foreground"
                                                    : "rounded-bl-md border border-border/60 bg-background text-foreground",
                                            )}
                                        >
                                            {msg.role === "assistant" ? (
                                                <ChatMessageMarkdown
                                                    content={msg.content}
                                                />
                                            ) : (
                                                <span className="whitespace-pre-wrap wrap-break-word">
                                                    {msg.content}
                                                </span>
                                            )}
                                        </div>
                                        {msg.role === "user" && (
                                            <Avatar className="mt-0.5 size-8 shrink-0">
                                                <AvatarFallback className="bg-muted text-muted-foreground">
                                                    <User
                                                        className="size-4"
                                                        aria-hidden
                                                    />
                                                </AvatarFallback>
                                            </Avatar>
                                        )}
                                    </div>
                                ))}
                                {loading && (
                                    <div className="flex gap-2">
                                        <Avatar className="mt-0.5 size-8 shrink-0">
                                            <AvatarFallback className="bg-muted text-muted-foreground">
                                                <Bot
                                                    className="size-4"
                                                    aria-hidden
                                                />
                                            </AvatarFallback>
                                        </Avatar>
                                        <div
                                            className="flex items-center gap-1 rounded-2xl rounded-bl-md border border-border/60 bg-muted/50 px-4 py-3"
                                            aria-busy="true"
                                            aria-label="Đang trả lời"
                                        >
                                            <span className="sr-only">
                                                Đang soạn phản hồi
                                            </span>
                                            <span className="flex gap-1">
                                                <span
                                                    className="size-2 rounded-full bg-muted-foreground/50 motion-reduce:animate-none animate-bounce"
                                                    style={{
                                                        animationDelay: "0ms",
                                                    }}
                                                />
                                                <span
                                                    className="size-2 rounded-full bg-muted-foreground/50 motion-reduce:animate-none animate-bounce"
                                                    style={{
                                                        animationDelay: "150ms",
                                                    }}
                                                />
                                                <span
                                                    className="size-2 rounded-full bg-muted-foreground/50 motion-reduce:animate-none animate-bounce"
                                                    style={{
                                                        animationDelay: "300ms",
                                                    }}
                                                />
                                            </span>
                                        </div>
                                    </div>
                                )}
                                <div ref={bottomRef} aria-hidden />
                            </div>
                        </ScrollArea>
                    </CardContent>

                    <Separator />

                    <CardFooter className="shrink-0 flex-col gap-2 border-t bg-muted/30 p-3">
                        <div
                            className="flex w-full flex-wrap gap-2"
                            aria-label="Gợi ý câu hỏi"
                        >
                            {suggestionPrompts.map((label) => (
                                <Button
                                    key={label}
                                    type="button"
                                    variant="secondary"
                                    size="sm"
                                    disabled={inputDisabled}
                                    className="h-auto min-h-8 max-w-full whitespace-normal px-2.5 py-1.5 text-left text-xs leading-snug"
                                    onClick={() => void sendUserMessage(label)}
                                >
                                    {label}
                                </Button>
                            ))}
                        </div>
                        <form
                            className="w-full"
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleSend();
                            }}
                        >
                            <InputGroup className="h-11 rounded-lg bg-background shadow-sm">
                                <InputGroupInput
                                    value={input}
                                    onChange={(e) =>
                                        setInput(e.target.value)
                                    }
                                    placeholder={
                                        clientOnline
                                            ? "Nhập tin nhắn…"
                                            : "Đang mất mạng…"
                                    }
                                    disabled={inputDisabled}
                                    autoComplete="off"
                                    aria-label="Nội dung tin nhắn"
                                    onKeyDown={(e) => {
                                        if (
                                            e.key === "Enter" &&
                                            !e.shiftKey
                                        ) {
                                            e.preventDefault();
                                            handleSend();
                                        }
                                    }}
                                />
                                <InputGroupAddon align="inline-end">
                                    <InputGroupButton
                                        type="submit"
                                        variant="default"
                                        size="icon-sm"
                                        disabled={
                                            inputDisabled || !input.trim()
                                        }
                                        aria-label="Gửi tin nhắn"
                                    >
                                        <Send className="size-4" />
                                    </InputGroupButton>
                                </InputGroupAddon>
                            </InputGroup>
                        </form>
                    </CardFooter>
                </Card>
            )}
        </TooltipProvider>
    );
}
