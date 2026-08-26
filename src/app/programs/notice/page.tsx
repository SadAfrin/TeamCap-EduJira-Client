"use client";

import { useState } from "react";
import Link from "next/link";

// English-only data coming from your MongoDB
const initialNotices = [
  {
    id: 1,
    date: "August 27, 2026",
    title: "School Closure for Upcoming Public Holiday",
    body: "Please be informed that the school will remain closed tomorrow due to the scheduled public holiday. Regular academic activities will resume the following day.",
  },
  {
    id: 2,
    date: "August 25, 2026",
    title: "First Term Examination Schedule Released",
    body: "The routine for the upcoming First Term Examinations has been published. Parents are requested to log into their portals to download the PDF schedule.",
  },
  {
    id: 3,
    date: "September 2, 2026",
    title: "Parent-Teacher Meeting for Middle School",
    body: "A mandatory Parent-Teacher Meeting (PTM) for grades 6 through 8 is scheduled for this Saturday. Teachers will discuss mid-term progress, behavior, and areas for improvement. Please book your time slot via the parent portal.",
  },
  {
    id: 4,
    date: "September 5, 2026",
    title: "Inter-School Football Tournament Selections",
    body: "Trials for the upcoming district inter-school football tournament will begin next Tuesday after school hours. All interested students from grades 9 to 12 must report to the main sports field in proper athletic gear.",
  },
  {
    id: 5,
    date: "September 10, 2026",
    title: "Reminder: Third Quarter Tuition Fees",
    body: "This is a gentle reminder that the deadline for the third-quarter tuition fee payment is approaching. Please ensure all dues are cleared by the 15th to avoid any late fees. Payments can be made directly through the EduJira billing tab.",
  },
  {
    id: 6,
    date: "September 12, 2026",
    title: "Library Book Return Notice",
    body: "The library will be conducting a routine inventory check next week. All students are required to return any overdue books by this Friday. A list of students with outstanding books has been shared with class teachers.",
  },
];

type Language = "en" | "bn";

export default function NoticePage() {
  const [lang, setLang] = useState<Language>("en");
  const [notices, setNotices] = useState(initialNotices);
  const [isTranslating, setIsTranslating] = useState(false);

  // Add this small delay helper function right above your handleLanguageToggle
  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  async function handleLanguageToggle(targetLang: Language) {
    if (lang === targetLang) return;
    setLang(targetLang);

    // If switching back to English, reset immediately
    if (targetLang === "en") {
      setNotices(initialNotices);
      return;
    }

    setIsTranslating(true);

    // We will update this array step-by-step
    const updatedNotices = [...initialNotices];

    try {
      for (let i = 0; i < initialNotices.length; i++) {
        const notice = initialNotices[i];

        // Combine title and body with newlines to only make ONE request per notice
        const textToTranslate = `${notice.title}\n\n\n${notice.body}`;

        const res = await fetch("/api/translate", {
          method: "POST",
          body: JSON.stringify({ text: textToTranslate, targetLanguage: "bn" }),
        });

        if (!res.ok) throw new Error("API Rate Limit Hit");

        const data = await res.json();

        // Split the translated text back into title and body
        const [translatedTitle, ...bodyParts] =
          data.translatedText.split(/\n\n\n|\n\n/);
        const translatedBody = bodyParts.join("\n\n");

        // Update just this one notice
        updatedNotices[i] = {
          ...notice,
          title: translatedTitle?.trim() || notice.title,
          body: translatedBody?.trim() || notice.body,
        };

        // Update state to trigger a re-render so the user sees them translate one by one!
        setNotices([...updatedNotices]);

        // Wait 500ms before translating the next one to avoid getting blocked by Google
        await delay(500);
      }
    } catch (error) {
      console.error("Translation stopped due to error:", error);
    } finally {
      setIsTranslating(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 sm:py-16">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/"
            className="text-sm font-medium text-slate-500 hover:text-indigo-600"
          >
            &larr; Back to Dashboard
          </Link>
        </div>

        <div className="mb-10 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              School Notices
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Stay updated with the latest announcements.
            </p>
          </div>

          {/* Language Toggle */}
          <div className="flex shrink-0 items-center rounded-xl bg-slate-200/60 p-1.5 shadow-inner">
            <button
              onClick={() => handleLanguageToggle("en")}
              disabled={isTranslating}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
                lang === "en"
                  ? "bg-white text-indigo-600 shadow-sm ring-1 ring-slate-900/5"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              English
            </button>
            <button
              onClick={() => handleLanguageToggle("bn")}
              disabled={isTranslating}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
                lang === "bn"
                  ? "bg-white text-indigo-600 shadow-sm ring-1 ring-slate-900/5"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              {isTranslating && lang === "bn" && (
                <svg
                  className="h-4 w-4 animate-spin text-indigo-600"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              )}
              বাংলা
            </button>
          </div>
        </div>

        {/* Notice Feed */}
        <div className="space-y-6">
          {notices.map((notice) => (
            <div
              key={notice.id}
              className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-indigo-200 hover:shadow-md sm:p-8"
            >
              <div
                className={`absolute bottom-0 left-0 top-0 w-1.5 transition-colors ${isTranslating ? "bg-slate-200 animate-pulse" : "bg-slate-200 group-hover:bg-indigo-500"}`}
              ></div>

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0M3.124 7.5A8.969 8.969 0 015.292 3m13.416 0a8.969 8.969 0 012.168 4.5"
                    />
                  </svg>
                </div>
                <time className="text-xs font-medium uppercase tracking-wider text-slate-500">
                  {notice.date}
                </time>
              </div>

              <div className="ml-13 mt-4 sm:ml-13 sm:mt-2">
                <h3
                  className={`text-lg font-semibold text-slate-900 ${isTranslating ? "animate-pulse text-slate-300 bg-slate-200 rounded w-3/4" : ""}`}
                >
                  {isTranslating ? "Translating..." : notice.title}
                </h3>
                <p
                  className={`mt-2 text-sm leading-relaxed text-slate-600 ${isTranslating ? "animate-pulse text-slate-300 bg-slate-100 rounded w-full h-10" : ""}`}
                >
                  {isTranslating ? "" : notice.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
