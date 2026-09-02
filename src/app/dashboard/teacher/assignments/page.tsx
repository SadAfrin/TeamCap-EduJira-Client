"use client";

import { useState } from "react";
import toast from "react-hot-toast";

type Assignment = {
  id: string;
  title: string;
  className: string;
  subject: string;
  dueDate: string;
  submissionsCount: number;
  totalStudents: number;
};

const INITIAL_ASSIGNMENTS: Assignment[] = [
  { id: "ASN-01", title: "Newton's Laws of Motion Problem Set", className: "Class 9 - Sec A", subject: "Physics", dueDate: "2026-09-08", submissionsCount: 18, totalStudents: 22 },
  { id: "ASN-02", title: "Organic Chemistry Lab Report", className: "Class 10 - Sec A", subject: "Chemistry", dueDate: "2026-09-10", submissionsCount: 12, totalStudents: 20 },
  { id: "ASN-03", title: "Algebra Chapter 4 Exercise 4.2", className: "Class 8 - Sec B", subject: "Mathematics", dueDate: "2026-09-05", submissionsCount: 24, totalStudents: 25 },
];

export default function TeacherAssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>(INITIAL_ASSIGNMENTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    className: "Class 8 - Sec B",
    subject: "Mathematics",
    dueDate: "2026-09-12",
  });

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const newAsn: Assignment = {
      id: `ASN-${Math.floor(10 + Math.random() * 90)}`,
      title: formData.title,
      className: formData.className,
      subject: formData.subject,
      dueDate: formData.dueDate,
      submissionsCount: 0,
      totalStudents: 25,
    };
    setAssignments([newAsn, ...assignments]);
    setIsModalOpen(false);
    toast.success("Assignment published to student portal!");
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Assignments & Homework Manager</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Create tasks, set submission deadlines, and evaluate student homework.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-600/30 hover:bg-blue-500"
        >
          <span>+ Create Assignment</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {assignments.map((asn) => (
          <div key={asn.id} className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-blue-600">{asn.id}</span>
                <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700">{asn.className}</span>
              </div>
              <h3 className="mt-2 text-base font-bold text-slate-900">{asn.title}</h3>
              <p className="text-xs text-slate-500 mt-1">Subject: {asn.subject}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>Submissions:</span>
                <span className="font-bold text-slate-900">{asn.submissionsCount} / {asn.totalStudents}</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                <span>Due: {asn.dueDate}</span>
                <button onClick={() => toast.success("Opening submissions viewer...")} className="font-bold text-blue-600 hover:text-blue-700">Review →</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <h2 className="text-lg font-bold text-slate-900">Create New Assignment</h2>
            <form onSubmit={handleCreate} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Chapter 3 Trigonometry Quiz Preparation"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-900 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Target Class</label>
                  <select
                    value={formData.className}
                    onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-900 focus:outline-none"
                  >
                    <option value="Class 8 - Sec B">Class 8 - Sec B</option>
                    <option value="Class 9 - Sec A">Class 9 - Sec A</option>
                    <option value="Class 10 - Sec A">Class 10 - Sec A</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Due Date</label>
                  <input
                    type="date"
                    required
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700">Cancel</button>
                <button type="submit" className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs">Publish Assignment</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
