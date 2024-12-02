/* eslint-disable @typescript-eslint/no-unused-vars */
import apiClient from "@/services/apiClient";
import { useState } from "react";
import textLanguages from "@/data/text_languages";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectGroup,
    SelectLabel,
    SelectItem,
} from "@/components/ui/select";

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
            <div className="w-full max-w-2xl bg-card shadow-lg rounded-lg p-6 mb-8 border border-border">
                <h2 className="text-2xl font-semibold text-card-foreground mb-4">
                    Translation
                </h2>

                <textarea
                    className="w-full h-40 border border-border bg-input text-foreground rounded-lg p-2 focus:outline-none focus:border-accent"
                    placeholder="Enter text to translate..."
                    value={translationText}
                    onChange={(e) => setTranslationText(e.target.value)}
                />
                <div className="mt-4 flex items-center justify-between">
                    <Select onValueChange={(value) => setTargetLanguage(value)}>
                        <SelectTrigger className="w-[180px] bg-input text-foreground border border-border rounded-md p-2 focus:ring focus:ring-accent focus:ring-opacity-50">
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
                                    <SelectItem
                                        value={lang.language_code}
                                        key={lang.language_code}
                                        className="hover:bg-purple-700"
                                    >
                                        {lang.name}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <Button
                        onClick={handleTranslation}
                        className="bg-primary text-primary-foreground text-sm px-4 py-2 rounded-lg hover:bg-opacity-90 focus:ring focus:ring-primary focus:ring-opacity-50"
                    >
                        Translate
                    </Button>
                </div>
                {translatedText && (
                    <div className="mt-4 p-4 bg-muted text-muted-foreground border border-border rounded-lg">
                        <h3 className="text-lg font-semibold">
                            Translated Text:
                        </h3>
                        <p className="mt-2">{translatedText}</p>
                    </div>
                )}
            </div>
        </>
    );
};

export default TextTranslation;

/*
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
*/
