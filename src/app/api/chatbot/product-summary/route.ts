import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/** Public read: active product name by slug (for chat widget welcome line). */
export async function GET(request: Request) {
    const slug = new URL(request.url).searchParams.get("slug")?.trim();
    if (!slug) {
        return NextResponse.json({ error: "slug required" }, { status: 400 });
    }

    const supabase = await createClient();
    const { data, error } = await supabase
        .from("products")
        .select("name, slug")
        .eq("slug", slug)
        .eq("is_active", true)
        .maybeSingle();

    if (error || !data) {
        return NextResponse.json({ error: "not found" }, { status: 404 });
    }

    return NextResponse.json({ name: data.name, slug: data.slug });
}
