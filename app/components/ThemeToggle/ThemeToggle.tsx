"use client";
import { useTheme } from "../ThemeProvider/ThemeProvider";

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <button onClick={toggleTheme}>
            {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>
    );
}