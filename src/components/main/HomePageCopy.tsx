/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import axios from "axios";

const HomePage: React.FC = () => {
    const [translationText, setTranslationText] = useState<string>("");
    const [targetLanguage, setTargetLanguage] = useState<string>("ar");
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [translatedText, setTranslatedText] = useState<string>("");

    const handleTranslation = () => {
        const requestData = {
            text: translationText,
            to: targetLanguage,
        };

        axios
            .post("http://127.0.0.1:8000/vocalearn/translate/", requestData, {
                headers: {
                    "Content-Type": "application/json",
                },
            })
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
        }
    };

    const handleRecord = () => {
        alert("Start recording...");
    };

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4">
            <h1 className="text-4xl font-bold text-gray-800 mb-8">
                VocaLearn - Translation & Pronunciation Feedback
            </h1>

            {/* Translation Section */}
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
                    {/* Language Selector */}
                    <select
                        value={targetLanguage}
                        onChange={(e) => setTargetLanguage(e.target.value)}
                        className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-500"
                    >
                        <option value="ar">Arabic</option>
                        <option value="bn">Bangla</option>
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="ja">Japan</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                        <option value="zh-Hans">Chinese (Simplified)</option>
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
                </div>
            </div>
        </div>
    );
};

export default HomePage;
