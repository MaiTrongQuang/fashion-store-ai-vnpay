import { NextResponse } from "next/server";

const GOONG_PLACE_DETAIL = "https://rsapi.goong.io/v2/place/detail";

export async function GET(request: Request) {
    const key = process.env.GOONG_API_KEY;
    if (!key) {
        return NextResponse.json(
            { error: "GOONG_API_KEY is not configured" },
            { status: 503 },
        );
    }

    const { searchParams } = new URL(request.url);
    const placeId = searchParams.get("place_id")?.trim();
    if (!placeId) {
        return NextResponse.json(
            { error: "place_id is required" },
            { status: 400 },
        );
    }

    const params = new URLSearchParams({
        place_id: placeId,
        api_key: key,
    });

    const sessiontoken = searchParams.get("sessiontoken");
    if (sessiontoken) params.set("sessiontoken", sessiontoken);

    try {
        const res = await fetch(`${GOONG_PLACE_DETAIL}?${params.toString()}`, {
            next: { revalidate: 0 },
        });
        const data = (await res.json()) as unknown;
        if (!res.ok) {
            return NextResponse.json(
                { error: "Goong place detail failed", detail: data },
                { status: res.status },
            );
        }
        return NextResponse.json(data);
    } catch (e) {
        console.error("[goong/place-detail]", e);
        return NextResponse.json(
            { error: "Upstream request failed" },
            { status: 502 },
        );
    }
}
