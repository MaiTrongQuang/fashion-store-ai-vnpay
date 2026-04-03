import type { GoongCompound } from "@/lib/goong-types";

export interface ParsedAdminAddress {
    ward: string;
    district: string;
    province: string;
}

const WARD_PREFIX =
    /^(Phường|Xã|Thị trấn)\s+/i;
const DISTRICT_PREFIX =
    /^(Quận|Huyện|Thị xã)\s+/i;
const PROVINCE_PREFIX =
    /^(Tỉnh|Thành phố|TP\.?)\s+/i;

/**
 * Parse Goong Place Detail `formatted_address` like:
 * "Phường Trung Hòa, Quận Cầu Giấy, Thành phố Hà Nội"
 */
export function parseFormattedAddressVn(
    formatted: string | undefined | null,
): Partial<ParsedAdminAddress> {
    if (!formatted?.trim()) return {};
    const parts = formatted
        .split(",")
        .map((p) => p.trim())
        .filter(Boolean);
    const out: Partial<ParsedAdminAddress> = {};

    for (const p of parts) {
        if (WARD_PREFIX.test(p) && !out.ward) {
            out.ward = p.replace(WARD_PREFIX, "").trim() || p;
            continue;
        }
        if (DISTRICT_PREFIX.test(p) && !out.district) {
            out.district = p.replace(DISTRICT_PREFIX, "").trim() || p;
            continue;
        }
        if (PROVINCE_PREFIX.test(p) && !out.province) {
            out.province = p.replace(PROVINCE_PREFIX, "").trim() || p;
            continue;
        }
    }

    // Some results only list ward + province (no explicit district in string)
    if (!out.province && parts.length >= 1) {
        const last = parts[parts.length - 1];
        if (last && !out.ward && !WARD_PREFIX.test(last)) {
            out.province = last;
        }
    }

    return out;
}

/**
 * Split Goong `secondary_text` e.g. "Trung Hòa, Cầu Giấy, Hà Nội" → ward, district, province.
 */
export function parseSecondaryText(
    secondary: string | undefined | null,
): Partial<ParsedAdminAddress> {
    if (!secondary?.trim()) return {};
    const parts = secondary
        .split(",")
        .map((p) => p.trim())
        .filter(Boolean);
    if (parts.length === 3) {
        return {
            ward: parts[0],
            district: parts[1],
            province: parts[2],
        };
    }
    if (parts.length === 2) {
        return {
            ward: parts[0],
            province: parts[1],
        };
    }
    return {};
}

/**
 * Merge place detail + autocomplete compound + secondary fallback into full admin fields.
 */
export function resolveAddressFields(input: {
    formattedAddress?: string | null;
    compound?: GoongCompound | null;
    secondaryText?: string | null;
}): ParsedAdminAddress {
    const fromFormatted = parseFormattedAddressVn(input.formattedAddress);

    let ward = (fromFormatted.ward ?? "").trim();
    let district = (fromFormatted.district ?? "").trim();
    let province = (fromFormatted.province ?? "").trim();

    if (!ward) ward = input.compound?.commune?.trim() ?? "";
    if (!district) district = input.compound?.district?.trim() ?? "";
    if (!province) province = input.compound?.province?.trim() ?? "";

    const sec = parseSecondaryText(input.secondaryText);
    if (!ward && sec.ward) ward = sec.ward;
    if (!district && sec.district) district = sec.district;
    if (!province && sec.province) province = sec.province;

    // Địa phương chỉ còn 2 cấp trên chuỗi (xã/thị trấn + tỉnh): lặp cấp trung gian để thỏa form 3 ô
    if (!district && ward && province) {
        district = ward;
    }
    if (!district && province) {
        district = province;
    }

    return {
        ward: ward.trim(),
        district: district.trim(),
        province: province.trim(),
    };
}
