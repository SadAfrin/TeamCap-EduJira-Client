"use client";

import { useEffect, useState } from "react";
import { apiGet } from "@/lib/api";

const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];

export default function StudentRoutinePage() {
  const [selectedDay, setSelectedDay] = useState("Sunday");
  const [routineData, setRoutineData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRoutine() {
      try {
        setLoading(true);
        const res = await apiGet(`/api/routines?className=Class 8&section=B&day=${selectedDay}`);
        if (res.success && res.data?.[0]?.periodSlots) {
          setRoutineData(res.data[0].periodSlots);
        } else {
          setRoutineData([]);
        }
      } catch (err) {
        console.error("Failed to load routine:", err);
      } finally {
        setLoading(false);
      }
    }
    loadRoutine();
  }, [selectedDay]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Class Routine & Timetable</h1>
          <p className="text-xs text-slate-500 mt-1">Class 8 – Section B • Academic Year 2026</p>
        </div>
        <div className="flex rounded-xl bg-slate-100 p-1">
          {daysOfWeek.map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                selectedDay === day ? "bg-white text-indigo-600 shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {day.slice(0, 3)}
            </button>
          ))}
        </div>
      </div>

      {/* Routine Grid */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h3 className="font-bold text-slate-900 text-sm">Schedule for {selectedDay}</h3>
          <span className="rounded-full bg-emerald-50 px-3 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-200">
            {routineData.length} Scheduled Periods
          </span>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs text-slate-400">Loading daily routine...</div>
        ) : routineData.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400">No scheduled periods for {selectedDay}.</div>
        ) : (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {routineData.map((slot, idx) => (
              <div
                key={idx}
                className="flex items-start justify-between rounded-2xl border border-slate-200/90 bg-slate-50/50 p-4 transition-all hover:bg-white hover:shadow-md hover:border-indigo-200"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-700 border border-indigo-100">
                      {slot.period}
                    </span>
                    <span className="text-xs font-semibold text-slate-500 font-mono">{slot.time}</span>
                  </div>
                  <h4 className="font-extrabold text-slate-900 text-sm">{slot.subject}</h4>
                  <p className="text-xs text-slate-600 flex items-center gap-1.5">
                    <span>👨‍🏫 {slot.teacher}</span>
                  </p>
                </div>
                <span className="rounded-xl bg-slate-200/60 px-2.5 py-1 text-[11px] font-bold text-slate-700">
                  {slot.room}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
