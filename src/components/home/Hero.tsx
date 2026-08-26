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
      {/* Background Grid Pattern & Mesh Glow */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-35" />
      
      <div className="absolute top-0 left-1/2 -z-10 -translate-x-1/2 transform-gpu blur-3xl sm:-top-80">
        <div
          className="aspect-1155/678 w-288.75 bg-linear-to-tr from-[#9089fc] to-[#67e8f9] opacity-25"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>

      <div className="mx-auto grid max-w-7xl gap-16 md:grid-cols-2 md:items-center">
        
        {/* --- LEFT HAND SIDE: COPY & CALL-TO-ACTIONS --- */}
        <div className="max-w-2xl">
          {/* New Release Announcement Badge */}
          <div className="mb-6 inline-flex items-center rounded-full border border-indigo-500/20 bg-indigo-50/50 px-3.5 py-1.5 text-xs font-semibold text-indigo-600 backdrop-blur-sm">
            <span className="relative mr-2 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
            </span>
            New: Interactive Class Timetables & Calendars
          </div>

          {/* Headline */}
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl leading-[1.1]">
            Every student&apos;s routine, <br />
            <span className="bg-linear-to-r from-indigo-600 via-indigo-500 to-cyan-500 bg-clip-text text-transparent">
              coordinated flawlessly.
            </span>
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-8 text-slate-600">
            EduJira centralizes academics, calendar events, routines, and roles into a single interface. Run schedule checks, double-booking alarms, and local audits effortlessly.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="/programs"
              className="rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-indigo-500 hover:shadow-md focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Explore Features
            </Link>
            <Link
              href="/login"
              className="rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-900 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50"
            >
              Portal Login
              <span aria-hidden="true" className="ml-1.5 text-slate-400">
                →
              </span>
            </Link>
          </div>

          {/* Core Stat Counters */}
          <div className="mt-12 grid grid-cols-3 gap-6 border-t border-slate-200/60 pt-8">
            <div>
              <p className="text-3xl font-extrabold text-indigo-600">4 Portals</p>
              <p className="text-xs text-slate-500 font-semibold mt-1 uppercase tracking-wider">Role-Based Access</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-cyan-500">0 Overlaps</p>
              <p className="text-xs text-slate-500 font-semibold mt-1 uppercase tracking-wider">Conflict Detection</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-slate-700">100% Client</p>
              <p className="text-xs text-slate-500 font-semibold mt-1 uppercase tracking-wider">Offline-Ready Sync</p>
            </div>
          </div>

        </div>

        {/* --- RIGHT HAND SIDE: INTERACTIVE WIDGET --- */}
        <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
          {/* Background Ambient Glow */}
          <div className="absolute -inset-1.5 rounded-2xl bg-linear-to-r from-indigo-500 to-cyan-500 opacity-20 blur-xl transition duration-1000 group-hover:opacity-30"></div>

          {/* Interactive Card */}
          <div className="relative rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xl ring-1 ring-slate-900/5">
            
            {/* Widget Tabs Selector */}
            <div className="flex rounded-xl bg-slate-100 p-1 mb-6">
              <button
                type="button"
                onClick={() => setActiveTab("academic")}
                className={`flex-1 rounded-lg py-2.5 text-xs font-bold transition-all ${
                  activeTab === "academic"
                    ? "bg-white text-indigo-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                📊 Report Card
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("calendar")}
                className={`flex-1 rounded-lg py-2.5 text-xs font-bold transition-all ${
                  activeTab === "calendar"
                    ? "bg-white text-indigo-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                📅 Calendar
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("timetable")}
                className={`flex-1 rounded-lg py-2.5 text-xs font-bold transition-all ${
                  activeTab === "timetable"
                    ? "bg-white text-indigo-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                ⏰ Timetable
              </button>
            </div>

            {/* TAB CONTENTS */}
            <div className="min-h-[260px] flex flex-col justify-between">
              
              {/* --- REPORT CARD TAB --- */}
              {activeTab === "academic" && (
                <div className="ledger-rules rounded-xl border border-indigo-100 bg-white/60 p-5 shadow-inner">
                  <div className="mb-4 flex items-center justify-between border-b border-indigo-100 pb-3">
                    <div>
                      <p className="font-semibold text-sm text-slate-800">Term report</p>
                      <p className="text-[10px] font-semibold text-slate-400">Class 10 · Section A</p>
                    </div>
                    
                    {/* Rotating Stamp */}
                    <div
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-amber-500 text-center font-bold text-[9px] leading-tight text-amber-600 rotate-[-8deg] bg-amber-50/50"
                    >
                      AI
                      <br />
                      VERIFIED
                    </div>
                  </div>

                  <div className="space-y-2">
                    {mockSubjects.map((s) => (
                      <div
                        key={s.name}
                        className="flex items-center justify-between border-b border-slate-100 py-1.5 last:border-0"
                      >
                        <div>
                          <p className="text-xs font-bold text-slate-700">{s.name}</p>
                          <p className="text-[10px] text-slate-400">{s.note}</p>
                        </div>
                        <span className={`text-xs font-extrabold ${s.color} bg-slate-100/80 px-2 py-0.5 rounded`}>
                          {s.grade}
                        </span>
                      </div>
                    ))}
                  </div>

                  <p className="mt-4 text-[10px] italic text-slate-500 border-t border-slate-100 pt-2.5">
                    &ldquo;Excellent analytical skill set. Focus on writing structure to secure consistent high grades.&rdquo;
                  </p>
                </div>
              )}

              {/* --- CALENDAR TAB --- */}
              {activeTab === "calendar" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-xs font-bold text-slate-800">Today&apos;s Events</span>
                    <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-150 px-2 py-0.5 rounded-full">
                      Wednesday, Aug 26
                    </span>
                  </div>

                  <div className="space-y-2">
                    {mockEvents.map((evt, idx) => (
                      <div
                        key={idx}
                        className={`flex items-center justify-between rounded-xl border p-3 ${evt.color}`}
                      >
                        <div>
                          <h4 className="text-xs font-bold">{evt.title}</h4>
                          <p className="text-[10px] opacity-75 mt-0.5 flex items-center gap-1">
                            <span>📍 {evt.location}</span>
                            <span>•</span>
                            <span>⏰ {evt.time}</span>
                          </p>
                        </div>
                        <span className="text-[9px] font-extrabold uppercase bg-white border border-inherit px-2 py-0.5 rounded-md">
                          {evt.badge}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* --- TIMETABLE TAB --- */}
              {activeTab === "timetable" && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-xs font-bold text-slate-800">Class Schedule</span>
                    <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-150 px-2 py-0.5 rounded-full">
                      Grade 10 - Section A
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-1.5 max-h-[220px] overflow-y-auto pr-1">
                    {mockTimetable.map((slot, idx) => {
                      const isCurrent = slot.status === "current";
                      const isPast = slot.status === "past";
                      const isBreak = slot.status === "break";

                      return (
                        <div
                          key={idx}
                          className={`flex items-center justify-between rounded-lg border p-2 text-xs transition-all ${
                            isCurrent
                              ? "bg-indigo-50 border-indigo-300 ring-1 ring-indigo-300/40 shadow-xs"
                              : isBreak
                              ? "bg-amber-50/50 border-amber-200 text-amber-800"
                              : "bg-white border-slate-100 text-slate-700"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-[9px] font-bold text-slate-400 uppercase w-12 shrink-0">
                              {slot.period}
                            </span>
                            <div>
                              <p className={`font-bold ${isCurrent ? "text-indigo-800" : ""}`}>
                                {slot.subject}
                              </p>
                              {slot.teacher && (
                                <p className="text-[9px] text-slate-400 mt-0.5">
                                  {slot.teacher} • Room {slot.room}
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
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                              </span>
                            ) : isPast ? (
                              <span className="text-emerald-500 font-bold text-[10px]" title="Done">✓</span>
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
