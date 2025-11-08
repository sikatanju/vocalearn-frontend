import TextTranslation from "./TextTranslation";
// import SpeechToText from "./SpeechToText";
import "@/index.css";

const HomePage = () => {
    return (
        <div className="flex flex-col items-center min-h-screen bg-background text-foreground p-4 mt-2">
            <TextTranslation />
        </div>
    );
};

export default HomePage;
