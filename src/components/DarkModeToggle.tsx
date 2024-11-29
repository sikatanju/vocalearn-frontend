import React, { useState, useEffect } from "react";

const DarkModeToggle: React.FC = () => {
    const [darkMode, setDarkMode] = useState<boolean>(
        () => localStorage.getItem("theme") === "dark"
    );

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }, [darkMode]);

    return (
        <button
            onClick={() => setDarkMode((prev) => !prev)}
            className="bg-secondary text-secondary-foreground rounded"
        >
            {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
    );
};

export default DarkModeToggle;
