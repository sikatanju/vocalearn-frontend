/* eslint-disable @typescript-eslint/no-unused-vars */
import apiClient from "@/services/apiClient";
import { useState } from "react";
import textLanguages from "@/data/text_languages";
import { Button } from "../ui/button";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "../ui/select";

const TextTranslation = () => {
    const [translationText, setTranslationText] = useState<string>("");

    const [targetLanguage, setTargetLanguage] = useState<string>("");

    const [translatedText, setTranslatedText] = useState<string>("");

    const handleTranslation = () => {
        let targetLang = targetLanguage;
        if (targetLanguage.endsWith("custom")) {
            targetLang = targetLanguage.replace("custom", "");
        }
        const requestData = {
            text: translationText,
            to: targetLang,
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
            <div className="w-full max-w-2xl bg-background shadow-lg rounded-lg p-6 mb-8 border-border">
                <h2 className="text-2xl font-semibold text-foreground mb-4">
                    Translation
                </h2>

                <textarea
                    className="w-full h-40 border bg-background text-foreground border-border rounded-lg p-2 focus:outline-none focus:border-accent"
                    placeholder="Enter text to translate..."
                    value={translationText}
                    onChange={(e) => setTranslationText(e.target.value)}
                />
                <div className="mt-4 flex items-center justify-between">
                    <Select onValueChange={(value) => setTargetLanguage(value)}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select a language" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Top Languages</SelectLabel>
                                <SelectItem value="arcustom">Arabic</SelectItem>
                                <SelectItem value="bncustom">Bangla</SelectItem>
                                <SelectItem value="encustom">
                                    English
                                </SelectItem>
                                <SelectItem value="frcustom">French</SelectItem>
                                <SelectItem value="jacustom">
                                    Japanese
                                </SelectItem>
                                <SelectItem value="kocustom">Korean</SelectItem>
                                <SelectItem value="rucustom">
                                    Russian
                                </SelectItem>
                                <SelectItem value="escustom">
                                    Spanish
                                </SelectItem>
                            </SelectGroup>
                            <SelectGroup>
                                <SelectLabel>All Languages</SelectLabel>
                                {textLanguages.map((lang) => (
                                    <SelectItem value={lang.language_code}>
                                        {lang.name}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <Button onClick={handleTranslation} className="text-sm">
                        Translate
                    </Button>
                </div>
                {translatedText && (
                    <div className="mt-4 p-4 bg-background text-foreground border-border rounded-lg">
                        <h3 className="text-lg font-semibold text-foreground">
                            Translated Text:
                        </h3>
                        <p className="text-secondary-foreground">
                            {translatedText}
                        </p>
                    </div>
                )}
            </div>
        </>
    );
};

export default TextTranslation;
