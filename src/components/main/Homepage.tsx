import React, { useState } from "react";

const HomePage: React.FC = () => {
    const [translationText, setTranslationText] = useState<string>("");
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);

    const handleTranslation = () => {
        alert(`Translating: ${translationText}`);
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
                Translation & Pronunciation Feedback
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
                <button
                    onClick={handleTranslation}
                    className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
                >
                    Translate
                </button>
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
