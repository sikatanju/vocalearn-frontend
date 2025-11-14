import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getSavedSpeechToText, SavedItem } from '@/services/savedItemsService';
import { speechLanguageCodeToNameMap } from '@/data/speech_to_text';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
    Search,
    ArrowLeft,
    Mic,
    AlertCircle,
    Trash2,
    Copy,
    CheckCircle2,
    Download,
    Play,
    Pause,
    X,
} from 'lucide-react';
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

interface TranscriptionItem {
    id: string;
    audioUrl: string | null;
    transcribedText: string;
    language: string;
    languageCode: string;
    createdAt: string;
}

const AllTranscriptions = () => {
    const { isAuthenticated, isLoading: authLoading } = useAuth();
    const navigate = useNavigate();

    const [transcriptions, setTranscriptions] = useState<TranscriptionItem[]>(
        []
    );
    const [filteredTranscriptions, setFilteredTranscriptions] = useState<
        TranscriptionItem[]
    >([]);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
    const [audioBlob, setAudioBlob] = useState<string | null>(null);
    const [audioBlobCache, setAudioBlobCache] = useState<Map<string, string>>(
        new Map()
    );

    useEffect(() => {
        // Wait for auth to finish loading before checking authentication
        if (authLoading) {
            return;
        }

        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        fetchAllTranscriptions();
    }, [isAuthenticated, authLoading, navigate]);

    // Cleanup: Revoke all blob URLs when component unmounts
    useEffect(() => {
        return () => {
            audioBlobCache.forEach((url) => {
                window.URL.revokeObjectURL(url);
            });
        };
    }, [audioBlobCache]);

    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredTranscriptions(transcriptions);
        } else {
            const query = searchQuery.toLowerCase();
            const filtered = transcriptions.filter(
                (item) =>
                    item.transcribedText.toLowerCase().includes(query) ||
                    item.language.toLowerCase().includes(query)
            );
            setFilteredTranscriptions(filtered);
        }
    }, [searchQuery, transcriptions]);

    const fetchAllTranscriptions = async () => {
        setIsLoading(true);
        setError('');
        try {
            const response = await getSavedSpeechToText();
            const transcriptionItems: TranscriptionItem[] = response.items.map(
                (item: SavedItem) => ({
                    id: item.id,
                    audioUrl: item.audio_url || null,
                    transcribedText: item.content.transcription || '',
                    language:
                        speechLanguageCodeToNameMap.get(
                            item.target_language || ''
                        ) ||
                        item.target_language ||
                        'Unknown',
                    languageCode: item.target_language || '',
                    createdAt: item.created_at,
                })
            );
            setTranscriptions(transcriptionItems);
            setFilteredTranscriptions(transcriptionItems);
        } catch (err) {
            console.error('Failed to fetch transcriptions:', err);
            setError(
                'Failed to load your transcriptions. Please try again later.'
            );
        } finally {
            setIsLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMs = now.getTime() - date.getTime();
        const diffInHours = diffInMs / (1000 * 60 * 60);

        if (diffInHours < 24) {
            return date.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
            });
        } else if (diffInHours < 24 * 7) {
            return date.toLocaleDateString('en-US', {
                weekday: 'short',
                hour: '2-digit',
                minute: '2-digit',
            });
        } else {
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
            });
        }
    };

    const handleCopy = async (text: string, id: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedId(id);
            setTimeout(() => setCopiedId(null), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const handlePlayAudio = async (id: string) => {
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
            setError('Failed to load audio file. Please try again.');
            setTimeout(() => setError(''), 5000);
        }
    };

    const handleCloseAudioPlayer = () => {
        setAudioBlob(null);
        setPlayingAudioId(null);
    };

    const handleDownloadAudio = async (id: string) => {
        try {

            // Fetch the audio file from backend
            const response = await apiClient.get(`saved-items/${id}/audio/`, {
                responseType: 'blob',
            });

            // Get filename from Content-Disposition header or use default
            const contentDisposition = response.headers['content-disposition'];
            let filename = `transcription-${id}.wav`;

            if (contentDisposition) {
                const filenameMatch =
                    contentDisposition.match(/filename="(.+)"/);
                if (filenameMatch && filenameMatch[1]) {
                    filename = filenameMatch[1];
                }
            }

            // Create blob from response data
            const blob = new Blob([response.data], { type: 'audio/wav' });
            const url = window.URL.createObjectURL(blob);

            // Create temporary link and trigger download
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();

            // Cleanup
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Failed to download audio:', err);
            setError('Failed to download audio file. Please try again.');
            setTimeout(() => setError(''), 5000);
        }
    };

    const handleDelete = (id: string) => {
        const prevTranscriptions = transcriptions;
        setTranscriptions((prev) => prev.filter((item) => item.id !== id));
        apiClient
            .delete(`saved-items/${id}/`)
            .then(() => {})
            .catch((e) => {
                console.log(e);
                setTranscriptions(prevTranscriptions);
            });
    };

    // Show loading state while auth is being checked
    if (authLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-muted-foreground">Loading...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                {/* Header Section */}
                <div className="mb-8">
                    <Button
                        variant="ghost"
                        onClick={() => navigate('/speech-to-text')}
                        className="mb-4 group"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                        Back to Speech-to-Text
                    </Button>

                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                            <Mic className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                                My Transcriptions
                            </h1>
                            <p className="text-muted-foreground">
                                View and manage all your saved transcriptions
                            </p>
                        </div>
                    </div>
                </div>

                {/* Search Bar */}
                <Card className="mb-6">
                    <CardContent className="pt-6">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Search transcriptions by text or language..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 h-12 text-base"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Error Alert */}
                {error && (
                    <Alert variant="destructive" className="mb-6">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {/* Main Content */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <span>
                                {isLoading
                                    ? 'Loading...'
                                    : `${
                                          filteredTranscriptions.length
                                      } Transcription${
                                          filteredTranscriptions.length !== 1
                                              ? 's'
                                              : ''
                                      }`}
                            </span>
                            {!isLoading && transcriptions.length > 0 && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={fetchAllTranscriptions}
                                >
                                    Refresh
                                </Button>
                            )}
                        </CardTitle>
                        <CardDescription>
                            {searchQuery && !isLoading && (
                                <span>Showing results for "{searchQuery}"</span>
                            )}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-16">
                                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                                <p className="text-muted-foreground">
                                    Loading your transcriptions...
                                </p>
                            </div>
                        ) : filteredTranscriptions.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 text-center">
                                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
                                    <Mic className="w-10 h-10 text-muted-foreground" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">
                                    {searchQuery
                                        ? 'No transcriptions found'
                                        : 'No transcriptions yet'}
                                </h3>
                                <p className="text-muted-foreground mb-6 max-w-md">
                                    {searchQuery
                                        ? 'Try adjusting your search query'
                                        : 'Start transcribing audio to see your history here'}
                                </p>
                                {!searchQuery && (
                                    <Button
                                        onClick={() =>
                                            navigate('/speech-to-text')
                                        }
                                        className="group"
                                    >
                                        Start Transcribing
                                        <Mic className="w-4 h-4 ml-2" />
                                    </Button>
                                )}
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[15%]">
                                                Audio
                                            </TableHead>
                                            <TableHead className="w-[15%]">
                                                Language
                                            </TableHead>
                                            <TableHead className="w-[50%]">
                                                Transcribed Text
                                            </TableHead>
                                            <TableHead className="w-[10%]">
                                                Date
                                            </TableHead>
                                            <TableHead className="w-[10%] text-right">
                                                Actions
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredTranscriptions.map((item) => (
                                            <TableRow
                                                key={item.id}
                                                className="group hover:bg-muted/50"
                                            >
                                                <TableCell>
                                                    {item.audioUrl ? (
                                                        <div className="flex items-center gap-2">
                                                            <Button
                                                                variant={
                                                                    playingAudioId ===
                                                                    item.id
                                                                        ? 'default'
                                                                        : 'outline'
                                                                }
                                                                size="sm"
                                                                className="gap-2"
                                                                onClick={() =>
                                                                    handlePlayAudio(
                                                                        item.id
                                                                    )
                                                                }
                                                            >
                                                                {playingAudioId ===
                                                                item.id ? (
                                                                    <Pause className="w-4 h-4" />
                                                                ) : (
                                                                    <Play className="w-4 h-4" />
                                                                )}
                                                                <span className="hidden sm:inline">
                                                                    {playingAudioId ===
                                                                    item.id
                                                                        ? 'Stop'
                                                                        : 'Play'}
                                                                </span>
                                                            </Button>
                                                        </div>
                                                    ) : (
                                                        <span className="text-sm text-muted-foreground">
                                                            No audio
                                                        </span>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                                            <Mic className="w-4 h-4 text-primary" />
                                                        </div>
                                                        <span className="text-sm font-medium">
                                                            {item.language}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-start justify-between gap-2">
                                                        <p className="line-clamp-2 flex-1">
                                                            {
                                                                item.transcribedText
                                                            }
                                                        </p>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 h-8 w-8 p-0"
                                                            onClick={() =>
                                                                handleCopy(
                                                                    item.transcribedText,
                                                                    item.id
                                                                )
                                                            }
                                                        >
                                                            {copiedId ===
                                                            item.id ? (
                                                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                                                            ) : (
                                                                <Copy className="w-4 h-4" />
                                                            )}
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-sm text-muted-foreground">
                                                    {formatDate(item.createdAt)}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        {item.audioUrl && (
                                                            <AlertDialog>
                                                                <AlertDialogTrigger
                                                                    asChild
                                                                >
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
                                                                    >
                                                                        <Download className="w-4 h-4" />
                                                                    </Button>
                                                                </AlertDialogTrigger>
                                                                <AlertDialogContent>
                                                                    <AlertDialogHeader>
                                                                        <AlertDialogTitle>
                                                                            Download
                                                                            Audio
                                                                            File
                                                                        </AlertDialogTitle>
                                                                        <AlertDialogDescription>
                                                                            Are
                                                                            you
                                                                            sure
                                                                            you
                                                                            want
                                                                            to
                                                                            download
                                                                            associated
                                                                            audio
                                                                            file
                                                                            ?
                                                                        </AlertDialogDescription>
                                                                    </AlertDialogHeader>
                                                                    <AlertDialogFooter>
                                                                        <AlertDialogCancel>
                                                                            Cancel
                                                                        </AlertDialogCancel>
                                                                        <AlertDialogAction
                                                                            onClick={() =>
                                                                                handleDownloadAudio(
                                                                                    item.id
                                                                                )
                                                                            }
                                                                            className="bg-accent text-destructive-foreground hover:bg-accent/80"
                                                                        >
                                                                            Download
                                                                        </AlertDialogAction>
                                                                    </AlertDialogFooter>
                                                                </AlertDialogContent>
                                                            </AlertDialog>
                                                        )}
                                                        <AlertDialog>
                                                            <AlertDialogTrigger
                                                                asChild
                                                            >
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0 text-destructive hover:text-destructive"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </Button>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent>
                                                                <AlertDialogHeader>
                                                                    <AlertDialogTitle>
                                                                        Delete
                                                                        Transcription
                                                                    </AlertDialogTitle>
                                                                    <AlertDialogDescription>
                                                                        Are you
                                                                        sure you
                                                                        want to
                                                                        delete
                                                                        this
                                                                        transcription?
                                                                        This
                                                                        action
                                                                        cannot
                                                                        be
                                                                        undone.
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel>
                                                                        Cancel
                                                                    </AlertDialogCancel>
                                                                    <AlertDialogAction
                                                                        onClick={() =>
                                                                            handleDelete(
                                                                                item.id
                                                                            )
                                                                        }
                                                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                                    >
                                                                        Delete
                                                                    </AlertDialogAction>
                                                                </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialog>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Audio Player */}
                {audioBlob && playingAudioId && (
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
                                    onClick={handleCloseAudioPlayer}
                                    className="h-8 w-8 p-0"
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                            <div className="space-y-2">
                                <p className="text-sm text-muted-foreground">
                                    {
                                        filteredTranscriptions.find(
                                            (t) => t.id === playingAudioId
                                        )?.transcribedText
                                    }
                                </p>
                                <audio
                                    controls
                                    autoPlay
                                    src={audioBlob}
                                    className="w-full"
                                    onEnded={handleCloseAudioPlayer}
                                >
                                    Your browser does not support the audio
                                    element.
                                </audio>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Stats Footer */}
                {!isLoading && transcriptions.length > 0 && (
                    <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Card>
                            <CardContent className="pt-6">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-primary">
                                        {transcriptions.length}
                                    </div>
                                    <div className="text-sm text-muted-foreground mt-1">
                                        Total Transcriptions
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="pt-6">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-primary">
                                        {
                                            new Set(
                                                transcriptions.map(
                                                    (t) => t.languageCode
                                                )
                                            ).size
                                        }
                                    </div>
                                    <div className="text-sm text-muted-foreground mt-1">
                                        Languages Used
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="pt-6">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-primary">
                                        {transcriptions.length > 0
                                            ? new Date(
                                                  transcriptions[0].createdAt
                                              ).toLocaleDateString('en-US', {
                                                  month: 'short',
                                                  day: 'numeric',
                                              })
                                            : '-'}
                                    </div>
                                    <div className="text-sm text-muted-foreground mt-1">
                                        Last Transcription
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="pt-6">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-primary">
                                        {
                                            transcriptions.filter(
                                                (t) => t.audioUrl
                                            ).length
                                        }
                                    </div>
                                    <div className="text-sm text-muted-foreground mt-1">
                                        With Audio Files
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AllTranscriptions;
