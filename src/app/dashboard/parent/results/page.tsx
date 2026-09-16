"use client";

import { useEffect, useState } from "react";
import { apiGet } from "@/lib/api";

export default function ParentResultsPage() {
  const [term, setTerm] = useState("Mid Term");
  const [transcriptData, setTranscriptData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTranscript() {
      try {
        setLoading(true);
        const res = await apiGet(`/api/results/transcript?studentId=STD-801&term=${term}`);
        if (res.success) {
          setTranscriptData(res.data);
        }
      } catch (err) {
        console.error("Failed to load results:", err);
      } finally {
        setLoading(false);
      }
    }
    loadTranscript();
  }, [term]);

  const results = transcriptData?.results || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Child Report Cards & Examination Grades</h1>
          <p className="text-xs text-slate-500 mt-1">Rahim Uddin • Class 8 – Section B • Roll #01</p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-xs outline-none focus:border-amber-600"
          >
            <option value="Mid Term">Mid Term Examination</option>
            <option value="Final Term">Final Term Examination</option>
          </select>

          <button
            onClick={() => window.print()}
            className="rounded-xl bg-amber-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-amber-500"
          >
            Download / Print Transcript 🖨️
          </button>
        </div>
      </div>

      {/* GPA Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-5 text-center">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">Term GPA</span>
          <p className="mt-1 text-3xl font-black text-amber-950">{transcriptData?.gpa || 5.0}</p>
          <span className="text-xs font-semibold text-amber-700">Out of 5.00</span>
        </div>
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5 text-center">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">Overall Grade</span>
          <p className="mt-1 text-3xl font-black text-emerald-950">{transcriptData?.overallGrade || "A+"}</p>
          <span className="text-xs font-semibold text-emerald-700">Passed with Distinction</span>
        </div>
        <div className="rounded-2xl border border-purple-200 bg-purple-50/50 p-5 text-center">
          <span className="text-[11px] font-bold uppercase tracking-wider text-purple-800">Marks Average</span>
          <p className="mt-1 text-3xl font-black text-purple-950">{transcriptData?.averageMarks || 89.0}%</p>
          <span className="text-xs font-semibold text-purple-700">Total Marks: {transcriptData?.totalMarks || 356}/400</span>
        </div>
      </div>

      {/* Results Table with AI Narrative feedback */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <h3 className="font-bold text-slate-900 text-sm mb-4">Subject-Wise Evaluation & Teacher AI Remarks</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-600">
              <tr>
                <th className="py-3 px-4">Subject</th>
                <th className="py-3 px-4 text-center">Marks (100)</th>
                <th className="py-3 px-4 text-center">Grade</th>
                <th className="py-3 px-4 text-center">GPA</th>
                <th className="py-3 px-4">Teacher & AI Personalized Comments</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {results.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    {loading ? "Loading results..." : "No marks available for this term."}
                  </td>
                </tr>
              ) : (
                results.map((r: any, idx: number) => (
                  <tr key={idx} className="hover:bg-slate-50/70">
                    <td className="py-3.5 px-4 font-bold text-slate-900">{r.subjectName}</td>
                    <td className="py-3.5 px-4 text-center font-bold text-slate-800">{r.marks}</td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="rounded-md bg-emerald-50 px-2 py-0.5 font-bold text-emerald-800 border border-emerald-200">
                        {r.grade}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-700">{r.gpa.toFixed(1)}</td>
                    <td className="py-3.5 px-4 text-slate-600 max-w-sm">
                      {r.aiNarrativeComment || r.teacherRemarks || "Consistent performance"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
