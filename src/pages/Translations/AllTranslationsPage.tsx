import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getSavedTranslations, SavedItem } from '@/services/savedItemsService';
import { languageCodeToNameMap } from '@/data/text_languages';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
    Search,
    ArrowLeft,
    Languages,
    AlertCircle,
    Trash2,
    Copy,
    CheckCircle2,
} from 'lucide-react';
import apiClient from '@/services/apiClient';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface TranslationItem {
    id: string;
    originalText: string;
    translatedText: string;
    language: string;
    languageCode: string;
    createdAt: string;
}

const AllTranslationsPage = () => {
    const { isAuthenticated, isLoading: authLoading } = useAuth();
    const navigate = useNavigate();

    const [translations, setTranslations] = useState<TranslationItem[]>([]);
    const [filteredTranslations, setFilteredTranslations] = useState<
        TranslationItem[]
    >([]);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [copiedId, setCopiedId] = useState<string | null>(null);

    useEffect(() => {
        // Wait for auth to finish loading before checking authentication
        if (authLoading) {
            return;
        }

        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        fetchAllTranslations();
    }, [isAuthenticated, authLoading, navigate]);

    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredTranslations(translations);
        } else {
            const query = searchQuery.toLowerCase();
            const filtered = translations.filter(
                (item) =>
                    item.originalText.toLowerCase().includes(query) ||
                    item.translatedText.toLowerCase().includes(query) ||
                    item.language.toLowerCase().includes(query)
            );
            setFilteredTranslations(filtered);
        }
    }, [searchQuery, translations]);

    const fetchAllTranslations = async () => {
        setIsLoading(true);
        setError('');
        try {
            const response = await getSavedTranslations();
            const translationItems: TranslationItem[] = response.items.map(
                (item: SavedItem) => ({
                    id: item.id,
                    originalText: item.content.text || '',
                    translatedText: item.content.translation || '',
                    language:
                        languageCodeToNameMap.get(item.target_language || '') ||
                        item.target_language ||
                        'Unknown',
                    languageCode: item.target_language || '',
                    createdAt: item.created_at,
                })
            );
            setTranslations(translationItems);
            setFilteredTranslations(translationItems);
        } catch (err) {
            console.error('Failed to fetch translations:', err);
            setError(
                'Failed to load your translations. Please try again later.'
            );
        } finally {
            setIsLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMs = now.getTime() - date.getTime();
        const diffInHours = diffInMs / (1000 * 60 * 60);

        if (diffInHours < 24) {
            return date.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
            });
        } else if (diffInHours < 24 * 7) {
            return date.toLocaleDateString('en-US', {
                weekday: 'short',
                hour: '2-digit',
                minute: '2-digit',
            });
        } else {
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
            });
        }
    };

    const handleCopy = async (text: string, id: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedId(id);
            setTimeout(() => setCopiedId(null), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const handleDelete = (id: string) => {
        const prevTranslations = translations;
        setTranslations((prev) => prev.filter((item) => item.id !== id));
        apiClient
            .delete(`saved-items/${id}/`)
            .then(() => {})
            .catch((e) => {
                console.log(e);
                setTranslations(prevTranslations);
            });
    };

    // Show loading state while auth is being checked
    if (authLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-muted-foreground">Loading...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                {/* Header Section */}
                <div className="mb-8">
                    <Button
                        variant="ghost"
                        onClick={() => navigate('/translate')}
                        className="mb-4 group"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                        Back to Translation
                    </Button>

                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                            <Languages className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                                My Translations
                            </h1>
                            <p className="text-muted-foreground">
                                View and manage all your saved translations
                            </p>
                        </div>
                    </div>
                </div>

                {/* Search Bar */}
                <Card className="mb-6">
                    <CardContent className="pt-6">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Search translations by text or language..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 h-12 text-base"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Error Alert */}
                {error && (
                    <Alert variant="destructive" className="mb-6">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {/* Main Content */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <span>
                                {isLoading
                                    ? 'Loading...'
                                    : `${
                                          filteredTranslations.length
                                      } Translation${
                                          filteredTranslations.length !== 1
                                              ? 's'
                                              : ''
                                      }`}
                            </span>
                            {!isLoading && translations.length > 0 && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={fetchAllTranslations}
                                >
                                    Refresh
                                </Button>
                            )}
                        </CardTitle>
                        <CardDescription>
                            {searchQuery && !isLoading && (
                                <span>Showing results for "{searchQuery}"</span>
                            )}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-16">
                                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                                <p className="text-muted-foreground">
                                    Loading your translations...
                                </p>
                            </div>
                        ) : filteredTranslations.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 text-center">
                                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
                                    <Languages className="w-10 h-10 text-muted-foreground" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">
                                    {searchQuery
                                        ? 'No translations found'
                                        : 'No translations yet'}
                                </h3>
                                <p className="text-muted-foreground mb-6 max-w-md">
                                    {searchQuery
                                        ? 'Try adjusting your search query'
                                        : 'Start translating text to see your history here'}
                                </p>
                                {!searchQuery && (
                                    <Button
                                        onClick={() => navigate('/translate')}
                                        className="group"
                                    >
                                        Start Translating
                                        <Languages className="w-4 h-4 ml-2" />
                                    </Button>
                                )}
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[35%]">
                                                Original Text
                                            </TableHead>
                                            <TableHead className="w-[15%]">
                                                Language
                                            </TableHead>
                                            <TableHead className="w-[35%]">
                                                Translation
                                            </TableHead>
                                            <TableHead className="w-[10%]">
                                                Date
                                            </TableHead>
                                            <TableHead className="w-[5%] text-right">
                                                Actions
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredTranslations.map((item) => (
                                            <TableRow
                                                key={item.id}
                                                className="group hover:bg-muted/50"
                                            >
                                                <TableCell className="font-medium">
                                                    <div className="flex items-start gap-2">
                                                        <p className="line-clamp-2">
                                                            {item.originalText}
                                                        </p>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                                            <Languages className="w-4 h-4 text-primary" />
                                                        </div>
                                                        <span className="text-sm font-medium">
                                                            {item.language}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-start justify-between gap-2">
                                                        <p className="line-clamp-2 flex-1">
                                                            {
                                                                item.translatedText
                                                            }
                                                        </p>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 h-8 w-8 p-0"
                                                            onClick={() =>
                                                                handleCopy(
                                                                    item.translatedText,
                                                                    item.id
                                                                )
                                                            }
                                                        >
                                                            {copiedId ===
                                                            item.id ? (
                                                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                                                            ) : (
                                                                <Copy className="w-4 h-4" />
                                                            )}
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-sm text-muted-foreground">
                                                    {formatDate(item.createdAt)}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <AlertDialog>
                                                        <AlertDialogTrigger>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0 text-destructive hover:text-destructive"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>
                                                                    Are you sure
                                                                    you want to
                                                                    delete this
                                                                    translation
                                                                    ?
                                                                </AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    This action
                                                                    cannot be
                                                                    undone. This
                                                                    will delete
                                                                    the
                                                                    translation.
                                                                    Proceed with
                                                                    caution.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>
                                                                    Cancel
                                                                </AlertDialogCancel>
                                                                <AlertDialogAction
                                                                    className="bg-destructive text-gray-100 hover:text-gray-300 hover:bg-red-500"
                                                                    onClick={() =>
                                                                        handleDelete(
                                                                            item.id
                                                                        )
                                                                    }
                                                                >
                                                                    Delete
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Stats Footer */}
                {!isLoading && translations.length > 0 && (
                    <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Card>
                            <CardContent className="pt-6">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-primary">
                                        {translations.length}
                                    </div>
                                    <div className="text-sm text-muted-foreground mt-1">
                                        Total Translations
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="pt-6">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-primary">
                                        {
                                            new Set(
                                                translations.map(
                                                    (t) => t.languageCode
                                                )
                                            ).size
                                        }
                                    </div>
                                    <div className="text-sm text-muted-foreground mt-1">
                                        Languages Used
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="pt-6">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-primary">
                                        {translations.length > 0
                                            ? new Date(
                                                  translations[0].createdAt
                                              ).toLocaleDateString('en-US', {
                                                  month: 'short',
                                                  day: 'numeric',
                                              })
                                            : '-'}
                                    </div>
                                    <div className="text-sm text-muted-foreground mt-1">
                                        Last Translation
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="pt-6">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-primary">
                                        {translations.reduce(
                                            (acc, t) =>
                                                acc +
                                                (t.originalText?.length || 0),
                                            0
                                        )}
                                    </div>
                                    <div className="text-sm text-muted-foreground mt-1">
                                        Characters Translated
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AllTranslationsPage;
