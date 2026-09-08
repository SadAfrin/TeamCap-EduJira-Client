"use client";

import { useEffect, useState } from "react";
import { apiGet, apiPost } from "@/lib/api";
import { useAuthRole } from "@/hooks/useAuthRole";
import toast from "react-hot-toast";

export default function StudentAssignmentsPage() {
  const { user } = useAuthRole();
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
  const [submissionText, setSubmissionText] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const res = await apiGet(`/api/assignments?className=Class 8&studentId=STD-801`);
      if (res.success) {
        setAssignments(res.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch assignments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const handleOpenSubmitModal = (assignment: any) => {
    setSelectedAssignment(assignment);
    const existing = assignment.mySubmission;
    if (existing) {
      setSubmissionText(existing.submissionText || "");
      setFileUrl(existing.fileUrl || "");
    } else {
      setSubmissionText("");
      setFileUrl("");
    }
  };

  const handleSaveSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssignment) return;

    setSubmitting(true);
    try {
      const res = await apiPost(`/api/assignments/${selectedAssignment._id}/submit`, {
        studentId: "STD-801",
        studentName: user?.name || "Rahim Uddin",
        studentEmail: user?.email || "rahim@edujira.edu",
        submissionText,
        fileUrl,
      });

      if (res.success) {
        toast.success("Assignment submitted successfully! 🎉");
        setSelectedAssignment(null);
        fetchAssignments();
      } else {
        toast.error(res.message || "Failed to submit assignment");
      }
    } catch (err: any) {
      toast.error(err.message || "Error submitting assignment");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Assignments & Homework</h1>
          <p className="text-xs text-slate-500 mt-1">Submit coursework, check deadlines, and review teacher grading</p>
        </div>
      </div>

      {/* Assignments List */}
      {loading ? (
        <div className="py-16 text-center text-xs text-slate-400">Loading assignments...</div>
      ) : assignments.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-xs text-slate-400">
          No assignments active at the moment.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {assignments.map((item) => {
            const sub = item.mySubmission;
            const isGraded = sub?.status === "graded";
            const isSubmitted = !!sub;

            return (
              <div
                key={item._id}
                className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-xs hover:border-indigo-200 hover:shadow-md transition-all"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="rounded-lg bg-indigo-50 px-2.5 py-1 text-[11px] font-bold text-indigo-700 border border-indigo-100">
                      {item.subjectName}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        isGraded
                          ? "bg-emerald-100 text-emerald-800"
                          : isSubmitted
                          ? "bg-blue-100 text-blue-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {isGraded ? `Graded: ${sub.marksObtained}/${item.totalMarks}` : isSubmitted ? "Submitted" : "Pending"}
                    </span>
                  </div>

                  <h3 className="mt-3 text-base font-extrabold text-slate-900">{item.title}</h3>
                  <p className="mt-2 text-xs text-slate-600 line-clamp-3 leading-relaxed">{item.description}</p>
                </div>

                <div className="mt-6 border-t border-slate-100 pt-4">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
                    <span>Deadline: <strong className="text-slate-800 font-mono">{item.deadline}</strong></span>
                    <span>Total Marks: <strong className="text-slate-800">{item.totalMarks}</strong></span>
                  </div>

                  {isGraded && sub.feedback && (
                    <div className="mb-4 rounded-xl bg-emerald-50/80 p-3 border border-emerald-100 text-xs text-emerald-900">
                      <p className="font-bold">Teacher Feedback:</p>
                      <p className="mt-0.5">{sub.feedback}</p>
                    </div>
                  )}

                  <button
                    onClick={() => handleOpenSubmitModal(item)}
                    className={`w-full rounded-xl py-2.5 text-xs font-bold transition-all shadow-sm ${
                      isSubmitted
                        ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        : "bg-indigo-600 text-white hover:bg-indigo-500 shadow-indigo-600/20"
                    }`}
                  >
                    {isSubmitted ? "Edit / View Submission" : "Submit Assignment 🚀"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Submission Modal */}
      {selectedAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                  {selectedAssignment.subjectName}
                </span>
                <h3 className="text-base font-extrabold text-slate-900">{selectedAssignment.title}</h3>
              </div>
              <button
                onClick={() => setSelectedAssignment(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveSubmission} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Answer / Notes:
                </label>
                <textarea
                  rows={4}
                  required
                  value={submissionText}
                  onChange={(e) => setSubmissionText(e.target.value)}
                  placeholder="Write your homework solution or key remarks here..."
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-xs outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Document / Solution Attachment Link (PDF / Image / Drive URL):
                </label>
                <input
                  type="url"
                  value={fileUrl}
                  onChange={(e) => setFileUrl(e.target.value)}
                  placeholder="https://example.com/homework-solution.pdf"
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-xs outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-4">
                <button
                  type="button"
                  onClick={() => setSelectedAssignment(null)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-xl bg-indigo-600 px-6 py-2 text-xs font-bold text-white hover:bg-indigo-500 shadow-md shadow-indigo-600/20 disabled:opacity-50"
                >
                  {submitting ? "Uploading..." : "Save Submission ✓"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
