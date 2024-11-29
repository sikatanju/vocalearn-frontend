import apiClient from "@/services/apiClient";
import { useState } from "react";
import { Button } from "../ui/button";
import "./global.css";

const SpeechToText = () => {
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [transcribedText, setTranscribedText] = useState<string>("");

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setUploadedFile(file);
        }
    };

    const handleSpeechToText = () => {
        const formData = new FormData();
        if (uploadedFile != null) formData.append("audio", uploadedFile);

        const headers = {
            "Content-Type": "multipart/form-data",
        };

        apiClient
            .post("speech/", formData, { headers })
            .then((response) => {
                if (response.data.transcription) {
                    setTranscribedText(response.data.transcription);
                } else {
                    alert("Transcription failed. Please try again.");
                }
            })
            .catch((error) => {
                console.error("Error:", error);
                alert("An error occurred while transcribing.");
            });
    };

    return (
        <>
            <div className="border-gray-200">
                <div className="w-full max-w-2xl bg-background shadow-lg rounded-lg p-6 border-border">
                    <h2 className="text-2xl font-semibold text-foreground mb-4">
                        Speech to Text
                    </h2>
                    <div className="flex flex-col items-center">
                        <input
                            type="file"
                            accept="audio/*"
                            onChange={handleFileUpload}
                            className="mb-4 border border-gray-300 rounded-lg p-2"
                        />
                        <Button onClick={() => handleSpeechToText()}>
                            Transcribe
                        </Button>
                        {uploadedFile && (
                            <p className="mt-4 text-secondary-foreground">
                                Uploaded File: {uploadedFile.name}
                            </p>
                        )}
                        {transcribedText && (
                            <div className="mt-4 p-4 bg-background border border-border rounded-lg">
                                <h3 className="text-lg font-semibold text-foreground">
                                    Transcribed Text:
                                </h3>
                                <p className="text-secondary-foreground">
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

export default SpeechToText;
