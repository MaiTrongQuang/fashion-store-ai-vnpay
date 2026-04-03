/** Subset of Goong Autocomplete V2 prediction (client-safe). */
export interface GoongCompound {
    commune?: string;
    district?: string;
    province?: string;
}

export interface GoongStructuredFormatting {
    main_text: string;
    secondary_text?: string;
}

export interface GoongPrediction {
    description: string;
    place_id: string;
    structured_formatting?: GoongStructuredFormatting;
    compound?: GoongCompound;
}

export interface GoongAutocompleteResponse {
    predictions?: GoongPrediction[];
    status?: string;
}

export interface GoongGeometry {
    location?: { lat: number; lng: number };
}

export interface GoongPlaceResult {
    place_id?: string;
    name?: string;
    formatted_address?: string;
    geometry?: GoongGeometry;
}

export interface GoongPlaceDetailResponse {
    result?: GoongPlaceResult;
    status?: string;
}
