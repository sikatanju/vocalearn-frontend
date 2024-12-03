import React, { useState, useEffect } from "react";
import { DarkModeSwitch } from "react-toggle-dark-mode";

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

    const toggleDarkMode = (checked: boolean) => {
        setDarkMode(checked);
    };
    // console.log("Dark mode state:", darkMode);
    return (
        <DarkModeSwitch
            checked={darkMode}
            onChange={toggleDarkMode}
            size={16}
        />
    );
};

export default DarkModeToggle;
