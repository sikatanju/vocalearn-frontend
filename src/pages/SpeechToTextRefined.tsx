import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { useState } from "react";
import ReactAudioPlayer from "react-audio-player";

import apiClient from "@/services/apiClient";

import "@/index.css";
import { AudioRecorder, useAudioRecorder } from "react-audio-voice-recorder";
import LoaderComponent from "@/components/LoaderComponent";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import languages from "@/data/speech_to_text";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface TranscriptionResult {
    id: number;
    fromAudio: string;
    selectedLanguage: string;
    toText: string;
}

const SpeechToTextRefined = () => {
    const [transcriptionList, setTranscriptionList] = useState<
        TranscriptionResult[]
    >([]);

    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [transcribedText, setTranscribedText] = useState<string>("");
    const [targetLanguage, setTargetLanguage] = useState<string>("");
    const [fileError, setFileError] = useState<boolean>(false);

    const [isError, setError] = useState<boolean>(false);
    const [erroMessage, setErrorMessage] = useState<string>("");
    const [isLoading, setLoading] = useState<boolean>(false);
    const [isStopRecordingVisible, setStopRecordingVisible] =
        useState<boolean>(false);

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
            setErrorMessage("Please select a Language.");
            resetError();
            return true;
        }
        return false;
    };

    const getTargetLanguage = () => {
        if (targetLanguage.endsWith("custom"))
            return targetLanguage.replace("custom", "");

        return targetLanguage;
    };

    const resetError = () => {
        setTimeout(() => {
            setError(false);
            setErrorMessage("");
        }, 5000);
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (isFileEmpty(event)) {
            return;
        } else {
            setFileError(false);
        }
        const file = event.target.files?.[0];
        if (file) {
            setUploadedFile(file);
        }
    };

    const handleSpeechToText = () => {
        if (isLanguageEmpty()) return;

        if (!uploadedFile) {
            setFileError(true);
            resetError();
            return;
        }
        setLoading(true);
        sendAudioToSpeechAPI(uploadedFile, getTargetLanguage());
    };

    const uploadAudio = (audioBlob: Blob) => {
        if (isLanguageEmpty()) return;

        setLoading(true);
        sendAudioToSpeechAPI(audioBlob, getTargetLanguage());
    };

    const addRecords = (
        blob: Blob,
        targetLanguage: string,
        transcribedText: string
    ) => {
        const newTranscriptionRes = {
            id: Date.now(),
            fromAudio: URL.createObjectURL(blob),
            selectedLanguage: targetLanguage,
            toText: transcribedText,
        };
        setTranscriptionList((prevList) => {
            const updatedList = [newTranscriptionRes, ...prevList];
            return updatedList.splice(0, 5);
        });
    };

    const sendAudioToSpeechAPI = (audio: Blob | File, language: string) => {
        const formData = new FormData();
        formData.append("audio", audio);
        formData.append("target_language", language);

        const headers = {
            "Content-Type": "multipart/form-data",
        };

        apiClient
            .post("speech/", formData, { headers })
            .then((response) => {
                if (response.data.transcription) {
                    setTranscribedText(response.data.transcription);
                    addRecords(audio, language, response.data.transcription);
                } else {
                    setError(true);
                    setErrorMessage(
                        response.data.error ||
                            "Sorry, couldn't get the translation. Please try again later."
                    );
                }
            })
            .catch((error) => {
                setError(true);
                if (error.message === "Network Error") {
                    setErrorMessage("Network error, please try again later.");
                } else if (
                    error.response?.data?.error ===
                    "No speech could be recognized."
                ) {
                    setErrorMessage("No speech could be recognized.");
                } else {
                    setErrorMessage(
                        error.message || "An unexpected error occurred."
                    );
                }
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <>
            <div className="border-t border-border py-8">
                <div className="w-full max-w-2xl mx-auto bg-card shadow-md rounded-lg p-6">
                    <h2 className="text-2xl font-bold text-card-foreground mb-6 text-center">
                        Speech to Text
                    </h2>
                    <h3 className="text-lg font-bold text-card-foreground mb-6 text-center">
                        Record audio or Upload an audio file (.wav or pcm format
                        for audio file)
                    </h3>
                    <div className="flex flex-col items-center space-y-6 mt-5">
                        <div className="w-full max-w-xs flex items-center justify-center mt-5">
                            <AudioRecorder
                                recorderControls={recorderControl}
                                onRecordingComplete={(blob) =>
                                    uploadAudio(blob)
                                }
                                downloadOnSavePress={false}
                                downloadFileExtension="wav"
                                mediaRecorderOptions={{
                                    audioBitsPerSecond: 320000,
                                }}
                                showVisualizer={true}
                            />
                        </div>
                        <div className="mt-5">
                            {!isStopRecordingVisible && (
                                <Button
                                    className="mb-5 mt-3"
                                    onClick={() => {
                                        if (isLanguageEmpty()) return;
                                        recorderControl.startRecording();
                                        setStopRecordingVisible(true);
                                    }}
                                >
                                    Start recording
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
                                        Arabic (Palestinian Authority)
                                    </SelectItem>
                                    <SelectItem value="ar-SAcustom">
                                        Arabic (Saudi Arabia)
                                    </SelectItem>
                                    <SelectItem value="bn-INcustom">
                                        Bengali
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
                                    <SelectItem value="ru-RU">
                                        Russian (Russia)
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
                    <div className="mt-10 flex flex-col items-center space-y-6">
                        <input
                            required
                            type="file"
                            accept="audio/*"
                            onChange={handleFileUpload}
                            className="w-64 max-w-md text-sm text-card-foreground bg-input border border-border rounded-lg cursor-pointer focus:outline-none focus:ring focus:ring-accent focus:ring-opacity-50 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-primary file:text-primary-foreground file:cursor-pointer hover:file:bg-opacity-90"
                        />
                        {fileError && (
                            <div className="w-1/2">
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>Error</AlertTitle>
                                    <AlertDescription>
                                        Please choose a file
                                    </AlertDescription>
                                </Alert>
                            </div>
                        )}

                        <Button
                            onClick={() => handleSpeechToText()}
                            className="w-64 max-w-xs bg-primary text-primary-foreground font-medium px-4 py-2 rounded-lg shadow-sm hover:bg-opacity-90 focus:ring focus:ring-accent focus:ring-opacity-50 transition"
                        >
                            Transcribe
                        </Button>
                        {isError && (
                            <div className="w-1/2">
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>Error</AlertTitle>
                                    <AlertDescription>
                                        {erroMessage}
                                    </AlertDescription>
                                </Alert>
                            </div>
                        )}
                        {isLoading && <LoaderComponent isLoading={isLoading} />}
                        {transcribedText && (
                            <div className="w-full max-w-md mt-6 p-4 bg-muted border border-border rounded-lg shadow-sm">
                                <h3 className="text-lg font-semibold text-card-foreground mb-2">
                                    Transcribed Text:
                                </h3>
                                <p className="text-sm text-secondary-foreground leading-relaxed">
                                    {transcribedText}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {transcriptionList.length > 0 && (
                <div className="w-full max-w-2xl md:w-1/2 mx-auto mb-20">
                    <h3 className="text-xl font-bold text-card-foreground mb-6 text-left">
                        Last 5 Res
                    </h3>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Audio File</TableHead>
                                <TableHead>Target Language</TableHead>
                                <TableHead>Transcribed Text</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {transcriptionList.map((list) => (
                                <TableRow key={list.id}>
                                    <TableCell>
                                        <ReactAudioPlayer
                                            src={list.fromAudio}
                                            controls
                                            className="min-w-12"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        {list.selectedLanguage}
                                    </TableCell>
                                    <TableCell>{list.toText}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </>
    );
};

export default SpeechToTextRefined;
