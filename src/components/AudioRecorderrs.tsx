import { useState } from "react";
import { AudioRecorder } from "react-audio-voice-recorder";
import apiClient from "@/services/apiClient";
import { Button } from "./ui/button";

const AudioRecorderrs = () => {
    const [savedAudios, setSavedAudios] = useState<string[]>([]);
    const [text, setText] = useState<string>();

    const addAudioElement = (blob: Blob) => {
        const url = URL.createObjectURL(blob);
        setSavedAudios((prev) => [url, ...prev]);
        uploadAudio(blob);
    };

    const uploadAudio = async (audioBlob: Blob) => {
        const formData = new FormData();
        formData.append("audio", audioBlob, "recording.wav");

        const headers = {
            "Content-Type": "multipart/form-data",
        };

        try {
            apiClient
                .post("record/", formData, { headers })
                .then((response) => {
                    if (response.data.status) {
                        setText(response.data.status);
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
                    <div className="flex flex-col items-center space-y-6">
                        <div className="w-full max-w-xs flex items-center justify-center">
                            <AudioRecorder
                                onRecordingComplete={addAudioElement}
                                audioTrackConstraints={{
                                    noiseSuppression: true,
                                    echoCancellation: true,
                                    channelCount: 1,
                                    sampleRate: 96000,
                                }}
                                onNotAllowedOrFound={(err) =>
                                    console.table(err)
                                }
                                downloadOnSavePress={false}
                                downloadFileExtension="wav"
                                mediaRecorderOptions={{
                                    audioBitsPerSecond: 320000,
                                }}
                                showVisualizer={true}
                            />
                        </div>

                        <Button
                            onClick={() => uploadAudio}
                            className="w-64 max-w-xs bg-primary text-primary-foreground font-medium px-4 py-2 rounded-lg shadow-sm hover:bg-opacity-90 focus:ring focus:ring-accent focus:ring-opacity-50 transition"
                        >
                            Transcribe
                        </Button>

                        <div className="w-full max-w-md mt-6 p-4 bg-muted border border-border rounded-lg shadow-sm">
                            <h3 className="text-lg font-semibold text-card-foreground mb-2">
                                Saved Audios:
                            </h3>
                            {savedAudios.length === 0 ? (
                                <p className="text-muted-foreground">
                                    No audio recordings saved yet.
                                </p>
                            ) : (
                                <ul className="space-y-2">
                                    {savedAudios.map((audioUrl, index) => (
                                        <li
                                            key={index}
                                            className="p-2 bg-card shadow rounded border border-border"
                                        >
                                            <audio
                                                controls
                                                src={audioUrl}
                                                className="w-full"
                                            />
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        {text && (
                            <div className="w-full max-w-md mt-6 p-4 bg-muted border border-border rounded-lg shadow-sm">
                                <h3 className="text-lg font-semibold text-card-foreground mb-2">
                                    Transcribed Text:
                                </h3>
                                <p className="text-sm text-secondary-foreground leading-relaxed">
                                    {text}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default AudioRecorderrs;
