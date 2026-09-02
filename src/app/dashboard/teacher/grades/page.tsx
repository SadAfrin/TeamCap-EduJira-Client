"use client";

import { useState } from "react";
import toast from "react-hot-toast";

type StudentGrade = {
  studentId: string;
  name: string;
  class: string;
  midTerm: number;
  quiz: number;
  finalExam: number;
  gpa: number;
  grade: string;
  aiNarrative?: string;
};

const INITIAL_STUDENT_GRADES: StudentGrade[] = [
  { studentId: "STD-801", name: "Rahim Uddin", class: "Class 8-B", midTerm: 88, quiz: 18, finalExam: 85, gpa: 4.85, grade: "A+", aiNarrative: "Rahim consistently excels in logical reasoning and algebraic formulations. Shows great class leadership." },
  { studentId: "STD-802", name: "Karim Ahmed", class: "Class 8-B", midTerm: 74, quiz: 14, finalExam: 72, gpa: 3.75, grade: "A-", aiNarrative: "Good understanding of core concepts. Needs slight improvement in complex geometry problems." },
  { studentId: "STD-803", name: "Fatima Islam", class: "Class 8-B", midTerm: 95, quiz: 20, finalExam: 92, gpa: 5.00, grade: "A+", aiNarrative: "Outstanding analytical ability. Perfect accuracy on midterm evaluation with flawless problem-solving." },
  { studentId: "STD-804", name: "Ayesha Khan", class: "Class 8-B", midTerm: 62, quiz: 11, finalExam: 65, gpa: 3.00, grade: "B", aiNarrative: "Steady performance. Recommended daily 20-minute practice on word problems to boost final GPA." },
];

export default function GradeEntryPage() {
  const [grades, setGrades] = useState<StudentGrade[]>(INITIAL_STUDENT_GRADES);
  const [generatingId, setGeneratingId] = useState<string | null>(null);

  function handleGenerateAINarrative(studentId: string) {
    setGeneratingId(studentId);
    setTimeout(() => {
      setGrades(
        grades.map((g) => {
          if (g.studentId === studentId) {
            return {
              ...g,
              aiNarrative: `${g.name} shows commendable academic dedication in term evaluations with an overall GPA of ${g.gpa}. Demonstrates strong teamwork and consistent conceptual growth.`,
            };
          }
          return g;
        })
      );
      setGeneratingId(null);
      toast.success("AI Report Card Narrative generated!");
    }, 1000);
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Marks & Grade Entry Console</h1>
            <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-bold text-blue-700 border border-blue-200">
              ⚡ AI Narrative Generator
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Input term scores, auto-calculate GPA, and generate automated AI comments for report cards.
          </p>
        </div>

        <button
          onClick={() => toast.success("All grade updates saved to EduJira database!")}
          className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-600/30 hover:bg-blue-500"
        >
          Save All Grades
        </button>
      </div>

      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 pl-6 pr-3">Student</th>
                <th className="py-3.5 px-3">Class</th>
                <th className="py-3.5 px-3">Midterm (100)</th>
                <th className="py-3.5 px-3">Quiz (20)</th>
                <th className="py-3.5 px-3">Final (100)</th>
                <th className="py-3.5 px-3">GPA & Grade</th>
                <th className="py-3.5 px-3">AI Narrative Summary</th>
                <th className="py-3.5 pr-6 pl-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {grades.map((st) => (
                <tr key={st.studentId} className="hover:bg-slate-50/70">
                  <td className="py-3.5 pl-6 pr-3 font-semibold text-slate-900">
                    <div>{st.name}</div>
                    <div className="font-mono text-[10px] text-slate-400">{st.studentId}</div>
                  </td>
                  <td className="py-3.5 px-3 text-slate-600">{st.class}</td>
                  <td className="py-3.5 px-3 font-mono font-bold text-slate-800">{st.midTerm}</td>
                  <td className="py-3.5 px-3 font-mono font-bold text-slate-800">{st.quiz}</td>
                  <td className="py-3.5 px-3 font-mono font-bold text-slate-800">{st.finalExam}</td>
                  <td className="py-3.5 px-3">
                    <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-800 border border-emerald-200">
                      {st.gpa.toFixed(2)} ({st.grade})
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-xs text-slate-600 max-w-sm">
                    {st.aiNarrative || <span className="text-slate-400 italic">No comments generated</span>}
                  </td>
                  <td className="py-3.5 pr-6 pl-3 text-right">
                    <button
                      onClick={() => handleGenerateAINarrative(st.studentId)}
                      disabled={generatingId === st.studentId}
                      className="rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-700 hover:bg-indigo-100 border border-indigo-200"
                    >
                      {generatingId === st.studentId ? "Generating..." : "⚡ AI Comment"}
                    </button>
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
