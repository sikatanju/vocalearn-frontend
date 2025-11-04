import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import {
    ArrowRight,
    Languages,
    Mic,
    Volume2,
    Globe,
    Zap,
    Shield,
    Star,
    CheckCircle2,
} from 'lucide-react';
import '@/index.css';

const LandingPage = () => {
    const { isAuthenticated } = useAuth();

    return (
        <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
            {/* Hero Section */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
                <div className="container mx-auto px-4 py-20 md:py-32">
                    <div className="flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20">
                            <Zap className="w-4 h-4" />
                            <span className="text-sm font-medium">
                                AI-Powered Language Learning
                            </span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
                            Master Languages with VocaLearn
                        </h1>

                        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl leading-relaxed">
                            Break language barriers with instant translation,
                            speech-to-text conversion, and AI-powered
                            pronunciation assessment across 150+ languages.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <Link
                                to={isAuthenticated ? '/translate' : '/signup'}
                            >
                                <Button
                                    size="lg"
                                    className="text-lg px-8 py-6 group"
                                >
                                    {isAuthenticated
                                        ? 'Start Translating'
                                        : 'Get Started Free'}
                                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                            <Link to="#features">
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="text-lg px-8 py-6"
                                >
                                    Explore Features
                                </Button>
                            </Link>
                        </div>

                        <div className="flex items-center gap-6 pt-8 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                                <span>No credit card required</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                                <span>150+ Languages</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                                <span>Instant Results</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
            </section>

            {/* Stats Section */}
            <section className="py-16 border-y border-border bg-muted/5">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div className="text-center">
                            <div className="text-4xl md:text-5xl font-bold text-primary">
                                150+
                            </div>
                            <div className="text-sm md:text-base text-muted-foreground mt-2">
                                Languages Supported
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl md:text-5xl font-bold text-primary">
                                10M+
                            </div>
                            <div className="text-sm md:text-base text-muted-foreground mt-2">
                                Translations
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl md:text-5xl font-bold text-primary">
                                99.9%
                            </div>
                            <div className="text-sm md:text-base text-muted-foreground mt-2">
                                Accuracy Rate
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl md:text-5xl font-bold text-primary">
                                24/7
                            </div>
                            <div className="text-sm md:text-base text-muted-foreground mt-2">
                                Available
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 md:py-32">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">
                            Everything You Need to Master Languages
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Powerful features designed to accelerate your
                            language learning journey
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {/* Feature 1: Translation */}
                        <Card className="relative group hover:shadow-2xl transition-all duration-300 border-2 hover:border-primary/50 overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <CardHeader>
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <Languages className="w-7 h-7 text-white" />
                                </div>
                                <CardTitle className="text-2xl">
                                    Instant Translation
                                </CardTitle>
                                <CardDescription className="text-base">
                                    Translate text between 150+ languages
                                    instantly with high accuracy
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-3 text-sm text-muted-foreground">
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                                        <span>
                                            Support for 150+ languages including
                                            Arabic, Chinese, Spanish, French
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                                        <span>
                                            Real-time translation with context
                                            awareness
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                                        <span>
                                            Save and review your translation
                                            history
                                        </span>
                                    </li>
                                </ul>
                                <Link to="/translate">
                                    <Button
                                        variant="ghost"
                                        className="w-full mt-6 group/btn"
                                    >
                                        Try Translation
                                        <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>

                        {/* Feature 2: Speech to Text */}
                        <Card className="relative group hover:shadow-2xl transition-all duration-300 border-2 hover:border-primary/50 overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <CardHeader>
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <Mic className="w-7 h-7 text-white" />
                                </div>
                                <CardTitle className="text-2xl">
                                    Speech to Text
                                </CardTitle>
                                <CardDescription className="text-base">
                                    Convert audio to text in 100+ languages with
                                    precision
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-3 text-sm text-muted-foreground">
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                                        <span>
                                            Record live or upload audio files
                                            (WAV, PCM formats)
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                                        <span>
                                            Advanced noise cancellation and echo
                                            suppression
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                                        <span>
                                            Multi-language recognition in one
                                            recording
                                        </span>
                                    </li>
                                </ul>
                                <Link to="/speech-to-text">
                                    <Button
                                        variant="ghost"
                                        className="w-full mt-6 group/btn"
                                    >
                                        Try Speech to Text
                                        <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>

                        {/* Feature 3: Pronunciation Assessment */}
                        <Card className="relative group hover:shadow-2xl transition-all duration-300 border-2 hover:border-primary/50 overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <CardHeader>
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <Volume2 className="w-7 h-7 text-white" />
                                </div>
                                <CardTitle className="text-2xl">
                                    Pronunciation Assessment
                                </CardTitle>
                                <CardDescription className="text-base">
                                    Get AI-powered feedback on your
                                    pronunciation accuracy
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-3 text-sm text-muted-foreground">
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                                        <span>
                                            Detailed scoring: accuracy, fluency,
                                            prosody, completeness
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                                        <span>
                                            Visual feedback with interactive
                                            charts
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                                        <span>
                                            Compare your audio with reference
                                            text
                                        </span>
                                    </li>
                                </ul>
                                <Link to="/pronunciation-assessment">
                                    <Button
                                        variant="ghost"
                                        className="w-full mt-6 group/btn"
                                    >
                                        Try Assessment
                                        <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Why Choose VocaLearn Section */}
            <section className="py-20 md:py-32 bg-muted/5 border-y border-border">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">
                            Why Choose VocaLearn?
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            The most comprehensive language learning platform
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <Globe className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold mb-2">
                                    Global Coverage
                                </h3>
                                <p className="text-muted-foreground">
                                    Access to 150+ languages including major
                                    languages and regional dialects
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <Zap className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold mb-2">
                                    Lightning Fast
                                </h3>
                                <p className="text-muted-foreground">
                                    Get instant results with our optimized AI
                                    processing engine
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <Shield className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold mb-2">
                                    Privacy First
                                </h3>
                                <p className="text-muted-foreground">
                                    Your data is encrypted and never shared with
                                    third parties
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <Star className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold mb-2">
                                    Premium Quality
                                </h3>
                                <p className="text-muted-foreground">
                                    Industry-leading accuracy powered by
                                    advanced AI models
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <CheckCircle2 className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold mb-2">
                                    Easy to Use
                                </h3>
                                <p className="text-muted-foreground">
                                    Intuitive interface designed for seamless
                                    user experience
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <Mic className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold mb-2">
                                    Multiple Formats
                                </h3>
                                <p className="text-muted-foreground">
                                    Support for text, audio, and file uploads
                                    across all features
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 md:py-32">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <Card className="relative overflow-hidden border-2">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10"></div>
                            <CardContent className="relative p-12 text-center">
                                <h2 className="text-3xl md:text-5xl font-bold mb-6">
                                    Ready to Break Language Barriers?
                                </h2>
                                <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                                    Join thousands of learners using VocaLearn
                                    to master new languages. Start your journey
                                    today - it's free!
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Link
                                        to={
                                            isAuthenticated
                                                ? '/translate'
                                                : '/signup'
                                        }
                                    >
                                        <Button
                                            size="lg"
                                            className="text-lg px-8 py-6 group"
                                        >
                                            {isAuthenticated
                                                ? 'Go to Dashboard'
                                                : 'Create Free Account'}
                                            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                    </Link>
                                    {!isAuthenticated && (
                                        <Link to="/login">
                                            <Button
                                                size="lg"
                                                variant="outline"
                                                className="text-lg px-8 py-6"
                                            >
                                                Sign In
                                            </Button>
                                        </Link>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-border py-12 bg-muted/5">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-4 gap-8 mb-8">
                        <div>
                            <h3 className="text-lg font-semibold mb-4">
                                VocaLearn
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Breaking language barriers with AI-powered tools
                                for translation, transcription, and
                                pronunciation.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Features</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li>
                                    <Link
                                        to="/translate"
                                        className="hover:text-primary transition-colors"
                                    >
                                        Translation
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/speech-to-text"
                                        className="hover:text-primary transition-colors"
                                    >
                                        Speech to Text
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/pronunciation-assessment"
                                        className="hover:text-primary transition-colors"
                                    >
                                        Pronunciation
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Resources</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li>
                                    <a
                                        href="#"
                                        className="hover:text-primary transition-colors"
                                    >
                                        Documentation
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="hover:text-primary transition-colors"
                                    >
                                        API
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="hover:text-primary transition-colors"
                                    >
                                        Support
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Company</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li>
                                    <a
                                        href="#"
                                        className="hover:text-primary transition-colors"
                                    >
                                        About
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="hover:text-primary transition-colors"
                                    >
                                        Privacy
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="hover:text-primary transition-colors"
                                    >
                                        Terms
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
                        <p>
                            © {new Date().getFullYear()} VocaLearn. All rights
                            reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
