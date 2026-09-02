"use client";

import { useState } from "react";
import toast from "react-hot-toast";

const NOTICES = [
  {
    title: "Mid-Term Examination Schedule & Guidelines",
    date: "2026-09-01",
    content: "The upcoming mid-term examinations for Grades 6 through 10 will commence on September 15. All students must bring their admit cards.",
    translated: "ষষ্ঠ থেকে দশম শ্রেণির আসন্ন মিড-টার্ম পরীক্ষা আগামী ১৫ সেপ্টেম্বর থেকে শুরু হবে। সকল শিক্ষার্থীকে তাদের অ্যাডমিট কার্ড আনতে হবে।",
  },
  {
    title: "Upcoming Parent-Teacher Conference (PTC)",
    date: "2026-08-28",
    content: "Parents are warmly invited to attend the quarterly parent-teacher progress review this Saturday from 09:30 AM to 01:00 PM.",
    translated: "অভিভাবকদের আগামী শনিবার সকাল ০৯:৩০ থেকে দুপুর ০১:০০ পর্যন্ত ত্রৈমাসিক অভিভাবক-শিক্ষক অগ্রগতি পর্যালোচনায় অংশ নেওয়ার জন্য আন্তরিকভাবে আমন্ত্রণ জানানো হচ্ছে।",
  },
];

export default function MultilingualNoticesPage() {
  const [targetLang, setTargetLang] = useState<"en" | "bn">("en");

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">School Notices & Announcements</h1>
            <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-800 border border-amber-200">
              🌐 Multilingual Auto-Translator
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Institutional announcements translated in real-time into your preferred language.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => { setTargetLang("en"); toast.success("Language: English"); }}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
              targetLang === "en" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500"
            }`}
          >
            English (Original)
          </button>
          <button
            onClick={() => { setTargetLang("bn"); toast.success("অনুবাদ: বাংলা"); }}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
              targetLang === "bn" ? "bg-amber-600 text-white shadow-xs" : "text-slate-500"
            }`}
          >
            বাংলা (Bangla)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {NOTICES.map((n, idx) => (
          <div key={idx} className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700">Official Notice</span>
              <span className="font-mono text-xs text-slate-400">{n.date}</span>
            </div>
            <h3 className="mt-3 text-base font-bold text-slate-900">{n.title}</h3>
            <p className="mt-2 text-xs sm:text-sm text-slate-700 leading-relaxed">
              {targetLang === "bn" ? n.translated : n.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
