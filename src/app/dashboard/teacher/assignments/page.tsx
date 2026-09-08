"use client";

import { useEffect, useState } from "react";
import { apiGet, apiPost } from "@/lib/api";
import { useAuthRole } from "@/hooks/useAuthRole";
import toast from "react-hot-toast";

export default function TeacherAssignmentsPage() {
  const { user } = useAuthRole();
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);

  // New Assignment Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [className, setClassName] = useState("Class 8");
  const [section, setSection] = useState("All");
  const [subjectName, setSubjectName] = useState("Mathematics");
  const [deadline, setDeadline] = useState("");
  const [totalMarks, setTotalMarks] = useState(25);
  const [creating, setCreating] = useState(false);

  // Grading Form State
  const [gradingStudentId, setGradingStudentId] = useState("");
  const [marksAwarded, setMarksAwarded] = useState(20);
  const [teacherFeedback, setTeacherFeedback] = useState("");
  const [grading, setGrading] = useState(false);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const res = await apiGet(`/api/assignments`);
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

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !deadline) {
      toast.error("Please fill in title, description, and deadline.");
      return;
    }

    setCreating(true);
    try {
      const res = await apiPost("/api/assignments", {
        title,
        description,
        className,
        section,
        subjectName,
        deadline,
        totalMarks: Number(totalMarks) || 25,
        teacherName: user?.name || "Dr. Anisur Rahman",
        teacherEmail: user?.email || "anisur.rahman@edujira.edu",
      });

      if (res.success) {
        toast.success("Assignment published to students! 🎉");
        setShowCreateModal(false);
        setTitle("");
        setDescription("");
        setDeadline("");
        fetchAssignments();
      } else {
        toast.error(res.message || "Failed to create assignment");
      }
    } catch (err: any) {
      toast.error(err.message || "Error creating assignment");
    } finally {
      setCreating(false);
    }
  };

  const handleGradeSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssignment || !gradingStudentId) return;

    setGrading(true);
    try {
      const res = await apiPost(`/api/assignments/${selectedAssignment._id}/grade`, {
        studentId: gradingStudentId,
        marksObtained: Number(marksAwarded),
        feedback: teacherFeedback,
      });

      if (res.success) {
        toast.success("Grade and feedback submitted! ✓");
        setGradingStudentId("");
        setTeacherFeedback("");
        setSelectedAssignment(res.data);
        fetchAssignments();
      } else {
        toast.error(res.message || "Failed to grade submission");
      }
    } catch (err: any) {
      toast.error(err.message || "Error submitting grade");
    } finally {
      setGrading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Assignments & Homework Management</h1>
          <p className="text-xs text-slate-500 mt-1">Create student assignments, review submissions, and award grades</p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-600/30 hover:bg-indigo-500 transition-colors"
        >
          + Create New Assignment
        </button>
      </div>

      {/* Assignments List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          <div className="col-span-3 py-16 text-center text-xs text-slate-400">Loading assignments...</div>
        ) : assignments.length === 0 ? (
          <div className="col-span-3 rounded-2xl border border-slate-200 bg-white p-12 text-center text-xs text-slate-400">
            No assignments created yet. Click "+ Create New Assignment" above.
          </div>
        ) : (
          assignments.map((item) => (
            <div
              key={item._id}
              className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-xs hover:shadow-md transition-all"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded-lg bg-indigo-50 px-2.5 py-0.5 text-xs font-bold text-indigo-700 border border-indigo-100">
                    {item.className} • {item.subjectName}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">Due: {item.deadline}</span>
                </div>

                <h3 className="mt-3 text-base font-extrabold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-xs text-slate-600 line-clamp-3 leading-relaxed">{item.description}</p>
              </div>

              <div className="mt-6 border-t border-slate-100 pt-4">
                <div className="flex items-center justify-between text-xs text-slate-600 mb-3">
                  <span>Submissions: <strong className="text-indigo-600">{item.submissions?.length || 0}</strong></span>
                  <span>Total Marks: <strong>{item.totalMarks}</strong></span>
                </div>

                <button
                  onClick={() => setSelectedAssignment(item)}
                  className="w-full rounded-xl bg-slate-100 py-2.5 text-xs font-bold text-slate-800 hover:bg-slate-200 transition-colors"
                >
                  Review Submissions ({item.submissions?.length || 0}) →
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-base font-extrabold text-slate-900">Create New Assignment</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAssignment} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Assignment Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Chapter 4 Problem Set"
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-xs outline-none focus:border-indigo-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Class</label>
                  <select
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs"
                  >
                    <option value="Class 6">Class 6</option>
                    <option value="Class 7">Class 7</option>
                    <option value="Class 8">Class 8</option>
                    <option value="Class 9">Class 9</option>
                    <option value="Class 10">Class 10</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Subject</label>
                  <select
                    value={subjectName}
                    onChange={(e) => setSubjectName(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs"
                  >
                    <option value="Mathematics">Mathematics</option>
                    <option value="General Science">General Science</option>
                    <option value="Physics">Physics</option>
                    <option value="English">English</option>
                    <option value="ICT & Computing">ICT & Computing</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Deadline Date *</label>
                  <input
                    type="date"
                    required
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Total Marks</label>
                  <input
                    type="number"
                    value={totalMarks}
                    onChange={(e) => setTotalMarks(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Assignment Instructions / Problem List *</label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Specify problem numbers, exercises, or essay topics..."
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-xs outline-none focus:border-indigo-600"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="rounded-xl bg-indigo-600 px-6 py-2 text-xs font-bold text-white hover:bg-indigo-500 shadow-md shadow-indigo-600/20 disabled:opacity-50"
                >
                  {creating ? "Publishing..." : "Publish Assignment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Review Submissions Drawer / Modal */}
      {selectedAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
                  {selectedAssignment.subjectName} ({selectedAssignment.className})
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

            <div className="mt-5 space-y-4">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                Student Submissions ({selectedAssignment.submissions?.length || 0})
              </h4>

              {selectedAssignment.submissions?.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center">No student submissions submitted yet.</p>
              ) : (
                selectedAssignment.submissions.map((sub: any) => (
                  <div key={sub.studentId} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-900 text-xs">{sub.studentName}</span>
                        <span className="text-[11px] font-mono text-slate-400 ml-2">({sub.studentId})</span>
                      </div>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                          sub.status === "graded"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {sub.status === "graded" ? `Score: ${sub.marksObtained}/${selectedAssignment.totalMarks}` : "Submitted"}
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 bg-white p-3 rounded-xl border border-slate-200/80">
                      {sub.submissionText || "No text written."}
                    </p>

                    {sub.fileUrl && (
                      <a
                        href={sub.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:underline"
                      >
                        📎 View Submitted Attachment
                      </a>
                    )}

                    {/* Grading Form */}
                    <div className="pt-2 border-t border-slate-200/60">
                      {gradingStudentId === sub.studentId ? (
                        <form onSubmit={handleGradeSubmission} className="space-y-2 mt-2">
                          <div className="flex items-center gap-2">
                            <label className="text-xs font-semibold text-slate-700">Marks (out of {selectedAssignment.totalMarks}):</label>
                            <input
                              type="number"
                              min={0}
                              max={selectedAssignment.totalMarks}
                              value={marksAwarded}
                              onChange={(e) => setMarksAwarded(Number(e.target.value))}
                              className="w-20 rounded-lg border border-slate-200 px-2 py-1 text-xs"
                            />
                          </div>
                          <input
                            type="text"
                            placeholder="Teacher feedback (e.g. Excellent work / Needs revision on Step 3)"
                            value={teacherFeedback}
                            onChange={(e) => setTeacherFeedback(e.target.value)}
                            className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs"
                          />
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => setGradingStudentId("")}
                              className="px-3 py-1 text-xs text-slate-600"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              disabled={grading}
                              className="rounded-lg bg-emerald-600 px-4 py-1 text-xs font-bold text-white hover:bg-emerald-500"
                            >
                              {grading ? "Saving..." : "Submit Grade ✓"}
                            </button>
                          </div>
                        </form>
                      ) : (
                        <div className="flex items-center justify-between">
                          <p className="text-[11px] text-slate-500">
                            {sub.feedback ? `Feedback: ${sub.feedback}` : "No feedback provided yet."}
                          </p>
                          <button
                            onClick={() => {
                              setGradingStudentId(sub.studentId);
                              setMarksAwarded(sub.marksObtained ?? 20);
                              setTeacherFeedback(sub.feedback || "");
                            }}
                            className="rounded-lg bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700 hover:bg-indigo-100"
                          >
                            {sub.status === "graded" ? "Edit Grade" : "Grade Submission"}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
