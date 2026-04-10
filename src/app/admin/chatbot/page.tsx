import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { FAQActions } from "./faq-actions";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Quản lý Chatbot FAQ" };

export default async function AdminChatbotPage() {
    const supabase = await createClient();
    const { data: faqs } = await supabase
        .from("chatbot_faqs")
        .select("*")
        .order("sort_order", { ascending: true });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Quản Lý Chatbot FAQ</h1>
                    <p className="text-muted-foreground">{faqs?.length || 0} câu hỏi</p>
                </div>
                <FAQActions />
            </div>

            <Card className="border-0 shadow-sm">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Câu hỏi</TableHead>
                                <TableHead>Câu trả lời</TableHead>
                                <TableHead>Danh mục</TableHead>
                                <TableHead>Thứ tự</TableHead>
                                <TableHead>Trạng thái</TableHead>
                                <TableHead className="w-24">Thao tác</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {faqs?.map((faq: any) => (
                                <TableRow key={faq.id}>
                                    <TableCell className="font-medium text-sm max-w-[250px] truncate">
                                        {faq.question}
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground max-w-[300px] truncate">
                                        {faq.answer}
                                    </TableCell>
                                    <TableCell className="text-sm">
                                        {faq.category ? (
                                            <Badge variant="outline">{faq.category}</Badge>
                                        ) : "—"}
                                    </TableCell>
                                    <TableCell className="text-sm">{faq.sort_order}</TableCell>
                                    <TableCell>
                                        <Badge variant={faq.is_active ? "default" : "secondary"}>
                                            {faq.is_active ? "Active" : "Inactive"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <FAQActions editItem={faq} />
                                    </TableCell>
                                </TableRow>
                            ))}
                            {(!faqs || faqs.length === 0) && (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                        Chưa có FAQ nào
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
