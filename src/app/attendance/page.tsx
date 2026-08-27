"use client";

import { useEffect, useState } from "react";
import { apiGet, apiPost } from "@/lib/api";

type Student = {
  _id: string;
  studentId: string;
  name: string;
  className: string;
  section: string;
};

type StatusValue = "Present" | "Absent" | "Late" | "Informed";

const CLASSES = ["Class 8", "Class 9"];
const SECTIONS = ["A", "B"];
const STATUS_OPTIONS: StatusValue[] = ["Present", "Absent", "Late", "Informed"];

export default function AttendancePage() {
  const [className, setClassName] = useState("Class 8");
  const [section, setSection] = useState("B");
  const [date] = useState(() => new Date().toISOString().split("T")[0]);
  const [students, setStudents] = useState<Student[]>([]);
  const [statusMap, setStatusMap] = useState<Record<string, StatusValue>>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function loadRoster() {
    setLoading(true);
    setSaved(false);
    const json = await apiGet(
      `/students?className=${encodeURIComponent(className)}&section=${section}`,
    );
    if (json.success) {
      setStudents(json.data);
      const defaults: Record<string, StatusValue> = {};
      json.data.forEach((s: Student) => (defaults[s._id] = "Present"));

      const existing = await apiGet(
        `/attendance?className=${encodeURIComponent(className)}&section=${section}&date=${date}`,
      );
      if (existing.success) {
        existing.data.forEach((rec: any) => {
          defaults[rec.studentId] = rec.status;
        });
      }
      setStatusMap(defaults);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadRoster();
  }, [className, section]);

  function setStatus(studentDbId: string, status: StatusValue) {
    setStatusMap((prev) => ({ ...prev, [studentDbId]: status }));
  }

  async function handleSave() {
    setSaving(true);
    const entries = students.map((s) => ({
      studentId: s._id,
      studentName: s.name,
      status: statusMap[s._id] || "Present",
    }));

    await apiPost("/attendance/bulk", { className, section, date, entries });
    setSaving(false);
    setSaved(true);
  }

  const statusStyle: Record<StatusValue, string> = {
    Present: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Absent: "bg-rose-50 text-rose-700 border-rose-200",
    Late: "bg-amber-50 text-amber-700 border-amber-200",
    Informed: "bg-indigo-50 text-indigo-700 border-indigo-200",
  };

  return (
    <div className="min-h-full bg-slate-50">
      <div className="mx-auto max-w-4xl px-6 py-16 lg:px-8">
        {/* Header, matching hero badge/heading style */}
        <div className="mb-8 inline-flex items-center rounded-full border border-indigo-500/30 bg-indigo-50/50 px-3 py-1 text-sm font-medium text-indigo-600 backdrop-blur-sm">
          <span className="mr-2 flex h-2 w-2 animate-pulse rounded-full bg-indigo-600"></span>
          Digital Attendance
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          Attendance Management
        </h1>
        <p className="mt-2 text-sm text-slate-500">{date}</p>

        {/* Filters */}
        <div className="mt-8 flex gap-4">
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium text-slate-600">
              Class
            </label>
            <select
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
            >
              {CLASSES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium text-slate-600">
              Section
            </label>
            <select
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              value={section}
              onChange={(e) => setSection(e.target.value)}
            >
              {SECTIONS.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Roster card, matching homepage's white rounded-2xl card style */}
        <div className="mt-8">
          {loading ? (
            <p className="text-slate-400">Loading roster...</p>
          ) : students.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-400">
              No students found for {className} - {section}.
            </div>
          ) : (
            <>
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                {students.map((s, i) => (
                  <div
                    key={s._id}
                    className={`flex items-center justify-between px-6 py-4 ${
                      i !== students.length - 1
                        ? "border-b border-slate-100"
                        : ""
                    }`}
                  >
                    <div>
                      <p className="font-semibold text-slate-900">{s.name}</p>
                      <p className="text-xs text-slate-400">
                        ID: {s.studentId}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {STATUS_OPTIONS.map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setStatus(s._id, opt)}
                          className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
                            statusMap[s._id] === opt
                              ? statusStyle[opt]
                              : "border-slate-200 bg-white text-slate-400 hover:bg-slate-50"
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex items-center gap-3">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Attendance"}
                </button>
                {saved && (
                  <span className="text-sm font-medium text-emerald-600">
                    Saved ✓
                  </span>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
