
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined
);

export function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");

    // If user has manually selected a theme, use it
    if (savedTheme === "light" || savedTheme === "dark") {
      setTheme(savedTheme);

      document.documentElement.setAttribute(
        "data-theme",
        savedTheme
      );

      return;
    }

    // Otherwise, follow the browser/system theme
    const mediaQuery = window.matchMedia(
      "(prefers-color-scheme: dark)"
    );

    const applySystemTheme = () => {
      const systemTheme: Theme = mediaQuery.matches
        ? "dark"
        : "light";

      setTheme(systemTheme);

      document.documentElement.setAttribute(
        "data-theme",
        systemTheme
      );
    };

    // Apply theme initially
    applySystemTheme();

    // Listen for browser/system theme changes
    mediaQuery.addEventListener("change", applySystemTheme);

    return () => {
      mediaQuery.removeEventListener("change", applySystemTheme);
    };
  }, []);

  const toggleTheme = () => {
    setTheme((currentTheme) => {
      const newTheme: Theme =
        currentTheme === "dark" ? "light" : "dark";

      // Save user's manual choice
      localStorage.setItem("theme", newTheme);

      // Update HTML attribute
      document.documentElement.setAttribute(
        "data-theme",
        newTheme
      );

      return newTheme;
    });
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error(
      "useTheme must be used inside ThemeProvider"
    );
  }

  return context;
}
