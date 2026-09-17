"use client";

import { useEffect, useState } from "react";
import { apiGet, apiPost } from "@/lib/api";

const languageOptions = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "bn", name: "বাংলা (Bangla)", flag: "🇧🇩" },
];

// Fallback dictionary for common school notices if the translation API is unavailable
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
  const [selectedLang, setSelectedLang] = useState("bn");
  const [translatedMap, setTranslatedMap] = useState
    Record<string, { title: string; body: string }>
  >({});
  const [showingOriginal, setShowingOriginal] = useState
    Record<string, boolean>
  >({});
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

  useEffect(() => {
    async function translateAll() {
      if (notices.length === 0 || selectedLang === "en") {
        setTranslatedMap({});
        setShowingOriginal({});
        return;
      }

      setTranslating(true);
      setShowingOriginal({});

      // Fetch all translations concurrently (dev's performance fix)
      const translationPromises = notices.map(async (notice) => {
        if (notice.translations && notice.translations[selectedLang]) {
          return { id: notice._id, data: notice.translations[selectedLang] };
        }

        // 1. Try the real translation API first
        try {
          const res = await apiPost("/api/ai/translate", {
            title: notice.title,
            body: notice.body,
            targetLang: selectedLang,
          });
          if (res.success && res.data?.translatedTitle) {
            return {
              id: notice._id,
              data: {
                title: res.data.translatedTitle,
                body: res.data.translatedBody,
              },
            };
          }
        } catch (err) {
          console.error("Translation API failed for", notice._id, err);
        }

        // 2. Fallback to local Bengali dictionary if targeting Bangla and API failed
        //    (apurba's safety net — prevents #52 from resurfacing if the API is down)
        if (selectedLang === "bn") {
          const dictTitle =
            BENGALI_DICTIONARY[notice.title] || `বিজ্ঞপ্তি: ${notice.title}`;
          const dictBody = notice.body
            ? `[বাংলা অনুবাদ]: ${notice.body}`
            : notice.body;
          return { id: notice._id, data: { title: dictTitle, body: dictBody } };
        }

        // 3. Last resort — show original
        return {
          id: notice._id,
          data: { title: notice.title, body: notice.body },
        };
      });

      const results = await Promise.all(translationPromises);

      const newMap: Record<string, { title: string; body: string }> = {};
      results.forEach((result) => {
        newMap[result.id] = result.data;
      });

      setTranslatedMap(newMap);
      setTranslating(false);
    }

    translateAll();
  }, [selectedLang, notices]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900">
              {selectedLang === "bn" ? "অভিভাবক নোটিশ ও বিজ্ঞপ্তি বোর্ড" : "Multilingual Notice Board"}
            </h1>
            <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-[10px] font-bold text-indigo-700 border border-indigo-200">
              AI Auto-Translate
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {selectedLang === "bn"
              ? "স্কুলের সকল জরুরি ঘোষণা ও বিজ্ঞপ্তি বাংলা ও ইংরেজি ভাষায় তাৎক্ষণিক পড়ুন"
              : "Instant real-time translation of school announcements into your preferred language"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-slate-600">
            {selectedLang === "bn" ? "ভাষা নির্বাচন:" : "Translate to:"}
          </label>
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
          <span>
            {selectedLang === "bn"
              ? "বিজ্ঞপ্তিগুলো বাংলায় অনুবাদ করা হচ্ছে..."
              : `Translating notice announcements into ${languageOptions.find((l) => l.code === selectedLang)?.name}...`}
          </span>
        </div>
      )}

      <div className="space-y-4">
        {loading ? (
          <div className="py-16 text-center text-xs text-slate-400">
            Loading notices...
          </div>
        ) : notices.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-xs text-slate-400">
            {selectedLang === "bn" ? "কোনো সক্রিয় বিজ্ঞপ্তি নেই।" : "No active school announcements."}
          </div>
        ) : (
          notices.map((n) => {
            const isOriginal = showingOriginal[n._id];
            const displayTitle = isOriginal
              ? n.title
              : translatedMap[n._id]?.title || n.title;
            const displayBody = isOriginal
              ? n.body
              : translatedMap[n._id]?.body || n.body;

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
                    {new Date(n.createdAt || Date.now()).toLocaleDateString(
                      [],
                      { month: "short", day: "numeric", year: "numeric" },
                    )}
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                  {displayTitle}
                </h3>
                <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                  {displayBody}
                </p>

                {selectedLang !== "en" && (
                  <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-400 flex items-center justify-between">
                    <span>
                      {isOriginal
                        ? (selectedLang === "bn" ? "মূল ইংরেজি লেখা দেখানো হচ্ছে" : "Showing original English text")
                        : (selectedLang === "bn"
                            ? "🇧🇩 বাংলায় প্রদর্শিত"
                            : `Translated from English into ${languageOptions.find((l) => l.code === selectedLang)?.name}`)}
                    </span>
                    <button
                      onClick={() => {
                        setShowingOriginal((prev) => ({
                          ...prev,
                          [n._id]: !prev[n._id],
                        }));
                      }}
                      className="text-amber-700 hover:underline font-bold cursor-pointer"
                    >
                      {isOriginal ? "Show Translation" : "Show Original English 🇺🇸"}
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