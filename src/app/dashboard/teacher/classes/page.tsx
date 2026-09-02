"use client";

import { useEffect, useState } from "react";
import { apiGet } from "@/lib/api";

export default function TeacherClassesPage() {
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await apiGet("/api/classes");
        if (res.success) setClasses(res.data);
      } catch (err) {
        console.error("Failed to load classes:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="border-b border-slate-200/80 pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">My Assigned Classes & Rosters</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          View enrolled students, section capacities, and curriculum breakdown for your assigned grades.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {classes.map((cls) => (
          <div key={cls.className} className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 text-lg">{cls.className}</span>
              <span className="rounded-md bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700">
                {cls.totalStudents ?? 0} Students
              </span>
            </div>

            <p className="mt-2 text-xs text-slate-500">{cls.roomNumber || "Classroom 201"} • Teacher: {cls.classTeacher || "You"}</p>

            <div className="mt-4 pt-3 border-t border-slate-100">
              <p className="text-[11px] font-bold uppercase text-slate-400">Sections</p>
              <div className="mt-1.5 flex gap-1.5">
                {cls.sections?.map((sec: string) => (
                  <span key={sec} className="rounded bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">
                    Section {sec}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
