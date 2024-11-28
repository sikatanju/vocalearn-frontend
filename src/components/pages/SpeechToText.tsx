import apiClient from "@/services/apiClient";
import { useState } from "react";

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
    // const handleRecord = () => {
    //     alert("Start recording...");
    // };

    return (
        <>
            <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-6">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                    Pronunciation Feedback
                </h2>
                <div className="flex flex-col items-center">
                    <input
                        type="file"
                        accept="audio/*"
                        onChange={handleFileUpload}
                        className="mb-4 border border-gray-300 rounded-lg p-2"
                    />
                    <button
                        onClick={() => handleSpeechToText()}
                        className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition"
                    >
                        transcribe
                    </button>
                    {uploadedFile && (
                        <p className="mt-4 text-gray-600">
                            Uploaded File: {uploadedFile.name}
                        </p>
                    )}
                    {transcribedText && (
                        <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                            <h3 className="text-lg font-semibold text-gray-600">
                                Transcribed Text:
                            </h3>
                            <p className="text-gray-800">{transcribedText}</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default SpeechToText;
