import { createBrowserRouter } from 'react-router-dom';
import ErrorPage from './pages/ErrorPage';
import Layout from './pages/Layout';
import SpeechToTextRefined from './pages/SpeechToTextRefined';
import PronunciationAssesment from './pages/PronunciationAssesment';
import LoginPage from './pages/Auth/LoginPage';
import SignupPage from './pages/Auth/SignupPage';
import ProfilePage from './pages/ProfilePage';
import LandingPage from './pages/LandingPage';
import TextTranslation from './pages/TextTranslation';
import AllTranslationsPage from './pages/AllTranslationsPage';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        errorElement: <ErrorPage />,
        children: [
            { index: true, element: <LandingPage /> },
            { path: '/translate', element: <TextTranslation /> },
            { path: '/translations', element: <AllTranslationsPage /> },
            { path: '/speech-to-text', element: <SpeechToTextRefined /> },
            {
                path: '/pronunciation-assessment',
                element: <PronunciationAssesment />,
            },
            { path: '/profile', element: <ProfilePage /> },
        ],
    },
    { path: '/login', element: <LoginPage /> },
    { path: '/signup', element: <SignupPage /> },
]);

export default router;
