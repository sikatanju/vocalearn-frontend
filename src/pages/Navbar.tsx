/* eslint-disable @typescript-eslint/no-unused-vars */
import DarkModeToggle from "@/components/DarkModeToggle";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import "@/index.css";

import { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
    const [isVisible, setVisible] = useState<boolean>(false);
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
                <div
                    data-collapse-toggle="mobile-menu"
                    className="md:hidden text-gray-500 dark:text-gray-400 p-2 rounded focus:outline-none focus:ring-2 focus:ring-accent"
                    aria-controls="mobile-menu"
                    aria-expanded="true"
                >
                    <DropdownMenu>
                        <DropdownMenuTrigger
                            onClick={() => setVisible(isVisible ? false : true)}
                        >
                            <svg
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
                            </svg>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <Link to="/">
                                <DropdownMenuItem>Translate</DropdownMenuItem>
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
                <div
                    className="hidden md:flex space-x-8 items-center"
                    id="mobile-menu"
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
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
