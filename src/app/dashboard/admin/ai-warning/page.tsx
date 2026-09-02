"use client";

import { useState } from "react";
import toast from "react-hot-toast";

type RiskStudent = {
  studentId: string;
  name: string;
  className: string;
  section: string;
  riskScore: number; // 0-100
  riskLevel: "Critical" | "Moderate" | "Watchlist";
  triggers: string[];
  attendanceRate: number;
  avgGrade: string;
  parentPhone: string;
};

const MOCK_RISK_STUDENTS: RiskStudent[] = [
  {
    studentId: "STD-805",
    name: "Nusrat Jahan",
    className: "Class 8",
    section: "B",
    riskScore: 84,
    riskLevel: "Critical",
    triggers: ["Consecutive 4 absences this week", "Mathematics quiz score dropped 35%", "Homework non-submission (3 tasks)"],
    attendanceRate: 68,
    avgGrade: "C-",
    parentPhone: "+880 1711-998803",
  },
  {
    studentId: "STD-901",
    name: "Mim Akter",
    className: "Class 9",
    section: "A",
    riskScore: 65,
    riskLevel: "Moderate",
    triggers: ["Frequent Monday late arrivals (4 times)", "Physics mid-term low score alert"],
    attendanceRate: 81,
    avgGrade: "B-",
    parentPhone: "+880 1711-998807",
  },
  {
    studentId: "STD-1002",
    name: "Sumaiya Islam",
    className: "Class 10",
    section: "A",
    riskScore: 52,
    riskLevel: "Watchlist",
    triggers: ["Chemistry lab reports pending", "Attendance fluctuation past 14 days"],
    attendanceRate: 86,
    avgGrade: "B+",
    parentPhone: "+880 1711-998810",
  },
];

export default function AIEarlyWarningSystemPage() {
  const [students] = useState<RiskStudent[]>(MOCK_RISK_STUDENTS);

  function handleTriggerIntervention(name: string) {
    toast.success(`Counseling & Parent Alert scheduled for ${name}!`);
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">AI Early Warning System</h1>
            <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-bold text-purple-700 border border-purple-200">
              ⚡ Predictive Engine
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Machine-learning risk analytics identifying students vulnerable to academic failure or attendance dropouts.
          </p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-5">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-700">Critical Attention Required</span>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-rose-900">1 Student</span>
            <span className="text-xs font-bold text-rose-600">Immediate Action</span>
          </div>
          <p className="mt-2 text-xs text-rose-600">Risk Score &gt; 80%</p>
        </div>

        <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-5">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700">Moderate Academic Risk</span>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-amber-900">2 Students</span>
            <span className="text-xs font-bold text-amber-600">Counseling Alert</span>
          </div>
          <p className="mt-2 text-xs text-amber-600">Risk Score 50–79%</p>
        </div>

        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Safe / On Track</span>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-900">92%</span>
            <span className="text-xs font-bold text-emerald-600">Normal Progress</span>
          </div>
          <p className="mt-2 text-xs text-emerald-600">Institution-wide stability</p>
        </div>
      </div>

      {/* Flagged Students Table */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">Flagged Risk Cases</h2>
          <span className="text-xs text-slate-400">Live AI Trend Detection</span>
        </div>

        <div className="divide-y divide-slate-100">
          {students.map((st) => (
            <div key={st.studentId} className="p-6 transition-colors hover:bg-slate-50/50">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl font-bold text-base ${
                    st.riskLevel === "Critical"
                      ? "bg-rose-100 text-rose-700 border border-rose-200"
                      : "bg-amber-100 text-amber-700 border border-amber-200"
                  }`}>
                    {st.riskScore}%
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-900 text-base">{st.name}</h3>
                      <span className="font-mono text-xs text-slate-400">({st.studentId})</span>
                      <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-700">
                        {st.className} - {st.section}
                      </span>
                    </div>

                    <div className="mt-2 flex flex-wrap gap-2">
                      {st.triggers.map((trig, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 rounded-md bg-rose-50 px-2 py-1 text-xs font-semibold text-rose-700 border border-rose-100"
                        >
                          ⚠️ {trig}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={() => handleTriggerIntervention(st.name)}
                    className="rounded-xl bg-purple-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-purple-500"
                  >
                    Trigger Intervention
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
