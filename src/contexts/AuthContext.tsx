/* eslint-disable react-refresh/only-export-components */
import apiClient from '@/services/apiClient';
import {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from 'react';

interface User {
    id: string;
    first_name?: string;
    last_name?: string;
    username?: string;
    email: string;
    profilePicture?: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('accessToken');

            if (token) {
                try {
                    const response = await apiClient.get('auth/users/me/');
                    setUser(response.data);
                } catch (error) {
                    console.error('Failed to fetch user:', error);
                    if (
                        error &&
                        typeof error === 'object' &&
                        'response' in error
                    ) {
                        const axiosError = error as {
                            response?: { status?: number };
                        };
                        if (axiosError.response?.status !== 401) {
                            // It's not an auth error, something else went wrong
                            localStorage.removeItem('accessToken');
                            localStorage.removeItem('refreshToken');
                        }
                    }
                }
            }

            setIsLoading(false);
        };

        initAuth();
    }, []);

    const login = async (email: string, password: string) => {
        // Call your login endpoint
        const response = await apiClient.post('/auth/jwt/create', {
            username: email,
            password: password,
        });

        const { access, refresh } = response.data;

        // Store tokens
        localStorage.setItem('accessToken', access);
        localStorage.setItem('refreshToken', refresh);

        // Fetch user data after login
        const userResponse = await apiClient.get('auth/users/me');
        setUser(userResponse.data);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                isLoading,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
