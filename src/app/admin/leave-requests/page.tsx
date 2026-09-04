"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuthRole } from "@/hooks/useAuthRole";
import { featureFetch } from "@/lib/featureApi";

interface LeaveRequest {
  _id: string;
  studentId: { _id: string; name: string; studentId: string; className: string; section: string };
  startDate: string;
  endDate: string;
  reason: string;
  status: "teacher_approved" | "teacher_rejected" | "admin_approved" | "admin_rejected";
  teacherReview?: { comments?: string; status?: string; reviewedBy?: string; reviewedAt?: string };
  createdAt: string;
}

export default function AdminLeaveRequestsPage() {
  const router = useRouter();
  const { role, isAuthenticated, isLoading } = useAuthRole();

  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("teacher_approved");
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [approvalStatus, setApprovalStatus] = useState<"approved" | "rejected">("approved");
  const [approvalComments, setApprovalComments] = useState("");

  if (!isLoading && (!isAuthenticated || role !== "admin")) {
    router.push("/login");
    return null;
  }

  useEffect(() => {
    fetchRequests();
  }, [statusFilter]);

  async function fetchRequests() {
    try {
      const res = await featureFetch(`/api/leave?status=${statusFilter}`);
      if (res.ok) {
        const data = await res.json();
        setRequests(data.data || []);
      }
    } catch (error) {
      toast.error("Failed to load leave requests");
    } finally {
      setLoading(false);
    }
  }

  async function handleApprove(id: string) {
    if (!approvalComments.trim()) {
      toast.error("Please add comments");
      return;
    }

    try {
      const res = await featureFetch(`/api/leave/${id}/approve`, {
        method: "POST",
        body: JSON.stringify({
          status: approvalStatus,
          comments: approvalComments,
        }),
      });

      if (res.ok) {
        toast.success(`Leave request ${approvalStatus}`);
        setApprovingId(null);
        setApprovalComments("");
        fetchRequests();
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to approve request");
      }
    } catch (error) {
      toast.error("Error approving request");
    }
  }

  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center text-slate-400">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 sm:py-16">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <Link href="/admin" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
          ← Back to Dashboard
        </Link>

        <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Leave Requests to Approve
        </h1>

        {/* Filter */}
        <div className="mt-8 flex gap-4">
          {["teacher_approved", "teacher_rejected", "admin_approved", "admin_rejected"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                statusFilter === status
                  ? "bg-indigo-600 text-white"
                  : "border border-slate-300 text-slate-700 hover:bg-slate-50"
              }`}
            >
              {status.replace("teacher_", "").replace("admin_", "")}
            </button>
          ))}
        </div>

        {/* Requests */}
        <div className="mt-10">
          {loading ? (
            <div className="text-center text-slate-400">Loading...</div>
          ) : requests.length === 0 ? (
            <div className="rounded-lg border border-slate-200 bg-white p-8 text-center text-slate-400">
              No {statusFilter} leave requests.
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((req) => (
                <div
                  key={req._id}
                  className="rounded-lg border border-slate-200 bg-white p-6 transition-all hover:shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-slate-900">
                        {req.studentId?.name}
                      </h3>
                      <p className="text-sm text-slate-600">
                        {req.studentId?.className} - {req.studentId?.section}
                      </p>

                      <div className="mt-4 space-y-2 text-sm">
                        <p>
                          <span className="font-medium text-slate-700">Dates:</span>{" "}
                          {req.startDate} to {req.endDate}
                        </p>
                        <p>
                          <span className="font-medium text-slate-700">Reason:</span> {req.reason}
                        </p>
                      </div>

                      {/* Teacher Review */}
                      {req.teacherReview && (
                        <div className="mt-4 rounded-lg bg-blue-50 p-4">
                          <p className="text-xs font-semibold text-blue-600 uppercase">
                            Teacher Review
                          </p>
                          <p className="mt-2 text-sm text-slate-700">
                            <span className="font-medium">Decision:</span>{" "}
                            {req.teacherReview.status}
                          </p>
                          {req.teacherReview.comments && (
                            <p className="mt-1 text-sm text-slate-700">
                              <span className="font-medium">Comments:</span>{" "}
                              {req.teacherReview.comments}
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Approve Button */}
                    {req.status === "teacher_approved" && (
                      <button
                        onClick={() => setApprovingId(req._id)}
                        className="ml-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-indigo-500"
                      >
                        Approve
                      </button>
                    )}
                  </div>

                  {/* Approval Modal */}
                  {approvingId === req._id && (
                    <div className="mt-6 border-t border-slate-200 pt-6">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-semibold text-slate-900">
                            Final Decision
                          </label>
                          <div className="mt-2 flex gap-4">
                            {(["approved", "rejected"] as const).map((s) => (
                              <label
                                key={s}
                                className="flex items-center gap-2 cursor-pointer"
                              >
                                <input
                                  type="radio"
                                  value={s}
                                  checked={approvalStatus === s}
                                  onChange={(e) =>
                                    setApprovalStatus(e.target.value as "approved" | "rejected")
                                  }
                                  className="h-4 w-4"
                                />
                                <span className="text-sm font-medium text-slate-700">
                                  {s.charAt(0).toUpperCase() + s.slice(1)}
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-slate-900">
                            Comments
                          </label>
                          <textarea
                            value={approvalComments}
                            onChange={(e) => setApprovalComments(e.target.value)}
                            placeholder="Add final comments for the parent..."
                            rows={4}
                            className="mt-2 block w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                          />
                        </div>

                        <div className="flex gap-3">
                          <button
                            onClick={() => handleApprove(req._id)}
                            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-indigo-500"
                          >
                            Submit Decision
                          </button>
                          <button
                            onClick={() => {
                              setApprovingId(null);
                              setApprovalComments("");
                            }}
                            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
