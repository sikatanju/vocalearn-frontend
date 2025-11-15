import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
    getSavedPronunciations,
    SavedItem,
} from '@/services/savedItemsService';
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
    AlertCircle,
    Trash2,
    Copy,
    CheckCircle2,
    Mic2,
    Eye,
} from 'lucide-react';
import apiClient from '@/services/apiClient';
import {
    AudioPlayerWithCache,
    AudioDownloadButton,
    FloatingAudioPlayer,
} from '@/components/AudioPlayer';
import { useAudioCache } from '@/hooks/useAudioCache';
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
import LoaderComponent from '@/components/LoaderComponent';
import PronunciationChart, {
    PronunciationAssessmentData,
} from '@/components/PronunciationChart';

interface PronunciationItem {
    id: string;
    audioUrl: string | null;
    referenceText: string;
    accuracyScore: number;
    fluencyScore: number;
    prosodyScore: number;
    completenessScore: number;
    createdAt: string;
}

const AllPronunciationAssessments = () => {
    const { isAuthenticated, isLoading: authLoading } = useAuth();
    const navigate = useNavigate();

    const [pronunciations, setPronunciations] = useState<PronunciationItem[]>(
        []
    );
    const [filteredPronunciations, setFilteredPronunciations] = useState<
        PronunciationItem[]
    >([]);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [audioLoading, setAudioLoading] = useState<boolean>(false);
    const [audioId, setAudioId] = useState<string | ''>('');
    const [error, setError] = useState<string>('');
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [viewChartId, setViewChartId] = useState<string | null>(null);

    const {
        playingAudioId,
        audioBlob,
        handlePlayAudio,
        handleCloseAudioPlayer,
    } = useAudioCache();

    const onAudioError = (message: string) => {
        setError(message);
        setTimeout(() => setError(''), 5000);
    };

    useEffect(() => {
        if (authLoading) {
            return;
        }

        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        fetchAllPronunciations();
    }, [isAuthenticated, authLoading, navigate]);

    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredPronunciations(pronunciations);
        } else {
            const query = searchQuery.toLowerCase();
            const filtered = pronunciations.filter((item) =>
                item.referenceText.toLowerCase().includes(query)
            );
            setFilteredPronunciations(filtered);
        }
    }, [searchQuery, pronunciations]);

    const handleAudioLoading = async (id: string) => {
        if (audioId && audioId !== id) {
            handleCloseAudioPlayer();
            setAudioId(id);
            await handlePlayAudio(id);
        }
        if (playingAudioId === id) {
            setAudioLoading(false);
            return;
        }
        setAudioLoading(true);
        setAudioId(id);
    };

    useEffect(() => {
        if (playingAudioId === audioId) setAudioLoading(false);
    }, [audioId, playingAudioId]);

    const fetchAllPronunciations = async () => {
        setIsLoading(true);
        setError('');
        try {
            const response = await getSavedPronunciations();
            const pronunciationItems: PronunciationItem[] = response.items.map(
                (item: SavedItem) => ({
                    id: item.id,
                    audioUrl: item.audio_url || null,
                    referenceText: item.content.reference_text || '',
                    accuracyScore: item.content.accuracy_score || 0,
                    fluencyScore: item.content.fluency_score || 0,
                    prosodyScore: item.content.prosody_score || 0,
                    completenessScore: item.content.completeness_score || 0,
                    createdAt: item.created_at,
                })
            );
            setPronunciations(pronunciationItems);
            setFilteredPronunciations(pronunciationItems);
        } catch (err) {
            console.error('Failed to fetch pronunciation assessments:', err);
            setError(
                'Failed to load your pronunciation assessments. Please try again later.'
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

    const handleDelete = (id: string) => {
        const prevPronunciations = pronunciations;
        setPronunciations((prev) => prev.filter((item) => item.id !== id));
        apiClient
            .delete(`saved-items/${id}/`)
            .then(() => {})
            .catch((e) => {
                console.log(e);
                setPronunciations(prevPronunciations);
            });
    };

    const getAverageScore = (item: PronunciationItem) => {
        return (
            (item.accuracyScore +
                item.fluencyScore +
                item.prosodyScore +
                item.completenessScore) /
            4
        ).toFixed(1);
    };

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
                        onClick={() => navigate('/pronunciation-assessment')}
                        className="mb-4 group"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                        Back to Pronunciation Assessment
                    </Button>

                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                            <Mic2 className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                                My Pronunciation Assessments
                            </h1>
                            <p className="text-muted-foreground">
                                View and manage all your pronunciation
                                assessments
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
                                placeholder="Search assessments by reference text..."
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
                                          filteredPronunciations.length
                                      } Assessment${
                                          filteredPronunciations.length !== 1
                                              ? 's'
                                              : ''
                                      }`}
                            </span>
                            {!isLoading && pronunciations.length > 0 && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={fetchAllPronunciations}
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
                                    Loading your assessments...
                                </p>
                            </div>
                        ) : filteredPronunciations.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 text-center">
                                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
                                    <Mic2 className="w-10 h-10 text-muted-foreground" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">
                                    {searchQuery
                                        ? 'No assessments found'
                                        : 'No assessments yet'}
                                </h3>
                                <p className="text-muted-foreground mb-6 max-w-md">
                                    {searchQuery
                                        ? 'Try adjusting your search query'
                                        : 'Start assessing your pronunciation to see your history here'}
                                </p>
                                {!searchQuery && (
                                    <Button
                                        onClick={() =>
                                            navigate(
                                                '/pronunciation-assessment'
                                            )
                                        }
                                        className="group"
                                    >
                                        Start Assessment
                                        <Mic2 className="w-4 h-4 ml-2" />
                                    </Button>
                                )}
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[10%]">
                                                Audio
                                            </TableHead>
                                            <TableHead className="w-[30%]">
                                                Reference Text
                                            </TableHead>
                                            <TableHead className="w-[10%]">
                                                Accuracy
                                            </TableHead>
                                            <TableHead className="w-[10%]">
                                                Fluency
                                            </TableHead>
                                            <TableHead className="w-[10%]">
                                                Prosody
                                            </TableHead>
                                            <TableHead className="w-[10%]">
                                                Completeness
                                            </TableHead>
                                            <TableHead className="w-[10%]">
                                                Average
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
                                        {filteredPronunciations.map((item) => (
                                            <TableRow
                                                key={item.id}
                                                className="group hover:bg-muted/50"
                                            >
                                                <TableCell>
                                                    {item.audioUrl ? (
                                                        <div
                                                            onClick={() =>
                                                                handleAudioLoading(
                                                                    item.id
                                                                )
                                                            }
                                                        >
                                                            <AudioPlayerWithCache
                                                                itemId={item.id}
                                                                isPlaying={
                                                                    playingAudioId ===
                                                                    item.id
                                                                }
                                                                onPlayToggle={() =>
                                                                    handlePlayAudio(
                                                                        item.id,
                                                                        onAudioError
                                                                    )
                                                                }
                                                            />
                                                        </div>
                                                    ) : (
                                                        <span className="text-sm text-muted-foreground">
                                                            No audio
                                                        </span>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-start justify-between gap-2">
                                                        <p className="line-clamp-2 flex-1 text-sm">
                                                            {item.referenceText}
                                                        </p>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 h-8 w-8 p-0"
                                                            onClick={() =>
                                                                handleCopy(
                                                                    item.referenceText,
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
                                                <TableCell>
                                                    <span className="text-sm font-medium">
                                                        {item.accuracyScore.toFixed(
                                                            1
                                                        )}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="text-sm font-medium">
                                                        {item.fluencyScore.toFixed(
                                                            1
                                                        )}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="text-sm font-medium">
                                                        {item.prosodyScore.toFixed(
                                                            1
                                                        )}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="text-sm font-medium">
                                                        {item.completenessScore.toFixed(
                                                            1
                                                        )}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="text-sm font-semibold text-primary">
                                                        {getAverageScore(item)}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-sm text-muted-foreground">
                                                    {formatDate(item.createdAt)}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
                                                            onClick={() =>
                                                                setViewChartId(
                                                                    item.id
                                                                )
                                                            }
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </Button>
                                                        {item.audioUrl && (
                                                            <AudioDownloadButton
                                                                itemId={item.id}
                                                                onError={
                                                                    onAudioError
                                                                }
                                                            />
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
                                                                        Assessment
                                                                    </AlertDialogTitle>
                                                                    <AlertDialogDescription>
                                                                        Are you
                                                                        sure you
                                                                        want to
                                                                        delete
                                                                        this
                                                                        pronunciation
                                                                        assessment?
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
                    <FloatingAudioPlayer
                        audioBlob={audioBlob}
                        displayText={
                            filteredPronunciations.find(
                                (t) => t.id === playingAudioId
                            )?.referenceText
                        }
                        onClose={handleCloseAudioPlayer}
                    />
                )}

                {audioLoading && (
                    <div className="w-full flex items-center justify-center">
                        <LoaderComponent isLoading={audioLoading} />
                    </div>
                )}

                {/* Chart Dialog */}
                {viewChartId && (
                    <AlertDialog
                        open={!!viewChartId}
                        onOpenChange={(open) => !open && setViewChartId(null)}
                    >
                        <AlertDialogContent className="max-w-4xl">
                            <AlertDialogHeader>
                                <AlertDialogTitle>
                                    Pronunciation Assessment Chart
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    Reference Text:{' '}
                                    {
                                        filteredPronunciations.find(
                                            (t) => t.id === viewChartId
                                        )?.referenceText
                                    }
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <div className="mt-4">
                                {(() => {
                                    const item = filteredPronunciations.find(
                                        (t) => t.id === viewChartId
                                    );
                                    if (!item) return null;
                                    const chartData: PronunciationAssessmentData[] =
                                        [
                                            {
                                                category: 'Accuracy Score',
                                                score: Number(
                                                    item.accuracyScore.toFixed(
                                                        2
                                                    )
                                                ),
                                            },
                                            {
                                                category: 'Fluency Score',
                                                score: Number(
                                                    item.fluencyScore.toFixed(2)
                                                ),
                                            },
                                            {
                                                category: 'Prosody Score',
                                                score: Number(
                                                    item.prosodyScore.toFixed(2)
                                                ),
                                            },
                                            {
                                                category: 'Completeness Score',
                                                score: Number(
                                                    item.completenessScore.toFixed(
                                                        2
                                                    )
                                                ),
                                            },
                                        ];
                                    return (
                                        <PronunciationChart
                                            pronunciationData={chartData}
                                        />
                                    );
                                })()}
                            </div>
                            <AlertDialogFooter>
                                <AlertDialogCancel
                                    onClick={() => setViewChartId(null)}
                                >
                                    Close
                                </AlertDialogCancel>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                )}

                {/* Stats Footer */}
                {!isLoading && pronunciations.length > 0 && (
                    <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Card>
                            <CardContent className="pt-6">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-primary">
                                        {pronunciations.length}
                                    </div>
                                    <div className="text-sm text-muted-foreground mt-1">
                                        Total Assessments
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="pt-6">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-primary">
                                        {(
                                            pronunciations.reduce(
                                                (acc, curr) =>
                                                    acc +
                                                    Number(
                                                        getAverageScore(curr)
                                                    ),
                                                0
                                            ) / pronunciations.length
                                        ).toFixed(1)}
                                    </div>
                                    <div className="text-sm text-muted-foreground mt-1">
                                        Average Score
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="pt-6">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-primary">
                                        {pronunciations.length > 0
                                            ? new Date(
                                                  pronunciations[0].createdAt
                                              ).toLocaleDateString('en-US', {
                                                  month: 'short',
                                                  day: 'numeric',
                                              })
                                            : '-'}
                                    </div>
                                    <div className="text-sm text-muted-foreground mt-1">
                                        Last Assessment
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="pt-6">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-primary">
                                        {
                                            pronunciations.filter(
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

export default AllPronunciationAssessments;
