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
                    <svg
                        className="mr-3 h-8 w-8"
                        viewBox="0 0 52 72"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M1.87695 53H28.7791C41.5357 53 51.877 42.7025 51.877 30H24.9748C12.2182 30 1.87695 40.2975 1.87695 53Z"
                            fill="#76A9FA"
                        />
                        <path
                            d="M0.000409561 32.1646L0.000409561 66.4111C12.8618 66.4111 23.2881 55.9849 23.2881 43.1235L23.2881 8.87689C10.9966 8.98066 1.39567 19.5573 0.000409561 32.1646Z"
                            fill="#A4CAFE"
                        />
                        <path
                            d="M50.877 5H23.9748C11.2182 5 0.876953 15.2975 0.876953 28H27.7791C40.5357 28 50.877 17.7025 50.877 5Z"
                            fill="#1C64F2"
                        />
                    </svg>
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
                            {" "}
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
                    <a
                        href="#"
                        className="text-sm font-medium text-card-foreground hover:text-accent transition-colors"
                    >
                        Pronunciation
                    </a>
                    <DarkModeToggle />
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

/*

                            {/* <DropdownMenuTrigger
                                onClick={() =>
                                    setVisible(isVisible ? false : true)
                                }
                            >
                                {" "}
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
                            </DropdownMenuTrigger>}





import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import DarkModeToggle from './DarkModeToggle';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="border border-border px-4 py-3 rounded bg-background shadow-md">
      <div className="container flex justify-between items-center mx-auto">
        <a href="#" className="flex items-center">
          <svg
            className="mr-3 h-8 w-8"
            viewBox="0 0 52 72"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1.87695 53H28.7791C41.5357 53 51.877 42.7025 51.877 30H24.9748C12.2182 30 1.87695 40.2975 1.87695 53Z"
              fill="#76A9FA"
            />
            <path
              d="M0.000409561 32.1646L0.000409561 66.4111C12.8618 66.4111 23.2881 55.9849 23.2881 43.1235L23.2881 8.87689C10.9966 8.98066 1.39567 19.5573 0.000409561 32.1646Z"
              fill="#A4CAFE"
            />
            <path
              d="M50.877 5H23.9748C11.2182 5 0.876953 15.2975 0.876953 28H27.7791C40.5357 28 50.877 17.7025 50.877 5Z"
              fill="#1C64F2"
            />
          </svg>
          <Link to="/">
            <span className="text-lg font-semibold text-card-foreground">
              VocaLearn
            </span>
          </Link>
        </a>
        <button
          type="button"
          className="md:hidden text-gray-500 dark:text-gray-400 p-2 rounded focus:outline-none focus:ring-2 focus:ring-accent"
          aria-controls="mobile-menu"
          aria-expanded={menuOpen ? 'true' : 'false'}
          onClick={toggleMenu}
        >
          <span className="sr-only">Open main menu</span>
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
        </button>
        <div
          className={`${
            menuOpen ? 'block' : 'hidden'
          } md:flex space-x-8 items-center`}
          id="mobile-menu"
        >
          <Link to="/">
            <span className="text-sm font-medium text-card-foreground hover:text-accent transition-colors">
              Home
            </span>
          </Link>
          <Link to="/speech-to-text">
            <span className="text-sm font-medium text-card-foreground hover:text-accent transition-colors">
              Speech to Text
            </span>
          </Link>
          <span className="text-sm font-medium text-card-foreground hover:text-accent transition-colors">
            Pronunciation
          </span>
          <DarkModeToggle />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
*/
