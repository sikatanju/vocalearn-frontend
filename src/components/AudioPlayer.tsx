import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Play, Pause, X, Download } from 'lucide-react';
import apiClient from '@/services/apiClient';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface AudioPlayerProps {
    itemId: string;
    displayText?: string;
    onError?: (message: string) => void;
}

interface AudioPlayerWithCacheProps {
    itemId: string;
    displayText?: string;
    isPlaying: boolean;
    onPlayToggle: () => void;
    onError?: (message: string) => void;
}

// Standalone audio player button with internal state
export const AudioPlayerButton = ({
    itemId,
    displayText,
    onError,
}: AudioPlayerProps) => {
    const [isPlaying, setIsPlaying] = useState(false);

    const handleToggle = () => {
        setIsPlaying(!isPlaying);
    };

    return (
        <AudioPlayerWithCache
            itemId={itemId}
            displayText={displayText}
            isPlaying={isPlaying}
            onPlayToggle={handleToggle}
            onError={onError}
        />
    );
};

// Audio player button that uses external state (for cache management)
export const AudioPlayerWithCache = ({
    isPlaying,
    onPlayToggle,
}: AudioPlayerWithCacheProps) => {
    return (
        <Button
            variant={isPlaying ? 'default' : 'outline'}
            size="sm"
            className="gap-2"
            onClick={onPlayToggle}
        >
            {isPlaying ? (
                <Pause className="w-4 h-4" />
            ) : (
                <Play className="w-4 h-4" />
            )}
            <span className="hidden sm:inline">
                {isPlaying ? 'Stop' : 'Play'}
            </span>
        </Button>
    );
};

// Download button component
export const AudioDownloadButton = ({ itemId, onError }: AudioPlayerProps) => {
    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownload = async () => {
        try {
            setIsDownloading(true);
            const response = await apiClient.get(
                `saved-items/${itemId}/audio/`,
                {
                    responseType: 'blob',
                }
            );

            const contentDisposition = response.headers['content-disposition'];
            let filename = `audio-${itemId}.wav`;

            if (contentDisposition) {
                const filenameMatch =
                    contentDisposition.match(/filename="(.+)"/);
                if (filenameMatch?.[1]) {
                    filename = filenameMatch[1];
                }
            }

            const blob = new Blob([response.data], { type: 'audio/wav' });
            const url = window.URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();

            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Failed to download audio:', err);
            if (onError) {
                onError('Failed to download audio file. Please try again.');
            }
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
                    disabled={isDownloading}
                >
                    <Download className="w-4 h-4" />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Download Audio File</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to download the associated audio
                        file?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDownload}
                        className="bg-accent text-accent-foreground hover:bg-accent/80"
                    >
                        Download
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

// Floating audio player component
interface FloatingAudioPlayerProps {
    audioBlob: string;
    displayText?: string;
    onClose: () => void;
}

export const FloatingAudioPlayer = ({
    audioBlob,
    displayText,
    onClose,
}: FloatingAudioPlayerProps) => {
    return (
        <Card className="mt-6 border-2 border-primary/50">
            <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Play className="w-5 h-5 text-primary" />
                        Now Playing
                    </h3>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClose}
                        className="h-8 w-8 p-0"
                    >
                        <X className="w-4 h-4" />
                    </Button>
                </div>
                <div className="space-y-2">
                    {displayText && (
                        <p className="text-sm text-muted-foreground">
                            {displayText}
                        </p>
                    )}
                    <audio
                        controls
                        autoPlay
                        src={audioBlob}
                        className="w-full"
                        onEnded={onClose}
                    >
                        Your browser does not support the audio element.
                    </audio>
                </div>
            </CardContent>
        </Card>
    );
};
