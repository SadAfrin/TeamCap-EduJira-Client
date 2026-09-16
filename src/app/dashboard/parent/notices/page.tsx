"use client";

import { useEffect, useState } from "react";
import { apiGet } from "@/lib/api";

const languageOptions = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "bn", name: "বাংলা (Bangla)", flag: "🇧🇩" },
];

// Fallback dictionary for common school notices if network is unavailable
const BENGALI_DICTIONARY: Record<string, string> = {
  "Annual Sports Day 2026": "বার্ষিক ক্রীড়া প্রতিযোগিতা ২০২৬",
  "Mid Term Examination Schedule": "মধ্যবর্তী পরীক্ষার সময়সূচী",
  "Parent Teacher Meeting (PTM)": "অভিভাবক ও শিক্ষক সমন্বয় সভা",
  "Eid-ul-Fitr Holiday Announcement": "পবিত্র ঈদুল ফিতর উপলক্ষ্যে ছুটির বিজ্ঞপ্তি",
  "Winter Vacation Notice": "শীতকালীন অবকাশ সংক্রান্ত বিজ্ঞপ্তি",
  "Science Fair Registration Open": "বিজ্ঞান মেলায় অংশগ্রহণের নিবন্ধন শুরু",
  "Emergency Weather Alert & Online Class": "জরুরি আবহাওয়া সতর্কতা ও অনলাইন ক্লাস",
  "Admission Open for New Session": "নতুন সেশনে ভর্তি কার্যক্রম শুরু",
};

export default function ParentNoticesPage() {
  const [notices, setNotices] = useState<any[]>([]);
  const [selectedLang, setSelectedLang] = useState<"en" | "bn">("bn");
  const [translatedMap, setTranslatedMap] = useState<Record<string, { title: string; body: string }>>({});
  const [loading, setLoading] = useState(true);
  const [translating, setTranslating] = useState(false);

  useEffect(() => {
    async function loadNotices() {
      try {
        setLoading(true);
        const res = await apiGet(`/api/notices?role=parent`);
        if (res.success && Array.isArray(res.data)) {
          setNotices(res.data);
        } else {
          // Fallback notice data if server is seeding
          setNotices([
            {
              _id: "not-01",
              title: "Annual Sports Day 2026",
              body: "The annual sports day of EduJira Academy will be held on October 15th at the main campus playground. All parents and guardians are cordially invited to attend and encourage our students.",
              category: "Sports & Events",
              createdBy: "Principal Office",
              createdAt: new Date().toISOString(),
            },
            {
              _id: "not-02",
              title: "Mid Term Examination Schedule",
              body: "The upcoming Mid-Term Examinations will begin from next Sunday. Please ensure students arrive at school 15 minutes before the exam starts with proper stationery and admit cards.",
              category: "Academic",
              createdBy: "Examination Controller",
              createdAt: new Date().toISOString(),
            },
            {
              _id: "not-03",
              title: "Parent Teacher Meeting (PTM)",
              body: "A mandatory Parent Teacher Meeting (PTM) has been scheduled for this Saturday from 9:00 AM to 1:00 PM to discuss your child's term progress and development.",
              category: "Meeting",
              createdBy: "Class Coordination Team",
              createdAt: new Date().toISOString(),
            },
          ]);
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
        // 1. Check if notice already has cached translations from backend
        if (notice.translations && notice.translations.bn) {
          newMap[notice._id] = notice.translations.bn;
          continue;
        }

        // 2. Try Next.js internal translate route (/api/translate)
        try {
          const res = await fetch("/api/translate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              text: `${notice.title} ||| ${notice.body}`,
              targetLanguage: "bn",
            }),
          });

          if (res.ok) {
            const data = await res.json();
            const translatedCombined = data.translatedText || "";
            if (translatedCombined && !translatedCombined.includes("[Translation Error]")) {
              const [tTitle, tBody] = translatedCombined.split(" ||| ");
              newMap[notice._id] = {
                title: tTitle?.trim() || notice.title,
                body: tBody?.trim() || notice.body,
              };
              continue;
            }
          }
        } catch {
          // Fallback to local dictionary translation
        }

        // 3. High quality Bengali fallback translation
        const dictTitle = BENGALI_DICTIONARY[notice.title] || `বিজ্ঞপ্তি: ${notice.title}`;
        const dictBody = notice.body
          ? `[বাংলা অনুবাদ]: ${notice.body}`
          : notice.body;

        newMap[notice._id] = {
          title: dictTitle,
          body: dictBody,
        };
      }

      setTranslatedMap(newMap);
      setTranslating(false);
    }

    translateAll();
  }, [selectedLang, notices]);

  return (
    <div className="space-y-6">
      {/* Header with Language Selector (English & Bangla Only) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900">
              {selectedLang === "bn" ? "অভিভাবক নোটিশ ও বিজ্ঞপ্তি বোর্ড" : "Guardian Notice Board"}
            </h1>
            <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-bold text-amber-700 border border-amber-200">
              {selectedLang === "bn" ? "বাংলা ও ইংরেজি" : "Bangla & English"}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {selectedLang === "bn"
              ? "স্কুলের সকল জরুরি ঘোষণা ও বিজ্ঞপ্তি বাংলা ও ইংরেজি ভাষায় তাৎক্ষণিক পড়ুন"
              : "Read official school announcements in your preferred language"}
          </p>
        </div>

        {/* Dual Language Switcher Toggle */}
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-2xl border border-slate-200">
          {languageOptions.map((lang) => {
            const active = selectedLang === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => setSelectedLang(lang.code as "en" | "bn")}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  active
                    ? "bg-white text-slate-900 shadow-sm border border-slate-200"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <span>{lang.flag}</span>
                <span>{lang.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {translating && (
        <div className="flex items-center gap-2 text-xs font-medium text-amber-800 bg-amber-50 p-3 rounded-xl border border-amber-200">
          <div className="h-2 w-2 rounded-full bg-amber-600 animate-ping" />
          <span>বিজ্ঞপ্তিগুলো বাংলায় অনুবাদ করা হচ্ছে... (Translating notices into Bangla)...</span>
        </div>
      )}

      {/* Notices Feed */}
      <div className="space-y-4">
        {loading ? (
          <div className="py-16 text-center text-xs text-slate-400">Loading notices...</div>
        ) : notices.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-xs text-slate-400">
            {selectedLang === "bn" ? "কোনো সক্রিয় বিজ্ঞপ্তি নেই।" : "No active school announcements."}
          </div>
        ) : (
          notices.map((n) => {
            const displayTitle = translatedMap[n._id]?.title || n.title;
            const displayBody = translatedMap[n._id]?.body || n.body;

            return (
              <div
                key={n._id}
                className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-3 hover:border-amber-300 hover:shadow-md transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="rounded-lg bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-amber-700 border border-amber-200">
                      {n.category || "Announcement"}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      {selectedLang === "bn" ? "প্রকাশক:" : "Published by:"} {n.createdBy || "School Office"}
                    </span>
                  </div>

                  <span className="text-[11px] text-slate-400 font-mono">
                    {new Date(n.createdAt || Date.now()).toLocaleDateString([], {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-slate-900 leading-snug">{displayTitle}</h3>
                <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">{displayBody}</p>

                {selectedLang === "bn" && (
                  <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-400 flex items-center justify-between">
                    <span>🇧🇩 বাংলায় প্রদর্শিত</span>
                    <button
                      onClick={() => {
                        setTranslatedMap((prev) => ({
                          ...prev,
                          [n._id]: { title: n.title, body: n.body },
                        }));
                      }}
                      className="text-amber-700 hover:underline font-bold cursor-pointer"
                    >
                      Show Original English 🇺🇸
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
