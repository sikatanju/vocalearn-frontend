import apiClient from './apiClient';

export interface SavedItemContent {
    text?: string;
    translation?: string;
    transcription?: string;
    audio_url?: string;
    reference_text?: string;
    accuracy_score?: number;
    fluency_score?: number;
    prosody_score?: number;
    completeness_score?: number;
}

export interface SavedItemCollection {
    id: string;
    name: string;
}

export interface SavedItem {
    id: string;
    type: 'translation' | 'speech_to_text' | 'pronunciation';
    content: SavedItemContent;
    source_language: string | null;
    target_language: string | null;
    created_at: string;
    audio_url?: string;
    collections: SavedItemCollection[];
}

export interface SavedItemsResponse {
    count: number;
    items: SavedItem[];
}

export interface GetSavedItemsParams {
    type?: 'translation' | 'speech_to_text' | 'pronunciation';
    search?: string;
}

/**
 * Fetch saved items for the authenticated user
 * @param params - Optional filtering parameters (type, search)
 * @returns Promise with saved items data
 */
export const getSavedItems = async (
    params?: GetSavedItemsParams
): Promise<SavedItemsResponse> => {
    const queryParams = new URLSearchParams();

    if (params?.type) {
        queryParams.append('type', params.type);
    }

    if (params?.search) {
        queryParams.append('search', params.search);
    }

    const url = `saved-items/${
        queryParams.toString() ? `?${queryParams.toString()}` : ''
    }`;

    const response = await apiClient.get(url);
    return response.data;
};

/**
 * Fetch only translation items
 * @param search - Optional search query
 * @returns Promise with translation items
 */
export const getSavedTranslations = async (
    search?: string
): Promise<SavedItemsResponse> => {
    return getSavedItems({ type: 'translation', search });
};

/**
 * Fetch only speech-to-text items
 * @param search - Optional search query
 * @returns Promise with speech-to-text items
 */
export const getSavedSpeechToText = async (
    search?: string
): Promise<SavedItemsResponse> => {
    return getSavedItems({ type: 'speech_to_text', search });
};

/**
 * Fetch only pronunciation assessment items
 * @param search - Optional search query
 * @returns Promise with pronunciation items
 */
export const getSavedPronunciations = async (
    search?: string
): Promise<SavedItemsResponse> => {
    return getSavedItems({ type: 'pronunciation', search });
};
