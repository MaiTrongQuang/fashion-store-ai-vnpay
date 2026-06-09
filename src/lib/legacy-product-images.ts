import type { ProductImage } from "@/lib/types";

type ProductImageLike = Partial<ProductImage> & {
    url: string;
};

type ProductImageSource = {
    id?: string;
    slug: string;
    name: string;
    images?: ProductImageLike[] | null;
};

const LEGACY_IMAGES_BY_SLUG: Record<string, string[]> = {
    "ao-so-mi-hawaii-hoa-tiet": ["somi_hawaii_1_1776280265034.png"],
    "vay-midi-a-line-dang-xoe": ["vay_midi_1_1776280638175.png"],
    "dam-om-body-du-tiec-nu": ["dam_bodycon_1_1776280196837.png"],
    "vay-xep-ly-tennis-sporty": ["vay_tennis_1_1776280180488.png"],
    "ao-so-mi-co-vest-nu": ["somi_vest_1_1776280668512.png"],
    "ao-so-mi-linen-tay-ngan": ["somi_linen_1_1776280249250.png"],
    "ao-thun-graphic-art-print": ["ao_graphic_1_1776280654287.png"],
    "ao-thun-henley-co-tru": ["ao_henley_1_1776280234382.png"],
    "ao-thun-tie-dye-unisex": ["ao_thun_tiedye_1_1776280219452.png"],
    "dam-maxi-hoa-boho-nu": ["dam_maxi_1_1776280165794.png"],
    "quan-jean-boyfriend-relaxed-nu": [
        "jean_boyfriend_1_1776280586034.png",
    ],
    "quan-jean-skinny-rach-goi-wash": [
        "jean_skinny_rach_1_1776280681846.png",
    ],
    "quan-jean-ong-loe-vintage-nu": ["jean_ong_loe_1_1776280080969.png"],
    "vong-tay-charm-bac-925": ["vong_tay_1_1776280152291.png"],
    "khan-choang-silk-hoa-nhi": ["khan_silk_1_1776280617276.png"],
    "kinh-mat-thoi-trang-cat-eye": ["kinh_mat_1_1776280138207.png"],
    "mu-bucket-theu-hoa-daisy": ["mu_bucket_1_1776280112798.png"],
    "quan-au-nam-business-premium": ["quan_au_1_1776280696783.png"],
    "quan-tay-cap-cao-ong-suong-nu": [
        "quan_tay_cap_cao_1_1776280719462.png",
    ],
    "quan-tay-nu-ong-rong-cap-cao": [
        "quan_tay_nu_1_1776280601561.png",
    ],
    "quan-tay-ong-dung-slim-classic": [
        "quan_tay_slim_1_1776280095904.png",
    ],
    "quan-jean-baggy-nam-streetwear": ["jean_baggy_1_1776280570133.png"],
    "sneaker-platform-nu-chunky": [
        "sneaker_platform_1_1776280301512.png",
    ],
    "ao-khoac-gio-nhe-chong-nuoc": [
        "ao_khoac_gio_1_1776280550212.png",
    ],
    "ao-khoac-hoodie-zip-unisex": ["hoodie_zip_1_1776279993826.png"],
    "ao-khoac-denim-vintage-wash": [
        "denim_jacket_1_1776280009916.png",
    ],
    "ao-khoac-bomber-theu-hoa": ["bomber_theu_1_1776280278883.png"],
    "ao-khoac-blazer-oversize-nu": [
        "blazer_oversize_1_1776279912185.png",
    ],
    "sneaker-high-top-streetwear": [
        "sneaker_hightop_1_1776280317333.png",
    ],
    "sneaker-retro-old-school": ["sneaker_retro_1_1776280331323.png"],
    "sneaker-running-sieu-nhe": [
        "sneaker_running_1_1776279897460.png",
    ],
    "sneaker-canvas-co-thap": ["sneaker_canvas_1_1776279883665.png"],
    "boots-chelsea-da-bo-genuine": ["boots_chelsea_1_1776279753151.png"],
    "giay-bup-be-nu-mui-tron": ["giay_bup_be_1_1776280380976.png"],
    "sandal-de-xuong-nu": ["sandal_xuong_1_1776280360642.png"],
    "giay-cao-got-cong-so-5cm": ["giay_cao_got_1_1776279867237.png"],
    "dep-quai-ngang-the-thao-slide": ["dep_slide_1_1776280346545.png"],
    "giay-luoi-nam-da-bo-premium": ["giay_luoi_1_1776279854223.png"],
    "boots-cowboy-western-nu": ["boots_cowboy_1_1776280396431.png"],
    "boots-martin-classic-8-eye": ["boots_martin_1_1776279784487.png"],
    "boots-cao-got-mui-nhon": ["boots_cao_got_1_1776280411747.png"],
    "boots-combat-co-cao-lacing": ["boots_combat_1_1776279768309.png"],
    "tui-tote-canvas-unisex": ["tui_tote_1_1776279628056.png"],
    "tui-deo-vai-vintage-corduroy": ["tui_vintage_1_1776280440553.png"],
    "tui-bucket-da-thoi-trang": ["tui_bucket_1_1776280425981.png"],
    "tui-xach-tay-cong-so-nu": ["tui_xach_tay_1_1776279658864.png"],
    "tui-deo-cheo-mini-da-pu": ["tui_deo_cheo_1_1776279641463.png"],
    "balo-thoi-trang-urban": ["balo_urban_1_1776279724134.png"],
    "tui-clutch-da-hoi-sequin": ["tui_clutch_1_1776279739503.png"],
    "quan-dui-mac-nha-cotton": ["short_nh_1_1776280525415.png"],
    "quan-short-kaki-nam": ["short_kaki_1_1776279529452.png"],
    "quan-short-jean-nu": ["short_jean_1_1776279545787.png"],
    "quan-short-the-thao-dri-fit": [
        "short_thethao_1_1776279598682.png",
    ],
    "quan-short-linen-premium": ["short_linen_1_1776280494127.png"],
    "quan-short-cargo-tui-hop": ["short_cargo_1_1776279614458.png"],
    "quan-short-di-bien-tropical": ["short_beach_1_1776280511470.png"],
    "quan-ong-rong-linen": [
        "quan_linen_1_1776279409237.png",
        "quan_linen_2_1776280782774.png",
    ],
    "quan-kaki-slim-fit": ["quan_kaki_1_1776280479478.png"],
    "quan-baggy-dang-suong": ["quan_baggy_1_1776280464279.png"],
    "quan-cargo-tui-hop": ["quan_cargo_1_1776279510976.png"],
    "quan-legging-fitness-nu": ["quan_legging_1_1776279496821.png"],
    "quan-culottes-nu": ["quan_culottes_1_1776279477235.png"],
    "quan-jogger-the-thao": ["quan_jogger_1_1776279424296.png"],
    "ao-polo-pique-premium": [
        "polo_classic_1_1776279124335.png",
        "polo_classic_2_1776279293350.png",
        "polo_classic_3_1776280736371.png",
    ],
    "ao-tank-top-cotton-premium": [
        "ao_tanktop_1_1776279231175.png",
        "ao_tanktop_2_1776280767238.png",
    ],
    "ao-co-tron-oversized-unisex": [
        "ao_oversized_1_1776279214498.png",
        "ao_oversized_2_1776279395866.png",
    ],
    "ao-kieu-nu-tay-loe": [
        "ao_tay_loe_1_1776279195933.png",
        "ao_tay_loe_2_1776280750994.png",
    ],
    "ao-hai-day-lua-satin": [
        "ao_hai_day_1_1776279179156.png",
        "ao_hai_day_2_1776279380727.png",
    ],
    "ao-croptop-the-thao-nu": [
        "croptop_thethao_1_1776279156941.png",
        "croptop_thethao_2_1776279323927.png",
    ],
    "ao-polo-soc-ngang": [
        "polo_soc_1_1776279139367.png",
        "polo_soc_2_1776279310282.png",
    ],
};

function buildLegacyImages(
    product: ProductImageSource,
    files: string[],
): ProductImage[] {
    return files.map((file, index) => ({
        id: `${product.id ?? product.slug}-legacy-${index}`,
        product_id: product.id ?? product.slug,
        url: `/products/${file}`,
        alt: product.name,
        is_primary: index === 0,
        sort_order: index,
        created_at: "",
    }));
}

export function getProductDisplayImages(
    product: ProductImageSource,
): ProductImage[] {
    const legacyFiles = LEGACY_IMAGES_BY_SLUG[product.slug];
    if (legacyFiles) {
        return buildLegacyImages(product, legacyFiles);
    }

    return (product.images ?? []).map((image, index) => ({
        id: image.id ?? `${product.id ?? product.slug}-image-${index}`,
        product_id: image.product_id ?? product.id ?? product.slug,
        url: image.url,
        alt: image.alt ?? product.name,
        is_primary: image.is_primary ?? index === 0,
        sort_order: image.sort_order ?? index,
        created_at: image.created_at ?? "",
    }));
}
