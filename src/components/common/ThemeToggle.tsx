"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

type ThemeToggleProps = {
  className?: string;
};

export default function ThemeToggle({ className = "" }: ThemeToggleProps) {
  const { setTheme } = useTheme();

  function handleToggle() {
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "light" : "dark");
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label="Toggle dark and light mode"
      title="Toggle theme"
      className={`relative inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-xs transition-all duration-300 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-indigo-400/40 dark:hover:bg-slate-700 dark:hover:text-indigo-300 ${className}`}
    >
      <Moon
        className="h-[18px] w-[18px] rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0"
        strokeWidth={2}
        aria-hidden
      />
      <Sun
        className="absolute h-[18px] w-[18px] rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100"
        strokeWidth={2}
        aria-hidden
      />
      <span className="sr-only">Toggle dark and light mode</span>
    </button>
  );
}
