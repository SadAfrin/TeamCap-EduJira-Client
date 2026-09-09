"use client";

import { useEffect, useState } from "react";
import { apiGet, apiPost } from "@/lib/api";
import { useAuthRole } from "@/hooks/useAuthRole";
import toast from "react-hot-toast";

export default function TeacherLeavesPage() {
  const { user } = useAuthRole();
  const [leaves, setLeaves] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState("pending");
  const [loading, setLoading] = useState(true);
  const [reviewingId, setReviewingId] = useState<string | null>(null);
  const [remarks, setRemarks] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const res = await apiGet(`/api/leaves?status=${statusFilter}`);
      if (res.success) {
        setLeaves(res.data || []);
      }
    } catch (err) {
      console.error("Failed to load leaves:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, [statusFilter]);

  const handleReview = async (id: string, status: "approved" | "rejected") => {
    setActionLoading(true);
    try {
      const res = await apiPost(`/api/leaves/${id}/review`, {
        status,
        reviewRemarks: remarks || (status === "approved" ? "Approved by class teacher." : "Declined due to exam schedule."),
        reviewedBy: user?.name || "Teacher",
        reviewRole: "teacher",
      });

      if (res.success) {
        toast.success(`Leave request ${status}! ✓`);
        setReviewingId(null);
        setRemarks("");
        fetchLeaves();
      } else {
        toast.error(res.message || "Failed to review leave");
      }
    } catch (err: any) {
      toast.error(err.message || "Error reviewing leave");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Student Leave Requests</h1>
          <p className="text-xs text-slate-500 mt-1">Review, approve, and manage medical and family leave applications</p>
        </div>

        <div className="flex rounded-xl bg-slate-100 p-1">
          {["pending", "approved", "rejected", "All"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold capitalize transition-all ${
                statusFilter === st ? "bg-white text-blue-600 shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Leaves Feed */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        {loading ? (
          <div className="py-16 text-center text-xs text-slate-400">Loading leave requests...</div>
        ) : leaves.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-400">
            No {statusFilter} leave requests found.
          </div>
        ) : (
          <div className="space-y-4">
            {leaves.map((item) => (
              <div
                key={item._id}
                className="rounded-2xl border border-slate-200/90 bg-slate-50/50 p-5 space-y-3 hover:border-blue-200 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 font-bold text-xs">
                      ✉️
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-sm">
                        {item.studentName} ({item.className} – Section {item.section})
                      </h4>
                      <p className="text-xs text-slate-500">
                        Requested by: <strong className="capitalize">{item.requestedBy}</strong> ({item.parentName || "Guardian"}) • ID: {item.studentId}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`rounded-full px-3 py-0.5 text-xs font-bold uppercase tracking-wider self-start sm:self-auto ${
                      item.status === "approved"
                        ? "bg-emerald-100 text-emerald-800"
                        : item.status === "rejected"
                        ? "bg-rose-100 text-rose-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                <div className="rounded-xl bg-white p-3.5 border border-slate-200/80 text-xs text-slate-700 space-y-1">
                  <p>
                    <strong>Absence Period: </strong>
                    <span className="font-mono text-indigo-700 font-bold">{item.startDate}</span> to{" "}
                    <span className="font-mono text-indigo-700 font-bold">{item.endDate}</span> ({item.daysCount} days)
                  </p>
                  <p><strong>Reason: </strong>{item.reason}</p>
                  {item.doctorNoteUrl && (
                    <p className="pt-1">
                      <a
                        href={item.doctorNoteUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 font-bold text-indigo-600 hover:underline"
                      >
                        📄 View Attached Doctor's Note
                      </a>
                    </p>
                  )}
                </div>

                {item.status === "pending" ? (
                  <div className="pt-2 border-t border-slate-200/60 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <input
                      type="text"
                      placeholder="Remarks for approval/rejection..."
                      value={reviewingId === item._id ? remarks : ""}
                      onChange={(e) => {
                        setReviewingId(item._id);
                        setRemarks(e.target.value);
                      }}
                      className="w-full sm:w-80 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs outline-none focus:border-blue-600"
                    />

                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                      <button
                        onClick={() => handleReview(item._id, "rejected")}
                        disabled={actionLoading}
                        className="rounded-xl bg-rose-50 border border-rose-200 px-4 py-1.5 text-xs font-bold text-rose-700 hover:bg-rose-100"
                      >
                        Decline ✕
                      </button>
                      <button
                        onClick={() => handleReview(item._id, "approved")}
                        disabled={actionLoading}
                        className="rounded-xl bg-emerald-600 px-5 py-1.5 text-xs font-bold text-white hover:bg-emerald-500 shadow-md shadow-emerald-600/20"
                      >
                        Approve ✓
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-500 pt-2 border-t border-slate-200/60">
                    <strong>Resolution: </strong> {item.reviewRemarks} (By {item.reviewedBy || "Staff"})
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
