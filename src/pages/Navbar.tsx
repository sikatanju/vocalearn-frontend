import DarkModeToggle from '@/components/DarkModeToggle';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import '@/index.css';

import { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const [isVisible, setVisible] = useState<boolean>(false);
    const [isProfileDropDown, setIsProfileDropDown] = useState<boolean>(false);

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
                        <DropdownMenu>
                            <DropdownMenuTrigger
                                onClick={() =>
                                    setVisible(isVisible ? false : true)
                                }
                            >
                                {/* <svg
                                    className="w-6 h-6"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                                        clipRule="evenodd"
                                    />
                                </svg> */}
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
                                <Link to="/">
                                    <DropdownMenuItem>
                                        Translate
                                    </DropdownMenuItem>
                                </Link>
                                <Link to="/speech-to-text">
                                    <DropdownMenuItem>
                                        Speech to Text
                                    </DropdownMenuItem>
                                </Link>
                                <Link to="#">
                                    <DropdownMenuItem>
                                        Pronunciation
                                    </DropdownMenuItem>
                                </Link>
                                <DropdownMenuItem>
                                    <DarkModeToggle />
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <div className=''>
                        <DropdownMenu>
                            <DropdownMenuTrigger
                                onClick={() =>
                                    setIsProfileDropDown(!isProfileDropDown)
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
                                        d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                                    />
                                </svg>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <Link to="/profile">
                                    <DropdownMenuItem>Profile</DropdownMenuItem>
                                </Link>
                                <Link to="/logout">
                                    <DropdownMenuItem>Logout</DropdownMenuItem>
                                </Link>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
                <div
                    className="hidden md:flex space-x-6 items-center"
                    id="table-menu"
                >
                    <Link to="/">
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
                    <DarkModeToggle />
                    <div className='pt-1'>
                        <DropdownMenu>
                            <DropdownMenuTrigger
                                onClick={() =>
                                    setIsProfileDropDown(!isProfileDropDown)
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
                                        d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                                    />
                                </svg>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <Link to="/profile">
                                    <DropdownMenuItem>Profile</DropdownMenuItem>
                                </Link>
                                <Link to="/logout">
                                    <DropdownMenuItem>Logout</DropdownMenuItem>
                                </Link>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
