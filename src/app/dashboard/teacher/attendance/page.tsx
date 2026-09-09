"use client";

import { useEffect, useState } from "react";
import { apiGet, apiPost } from "@/lib/api";
import toast from "react-hot-toast";

type StatusValue = "Present" | "Absent" | "Late";

export default function TeacherAttendancePage() {
  const [className, setClassName] = useState("Class 8");
  const [section, setSection] = useState("B");
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [students, setStudents] = useState<any[]>([]);
  const [statusMap, setStatusMap] = useState<Record<string, StatusValue>>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadRoster = async () => {
    setLoading(true);
    try {
      const res = await apiGet(`/api/students?className=${encodeURIComponent(className)}&section=${encodeURIComponent(section)}`);
      if (res.success) {
        const studentList = res.data || [];
        setStudents(studentList);

        // Check if attendance already taken for this date
        const attRes = await apiGet(`/api/attendance?className=${encodeURIComponent(className)}&section=${encodeURIComponent(section)}&date=${date}`);
        const defaults: Record<string, StatusValue> = {};

        studentList.forEach((s: any) => {
          defaults[s.studentId] = "Present";
        });

        if (attRes.success && Array.isArray(attRes.data)) {
          attRes.data.forEach((rec: any) => {
            defaults[rec.studentId] = rec.status as StatusValue;
          });
        }
        setStatusMap(defaults);
      }
    } catch (err) {
      console.error("Failed to load roster:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRoster();
  }, [className, section, date]);

  const setStudentStatus = (studentId: string, st: StatusValue) => {
    setStatusMap((prev) => ({ ...prev, [studentId]: st }));
  };

  const handleMarkAll = (st: StatusValue) => {
    const updated: Record<string, StatusValue> = {};
    students.forEach((s) => {
      updated[s.studentId] = st;
    });
    setStatusMap(updated);
  };

  const handleSave = async () => {
    if (students.length === 0) return;
    setSaving(true);
    try {
      const entries = students.map((s) => ({
        studentId: s.studentId,
        studentName: s.name,
        className,
        section,
        date,
        status: statusMap[s.studentId] || "Present",
      }));

      const res = await apiPost("/api/attendance/bulk", {
        className,
        section,
        date,
        entries,
      });

      if (res.success) {
        toast.success(`Attendance submitted for ${students.length} students! ✓`);
      } else {
        toast.error(res.message || "Failed to save attendance");
      }
    } catch (err: any) {
      toast.error(err.message || "Error saving attendance");
    } finally {
      setSaving(false);
    }
  };

  const presentCount = Object.values(statusMap).filter((v) => v === "Present").length;
  const absentCount = Object.values(statusMap).filter((v) => v === "Absent").length;
  const lateCount = Object.values(statusMap).filter((v) => v === "Late").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Digital Classroom Attendance</h1>
          <p className="text-xs text-slate-500 mt-1">Mark daily roll call with instant student & parent sync</p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => handleMarkAll("Present")}
            className="rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-100"
          >
            ✓ Mark All Present
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || students.length === 0}
            className="rounded-xl bg-blue-600 px-6 py-2 text-xs font-bold text-white shadow-md shadow-blue-600/30 hover:bg-blue-500 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Daily Attendance"}
          </button>
        </div>
      </div>

      {/* Selector Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Class</label>
          <select
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-900 outline-none focus:bg-white focus:border-blue-600"
          >
            <option value="Class 6">Class 6</option>
            <option value="Class 7">Class 7</option>
            <option value="Class 8">Class 8</option>
            <option value="Class 9">Class 9</option>
            <option value="Class 10">Class 10</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Section</label>
          <select
            value={section}
            onChange={(e) => setSection(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-900 outline-none focus:bg-white focus:border-blue-600"
          >
            <option value="A">Section A</option>
            <option value="B">Section B</option>
            <option value="C">Section C</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-900 outline-none focus:bg-white focus:border-blue-600"
          />
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4 text-center">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Present</span>
          <p className="mt-1 text-2xl font-black text-emerald-900">{presentCount}</p>
        </div>
        <div className="rounded-2xl border border-rose-100 bg-rose-50/60 p-4 text-center">
          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700">Absent</span>
          <p className="mt-1 text-2xl font-black text-rose-900">{absentCount}</p>
        </div>
        <div className="rounded-2xl border border-amber-100 bg-amber-50/60 p-4 text-center">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">Late</span>
          <p className="mt-1 text-2xl font-black text-amber-900">{lateCount}</p>
        </div>
      </div>

      {/* Student Attendance Table */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <h3 className="font-bold text-slate-900 text-sm mb-4">
          Student Roster for {className} – Section {section} ({students.length} students)
        </h3>

        {loading ? (
          <div className="py-12 text-center text-xs text-slate-400">Loading roster...</div>
        ) : students.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400">
            No students found in {className} – Section {section}.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {students.map((s) => {
              const currentSt = statusMap[s.studentId] || "Present";
              return (
                <div key={s.studentId} className="flex flex-col sm:flex-row sm:items-center justify-between py-3.5 gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 font-bold text-xs text-slate-700 font-mono">
                      #{s.roll || "01"}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-xs">{s.name}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{s.studentId} • Guardian: {s.parentName || "—"}</p>
                    </div>
                  </div>

                  {/* Status Toggle Buttons */}
                  <div className="flex items-center gap-1.5 self-end sm:self-center">
                    {(["Present", "Absent", "Late"] as StatusValue[]).map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setStudentStatus(s.studentId, st)}
                        className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
                          currentSt === st
                            ? st === "Present"
                              ? "bg-emerald-600 text-white shadow-xs"
                              : st === "Absent"
                              ? "bg-rose-600 text-white shadow-xs"
                              : "bg-amber-500 text-white shadow-xs"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
