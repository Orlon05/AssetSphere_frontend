/**
 * @file ThemeToggle.jsx
 * @description Provides a button to toggle between light and dark themes.
 */

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

/**
 * ThemeToggle Component
 * @description A component that toggles the application's theme (light/dark) and persists the selection in local storage.
 * @returns {JSX.Element} The rendered button component.
 */
export default function ThemeToggle() {
  const [theme, setTheme] = useState(() => {
    const local = localStorage.getItem("theme");
    if (local) return local;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  useEffect(() => {
    const root = window.document.documentElement;
    console.log("ThemeToggle: applying theme =", theme);
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    console.log("ThemeToggle: toggling theme from", theme);
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 text-gray-700 dark:text-slate-300 transition dark:hover:bg-slate-700 flex items-center justify-center border border-gray-200 dark:border-slate-700"
      aria-label="Toggle dark mode"
      title={theme === "light" ? "Cambiar a modo oscuro" : "Cambiar a modo claro"}
    >
      {theme === "light" ? <Moon size={18} className="text-gray-650" /> : <Sun size={18} className="text-amber-400" />}
    </button>
  );
}
