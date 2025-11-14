import { useState, useEffect } from 'react';
import apiClient from '@/services/apiClient';

// Hook for managing audio cache across components
export const useAudioCache = () => {
    const [audioBlobCache, setAudioBlobCache] = useState<Map<string, string>>(
        new Map()
    );
    const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
    const [audioBlob, setAudioBlob] = useState<string | null>(null);

    const handlePlayAudio = async (
        id: string,
        onError?: (message: string) => void
    ) => {
        try {
            // If already playing this audio, pause it
            if (playingAudioId === id) {
                setPlayingAudioId(null);
                setAudioBlob(null);
                return;
            }

            // Check if audio is already in cache
            if (audioBlobCache.has(id)) {
                const cachedUrl = audioBlobCache.get(id)!;
                setAudioBlob(cachedUrl);
                setPlayingAudioId(id);
                return;
            }

            // Fetch the audio file from backend if not in cache
            const response = await apiClient.get(`saved-items/${id}/audio/`, {
                responseType: 'blob',
            });

            // Create blob URL for audio playback
            const blob = new Blob([response.data], { type: 'audio/wav' });
            const url = window.URL.createObjectURL(blob);

            // Add to cache
            setAudioBlobCache((prev) => new Map(prev).set(id, url));

            setAudioBlob(url);
            setPlayingAudioId(id);
        } catch (err) {
            console.error('Failed to load audio:', err);
            if (onError) {
                onError('Failed to load audio file. Please try again.');
            }
        }
    };

    const handleCloseAudioPlayer = () => {
        setAudioBlob(null);
        setPlayingAudioId(null);
    };

    // Cleanup: Revoke all blob URLs when component unmounts
    useEffect(() => {
        return () => {
            audioBlobCache.forEach((url) => {
                window.URL.revokeObjectURL(url);
            });
        };
    }, [audioBlobCache]);

    return {
        playingAudioId,
        audioBlob,
        handlePlayAudio,
        handleCloseAudioPlayer,
    };
};
