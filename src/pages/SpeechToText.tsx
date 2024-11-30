import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import "@/index.css";
import apiClient from "@/services/apiClient";
import { AlertCircle } from "lucide-react";
import { useState } from "react";

const SpeechToText = () => {
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [transcribedText, setTranscribedText] = useState<string>("");
    const [fileError, setFileError] = useState<boolean>(false);

    const isFileEmpty = (
        event: React.ChangeEvent<HTMLInputElement>
    ): boolean => {
        if (!event.target.files || event.target.files.length === 0) {
            return true;
        }
        return false;
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
            <div className="border-t border-border py-8">
                <div className="w-full max-w-2xl mx-auto bg-card shadow-md rounded-lg p-6">
                    <h2 className="text-2xl font-bold text-card-foreground mb-6 text-center">
                        Speech to Text
                    </h2>
                    <div className="flex flex-col items-center space-y-6">
                        <input
                            required
                            type="file"
                            accept="audio/*"
                            onChange={handleFileUpload}
                            className="w-64 max-w-md text-sm text-card-foreground bg-input border border-border rounded-lg cursor-pointer focus:outline-none focus:ring focus:ring-accent focus:ring-opacity-50 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-primary file:text-primary-foreground file:cursor-pointer hover:file:bg-opacity-90"
                        />
                        {fileError && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>
                                    Please choose a file
                                </AlertDescription>
                            </Alert>
                        )}
                        <Button
                            onClick={() => handleSpeechToText()}
                            className="w-64 max-w-xs bg-primary text-primary-foreground font-medium px-4 py-2 rounded-lg shadow-sm hover:bg-opacity-90 focus:ring focus:ring-accent focus:ring-opacity-50 transition"
                        >
                            Transcribe
                        </Button>
                        {uploadedFile && (
                            <p className="mt-4 text-sm text-muted-foreground">
                                Uploaded File:{" "}
                                <span className="font-medium text-card-foreground">
                                    {uploadedFile.name}
                                </span>
                            </p>
                        )}
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

export default SpeechToText;
