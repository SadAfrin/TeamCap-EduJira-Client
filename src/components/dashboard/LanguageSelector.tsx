"use client";

import { useState } from "react";

const languages = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "bn", label: "বাংলা (Bangla)", flag: "🇧🇩" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "ar", label: "العربية", flag: "🇸🇦" },
  { code: "hi", label: "हिन्दी", flag: "🇮🇳" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
];

export default function LanguageSelector({
  currentLang = "en",
  onSelectLanguage,
}: {
  currentLang?: string;
  onSelectLanguage?: (code: string) => void;
}) {
  const [selected, setSelected] = useState(currentLang);
  const [isOpen, setIsOpen] = useState(false);

  const active = languages.find((l) => l.code === selected) || languages[0];

  const handleSelect = (code: string) => {
    setSelected(code);
    setIsOpen(false);
    if (onSelectLanguage) {
      onSelectLanguage(code);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 transition-colors focus:outline-none"
      >
        <span>{active.flag}</span>
        <span className="hidden sm:inline">{active.label}</span>
        <svg className="h-3.5 w-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-44 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleSelect(lang.code)}
              className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-left transition-colors ${
                selected === lang.code ? "bg-indigo-50 text-indigo-700 font-bold" : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              <span>{lang.flag}</span>
              <span>{lang.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
