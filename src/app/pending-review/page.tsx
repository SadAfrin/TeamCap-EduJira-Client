"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { apiGet } from "@/lib/api";

function PendingReviewContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const emailParam = searchParams.get("email") || "";
  const nameParam = searchParams.get("name") || "";
  const classParam = searchParams.get("class") || "";

  const [email, setEmail] = useState(emailParam);
  const [statusData, setStatusData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const checkStatus = async (targetEmail: string) => {
    if (!targetEmail) return;
    setLoading(true);
    setError("");
    try {
      const res = await apiGet(`/api/students/status?email=${encodeURIComponent(targetEmail)}`);
      if (res.success && res.exists) {
        setStatusData(res);
      } else {
        setError("No registration found with this email address.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to check status");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (emailParam) {
      checkStatus(emailParam);
    }
  }, [emailParam]);

  const currentStatus = statusData?.status || "pending";

  return (
    <div className="min-h-screen bg-slate-900 py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-white p-8 sm:p-10 shadow-2xl text-center">
        {/* Status Icon */}
        {currentStatus === "pending" && (
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 border border-amber-200">
            <svg className="h-8 w-8 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
        )}

        {currentStatus === "approved" && (
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        )}

        {currentStatus === "rejected" && (
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 border border-rose-200">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        )}

        <h1 className="mt-5 text-2xl font-black text-slate-900">
          {currentStatus === "pending" && "Application Under Review"}
          {currentStatus === "approved" && "Application Approved! 🎉"}
          {currentStatus === "rejected" && "Application Update"}
        </h1>

        <p className="mt-2 text-sm text-slate-600 max-w-md mx-auto">
          {currentStatus === "pending" &&
            `Thank you for applying to EduJira, ${nameParam || statusData?.name || "Student"}. Your application for ${classParam || "admission"} has been recorded and is currently awaiting manual review & section assignment by school administrators.`}
          {currentStatus === "approved" &&
            `Congratulations, ${statusData?.name || "Student"}! Your admission has been confirmed. You are assigned to ${statusData?.className} (Section ${statusData?.section}).`}
          {currentStatus === "rejected" &&
            `We appreciate your interest in EduJira. However, your application could not be approved at this time.`}
        </p>

        {currentStatus === "rejected" && statusData?.rejectionReason && (
          <div className="mt-4 rounded-xl bg-rose-50 p-4 border border-rose-200 text-xs text-rose-800 text-left">
            <p className="font-bold">Reason from Administration:</p>
            <p className="mt-0.5">{statusData.rejectionReason}</p>
          </div>
        )}

        {/* Application Status Card */}
        <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50 p-5 text-left text-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="font-medium text-slate-500">Applicant Name</span>
            <span className="font-bold text-slate-900">{nameParam || statusData?.name || "Student Applicant"}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-medium text-slate-500">Registered Email</span>
            <span className="font-mono font-semibold text-slate-700">{email || "Not specified"}</span>
          </div>
          {statusData?.studentId && (
            <div className="flex items-center justify-between">
              <span className="font-medium text-slate-500">Application Reference</span>
              <span className="font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                {statusData.studentId}
              </span>
            </div>
          )}
          <div className="flex items-center justify-between border-t border-slate-200 pt-2">
            <span className="font-medium text-slate-500">Current Status</span>
            <span
              className={`rounded-full px-2.5 py-0.5 font-bold uppercase tracking-wider text-[10px] ${
                currentStatus === "approved"
                  ? "bg-emerald-100 text-emerald-800"
                  : currentStatus === "rejected"
                  ? "bg-rose-100 text-rose-800"
                  : "bg-amber-100 text-amber-800"
              }`}
            >
              {currentStatus}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          {currentStatus === "approved" ? (
            <Link
              href="/login"
              className="w-full sm:w-auto rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white shadow-md hover:bg-emerald-500"
            >
              Sign In to Student Dashboard →
            </Link>
          ) : (
            <button
              onClick={() => checkStatus(email)}
              disabled={loading}
              className="w-full sm:w-auto rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-bold text-white shadow-md hover:bg-indigo-500 disabled:opacity-50"
            >
              {loading ? "Checking Status..." : "Refresh Application Status ⟳"}
            </button>
          )}

          <Link
            href="/"
            className="w-full sm:w-auto rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Return to Home
          </Link>
        </div>

        {/* Manual lookup input if email wasn't provided in query */}
        {!emailParam && (
          <div className="mt-8 pt-6 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Track Another Application by Email:
            </label>
            <div className="flex gap-2 max-w-sm mx-auto">
              <input
                type="email"
                placeholder="name@school.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-xs"
              />
              <button
                onClick={() => checkStatus(email)}
                className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800"
              >
                Track
              </button>
            </div>
            {error && <p className="mt-2 text-xs text-rose-600">{error}</p>}
          </div>
        )}
      </div>
    </div>
  );
}

export default function PendingReviewPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white text-sm">
          Loading application review...
        </div>
      }
    >
      <PendingReviewContent />
    </Suspense>
  );
}
