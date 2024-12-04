/* eslint-disable @typescript-eslint/no-unused-vars */
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { ChangeEvent, useState } from "react";

import apiClient from "@/services/apiClient";

import "@/index.css";
import { AudioRecorder, useAudioRecorder } from "react-audio-voice-recorder";
import { Progress } from "@/components/ui/progress";

const SpeechToTextRefined = () => {
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [transcribedText, setTranscribedText] = useState<string>("");
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
        const formData = new FormData();
        if (uploadedFile === null) {
            setFileError(true);
            resetError();
            return;
        }

        if (uploadedFile !== null) formData.append("audio", uploadedFile);
        const headers = {
            "Content-Type": "multipart/form-data",
        };

        apiClient
            .post("speech/", formData, { headers })
            .then((response) => {
                if (response.data.transcription) {
                    setTranscribedText(response.data.transcription);
                } else {
                    setError(true);
                    setErrorMessage(
                        "Sorry, couldn't get the translation, please try again later."
                    );
                    resetError();
                }
            })
            .catch((error) => {
                setError(true);
                if (error.message == "Network Error") {
                    setErrorMessage("Network error, please try again later.");
                } else {
                    setErrorMessage(error.message);
                }
                resetError();
            });
    };

    const uploadAudio = async (audioBlob: Blob) => {
        const formData = new FormData();
        formData.append("audio", audioBlob, "recording.wav");

        const headers = {
            "Content-Type": "multipart/form-data",
        };
        setLoading(true);
        try {
            apiClient
                .post("record/", formData, { headers })
                .then((response) => {
                    if (response.data.status == "success") {
                        setTranscribedText(response.data.transcription);
                        setLoading(false);
                    } else {
                        alert("Transcription failed. Please try again.");
                    }
                });
        } catch (error) {
            console.error("Error uploading audio:", error);
            alert("An error occurred while uploading.");
        }
    };
    return (
        <>
            <div className="border-t border-border py-8">
                <div className="w-full max-w-2xl mx-auto bg-card shadow-md rounded-lg p-6">
                    <h2 className="text-2xl font-bold text-card-foreground mb-6 text-center">
                        Speech to Text
                    </h2>
                    <h3 className="text-2xl font-bold text-card-foreground mb-6 text-center">
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
                                        recorderControl.stopRecording();
                                        setStopRecordingVisible(false);
                                    }}
                                >
                                    Stop Recording
                                </Button>
                            )}
                        </div>
                    </div>
                    <hr />
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
                        {/* {isLoading && (
                            <Progress value={60} className="w-[60%]" />
                        )} */}
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
        </>
    );
};

export default SpeechToTextRefined;
