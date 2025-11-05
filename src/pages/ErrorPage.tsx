import { isRouteErrorResponse, useRouteError } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Home, ArrowLeft, Navigation } from 'lucide-react';
import Navbar from '../components/Navbar';

const ErrorPage = () => {
    const error = useRouteError();

    return (
        <>
            <Navbar />
            <div className="min-h-screen flex justify-center items-start mt-36 bg-background from-secondary to-muted">
                <Card className="w-full max-w-md border shadow-lg bg-background">
                    <CardContent className="p-8 text-center space-y-6">
                        {/* Elegant 404 Number */}
                        <div className="relative">
                            <div className="text-8xl font-light text-foreground tracking-tighter font-serif">
                                404
                            </div>
                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full animate-pulse"></div>
                        </div>

                        {/* Error Message */}
                        <div className="space-y-3">
                            <h1 className="text-xl font-semibold text-foreground">
                                {isRouteErrorResponse(error)
                                    ? 'Page not found'
                                    : 'Something went wrong'}
                            </h1>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                {isRouteErrorResponse(error)
                                    ? "The page you're looking for doesn't exist or has been moved."
                                    : 'An unexpected error has occurred. Please try again.'}
                            </p>
                        </div>

                        {/* Decorative Line */}
                        <div className="flex justify-center">
                            <div className="w-16 h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-3 pt-4">
                            <Button
                                className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                                asChild
                            >
                                <a href="/">
                                    <Home className="w-4 h-4" />
                                    Back to Home
                                </a>
                            </Button>
                            <Button
                                variant="outline"
                                className="gap-2 border-border text-foreground hover:bg-secondary"
                                onClick={() => window.history.back()}
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Go Back
                            </Button>
                        </div>

                        {/* Subtle Footer Text */}
                        <div className="pt-4">
                            <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                                <Navigation className="w-3 h-3" />
                                Navigate safely
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
};

export default ErrorPage;
