import { NextResponse } from "next/server";

const GOONG_AUTOCOMPLETE =
    "https://rsapi.goong.io/v2/place/autocomplete";

export async function GET(request: Request) {
    const key = process.env.GOONG_API_KEY;
    if (!key) {
        return NextResponse.json(
            { error: "GOONG_API_KEY is not configured" },
            { status: 503 },
        );
    }

    const { searchParams } = new URL(request.url);
    const input = searchParams.get("input")?.trim();
    if (!input) {
        return NextResponse.json(
            { error: "input is required" },
            { status: 400 },
        );
    }

    const params = new URLSearchParams({
        input,
        api_key: key,
        more_compound: "true",
        limit: searchParams.get("limit") ?? "8",
    });

    const location = searchParams.get("location");
    if (location) params.set("location", location);

    const sessiontoken = searchParams.get("sessiontoken");
    if (sessiontoken) params.set("sessiontoken", sessiontoken);

    const radius = searchParams.get("radius");
    if (radius) params.set("radius", radius);

    try {
        const res = await fetch(`${GOONG_AUTOCOMPLETE}?${params.toString()}`, {
            next: { revalidate: 0 },
        });
        const data = (await res.json()) as unknown;
        if (!res.ok) {
            return NextResponse.json(
                { error: "Goong autocomplete failed", detail: data },
                { status: res.status },
            );
        }
        return NextResponse.json(data);
    } catch (e) {
        console.error("[goong/autocomplete]", e);
        return NextResponse.json(
            { error: "Upstream request failed" },
            { status: 502 },
        );
    }
}
