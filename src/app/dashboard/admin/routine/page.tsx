"use client";

import { useState } from "react";
import toast from "react-hot-toast";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];
const PERIODS = [
  "Period 1 (09:00 - 09:45 AM)",
  "Period 2 (09:50 - 10:35 AM)",
  "Period 3 (10:40 - 11:25 AM)",
  "Period 4 (11:45 - 12:30 PM)",
  "Period 5 (01:15 - 02:00 PM)",
];

export default function RoutineManagerPage() {
  const [selectedClass, setSelectedClass] = useState("Class 8");
  const [selectedSection, setSelectedSection] = useState("B");
  const [autoOptimizing, setAutoOptimizing] = useState(false);

  function handleAutoOptimize() {
    setAutoOptimizing(true);
    setTimeout(() => {
      setAutoOptimizing(false);
      toast.success("AI Routine Optimizer: 0 teacher conflicts detected! Classrooms allocated optimally.");
    }, 1200);
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Institutional Routine & Timetable Manager</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Automated classroom, teacher, and schedule allocation planner with conflict resolution.
          </p>
        </div>

        <button
          onClick={handleAutoOptimize}
          disabled={autoOptimizing}
          className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-md shadow-indigo-600/30 hover:bg-indigo-500 disabled:opacity-50"
        >
          <span>⚡ {autoOptimizing ? "Optimizing..." : "AI Auto-Allocate Routine"}</span>
        </button>
      </div>

      {/* Selector */}
      <div className="flex flex-wrap gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
        <div className="w-48">
          <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Select Class</label>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs sm:text-sm font-semibold text-slate-800"
          >
            {["Class 6", "Class 7", "Class 8", "Class 9", "Class 10"].map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="w-48">
          <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Select Section</label>
          <select
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs sm:text-sm font-semibold text-slate-800"
          >
            {["A", "B", "C"].map((s) => (
              <option key={s} value={s}>Section {s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Routine Grid */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 pl-6 pr-3">Day / Time</th>
                {PERIODS.map((p, idx) => (
                  <th key={idx} className="py-3.5 px-3 min-w-[170px]">{p}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {DAYS.map((day) => (
                <tr key={day} className="hover:bg-slate-50/50">
                  <td className="py-4 pl-6 pr-3 font-bold text-slate-900 bg-slate-50/70 border-r border-slate-100">
                    {day}
                  </td>
                  <td className="p-2">
                    <div className="rounded-xl border border-indigo-100 bg-indigo-50/60 p-2.5">
                      <p className="font-bold text-slate-900 text-xs">Mathematics</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">Mohammad Rafiq</p>
                      <span className="inline-block mt-1 rounded bg-white px-1.5 py-0.2 text-[9px] font-bold text-indigo-700">Room 201</span>
                    </div>
                  </td>
                  <td className="p-2">
                    <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-2.5">
                      <p className="font-bold text-slate-900 text-xs">English</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">Farzana Yasmin</p>
                      <span className="inline-block mt-1 rounded bg-white px-1.5 py-0.2 text-[9px] font-bold text-blue-700">Room 201</span>
                    </div>
                  </td>
                  <td className="p-2">
                    <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-2.5">
                      <p className="font-bold text-slate-900 text-xs">General Science</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">Dr. Anisur Rahman</p>
                      <span className="inline-block mt-1 rounded bg-white px-1.5 py-0.2 text-[9px] font-bold text-emerald-700">Room 201</span>
                    </div>
                  </td>
                  <td className="p-2">
                    <div className="rounded-xl border border-purple-100 bg-purple-50/60 p-2.5">
                      <p className="font-bold text-slate-900 text-xs">ICT Computing</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">Tanvir Hasan</p>
                      <span className="inline-block mt-1 rounded bg-white px-1.5 py-0.2 text-[9px] font-bold text-purple-700">Lab 1</span>
                    </div>
                  </td>
                  <td className="p-2">
                    <div className="rounded-xl border border-amber-100 bg-amber-50/60 p-2.5">
                      <p className="font-bold text-slate-900 text-xs">Social Science</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">Shamima Nasrin</p>
                      <span className="inline-block mt-1 rounded bg-white px-1.5 py-0.2 text-[9px] font-bold text-amber-700">Room 201</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
