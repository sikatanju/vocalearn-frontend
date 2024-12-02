import DarkModeToggle from "@/components/DarkModeToggle";
import "@/index.css";

const Navbar = () => {
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
                    <span className="text-lg font-semibold text-card-foreground">
                        VocaLearn
                    </span>
                </a>
                <button
                    data-collapse-toggle="mobile-menu"
                    type="button"
                    className="md:hidden text-gray-500 dark:text-gray-400 p-2 rounded focus:outline-none focus:ring-2 focus:ring-accent"
                    aria-controls="mobile-menu"
                    aria-expanded="false"
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
                    className="hidden md:flex space-x-8 items-center"
                    id="mobile-menu"
                >
                    <a
                        href="#"
                        className="text-sm font-medium text-card-foreground hover:text-accent transition-colors"
                    >
                        Home
                    </a>
                    <a
                        href="#"
                        className="text-sm font-medium text-card-foreground hover:text-accent transition-colors"
                    >
                        Translation
                    </a>
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
