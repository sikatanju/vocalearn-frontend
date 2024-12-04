/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import { AudioRecorder } from "react-audio-voice-recorder";
import apiClient from "@/services/apiClient";
import { Button } from "./ui/button";

const RecordAudio = () => {
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
        <div className="flex flex-col items-center space-y-6">
            <div className="w-full max-w-xs flex items-center justify-center">
                <AudioRecorder
                    onRecordingComplete={addAudioElement}
                    audioTrackConstraints={{
                        noiseSuppression: true,
                        echoCancellation: true,
                        channelCount: 1,
                        sampleRate: 48000,
                    }}
                    onNotAllowedOrFound={(err) => console.table(err)}
                    downloadOnSavePress={false}
                    downloadFileExtension="wav"
                    mediaRecorderOptions={{
                        audioBitsPerSecond: 320000,
                    }}
                    showVisualizer={true}
                />
            </div>
        </div>
    );
};

export default RecordAudio;
