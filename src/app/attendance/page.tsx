"use client";

import { useEffect, useMemo, useState } from "react";
import { apiGet, apiPost } from "@/lib/api";
import {
  MOCK_STUDENTS,
  CLASSES,
  SECTIONS,
  MockStudent,
} from "@/data/mockAttendance";

// Flip to false once the backend is deployed and reachable
const USE_MOCK_DATA = true;

type Student = MockStudent;
type StatusValue = "Present" | "Absent" | "Late" | "Informed";

const STATUS_OPTIONS: StatusValue[] = ["Present", "Absent", "Late", "Informed"];

const AVATAR_PALETTE = [
  "bg-indigo-50 text-indigo-600",
  "bg-cyan-50 text-cyan-600",
  "bg-amber-50 text-amber-700",
  "bg-emerald-50 text-emerald-700",
  "bg-rose-50 text-rose-600",
];

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function avatarColor(name: string) {
  const sum = name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return AVATAR_PALETTE[sum % AVATAR_PALETTE.length];
}

export default function AttendancePage() {
  const [className, setClassName] = useState("Class 1");
  const [section, setSection] = useState("A");
  const [date] = useState(() => new Date().toISOString().split("T")[0]);
  const [students, setStudents] = useState<Student[]>([]);
  const [statusMap, setStatusMap] = useState<Record<string, StatusValue>>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function loadRoster() {
    setLoading(true);
    setSaved(false);

    if (USE_MOCK_DATA) {
      const filtered = MOCK_STUDENTS.filter(
        (s) => s.className === className && s.section === section,
      );
      setStudents(filtered);
      const defaults: Record<string, StatusValue> = {};
      filtered.forEach((s) => (defaults[s._id] = "Present"));
      setStatusMap(defaults);
      setLoading(false);
      return;
    }

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

    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      setSaving(false);
      setSaved(true);
      return;
    }

    const entries = students.map((s) => ({
      studentId: s._id,
      studentName: s.name,
      status: statusMap[s._id] || "Present",
    }));

    await apiPost("/attendance/bulk", { className, section, date, entries });
    setSaving(false);
    setSaved(true);
  }

  const summary = useMemo(() => {
    const counts: Record<StatusValue, number> = {
      Present: 0,
      Absent: 0,
      Late: 0,
      Informed: 0,
    };
    students.forEach((s) => {
      const status = statusMap[s._id];
      if (status) counts[status]++;
    });
    return counts;
  }, [students, statusMap]);

  const statusStyle: Record<StatusValue, string> = {
    Present: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Absent: "bg-rose-50 text-rose-700 border-rose-200",
    Late: "bg-amber-50 text-amber-700 border-amber-200",
    Informed: "bg-indigo-50 text-indigo-700 border-indigo-200",
  };

  const summaryColor: Record<StatusValue, string> = {
    Present: "text-emerald-600",
    Absent: "text-rose-600",
    Late: "text-amber-600",
    Informed: "text-indigo-600",
  };

  return (
    <div className="min-h-full bg-slate-50">
      <div className="mx-auto max-w-4xl px-6 py-16 lg:px-8">
        {/* Eyebrow badge, matching homepage hero */}
        <div className="mb-6 inline-flex items-center rounded-full border border-indigo-500/30 bg-indigo-50/50 px-3 py-1 text-sm font-medium text-indigo-600 backdrop-blur-sm">
          <span className="mr-2 flex h-2 w-2 animate-pulse rounded-full bg-indigo-600"></span>
          Digital Attendance
        </div>

        <div className="flex flex-wrap items-end justify-between gap-4">
          <h1
            style={{ fontFamily: "var(--font-fraunces)" }}
            className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl"
          >
            Attendance Management
          </h1>
          <p
            style={{ fontFamily: "var(--font-plex-mono)" }}
            className="pb-1 text-sm text-slate-400"
          >
            {date}
          </p>
        </div>

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

        {/* Summary strip, echoes homepage stat row (4 Portals / 0 Overlaps / 100% Client) */}
        {students.length > 0 && (
          <div className="mt-8 flex gap-8 border-t border-b border-slate-200 py-5">
            {STATUS_OPTIONS.map((opt) => (
              <div key={opt}>
                <p className={`text-2xl font-bold ${summaryColor[opt]}`}>
                  {summary[opt]}
                </p>
                <p className="text-xs font-medium tracking-wide text-slate-400 uppercase">
                  {opt}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Roster */}
        <div className="mt-8">
          {loading ? (
            <p className="text-slate-400">Loading roster...</p>
          ) : students.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-400">
              No students in {className} - {section} yet. Try a different class
              or section.
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
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold ${avatarColor(
                          s.name,
                        )}`}
                      >
                        {initials(s.name)}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{s.name}</p>
                        <p
                          style={{ fontFamily: "var(--font-plex-mono)" }}
                          className="text-xs text-slate-400"
                        >
                          {s.studentId}
                        </p>
                      </div>
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
                  className="rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-indigo-500 hover:shadow-md disabled:opacity-50 disabled:hover:translate-y-0"
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
