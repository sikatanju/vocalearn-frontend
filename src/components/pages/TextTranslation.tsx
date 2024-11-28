import apiClient from "@/services/apiClient";
import { useState } from "react";
import textLanguages from "@/data/text_languages";
import { Button } from "../ui/button";

const TextTranslation = () => {
    const [translationText, setTranslationText] = useState<string>("");

    const [targetLanguage, setTargetLanguage] = useState<string>("ar");

    const [translatedText, setTranslatedText] = useState<string>("");

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

    return (
        <>
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
                    <Button onClick={handleTranslation}>Translate</Button>
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
        </>
    );
};

export default TextTranslation;
