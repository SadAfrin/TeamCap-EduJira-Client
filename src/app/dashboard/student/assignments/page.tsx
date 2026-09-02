"use client";

import { useState } from "react";
import toast from "react-hot-toast";

type Task = {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  status: "Pending" | "Submitted" | "Graded";
  grade?: string;
};

const INITIAL_TASKS: Task[] = [
  { id: "ASN-01", title: "Newton's Laws of Motion Problem Set", subject: "Physics", dueDate: "2026-09-08", status: "Pending" },
  { id: "ASN-03", title: "Algebra Chapter 4 Exercise 4.2", subject: "Mathematics", dueDate: "2026-09-05", status: "Submitted" },
  { id: "ASN-04", title: "English Essay on Climate Action", subject: "English", dueDate: "2026-08-25", status: "Graded", grade: "A (19/20)" },
];

export default function StudentAssignmentsPage() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [submittingId, setSubmittingId] = useState<string | null>(null);

  function handleSubmitAssignment(id: string) {
    setSubmittingId(id);
    setTimeout(() => {
      setTasks(tasks.map((t) => (t.id === id ? { ...t, status: "Submitted" } : t)));
      setSubmittingId(null);
      toast.success("Assignment submitted to teacher portal!");
    }, 800);
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="border-b border-slate-200/80 pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Assignments & Homework Portal</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Submit homework, track teacher evaluations, and review graded assignments.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {tasks.map((task) => (
          <div key={task.id} className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-emerald-600">{task.id}</span>
                <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ${
                  task.status === "Graded" ? "bg-purple-50 text-purple-700 border border-purple-200" : task.status === "Submitted" ? "bg-blue-50 text-blue-700 border border-blue-200" : "bg-amber-50 text-amber-700 border border-amber-200"
                }`}>
                  {task.status}
                </span>
              </div>
              <h3 className="mt-2 text-base font-bold text-slate-900">{task.title}</h3>
              <p className="text-xs text-slate-500 mt-1">Subject: {task.subject}</p>
              {task.grade && (
                <div className="mt-3 rounded-lg bg-purple-50 p-2 text-xs font-bold text-purple-700 border border-purple-100">
                  Evaluated Score: {task.grade}
                </div>
              )}
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">Due: {task.dueDate}</span>
              {task.status === "Pending" ? (
                <button
                  onClick={() => handleSubmitAssignment(task.id)}
                  disabled={submittingId === task.id}
                  className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-500 shadow-xs"
                >
                  {submittingId === task.id ? "Uploading..." : "Submit Task"}
                </button>
              ) : (
                <span className="text-xs font-semibold text-slate-400">Done ✓</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
