"use client";

import { useEffect, useState } from "react";
import { apiGet, apiPost } from "@/lib/api";

const languageOptions = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "bn", name: "বাংলা (Bangla)", flag: "🇧🇩" },
  { code: "es", name: "Español (Spanish)", flag: "🇪🇸" },
  { code: "ar", name: "العربية (Arabic)", flag: "🇸🇦" },
  { code: "hi", name: "हिन्दी (Hindi)", flag: "🇮🇳" },
  { code: "fr", name: "Français (French)", flag: "🇫🇷" },
];

export default function ParentNoticesPage() {
  const [notices, setNotices] = useState<any[]>([]);
  const [selectedLang, setSelectedLang] = useState("bn");
  const [translatedMap, setTranslatedMap] = useState<Record<string, { title: string; body: string }>>({});
  const [loading, setLoading] = useState(true);
  const [translating, setTranslating] = useState(false);

  useEffect(() => {
    async function loadNotices() {
      try {
        setLoading(true);
        const res = await apiGet(`/api/notices?role=parent`);
        if (res.success) {
          setNotices(res.data || []);
        }
      } catch (err) {
        console.error("Failed to load notices:", err);
      } finally {
        setLoading(false);
      }
    }
    loadNotices();
  }, []);

  // Auto-translate notices when selected language changes
  useEffect(() => {
    async function translateAll() {
      if (notices.length === 0 || selectedLang === "en") {
        setTranslatedMap({});
        return;
      }

      setTranslating(true);
      const newMap: Record<string, { title: string; body: string }> = {};

      for (const notice of notices) {
        // Check if notice already has this translation cached in notice.translations
        if (notice.translations && notice.translations[selectedLang]) {
          newMap[notice._id] = notice.translations[selectedLang];
        } else {
          try {
            const res = await apiPost("/api/ai/translate", {
              title: notice.title,
              body: notice.body,
              targetLang: selectedLang,
            });
            if (res.success && res.data) {
              newMap[notice._id] = {
                title: res.data.translatedTitle,
                body: res.data.translatedBody,
              };
            }
          } catch {
            newMap[notice._id] = { title: notice.title, body: notice.body };
          }
        }
      }

      setTranslatedMap(newMap);
      setTranslating(false);
    }

    translateAll();
  }, [selectedLang, notices]);

  return (
    <div className="space-y-6">
      {/* Header with Language Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900">Multilingual Notice Board</h1>
            <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-[10px] font-bold text-indigo-700 border border-indigo-200">
              AI Auto-Translate
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Instant real-time translation of school announcements into your preferred language</p>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-slate-600">Translate to:</label>
          <select
            value={selectedLang}
            onChange={(e) => setSelectedLang(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-800 shadow-xs outline-none focus:border-indigo-600"
          >
            {languageOptions.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.flag} {lang.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {translating && (
        <div className="flex items-center gap-2 text-xs font-medium text-indigo-700 bg-indigo-50/70 p-3 rounded-xl border border-indigo-100">
          <div className="h-2 w-2 rounded-full bg-indigo-600 animate-ping" />
          <span>Translating notice announcements into {languageOptions.find((l) => l.code === selectedLang)?.name}...</span>
        </div>
      )}

      {/* Notices Feed */}
      <div className="space-y-4">
        {loading ? (
          <div className="py-16 text-center text-xs text-slate-400">Loading notices...</div>
        ) : notices.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-xs text-slate-400">
            No active school announcements.
          </div>
        ) : (
          notices.map((n) => {
            const displayTitle = translatedMap[n._id]?.title || n.title;
            const displayBody = translatedMap[n._id]?.body || n.body;

            return (
              <div
                key={n._id}
                className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-3 hover:border-indigo-200 hover:shadow-md transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="rounded-lg bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-amber-700 border border-amber-200">
                      {n.category || "Announcement"}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">Published by: {n.createdBy || "School Office"}</span>
                  </div>

                  <span className="text-[11px] text-slate-400 font-mono">
                    {new Date(n.createdAt || Date.now()).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-slate-900 leading-snug">{displayTitle}</h3>
                <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">{displayBody}</p>

                {selectedLang !== "en" && (
                  <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-400 flex items-center justify-between">
                    <span>Translated from English into {languageOptions.find((l) => l.code === selectedLang)?.name}</span>
                    <button
                      onClick={() => {
                        setTranslatedMap((prev) => ({
                          ...prev,
                          [n._id]: { title: n.title, body: n.body },
                        }));
                      }}
                      className="text-indigo-600 hover:underline font-bold"
                    >
                      Show Original English
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
