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
  documentUrl?: string;
  status: "submitted" | "teacher_approved" | "teacher_rejected" | "admin_approved" | "admin_rejected";
  createdAt: string;
}

export default function TeacherLeaveRequestsPage() {
  const router = useRouter();
  const { role, isAuthenticated, isLoading } = useAuthRole();

  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("submitted");
  const [reviewingId, setReviewingId] = useState<string | null>(null);
  const [reviewStatus, setReviewStatus] = useState<"approved" | "rejected">("approved");
  const [reviewComments, setReviewComments] = useState("");

  if (!isLoading && (!isAuthenticated || role !== "teacher")) {
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

  async function handleReview(id: string) {
    if (!reviewComments.trim()) {
      toast.error("Please add comments");
      return;
    }

    try {
      const res = await featureFetch(`/api/leave/${id}/review`, {
        method: "POST",
        body: JSON.stringify({
          status: reviewStatus,
          comments: reviewComments,
        }),
      });

      if (res.ok) {
        toast.success(`Leave request ${reviewStatus}`);
        setReviewingId(null);
        setReviewComments("");
        fetchRequests();
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to review request");
      }
    } catch (error) {
      toast.error("Error reviewing request");
    }
  }

  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center text-slate-400">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 sm:py-16">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <Link href="/teacher" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
          ← Back to Dashboard
        </Link>

        <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Leave Requests to Review
        </h1>

        {/* Filter */}
        <div className="mt-8 flex gap-4">
          {["submitted", "teacher_approved", "teacher_rejected"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                statusFilter === status
                  ? "bg-indigo-600 text-white"
                  : "border border-slate-300 text-slate-700 hover:bg-slate-50"
              }`}
            >
              {status === "submitted" ? "Pending" : status.replace("teacher_", "")}
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
                        {req.documentUrl && (
                          <p>
                            <a
                              href={req.documentUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="font-medium text-indigo-600 hover:underline"
                            >
                              View Document
                            </a>
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Review Button */}
                    {req.status === "submitted" && (
                      <button
                        onClick={() => setReviewingId(req._id)}
                        className="ml-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-indigo-500"
                      >
                        Review
                      </button>
                    )}
                  </div>

                  {/* Review Modal */}
                  {reviewingId === req._id && (
                    <div className="mt-6 border-t border-slate-200 pt-6">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-semibold text-slate-900">
                            Decision
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
                                  checked={reviewStatus === s}
                                  onChange={(e) => setReviewStatus(e.target.value as "approved" | "rejected")}
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
                            value={reviewComments}
                            onChange={(e) => setReviewComments(e.target.value)}
                            placeholder="Add comments for the parent and admin..."
                            rows={4}
                            className="mt-2 block w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                          />
                        </div>

                        <div className="flex gap-3">
                          <button
                            onClick={() => handleReview(req._id)}
                            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-indigo-500"
                          >
                            Submit Review
                          </button>
                          <button
                            onClick={() => {
                              setReviewingId(null);
                              setReviewComments("");
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
