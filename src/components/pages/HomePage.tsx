/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import TextTranslation from "./TextTranslation";
import SpeechToText from "./SpeechToText";

const HomePage: React.FC = () => {
    return (
        <>
            <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4">
                <h1 className="text-4xl font-bold text-gray-800 mb-8">
                    VocaLearn
                </h1>
                <h3 className="text-xl font-bold text-gray-800 mb-8">
                    Translation & Pronunciation Feedback
                </h3>
                <TextTranslation />
                <SpeechToText />
            </div>
        </>
    );
};

export default HomePage;
