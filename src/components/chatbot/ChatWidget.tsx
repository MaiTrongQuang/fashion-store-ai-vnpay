"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Message {
    role: "user" | "assistant";
    content: string;
}

export default function ChatWidget() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            role: "assistant",
            content:
                "Xin chào! 👋 Mình là trợ lý mua sắm AI của LUXE Fashion. Bạn cần tư vấn gì về thời trang nhé?",
        },
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [conversationId, setConversationId] = useState<string | null>(null);
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTop =
                scrollAreaRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userMessage = input.trim();
        setInput("");
        setMessages((prev) => [
            ...prev,
            { role: "user", content: userMessage },
        ]);
        setLoading(true);

        try {
            const response = await fetch("/api/chatbot", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: userMessage,
                    conversationId,
                }),
            });

            const data = await response.json();
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: data.reply || "Xin lỗi, mình chưa hiểu ý bạn.",
                },
            ]);
            if (data.conversationId) {
                setConversationId(data.conversationId);
            }
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

    return (
        <>
            {/* FAB Button */}
            <button
                onClick={() => setOpen(!open)}
                className={`fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 ${
                    open
                        ? "bg-muted text-muted-foreground hover:bg-muted/80 scale-90"
                        : "bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-110"
                }`}
            >
                {open ? (
                    <X className="h-6 w-6" />
                ) : (
                    <MessageCircle className="h-6 w-6" />
                )}
            </button>

            {/* Chat Window */}
            {open && (
                <div className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-48px)] h-[520px] bg-background border rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
                    {/* Header */}
                    <div className="bg-primary text-primary-foreground px-4 py-3 flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                            <Bot className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="font-semibold text-sm">
                                LUXE AI Assistant
                            </p>
                            <p className="text-xs opacity-80">
                                Tư vấn thời trang 24/7
                            </p>
                        </div>
                    </div>

                    {/* Messages */}
                    <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
                        <div className="space-y-4">
                            {messages.map((msg, index) => (
                                <div
                                    key={index}
                                    className={`flex gap-2 ${
                                        msg.role === "user"
                                            ? "justify-end"
                                            : "justify-start"
                                    }`}
                                >
                                    {msg.role === "assistant" && (
                                        <Avatar className="h-7 w-7 shrink-0">
                                            <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                                <Bot className="h-3.5 w-3.5" />
                                            </AvatarFallback>
                                        </Avatar>
                                    )}
                                    <div
                                        className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                                            msg.role === "user"
                                                ? "bg-primary text-primary-foreground rounded-br-md"
                                                : "bg-accent rounded-bl-md"
                                        }`}
                                    >
                                        {msg.content}
                                    </div>
                                    {msg.role === "user" && (
                                        <Avatar className="h-7 w-7 shrink-0">
                                            <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                                                <User className="h-3.5 w-3.5" />
                                            </AvatarFallback>
                                        </Avatar>
                                    )}
                                </div>
                            ))}
                            {loading && (
                                <div className="flex gap-2">
                                    <Avatar className="h-7 w-7 shrink-0">
                                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                            <Bot className="h-3.5 w-3.5" />
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="bg-accent px-4 py-3 rounded-2xl rounded-bl-md">
                                        <div className="flex gap-1">
                                            <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" />
                                            <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:0.2s]" />
                                            <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:0.4s]" />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </ScrollArea>

                    {/* Input */}
                    <div className="p-3 border-t">
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleSend();
                            }}
                            className="flex gap-2"
                        >
                            <Input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Nhập tin nhắn..."
                                className="rounded-full bg-accent border-0"
                                disabled={loading}
                            />
                            <Button
                                type="submit"
                                size="icon"
                                className="rounded-full shrink-0"
                                disabled={loading || !input.trim()}
                            >
                                <Send className="h-4 w-4" />
                            </Button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
