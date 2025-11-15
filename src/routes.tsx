import { createBrowserRouter } from 'react-router-dom';
import ErrorPage from './pages/ErrorPage';
import Layout from './pages/Layout';
import SpeechToText from './pages/transcription/SpeechToText';
import AllTranscriptions from './pages/transcription/AllTranscriptions';
import PronunciationAssesment from './pages/pronunciation/PronunciationAssesment';
import AllPronunciationAssessments from './pages/pronunciation/AllPronunciationAssessments';
import LoginPage from './pages/Auth/LoginPage';
import SignupPage from './pages/Auth/SignupPage';
import ProfilePage from './pages/ProfilePage';
import LandingPage from './pages/LandingPage';
import TextTranslation from './pages/Translations/TextTranslation';
import AllTranslationsPage from './pages/Translations/AllTranslationsPage';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        errorElement: <ErrorPage />,
        children: [
            { index: true, element: <LandingPage /> },
            { path: '/translate', element: <TextTranslation /> },
            { path: '/translations', element: <AllTranslationsPage /> },
            { path: '/speech-to-text', element: <SpeechToText /> },
            { path: '/transcriptions', element: <AllTranscriptions /> },
            {
                path: '/pronunciation-assessment',
                element: <PronunciationAssesment />,
            },
            {
                path: '/pronunciation-assessments',
                element: <AllPronunciationAssessments />,
            },
            { path: '/profile', element: <ProfilePage /> },
        ],
    },
    { path: '/login', element: <LoginPage /> },
    { path: '/signup', element: <SignupPage /> },
]);

export default router;
