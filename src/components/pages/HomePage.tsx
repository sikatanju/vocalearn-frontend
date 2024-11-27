/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import textLanguages from "@/data/text_languages";
import apiClient from "@/services/apiClient";

const HomePage: React.FC = () => {
    const [translationText, setTranslationText] = useState<string>("");
    const [targetLanguage, setTargetLanguage] = useState<string>("ar");
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [translatedText, setTranslatedText] = useState<string>("");
    const [transcribedText, setTranscribedText] = useState<string>("");

    const handleTranslation = () => {
        const requestData = {
            text: translationText,
            to: targetLanguage,
        };

        apiClient
            .post("translate/", requestData)
            .then((response) => {
                if (response.data.translation) {
                    setTranslatedText(response.data.translation);
                } else {
                    alert("Translation failed. Please try again.");
                }
            })
            .catch((error) => {
                console.error("Error:", error);
                alert("An error occurred while translating.");
            });
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setUploadedFile(file);
            handleSpeechToText(file);
        }
    };

    const handleSpeechToText = (file: File) => {
        const formData = new FormData();
        formData.append("audio", file);

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

    const handleRecord = () => {
        alert("Start recording...");
    };

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4">
            <h1 className="text-4xl font-bold text-gray-800 mb-8">VocaLearn</h1>
            <h3 className="text-xl font-bold text-gray-800 mb-8">
                Translation & Pronunciation Feedback
            </h3>
            <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-6 mb-8">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                    Translation
                </h2>

                <textarea
                    className="w-full h-40 border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-500"
                    placeholder="Enter text to translate..."
                    value={translationText}
                    onChange={(e) => setTranslationText(e.target.value)}
                />
                <div className="mt-4 flex items-center justify-between">
                    <select
                        value={targetLanguage}
                        onChange={(e) => setTargetLanguage(e.target.value)}
                        className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-500"
                    >
                        {textLanguages.map((lang) => (
                            <option value={lang.language_code}>
                                {lang.name}
                            </option>
                        ))}
                    </select>
                    <button
                        onClick={handleTranslation}
                        className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
                    >
                        Translate
                    </button>
                </div>
                {translatedText && (
                    <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                        <h3 className="text-lg font-semibold text-gray-600">
                            Translated Text:
                        </h3>
                        <p className="text-gray-800">{translatedText}</p>
                    </div>
                )}
            </div>

            {/* Pronunciation Feedback Section */}
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
                        onClick={handleRecord}
                        className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition"
                    >
                        Record Pronunciation
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
        </div>
    );
};

export default HomePage;
