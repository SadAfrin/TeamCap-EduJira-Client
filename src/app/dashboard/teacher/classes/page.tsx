"use client";

import { useEffect, useState } from "react";
import { apiGet } from "@/lib/api";

export default function TeacherClassesPage() {
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>("Class 8");
  const [selectedSection, setSelectedSection] = useState<string>("B");
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [classesRes, studentsRes] = await Promise.all([
          apiGet("/api/classes"),
          apiGet(`/api/students?className=${encodeURIComponent(selectedClass)}&section=${encodeURIComponent(selectedSection)}`),
        ]);

        if (classesRes.success) setClasses(classesRes.data || []);
        if (studentsRes.success) setStudents(studentsRes.data || []);
      } catch (err) {
        console.error("Failed to load classes:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [selectedClass, selectedSection]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">My Classes & Rosters</h1>
        <p className="text-xs text-slate-500 mt-1">Supervised divisions, subject allocations, and student directories</p>
      </div>

      {/* Class Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { name: "Class 8", section: "B", room: "Room 201", subject: "Mathematics & Science", count: 28 },
          { name: "Class 8", section: "A", room: "Room 201", subject: "Mathematics", count: 26 },
          { name: "Class 9", section: "A", room: "Room 301", subject: "Physics", count: 30 },
        ].map((c, idx) => (
          <div
            key={idx}
            onClick={() => {
              setSelectedClass(c.name);
              setSelectedSection(c.section);
            }}
            className={`p-5 rounded-2xl border cursor-pointer transition-all ${
              selectedClass === c.name && selectedSection === c.section
                ? "border-blue-500 bg-blue-50/50 shadow-md ring-2 ring-blue-500/20"
                : "border-slate-200 bg-white hover:border-slate-300"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="rounded-lg bg-blue-100/70 px-2.5 py-0.5 text-xs font-bold text-blue-800">
                {c.name} - Sec {c.section}
              </span>
              <span className="text-xs text-slate-500 font-semibold">{c.room}</span>
            </div>
            <h3 className="mt-3 text-base font-extrabold text-slate-900">{c.subject}</h3>
            <p className="text-xs text-slate-500 mt-1">{c.count} Students Enrolled</p>
          </div>
        ))}
      </div>

      {/* Student Directory Table */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <h3 className="font-bold text-slate-900 text-sm mb-4">
          Student Roster: {selectedClass} – Section {selectedSection} ({students.length} students)
        </h3>

        {loading ? (
          <div className="py-12 text-center text-xs text-slate-400">Loading student directory...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-600">
                <tr>
                  <th className="py-3 px-4">Roll</th>
                  <th className="py-3 px-4">Student ID</th>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Gender</th>
                  <th className="py-3 px-4">Parent Name</th>
                  <th className="py-3 px-4">Contact Phone</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((s) => (
                  <tr key={s.studentId} className="hover:bg-slate-50/80">
                    <td className="py-3 px-4 font-mono font-bold text-slate-700">#{s.roll || "01"}</td>
                    <td className="py-3 px-4 font-mono font-bold text-blue-700">{s.studentId}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">{s.name}</td>
                    <td className="py-3 px-4 text-slate-600">{s.gender || "Male"}</td>
                    <td className="py-3 px-4 text-slate-700">{s.parentName || "—"}</td>
                    <td className="py-3 px-4 text-slate-500">{s.parentPhone || s.phone || "—"}</td>
                    <td className="py-3 px-4">
                      <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 uppercase">
                        {s.status || "Active"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
