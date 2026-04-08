"use client";

import dynamic from "next/dynamic";

// Lazy load ChatWidget — nó không cần thiết cho initial page render
// và fetch health check khi mount, gây chậm trang
const ChatWidget = dynamic(() => import("@/components/chatbot/ChatWidget"), {
    ssr: false,
});

export default function LazyChatWidget() {
    return <ChatWidget />;
}
