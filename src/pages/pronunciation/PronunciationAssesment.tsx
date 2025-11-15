import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle, Eye } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';

import apiClient from '@/services/apiClient';

import LoaderComponent from '@/components/LoaderComponent';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import '@/index.css';
import { AudioRecorder, useAudioRecorder } from 'react-audio-voice-recorder';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    getSavedPronunciations,
    SavedItem,
} from '@/services/savedItemsService';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import {
    AudioPlayerWithCache,
    AudioDownloadButton,
    FloatingAudioPlayer,
} from '@/components/AudioPlayer';
import { useAudioCache } from '@/hooks/useAudioCache';
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';

import PronunciationChart, {
    PronunciationAssessmentData,
} from '@/components/PronunciationChart';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import languages from '@/data/PronunciationLanguages';
import { debounce } from 'lodash';

interface PronunciationResult {
    id: string;
    audioUrl: string | null;
    referenceText: string;
    accuracyScore: number;
    fluencyScore: number;
    prosodyScore: number;
    completenessScore: number;
}

const PronunciationAssesment = () => {
    const { isAuthenticated } = useAuth();
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [recordedAudioBlob, setRecordedAudioBlob] = useState<Blob | null>(
        null
    );
    const [referenceText, setReferenceText] = useState<string>('');
    const [targetLanguage, setTargetLanguage] = useState<string>('');

    const [isError, setError] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [isLoading, setLoading] = useState<boolean>(false);
    const [isStopRecordingVisible, setStopRecordingVisible] =
        useState<boolean>(false);

    const [showAssessmentChar, setShowAssessmentChart] =
        useState<boolean>(false);

    const [assessmentNumber, setAssessmentNumber] = useState<
        PronunciationAssessmentData[]
    >([]);

    const [pronunciationList, setPronunciationList] = useState<
        PronunciationResult[]
    >([]);

    const [viewChartId, setViewChartId] = useState<string | null>(null);

    const {
        playingAudioId,
        audioBlob,
        handlePlayAudio,
        handleCloseAudioPlayer,
    } = useAudioCache();

    const onAudioError = (message: string) => {
        setError(true);
        setErrorMessage(message);
        setTimeout(() => {
            setError(false);
            setErrorMessage('');
        }, 5000);
    };

    const recorderControl = useAudioRecorder(
        {
            noiseSuppression: true,
            echoCancellation: true,
            channelCount: 2,
            sampleRate: 48000,
        },
        (err) => console.table(err)
    );

    const isFileEmpty = (
        event: React.ChangeEvent<HTMLInputElement>
    ): boolean => {
        if (!event.target.files || event.target.files.length === 0) {
            return true;
        }
        return false;
    };

    const isLanguageEmpty = () => {
        if (targetLanguage.length <= 0) {
            setError(true);
            setErrorMessage('Please select a Language.');
            resetError();
            return true;
        }
        return false;
    };

    const isReferenceTextEmpty = () => {
        if (referenceText === '') {
            setError(true);
            setErrorMessage('Please enter reference text first...');
            resetError();
            return true;
        }
        return false;
    };

    const getTargetLanguage = () => {
        if (targetLanguage.endsWith('custom'))
            return targetLanguage.replace('custom', '');

        return targetLanguage;
    };

    const resetError = () => {
        setTimeout(() => {
            setError(false);
            setErrorMessage('');
        }, 5000);
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (isFileEmpty(event)) {
            return;
        } else {
            setError(false);
        }
        const file = event.target.files?.[0];
        if (file) {
            setUploadedFile(file);
        }
    };

    const handleSaveAudio = (blob: Blob) => {
        setRecordedAudioBlob(blob);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const handleReferenceText = useCallback(
        debounce((text: string) => {
            setReferenceText(text);
        }, 500),
        []
    );
    const handlePronunciationAssessment = () => {
        if (isReferenceTextEmpty()) return;
        if (isLanguageEmpty()) return;

        if (!uploadedFile && !recordedAudioBlob) {
            setError(true);
            setErrorMessage('Please upload an audio file or record your audio');
            resetError();
            return;
        }

        setLoading(true);
        setShowAssessmentChart(false);
        setAssessmentNumber([]);
        if (uploadedFile)
            getPronunciationAssesment(uploadedFile, getTargetLanguage());
        else if (recordedAudioBlob)
            getPronunciationAssesment(recordedAudioBlob, getTargetLanguage());
    };

    const getPronunciationAssesment = (
        audio: Blob | File,
        language: string
    ) => {
        const formData = new FormData();
        formData.append('audio', audio);
        formData.append('target_language', language);
        formData.append('reference_text', referenceText);

        const headers = {
            'Content-Type': 'multipart/form-data',
        };

        apiClient
            .post('pronunciation/', formData, { headers })
            .then((response) => {
                if (response.data.status == 'success') {
                    console.log(assessmentNumber);
                    console.log('Success');
                    setError(false);
                    const data = response.data;
                    if (
                        data.accuracyScore &&
                        typeof data.accuracyScore === 'number'
                    ) {
                        setAssessmentNumber((prev) => [
                            ...prev,
                            {
                                category: 'Accuracy Score',
                                score: Number(data.accuracyScore.toFixed(2)),
                            },
                        ]);
                        console.log(assessmentNumber);
                    }
                    if (
                        data.prosodyScore &&
                        typeof data.prosodyScore === 'number'
                    ) {
                        console.log(data.prosodyScore);
                        setAssessmentNumber((prev) => [
                            ...prev,
                            {
                                category: 'Prosody Score',
                                score: Number(data.prosodyScore.toFixed(2)),
                            },
                        ]);
                    }
                    if (
                        data.completenessScore &&
                        typeof data.completenessScore === 'number'
                    ) {
                        console.log(data.completenessScore);
                        setAssessmentNumber((prev) => [
                            ...prev,
                            {
                                category: 'Completeness Score',
                                score: Number(
                                    data.completenessScore.toFixed(2)
                                ),
                            },
                        ]);
                    }
                    if (
                        data.fluency_score &&
                        typeof data.fluency_score === 'number'
                    ) {
                        console.log(data.fluency_score);

                        setAssessmentNumber((prev) => [
                            ...prev,
                            {
                                category: 'Fluency Score',
                                score: Number(data.fluency_score.toFixed(2)),
                            },
                        ]);
                    }
                    setShowAssessmentChart(true);
                    fetchSavedPronunciations();
                } else {
                    setError(true);
                    setErrorMessage(
                        response.data.error ||
                            "Sorry, couldn't get the translation. Please try again later."
                    );
                    resetError();
                }
            })
            .catch((error) => {
                setError(true);
                if (error.message === 'Network Error') {
                    setErrorMessage('Network error, please try again later.');
                } else if (
                    error.response?.data?.error ===
                    'No speech could be recognized.'
                ) {
                    setErrorMessage('No speech could be recognized.');
                } else {
                    setErrorMessage(
                        error.message || 'An unexpected error occurred.'
                    );
                }
            })
            .finally(() => {
                setLoading(false);
                setTimeout(() => {
                    window.scrollTo({
                        top: document.body.scrollHeight,
                        behavior: 'smooth',
                    });
                }, 100);
            });
    };

    const fetchSavedPronunciations = async () => {
        console.log('Fetching saved pronunciations...');
        setLoading(true);
        try {
            const response = await getSavedPronunciations();
            const pronunciations: PronunciationResult[] = response?.items?.map(
                (item: SavedItem) => ({
                    id: item?.id,
                    audioUrl: item?.audio_url || null,
                    referenceText: item?.content?.reference_text || '',
                    accuracyScore: item?.content?.accuracy_score || 0,
                    fluencyScore: item?.content?.fluency_score || 0,
                    prosodyScore: item?.content?.prosody_score || 0,
                    completenessScore: item?.content?.completeness_score || 0,
                })
            );
            setPronunciationList(pronunciations.slice(0, 5));
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchSavedPronunciations();
        } else {
            setPronunciationList([]);
        }
    }, [isAuthenticated]);

    return (
        <>
            <div className="border-t border-border py-8">
                <div className="w-full max-w-2xl mx-auto bg-card shadow-md rounded-lg p-6">
                    <h2 className="text-2xl font-bold text-card-foreground mb-6 text-center">
                        Pronunciation Assessment
                    </h2>
                    <h3 className="text-lg font-bold text-card-foreground mb-6 text-center">
                        Record or upload an audio file to check your
                        pronunciation
                    </h3>
                    <div className="flex flex-col items-left space-y-2 mt-10 mb-10">
                        <Label>Reference Text</Label>
                        <Textarea
                            placeholder="Enter referenced text to assess pronunciation..."
                            onChange={(e) => {
                                handleReferenceText(e.target.value);
                            }}
                            className="w-full h-20 border border-border bg-input text-foreground rounded-lg p-2 focus:outline-none focus:border-accent"
                        />
                    </div>
                    <div className="flex flex-col items-center space-y-6 mt-5">
                        <Select
                            onValueChange={(value) => setTargetLanguage(value)}
                        >
                            <SelectTrigger className="w-auto sm:w-[180px] bg-input text-foreground border border-border rounded-md p-2 focus:ring focus:ring-accent focus:ring-opacity-50">
                                <SelectValue placeholder="Select Language" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Top Languages</SelectLabel>
                                    <SelectItem value="ar-PScustom">
                                        Arabic (Egypt)
                                    </SelectItem>
                                    <SelectItem value="ar-SAcustom">
                                        Arabic (Saudi Arabia)
                                    </SelectItem>
                                    <SelectItem value="zh-CNcustom">
                                        Chinese (Mandarin, Simplified)
                                    </SelectItem>
                                    <SelectItem value="en-GBcustom">
                                        English (United Kingdom)
                                    </SelectItem>
                                    <SelectItem value="en-UScustom">
                                        English (United States)
                                    </SelectItem>
                                    <SelectItem value="ja-JPcustom">
                                        Japanese (Japan)
                                    </SelectItem>
                                    <SelectItem value="ko-KRcustom">
                                        Korean (Korea)
                                    </SelectItem>
                                    <SelectItem value="ru-RUcustom">
                                        Russian (Russia)
                                    </SelectItem>
                                    <SelectItem value="es-EScustom">
                                        Spanish (Spain)
                                    </SelectItem>
                                </SelectGroup>
                                <SelectGroup>
                                    <SelectLabel>All Languages</SelectLabel>
                                    {languages.map((lang) => (
                                        <SelectItem
                                            value={lang.language_code}
                                            key={lang.language_code}
                                            className="hover:bg-purple-700"
                                        >
                                            {lang.name}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex flex-col lg:flex-row lg:space-x-6 space-y-6 lg:space-y-0 mt-10 items-center">
                        <div className="flex flex-col items-center w-full lg:w-1/2 space-y-6">
                            <div className="w-full max-w-xs flex items-center justify-center">
                                <AudioRecorder
                                    recorderControls={recorderControl}
                                    onRecordingComplete={(blob) =>
                                        handleSaveAudio(blob)
                                    }
                                    downloadOnSavePress={false}
                                    downloadFileExtension="wav"
                                    mediaRecorderOptions={{
                                        audioBitsPerSecond: 320000,
                                    }}
                                    showVisualizer={true}
                                />
                            </div>
                            <div>
                                {!isStopRecordingVisible && (
                                    <Button
                                        className="mb-5 mt-3"
                                        onClick={() => {
                                            if (isLanguageEmpty()) return;
                                            recorderControl.startRecording();
                                            setStopRecordingVisible(true);
                                        }}
                                    >
                                        Start Recording
                                    </Button>
                                )}
                                {isStopRecordingVisible && (
                                    <Button
                                        className="mb-5 mt-3"
                                        onClick={() => {
                                            if (isLanguageEmpty()) return;
                                            recorderControl.stopRecording();
                                            setStopRecordingVisible(false);
                                        }}
                                    >
                                        Stop Recording
                                    </Button>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col items-center w-full lg:w-1/2 space-y-6 h-[150px] justify-center">
                            <input
                                required
                                type="file"
                                accept="audio/*"
                                onChange={handleFileUpload}
                                className="w-64 max-w-md text-sm text-card-foreground bg-input border border-border rounded-lg cursor-pointer focus:outline-none focus:ring focus:ring-accent focus:ring-opacity-50 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-primary file:text-primary-foreground file:cursor-pointer hover:file:bg-opacity-90"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col items-center space-y-6 mt-5">
                        {isError && (
                            <div className="w-1/2">
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>Error</AlertTitle>
                                    <AlertDescription>
                                        {errorMessage}
                                    </AlertDescription>
                                </Alert>
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col items-center space-y-6 mt-5">
                        <Button
                            onClick={() => handlePronunciationAssessment()}
                            className="w-64 max-w-xs bg-primary text-primary-foreground font-medium px-4 py-2 rounded-lg shadow-sm hover:bg-opacity-90 focus:ring focus:ring-accent focus:ring-opacity-50 transition"
                        >
                            Get Assessment
                        </Button>
                        {isLoading && <LoaderComponent isLoading={isLoading} />}
                    </div>
                </div>
                <div className="w-full max-w-2xl mx-auto bg-card rounded-lg p-6 mt-10">
                    {showAssessmentChar && assessmentNumber && (
                        <PronunciationChart
                            pronunciationData={assessmentNumber}
                        />
                    )}
                </div>
            </div>

            {pronunciationList.length > 0 && (
                <div className="w-full max-w-3xl md:w-full mx-auto mb-20">
                    <div className="w-full flex justify-between px-2 md:px-0 mb-2 md:mb-0">
                        <h3 className="text-xl font-bold text-card-foreground mb-6 text-left">
                            Recent Assessments
                        </h3>
                        <Link to={'/pronunciation-assessments'}>
                            <Button>See All</Button>
                        </Link>
                    </div>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Audio File</TableHead>
                                <TableHead>Reference Text</TableHead>
                                <TableHead>Accuracy</TableHead>
                                <TableHead>Fluency</TableHead>
                                <TableHead>Prosody</TableHead>
                                <TableHead>Completeness</TableHead>
                                <TableHead className="text-right">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {pronunciationList.map((item) => (
                                <TableRow key={item.id} className="group">
                                    <TableCell>
                                        {item.audioUrl ? (
                                            <AudioPlayerWithCache
                                                itemId={item.id}
                                                isPlaying={
                                                    playingAudioId === item.id
                                                }
                                                onPlayToggle={() =>
                                                    handlePlayAudio(
                                                        item.id,
                                                        onAudioError
                                                    )
                                                }
                                            />
                                        ) : (
                                            <span className="text-sm text-muted-foreground">
                                                No audio
                                            </span>
                                        )}
                                    </TableCell>
                                    <TableCell className="max-w-xs truncate">
                                        {item.referenceText}
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-sm font-medium">
                                            {item.accuracyScore.toFixed(1)}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-sm font-medium">
                                            {item.fluencyScore.toFixed(1)}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-sm font-medium">
                                            {item.prosodyScore.toFixed(1)}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-sm font-medium">
                                            {item.completenessScore.toFixed(1)}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-6 w-6 p-0"
                                                onClick={() =>
                                                    setViewChartId(item.id)
                                                }
                                            >
                                                <Eye className="w-4 h-4" />
                                            </Button>
                                            {item.audioUrl && (
                                                <AudioDownloadButton
                                                    itemId={item.id}
                                                    onError={onAudioError}
                                                />
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    {audioBlob && playingAudioId && (
                        <FloatingAudioPlayer
                            audioBlob={audioBlob}
                            displayText={
                                pronunciationList.find(
                                    (t) => t.id === playingAudioId
                                )?.referenceText
                            }
                            onClose={handleCloseAudioPlayer}
                        />
                    )}

                    {/* Chart Dialog */}
                    {viewChartId && (
                        <AlertDialog
                            open={!!viewChartId}
                            onOpenChange={(open) =>
                                !open && setViewChartId(null)
                            }
                        >
                            <AlertDialogContent className="max-w-4xl">
                                <AlertDialogHeader>
                                    <AlertDialogTitle>
                                        Pronunciation Assessment Chart
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Reference Text:{' '}
                                        {
                                            pronunciationList.find(
                                                (t) => t.id === viewChartId
                                            )?.referenceText
                                        }
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <div className="mt-4">
                                    {(() => {
                                        const item = pronunciationList.find(
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
                                                        item.fluencyScore.toFixed(
                                                            2
                                                        )
                                                    ),
                                                },
                                                {
                                                    category: 'Prosody Score',
                                                    score: Number(
                                                        item.prosodyScore.toFixed(
                                                            2
                                                        )
                                                    ),
                                                },
                                                {
                                                    category:
                                                        'Completeness Score',
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
                </div>
            )}
        </>
    );
};

export default PronunciationAssesment;
