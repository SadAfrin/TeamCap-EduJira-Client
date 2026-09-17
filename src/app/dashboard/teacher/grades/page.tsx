"use client";

import { useEffect, useState } from "react";
import { apiGet, apiPost } from "@/lib/api";
import { useAuthRole } from "@/hooks/useAuthRole";
import toast from "react-hot-toast";

export default function TeacherGradesPage() {
  const { user } = useAuthRole();
  const [className, setClassName] = useState("Class 8");
  const [section, setSection] = useState("B");
  const [subjectName, setSubjectName] = useState("Mathematics");
  const [term, setTerm] = useState("Mid Term");
  const [students, setStudents] = useState<any[]>([]);
  const [marksMap, setMarksMap] = useState<Record<string, { marks: number; remarks: string; aiNarrative: string }>>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [generatingFor, setGeneratingFor] = useState<string | null>(null);

  const calculateGradeGPA = (marks: number) => {
    const m = Number(marks);
    if (m >= 80) return { grade: "A+", gpa: 5.0 };
    if (m >= 70) return { grade: "A", gpa: 4.0 };
    if (m >= 60) return { grade: "A-", gpa: 3.5 };
    if (m >= 50) return { grade: "B", gpa: 3.0 };
    if (m >= 40) return { grade: "C", gpa: 2.0 };
    if (m >= 33) return { grade: "D", gpa: 1.0 };
    return { grade: "F", gpa: 0.0 };
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [studentsRes, resultsRes] = await Promise.all([
        apiGet(`/api/students?className=${encodeURIComponent(className)}&section=${encodeURIComponent(section)}`),
        apiGet(`/api/results?className=${encodeURIComponent(className)}&section=${encodeURIComponent(section)}&subjectName=${encodeURIComponent(subjectName)}&term=${encodeURIComponent(term)}`),
      ]);

      if (studentsRes.success) {
        const studentList = studentsRes.data || [];
        setStudents(studentList);

        const initial: Record<string, { marks: number; remarks: string; aiNarrative: string }> = {};
        studentList.forEach((s: any) => {
          initial[s.studentId] = { marks: 85, remarks: "", aiNarrative: "" };
        });

        if (resultsRes.success && Array.isArray(resultsRes.data)) {
          resultsRes.data.forEach((r: any) => {
            initial[r.studentId] = {
              marks: r.marks ?? 85,
              remarks: r.teacherRemarks || "",
              aiNarrative: r.aiNarrativeComment || "",
            };
          });
        }

        setMarksMap(initial);
      }
    } catch (err) {
      console.error("Failed to load grade records:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [className, section, subjectName, term]);

  const handleMarksChange = (studentId: string, val: string) => {
    const num = Math.min(100, Math.max(0, Number(val) || 0));
    setMarksMap((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        marks: num,
      },
    }));
  };

  const handleNarrativeChange = (studentId: string, text: string) => {
    setMarksMap((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        aiNarrative: text,
      },
    }));
  };

  const handleGenerateAINarrative = async (student: any) => {
    setGeneratingFor(student.studentId);
    try {
      const currentMarks = marksMap[student.studentId]?.marks ?? 85;
      const res = await apiPost("/api/ai/narrative/generate", {
        studentName: student.name,
        className,
        marks: currentMarks,
        subjectName,
        attendanceRate: 94,
      });

      if (res.success && res.data?.narrative) {
        handleNarrativeChange(student.studentId, res.data.narrative);
        toast.success(`Generated AI comment for ${student.name}!`);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to generate AI comment");
    } finally {
      setGeneratingFor(null);
    }
  };

  const handleSaveGrades = async () => {
    setSaving(true);
    try {
      const resultsPayload = students.map((s) => ({
        studentId: s.studentId,
        studentName: s.name,
        studentEmail: s.email,
        className,
        section,
        subjectName,
        term,
        marks: marksMap[s.studentId]?.marks || 0,
        aiNarrativeComment: marksMap[s.studentId]?.aiNarrative || "",
        teacherRemarks: marksMap[s.studentId]?.remarks || "",
        enteredBy: user?.name || "Teacher",
      }));

      const res = await apiPost("/api/results/batch", {
        className,
        section,
        subjectName,
        term,
        results: resultsPayload,
        enteredBy: user?.name || "Teacher",
      });

      if (res.success) {
        toast.success(`Saved results and AI comments for ${students.length} students! ✓`);
      } else {
        toast.error(res.message || "Failed to save results");
      }
    } catch (err: any) {
      toast.error(err.message || "Error saving results");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900">Marks Entry & AI Report Cards</h1>
            <span className="rounded-full bg-purple-50 px-2.5 py-0.5 text-[10px] font-bold text-purple-700 border border-purple-200">
              AI Narrative Engine
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Enter marks with auto GPA calculation and generate personalized comments</p>
        </div>

        <button
          onClick={handleSaveGrades}
          disabled={saving || students.length === 0}
          className="rounded-xl bg-purple-600 px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-purple-600/30 hover:bg-purple-500 disabled:opacity-50"
        >
          {saving ? "Saving All..." : "Publish & Save All Results ✓"}
        </button>
      </div>

      {/* Control Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Class</label>
          <select
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-900 outline-none focus:bg-white focus:border-purple-600"
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
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-900 outline-none focus:bg-white focus:border-purple-600"
          >
            <option value="A">Section A</option>
            <option value="B">Section B</option>
            <option value="C">Section C</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Subject</label>
          <select
            value={subjectName}
            onChange={(e) => setSubjectName(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-900 outline-none focus:bg-white focus:border-purple-600"
          >
            <option value="Mathematics">Mathematics</option>
            <option value="General Science">General Science</option>
            <option value="English">English</option>
            <option value="Physics">Physics</option>
            <option value="Chemistry">Chemistry</option>
            <option value="ICT & Computing">ICT & Computing</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Exam Term</label>
          <select
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-900 outline-none focus:bg-white focus:border-purple-600"
          >
            <option value="Mid Term">Mid Term Examination</option>
            <option value="Final Term">Final Term Examination</option>
          </select>
        </div>
      </div>

      {/* Grade Entry Table */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <h3 className="font-bold text-slate-900 text-sm mb-4">
          Grade Roster: {subjectName} ({term})
        </h3>

        {loading ? (
          <div className="py-12 text-center text-xs text-slate-400">Loading student marks...</div>
        ) : students.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400">No students enrolled in this division.</div>
        ) : (
          <div className="space-y-4">
            {students.map((s) => {
              const currentMarks = marksMap[s.studentId]?.marks ?? 85;
              const { grade, gpa } = calculateGradeGPA(currentMarks);
              const currentNarrative = marksMap[s.studentId]?.aiNarrative || "";
              const isGen = generatingFor === s.studentId;

              return (
                <div
                  key={s.studentId}
                  className="rounded-2xl border border-slate-200/90 bg-slate-50/50 p-4 space-y-3 hover:border-purple-200 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-700 font-bold text-xs font-mono">
                        #{s.roll || "01"}
                      </div>
                      <div>
                        <h4 className="font-extrabold text-slate-900 text-xs">{s.name}</h4>
                        <p className="text-[10px] text-slate-400 font-mono">{s.studentId}</p>
                      </div>
                    </div>

                    {/* Marks & Live GPA Badge */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <label className="text-xs font-bold text-slate-600">Marks (0-100):</label>
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={currentMarks}
                          onChange={(e) => handleMarksChange(s.studentId, e.target.value)}
                          className="w-20 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-900 text-center focus:border-purple-600 outline-none"
                        />
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className="rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-black text-emerald-800 border border-emerald-200">
                          {grade}
                        </span>
                        <span className="rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-mono font-bold text-indigo-800 border border-indigo-200">
                          GPA {gpa.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* AI Report Card Narrative Comment Area */}
                  <div className="pt-2 border-t border-slate-200/60 flex flex-col sm:flex-row items-start gap-3">
                    <div className="flex-1 w-full">
                      <textarea
                        rows={2}
                        value={currentNarrative}
                        onChange={(e) => handleNarrativeChange(s.studentId, e.target.value)}
                        placeholder={`AI generated or teacher narrative comment for ${s.name}...`}
                        className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 outline-none focus:border-purple-600"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleGenerateAINarrative(s)}
                      disabled={isGen}
                      className="rounded-xl border border-purple-300 bg-purple-50 px-3.5 py-2 text-xs font-bold text-purple-700 hover:bg-purple-100 shrink-0 transition-colors disabled:opacity-50"
                    >
                      {isGen ? "Generating..." : "⚡ Generate AI Comment"}
                    </button>
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
