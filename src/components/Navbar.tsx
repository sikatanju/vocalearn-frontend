import DarkModeToggle from '@/components/DarkModeToggle';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import '@/index.css';

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Navbar = () => {
    const [isVisible, setVisible] = useState<boolean>(false);
    const [isProfileDropDown, setIsProfileDropDown] = useState<boolean>(false);
    const { user, isAuthenticated, logout, isLoading } = useAuth();

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const handleLogout = () => {
        logout();
    };

    if (isLoading) {
        return (
            <nav className="border border-border px-4 py-3 rounded bg-background shadow-md">
                <div className="container flex justify-between items-center mx-auto">
                    {/* Logo Skeleton */}
                    <div className="h-7 w-28 bg-muted rounded animate-pulse"></div>

                    {/* Mobile Skeleton */}
                    <div className="flex place-items-center gap-x-3 py-1 md:hidden">
                        <div className="h-6 w-6 bg-muted rounded animate-pulse"></div>
                        <div className="h-8 w-8 bg-muted rounded-full animate-pulse"></div>
                    </div>

                    {/* Desktop Skeleton */}
                    <div className="hidden md:flex space-x-6 items-center">
                        <div className="h-5 w-20 bg-muted rounded animate-pulse"></div>
                        <div className="h-5 w-28 bg-muted rounded animate-pulse"></div>
                        <div className="h-5 w-24 bg-muted rounded animate-pulse"></div>
                        <div className="h-6 w-6 bg-muted rounded animate-pulse"></div>
                        <div className="h-9 w-9 bg-muted rounded-full animate-pulse"></div>
                    </div>
                </div>
            </nav>
        );
    }

    return (
        <nav className="border border-border px-4 py-3 rounded bg-background shadow-md">
            <div className="container flex justify-between items-center mx-auto">
                <a href="#" className="flex items-center">
                    <Link to="/">
                        <span className="text-lg font-semibold text-card-foreground">
                            VocaLearn
                        </span>
                    </Link>
                </a>
                <div className="flex place-items-center gap-x-3 py-1 md:hidden">
                    <div
                        data-collapse-toggle="mobile-menu"
                        className="text-gray-500 dark:text-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-accent"
                        aria-controls="mobile-menu"
                        aria-expanded="true"
                    >
                        {isAuthenticated ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger
                                    onClick={() =>
                                        setVisible(isVisible ? false : true)
                                    }
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className="size-6"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12"
                                        />
                                    </svg>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <Link to="/translate">
                                        <DropdownMenuItem>
                                            Translate
                                        </DropdownMenuItem>
                                    </Link>
                                    <Link to="/speech-to-text">
                                        <DropdownMenuItem>
                                            Speech to Text
                                        </DropdownMenuItem>
                                    </Link>
                                    <Link to="/pronunciation-assessment">
                                        <DropdownMenuItem>
                                            Pronunciation
                                        </DropdownMenuItem>
                                    </Link>
                                    <DropdownMenuItem>
                                        <DarkModeToggle />
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <DarkModeToggle />
                        )}
                    </div>
                    {isAuthenticated ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger
                                onClick={() =>
                                    setIsProfileDropDown(!isProfileDropDown)
                                }
                            >
                                <Avatar className="h-8 w-8 cursor-pointer">
                                    <AvatarImage
                                        src={user?.profilePicture}
                                        alt={user?.name}
                                    />
                                    <AvatarFallback>
                                        {user?.name
                                            ? getInitials(user.name)
                                            : 'U'}
                                    </AvatarFallback>
                                </Avatar>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <Link to="/profile">
                                    <DropdownMenuItem>Profile</DropdownMenuItem>
                                </Link>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleLogout}>
                                    Logout
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <div className="flex gap-2">
                            <Link to="/login">
                                <Button variant="ghost" size="sm">
                                    Login
                                </Button>
                            </Link>
                            <Link to="/signup">
                                <Button size="sm">Sign Up</Button>
                            </Link>
                        </div>
                    )}
                </div>
                <div
                    className="hidden md:flex space-x-6 items-center"
                    id="table-menu"
                >
                    {isAuthenticated && (
                        <div>
                            <Link to="/translate">
                                <a
                                    href="#"
                                    className="text-sm font-medium text-card-foreground hover:text-accent transition-colors"
                                >
                                    Translate
                                </a>
                            </Link>
                            <Link to="/speech-to-text">
                                <a
                                    href="#"
                                    className="text-sm font-medium text-card-foreground hover:text-accent transition-colors"
                                >
                                    Speech to Text
                                </a>
                            </Link>
                            <Link to="/pronunciation-assessment">
                                <a
                                    href="#"
                                    className="text-sm font-medium text-card-foreground hover:text-accent transition-colors"
                                >
                                    Pronunciation
                                </a>
                            </Link>
                        </div>
                    )}
                    <DarkModeToggle />
                    {isAuthenticated ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger
                                onClick={() =>
                                    setIsProfileDropDown(!isProfileDropDown)
                                }
                            >
                                <Avatar className="h-9 w-9 cursor-pointer">
                                    <AvatarImage
                                        src={user?.profilePicture}
                                        alt={user?.name}
                                    />
                                    <AvatarFallback className="bg-primary text-primary-foreground">
                                        {user?.name
                                            ? getInitials(user.name)
                                            : 'U'}
                                    </AvatarFallback>
                                </Avatar>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <Link to="/profile">
                                    <DropdownMenuItem>Profile</DropdownMenuItem>
                                </Link>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleLogout}>
                                    Logout
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <div className="flex gap-2">
                            <Link to="/login">
                                <Button variant="ghost" size="sm">
                                    Login
                                </Button>
                            </Link>
                            <Link to="/signup">
                                <Button size="sm">Sign Up</Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
