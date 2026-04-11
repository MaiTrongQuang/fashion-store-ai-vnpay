import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/**
 * POST /api/admin/seed
 * Seeds admin accounts for test & production.
 * Requires: Authorization: Bearer <SUPABASE_SERVICE_ROLE_KEY>
 */
export async function POST(request: Request) {
    const authHeader = request.headers.get("Authorization");
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!authHeader || !serviceKey || authHeader !== `Bearer ${serviceKey}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const admin = createClient(supabaseUrl, serviceKey, {
        auth: { autoRefreshToken: false, persistSession: false },
    });

    const results: string[] = [];

    // 1. Promote chayphong33@gmail.com → admin
    const { data: promoted } = await admin
        .from("profiles")
        .update({ role: "admin" })
        .eq("email", "chayphong33@gmail.com")
        .select("id, email, role");

    if (promoted?.length) {
        results.push(`Promoted ${promoted[0].email} → admin`);
    }

    // 2. Create test admin account if not exists
    const testEmail = "admin@Nanafashion.com";
    const testPassword = "Admin@123456";

    const { data: existing } = await admin
        .from("profiles")
        .select("id")
        .eq("email", testEmail)
        .maybeSingle();

    if (!existing) {
        const { data: newUser, error: createError } =
            await admin.auth.admin.createUser({
                email: testEmail,
                password: testPassword,
                email_confirm: true,
                user_metadata: { full_name: "Admin Nana" },
            });

        if (createError) {
            results.push(`Failed to create ${testEmail}: ${createError.message}`);
        } else if (newUser.user) {
            // Upsert profile with admin role
            await admin.from("profiles").upsert({
                id: newUser.user.id,
                email: testEmail,
                full_name: "Admin Nana",
                role: "admin",
            });
            results.push(`Created admin ${testEmail} (password: ${testPassword})`);
        }
    } else {
        // Ensure existing user has admin role
        await admin
            .from("profiles")
            .update({ role: "admin" })
            .eq("email", testEmail);
        results.push(`${testEmail} already exists — ensured admin role`);
    }

    return NextResponse.json({ success: true, results });
}
