/* eslint-disable @typescript-eslint/no-unused-vars */
import { createBrowserRouter } from "react-router-dom";
import ErrorPage from "./pages/ErrorPage";
import HomePage from "./pages/HomePage";
import SpeechToText from "./pages/SpeechToText";
import Layout from "./pages/Layout";
import SpeechToTextRefined from "./pages/SpeechToTextRefined";
import AudioRecorderrs from "./components/AudioRecorderrs";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        errorElement: <ErrorPage />,
        children: [
            { index: true, element: <HomePage /> },
            { path: "/speech-to-text", element: <SpeechToTextRefined /> },
        ],
    },
]);

export default router;
