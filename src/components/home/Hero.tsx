"use client";

import { useState } from "react";
import Link from "next/link";

const mockSubjects = [
  { name: "Mathematics", grade: "A", note: "Steady improvement", color: "text-indigo-600" },
  { name: "Physics", grade: "A-", note: "Strong in practicals", color: "text-cyan-600" },
  { name: "Bangla Literature", grade: "B+", note: "Needs grammar focus", color: "text-amber-600" },
];

const mockEvents = [
  {
    time: "09:00 - 11:30",
    title: "Math Midterm Exam",
    location: "Exam Hall A",
    badge: "Exams",
    color: "bg-red-50 text-red-700 border-red-200 dot:bg-red-500",
  },
  {
    time: "13:30 - 15:30",
    title: "Physics Lab Assessment",
    location: "Physics Lab 3",
    badge: "Exams",
    color: "bg-red-50 text-red-700 border-red-200 dot:bg-red-500",
  },
  {
    time: "15:30 - 17:00",
    title: "Basketball Practice",
    location: "Main Gymnasium",
    badge: "Sports",
    color: "bg-emerald-50 text-emerald-700 border-emerald-200 dot:bg-emerald-500",
  },
];

const mockTimetable = [
  { period: "Period 1", time: "08:30 - 09:30", subject: "Mathematics", room: "Room 301", teacher: "Mr. Rahman", status: "past" },
  { period: "Period 2", time: "09:45 - 10:45", subject: "Physics", room: "Lab 204", teacher: "Mrs. Sultana", status: "past" },
  { period: "Period 3", time: "11:00 - 12:00", subject: "Bangla", room: "Room 301", teacher: "Mr. Hasan", status: "past" },
  { period: "Lunch", time: "12:00 - 13:00", subject: "Lunch Break", room: "Cafeteria", teacher: "", status: "break" },
  { period: "Period 4", time: "13:00 - 14:00", subject: "English Literature", room: "Room 301", teacher: "Miss Smith", status: "current" },
  { period: "Period 5", time: "14:15 - 15:15", subject: "World History", room: "Room 102", teacher: "Mr. David", status: "upcoming" },
];

export default function Hero() {
  const [activeTab, setActiveTab] = useState<"academic" | "calendar" | "timetable">("academic");

  return (
    <section className="relative overflow-hidden bg-slate-50 px-6 py-20 md:py-32 lg:px-8">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-35" />

      {/* Decorative Blobs */}
      <div className="absolute top-0 left-1/2 -z-10 -translate-x-1/2 transform-gpu blur-3xl sm:-top-80">
        <div
          className="aspect-1155/678 w-288.75 bg-linear-to-tr from-[#9089fc] to-[#67e8f9] opacity-25"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>
      <div className="absolute bottom-0 right-0 -z-10 h-96 w-96 translate-x-1/4 translate-y-1/4 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="absolute top-1/2 left-0 -z-10 h-72 w-72 -translate-x-1/3 -translate-y-1/2 rounded-full bg-indigo-400/10 blur-3xl" />

      <div className="mx-auto grid max-w-7xl gap-16 md:grid-cols-2 md:items-center">

        {/* --- LEFT: COPY & CTA --- */}
        <div className="max-w-2xl">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-50/60 px-4 py-2 text-xs font-semibold text-indigo-600 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-600"></span>
            </span>
            New: Interactive Class Timetables & Calendars
          </div>

          {/* Headline */}
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl leading-[1.08]">
            Every student&apos;s routine,{" "}
            <br className="hidden sm:block" />
            <span className="bg-linear-to-r from-indigo-600 via-violet-500 to-cyan-500 bg-clip-text text-transparent">
              coordinated flawlessly.
            </span>
          </h1>

          <p className="mt-7 max-w-lg text-lg leading-relaxed text-slate-600">
            EduJira centralizes academics, calendar events, routines, and roles
            into a single interface. Run schedule checks, double-booking alarms,
            and local audits effortlessly.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="/programs"
              className="group relative rounded-xl bg-indigo-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition-all hover:-translate-y-0.5 hover:bg-indigo-500 hover:shadow-xl hover:shadow-indigo-600/30"
            >
              <span className="relative z-10 flex items-center gap-2">
                Explore Features
                <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </span>
            </Link>
            <Link
              href="/login"
              className="group rounded-xl border border-slate-200 bg-white px-7 py-3.5 text-sm font-semibold text-slate-900 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50 hover:shadow-md"
            >
              <span className="flex items-center gap-2">
                Portal Login
                <svg className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </span>
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-14 grid grid-cols-3 gap-6 border-t border-slate-200/60 pt-8">
            <div className="group">
              <p className="text-3xl font-extrabold text-indigo-600 transition-colors group-hover:text-indigo-500">4 Portals</p>
              <p className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Role-Based Access</p>
            </div>
            <div className="group">
              <p className="text-3xl font-extrabold text-cyan-500 transition-colors group-hover:text-cyan-400">0 Overlaps</p>
              <p className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Conflict Detection</p>
            </div>
            <div className="group">
              <p className="text-3xl font-extrabold text-slate-700 transition-colors group-hover:text-slate-600">100% Client</p>
              <p className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Offline-Ready Sync</p>
            </div>
          </div>
        </div>

        {/* --- RIGHT: INTERACTIVE WIDGET --- */}
        <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
          {/* Glow behind card */}
          <div className="absolute -inset-2 rounded-3xl bg-linear-to-r from-indigo-500/20 via-violet-500/20 to-cyan-500/20 blur-2xl" />

          {/* Card */}
          <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-2xl shadow-slate-900/5 ring-1 ring-slate-900/5 backdrop-blur-sm sm:p-7">
            {/* Corner accent */}
            <div className="pointer-events-none absolute -top-20 -right-20 h-40 w-40 rounded-full bg-indigo-500/10 blur-3xl" />

            {/* Tabs */}
            <div className="relative mb-6 flex rounded-2xl bg-slate-100/80 p-1.5">
              {([
                { id: "academic" as const, label: "Report Card", icon: "📊" },
                { id: "calendar" as const, label: "Calendar", icon: "📅" },
                { id: "timetable" as const, label: "Timetable", icon: "⏰" },
              ]).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex-1 rounded-xl py-2.5 text-xs font-bold transition-all duration-200 ${
                    activeTab === tab.id
                      ? "bg-white text-indigo-600 shadow-sm shadow-slate-900/5"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <span className="relative z-10 flex items-center justify-center gap-1.5">
                    <span className="text-sm">{tab.icon}</span>
                    {tab.label}
                  </span>
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="min-h-[260px] flex flex-col justify-between">

              {/* REPORT CARD */}
              {activeTab === "academic" && (
                <div className="ledger-rules rounded-2xl border border-indigo-100 bg-white/70 p-5 shadow-inner">
                  <div className="mb-4 flex items-center justify-between border-b border-indigo-100 pb-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">Term report</p>
                      <p className="text-[10px] font-semibold text-slate-400">Class 10 · Section A</p>
                    </div>
                    <div className="seal-animate flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-dashed border-amber-400 bg-amber-50/80 text-center font-bold text-[9px] leading-tight text-amber-600 rotate-[-8deg] shadow-sm">
                      AI
                      <br />
                      VERIFIED
                    </div>
                  </div>
                  <div className="space-y-2">
                    {mockSubjects.map((s) => (
                      <div
                        key={s.name}
                        className="flex items-center justify-between rounded-lg border-b border-slate-100 py-2 last:border-0"
                      >
                        <div>
                          <p className="text-xs font-bold text-slate-700">{s.name}</p>
                          <p className="text-[10px] text-slate-400">{s.note}</p>
                        </div>
                        <span className={`rounded-lg px-2.5 py-1 text-xs font-extrabold ${s.color} bg-slate-100/80`}>
                          {s.grade}
                        </span>
                      </div>
                    ))}
                  </div>
                  <p className="mt-4 border-t border-slate-100 pt-3 text-[10px] italic text-slate-500">
                    &ldquo;Excellent analytical skill set. Focus on writing structure to secure consistent high grades.&rdquo;
                  </p>
                </div>
              )}

              {/* CALENDAR */}
              {activeTab === "calendar" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                    <span className="text-xs font-bold text-slate-800">Today&apos;s Events</span>
                    <span className="rounded-full border border-indigo-150 bg-indigo-50 px-2.5 py-1 text-[10px] font-bold text-indigo-600">
                      Wednesday, Aug 26
                    </span>
                  </div>
                  <div className="space-y-2.5">
                    {mockEvents.map((evt, idx) => (
                      <div
                        key={idx}
                        className={`flex items-center justify-between rounded-xl border p-3.5 transition-all hover:shadow-sm ${evt.color}`}
                      >
                        <div>
                          <h4 className="text-xs font-bold">{evt.title}</h4>
                          <p className="mt-0.5 flex items-center gap-1 text-[10px] opacity-75">
                            <span>📍 {evt.location}</span>
                            <span>·</span>
                            <span>⏰ {evt.time}</span>
                          </p>
                        </div>
                        <span className="rounded-lg border border-inherit bg-white px-2.5 py-1 text-[9px] font-extrabold uppercase">
                          {evt.badge}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TIMETABLE */}
              {activeTab === "timetable" && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                    <span className="text-xs font-bold text-slate-800">Class Schedule</span>
                    <span className="rounded-full border border-indigo-150 bg-indigo-50 px-2.5 py-1 text-[10px] font-bold text-indigo-600">
                      Grade 10 - Section A
                    </span>
                  </div>
                  <div className="grid max-h-[220px] grid-cols-1 gap-1.5 overflow-y-auto pr-1">
                    {mockTimetable.map((slot, idx) => {
                      const isCurrent = slot.status === "current";
                      const isPast = slot.status === "past";
                      const isBreak = slot.status === "break";
                      return (
                        <div
                          key={idx}
                          className={`flex items-center justify-between rounded-xl border p-2.5 text-xs transition-all ${
                            isCurrent
                              ? "border-indigo-300 bg-indigo-50 shadow-xs ring-1 ring-indigo-300/40"
                              : isBreak
                              ? "border-amber-200 bg-amber-50/50 text-amber-800"
                              : "border-slate-100 bg-white text-slate-700"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-12 shrink-0 text-[9px] font-bold uppercase text-slate-400">
                              {slot.period}
                            </span>
                            <div>
                              <p className={`font-bold ${isCurrent ? "text-indigo-800" : ""}`}>
                                {slot.subject}
                              </p>
                              {slot.teacher && (
                                <p className="mt-0.5 text-[9px] text-slate-400">
                                  {slot.teacher} · Room {slot.room}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-medium text-slate-400">
                              {slot.time}
                            </span>
                            {isCurrent ? (
                              <span className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                              </span>
                            ) : isPast ? (
                              <span className="text-[10px] font-bold text-emerald-500" title="Done">✓</span>
                            ) : null}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
