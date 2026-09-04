"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuthRole } from "@/hooks/useAuthRole";

interface LeaveRequest {
  _id: string;
  studentId: { _id: string; name: string; studentId: string; className: string; section: string };
  startDate: string;
  endDate: string;
  reason: string;
  status: "submitted" | "teacher_approved" | "teacher_rejected" | "admin_approved" | "admin_rejected";
  teacherReview?: { comments?: string; status?: string; reviewedAt?: string };
  adminReview?: { comments?: string; status?: string; reviewedAt?: string };
  createdAt: string;
}

const statusConfig: Record<string, { color: string; bg: string; label: string }> = {
  submitted: { color: "text-gray-600", bg: "bg-gray-50 border-gray-200", label: "Submitted" },
  teacher_approved: { color: "text-green-600", bg: "bg-green-50 border-green-200", label: "Teacher Approved" },
  teacher_rejected: { color: "text-red-600", bg: "bg-red-50 border-red-200", label: "Teacher Rejected" },
  admin_approved: { color: "text-blue-600", bg: "bg-blue-50 border-blue-200", label: "Approved" },
  admin_rejected: { color: "text-red-600", bg: "bg-red-50 border-red-200", label: "Rejected" },
};

export default function ParentLeavePage() {
  const router = useRouter();
  const { role, isAuthenticated, isLoading } = useAuthRole();

  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);

  if (!isLoading && (!isAuthenticated || role !== "parent")) {
    router.push("/login");
    return null;
  }

  useEffect(() => {
    fetchRequests();
  }, []);

  async function fetchRequests() {
    try {
      const res = await fetch("/api/leave");
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

  async function handleCancel(id: string) {
    if (!confirm("Are you sure you want to cancel this request?")) return;

    try {
      const res = await fetch(`/api/leave/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Leave request cancelled");
        setRequests(requests.filter((r) => r._id !== id));
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to cancel request");
      }
    } catch (error) {
      toast.error("Error cancelling request");
    }
  }

  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center text-slate-400">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 sm:py-16">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div>
            <Link href="/parent" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
              ← Back to Dashboard
            </Link>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Leave Request History
            </h1>
          </div>
          <Link
            href="/parent/leave"
            className="rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-indigo-500 hover:shadow-md"
          >
            + New Request
          </Link>
        </div>

        {/* Requests List */}
        <div className="mt-10">
          {loading ? (
            <div className="text-center text-slate-400">Loading...</div>
          ) : requests.length === 0 ? (
            <div className="rounded-lg border border-slate-200 bg-white p-8 text-center text-slate-400">
              No leave requests yet. <Link href="/parent/leave" className="text-indigo-600 hover:underline">Create one now</Link>.
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((req) => {
                const config = statusConfig[req.status];
                return (
                  <div
                    key={req._id}
                    className={`rounded-lg border ${config.bg} p-6 transition-all hover:shadow-md`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-semibold text-slate-900">
                            {req.studentId?.name}
                          </h3>
                          <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${config.color} ${config.bg}`}>
                            {config.label}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-slate-600">
                          {req.startDate} to {req.endDate}
                        </p>
                        <p className="mt-2 text-sm text-slate-700">{req.reason}</p>

                        {/* Teacher Review */}
                        {req.teacherReview?.comments && (
                          <div className="mt-4 border-t border-current border-opacity-10 pt-4">
                            <p className="text-xs font-semibold text-slate-600 uppercase">
                              Teacher Review
                            </p>
                            <p className="mt-1 text-sm text-slate-700">
                              {req.teacherReview.comments}
                            </p>
                          </div>
                        )}

                        {/* Admin Review */}
                        {req.adminReview?.comments && (
                          <div className="mt-4 border-t border-current border-opacity-10 pt-4">
                            <p className="text-xs font-semibold text-slate-600 uppercase">
                              Administrator Review
                            </p>
                            <p className="mt-1 text-sm text-slate-700">
                              {req.adminReview.comments}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      {req.status === "submitted" && (
                        <button
                          onClick={() => handleCancel(req._id)}
                          className="ml-4 text-xs font-medium text-red-600 hover:text-red-700"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
