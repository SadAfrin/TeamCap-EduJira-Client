"use client";

import { useEffect, useState } from "react";
import { apiGet } from "@/lib/api";
import { useAuthRole } from "@/hooks/useAuthRole";

export default function StudentResultsPage() {
  const { user } = useAuthRole();
  const [term, setTerm] = useState("Mid Term");
  const [transcriptData, setTranscriptData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const studentName = user?.name || "Student";
  const studentId = (user as any)?.studentId || "STD-801";

  useEffect(() => {
    async function loadTranscript() {
      try {
        setLoading(true);
        const res = await apiGet(`/api/results/transcript?studentId=${encodeURIComponent(studentId)}&term=${term}`);
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
  }, [term, studentId]);

  const handlePrint = () => {
    window.print();
  };

  const results = transcriptData?.results || [];

  return (
    <div className="space-y-6 print:m-0 print:p-0">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Academic Results & Transcripts</h1>
          <p className="text-xs text-slate-500 mt-1">Class 8 • Roll #01 • Student: {studentName}</p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-xs outline-none focus:border-indigo-600"
          >
            <option value="Mid Term">Mid Term Examination</option>
            <option value="Final Term">Final Term Examination</option>
          </select>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-indigo-500 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.75A2.25 2.25 0 0015.75 1.5h-7.5A2.25 2.25 0 006 3.75v3.529" />
            </svg>
            <span>Print Report Card</span>
          </button>
        </div>
      </div>

      {/* Report Card Certificate Layout */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-sm print:border-none print:shadow-none">
        {/* Institutional Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between border-b-2 border-indigo-600 pb-6 gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white font-black text-xl shadow-md">
              E
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">EduJira International Academy</h2>
              <p className="text-xs text-slate-500 font-medium">Official Academic Performance Transcript</p>
            </div>
          </div>
          <div className="sm:text-right text-xs">
            <p className="font-bold text-slate-900">{term} Evaluation</p>
            <p className="text-slate-500">Date of Issue: {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        {/* Student Metadata Box */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 rounded-2xl bg-slate-50 p-4 border border-slate-100 text-xs">
          <div>
            <span className="text-slate-400 block font-medium">Student Name</span>
            <span className="font-bold text-slate-900">{studentName}</span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">Class & Section</span>
            <span className="font-bold text-slate-900">Class 8 – Section B</span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">Student ID</span>
            <span className="font-mono font-bold text-indigo-700">STD-801</span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">Roll Number</span>
            <span className="font-bold text-slate-900">#01</span>
          </div>
        </div>

        {/* GPA Summary Badges */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-4 text-center">
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700">Grade Point Average</span>
            <p className="mt-1 text-3xl font-black text-indigo-900">{transcriptData?.gpa || 5.0}</p>
            <span className="text-xs font-semibold text-indigo-600">Scale of 5.00</span>
          </div>
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4 text-center">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">Letter Grade</span>
            <p className="mt-1 text-3xl font-black text-emerald-900">{transcriptData?.overallGrade || "A+"}</p>
            <span className="text-xs font-semibold text-emerald-600">Outstanding Excellence</span>
          </div>
          <div className="rounded-2xl border border-purple-100 bg-purple-50/50 p-4 text-center">
            <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700">Exam Average</span>
            <p className="mt-1 text-3xl font-black text-purple-900">{transcriptData?.averageMarks || 89.0}%</p>
            <span className="text-xs font-semibold text-purple-600">Total Marks: {transcriptData?.totalMarks || 356}</span>
          </div>
        </div>

        {/* Results Table */}
        <div className="mt-8 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-100/70 text-[11px] font-bold uppercase tracking-wider text-slate-600">
              <tr>
                <th className="py-3 px-4">Subject Code</th>
                <th className="py-3 px-4">Subject Title</th>
                <th className="py-3 px-4 text-center">Marks (100)</th>
                <th className="py-3 px-4 text-center">Grade</th>
                <th className="py-3 px-4 text-center">GPA</th>
                <th className="py-3 px-4">Teacher Feedback & AI Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {results.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    {loading ? "Loading exam records..." : "No marks recorded for this term."}
                  </td>
                </tr>
              ) : (
                results.map((r: any, idx: number) => (
                  <tr key={idx} className="hover:bg-slate-50/70">
                    <td className="py-3.5 px-4 font-mono font-semibold text-slate-500">{r.subjectCode || "CORE"}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{r.subjectName}</td>
                    <td className="py-3.5 px-4 text-center font-bold text-slate-800">{r.marks}</td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="rounded-md bg-emerald-50 px-2 py-0.5 font-bold text-emerald-800 border border-emerald-200">
                        {r.grade}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold font-mono text-slate-700">{r.gpa.toFixed(1)}</td>
                    <td className="py-3.5 px-4 text-slate-600 max-w-xs">
                      {r.aiNarrativeComment || r.teacherRemarks || "Consistent performance"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Signatures */}
        <div className="mt-12 pt-8 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-3 gap-6 text-center text-xs">
          <div>
            <div className="h-8 border-b border-dashed border-slate-300 w-36 mx-auto" />
            <p className="mt-2 font-bold text-slate-700">Class Teacher Signature</p>
          </div>
          <div>
            <div className="h-8 border-b border-dashed border-slate-300 w-36 mx-auto" />
            <p className="mt-2 font-bold text-slate-700">Academic Controller</p>
          </div>
          <div className="hidden sm:block">
            <div className="h-8 border-b border-dashed border-slate-300 w-36 mx-auto" />
            <p className="mt-2 font-bold text-slate-700">Principal Seal</p>
          </div>
        </div>
      </div>
    </div>
  );
}
