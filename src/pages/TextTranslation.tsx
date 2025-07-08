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
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import LoaderComponent from "@/components/LoaderComponent";
import "@/index.css";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface TranslationResult {
    from: string;
    to: string;
    lang: string;
}

const TextTranslation = () => {
    const [translationText, setTranslationText] = useState<string>("");
    const [targetLanguage, setTargetLanguage] = useState<string>("");
    const [translatedText, setTranslatedText] = useState<string>("");

    const [isLoading, setLoading] = useState<boolean>(false);
    const [isError, setError] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");

    const [translationList, setTranslationList] = useState<TranslationResult[]>(
        []
    );

    const updateTranslationList = (to_text: string, targetLang: string) => {
        const newTranslation = {
            from: translationText,
            to: to_text,
            lang:
                textLanguages.find((ln) => ln.language_code === targetLang)
                    ?.name || targetLang,
        };
        setTranslationList((prevList) => {
            const updatedList = [newTranslation, ...prevList];
            return updatedList.splice(0, 5);
        });
    };
    const resetError = () => {
        setTimeout(() => {
            setError(false);
            setErrorMessage("");
        }, 5000);
    };

    const handleTranslation = () => {
        let targetLang = targetLanguage;
        if (translationText.length <= 2) {
            setError(true);
            setErrorMessage("Please give a word or sentence to translate.");
            resetError();
            return;
        }
        if (targetLanguage.length <= 0) {
            setError(true);
            setErrorMessage("Please select a language for translation.");
            resetError();
            return;
        }
        setLoading(true);
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
                    updateTranslationList(
                        response.data.translation,
                        targetLang
                    );
                } else {
                    setError(true);
                    resetError();
                }
            })
            .catch((error) => {
                setError(true);
                if (error.message == "Network Error")
                    setErrorMessage("Network error, please try again later.");
                else setErrorMessage(error.message);
                resetError();
            })
            .finally(() => setLoading(false));
    };

    return (
        <>
            <h3 className="text-xl font-bold text-card-foreground mb-6 text-center">
                Text Translation
            </h3>
            <div className="w-full max-w-2xl bg-card shadow-lg rounded-lg p-6 mb-8 border border-border">
                <h2 className="text-xl font-semibold text-card-foreground mb-4">
                    Translation
                </h2>

                <textarea
                    className="w-full h-40 border border-border bg-input text-foreground rounded-lg p-2 focus:outline-none focus:border-accent"
                    placeholder="Enter text to translate..."
                    value={translationText}
                    onChange={(e) => {
                        setTranslationText(e.target.value);
                    }}
                />
                <div className="mt-4 flex items-center justify-between">
                    <Select onValueChange={(value) => setTargetLanguage(value)}>
                        <SelectTrigger className="w-auto sm:w-[180px] bg-input text-foreground border border-border rounded-md p-2 focus:ring focus:ring-accent focus:ring-opacity-50">
                            <SelectValue placeholder="Select Language" />
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
                    <div className="mt-5 p-4 bg-muted text-muted-foreground border border-border rounded-lg">
                        <h3 className="text-lg font-semibold">
                            Translated Text:
                        </h3>
                        <p className="mt-2">{translatedText}</p>
                    </div>
                )}

                {isLoading && (
                    <div className="flex flex-col items-center space-y-6 mt-3">
                        <LoaderComponent isLoading={isLoading} />
                    </div>
                )}
                <div className="mt-3 w-2/3">
                    {isError && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{errorMessage}</AlertDescription>
                        </Alert>
                    )}
                </div>
            </div>
            {translationList.length > 0 && (
                <div className="w-full max-w-2xl md:w-1/2">
                    <h3 className="text-xl font-bold text-card-foreground mb-6 text-left">
                        Last 5 translation
                    </h3>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Text for Translation</TableHead>
                                <TableHead>Target Language</TableHead>
                                <TableHead>Translated Text</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {translationList &&
                                translationList.map((obj) => (
                                    <TableRow key={obj.from}>
                                        <TableCell>{obj.from}</TableCell>
                                        <TableCell>{obj.lang}</TableCell>
                                        <TableCell>{obj.to}</TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </>
    );
};

export default TextTranslation;
