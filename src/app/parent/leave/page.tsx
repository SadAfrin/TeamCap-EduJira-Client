"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuthRole } from "@/hooks/useAuthRole";

interface ChildOption {
  _id: string;
  name: string;
  studentId: string;
}

export default function ParentLeavePage() {
  const router = useRouter();
  const { role, isAuthenticated, isLoading, user } = useAuthRole();

  const [selectedChild, setSelectedChild] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [documentPreview, setDocumentPreview] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [children, setChildren] = useState<ChildOption[]>([]);
  const [loadingChildren, setLoadingChildren] = useState(false);

  // Redirect if not parent
  if (!isLoading && (!isAuthenticated || role !== "parent")) {
    router.push("/login");
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-slate-400">Loading...</div>
      </div>
    );
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }

      setDocumentFile(file);
      setDocumentPreview(file.name);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Validation
    if (!selectedChild) {
      toast.error("Please select a child");
      return;
    }
    if (!startDate || !endDate) {
      toast.error("Please select start and end dates");
      return;
    }
    if (!reason.trim()) {
      toast.error("Please provide a reason for leave");
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start > end) {
      toast.error("Start date must be before end date");
      return;
    }

    setSubmitting(true);

    try {
      let documentUrl = "";

      // Upload document if provided
      if (documentFile) {
        const formData = new FormData();
        formData.append("file", documentFile);

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!uploadRes.ok) {
          throw new Error("Failed to upload document");
        }

        const uploadData = await uploadRes.json();
        documentUrl = uploadData.fileUrl;
      }

      // Submit leave request
      const res = await fetch("/api/leave", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: selectedChild,
          startDate,
          endDate,
          reason,
          documentUrl: documentUrl || null,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to submit leave request");
      }

      toast.success("Leave request submitted successfully!");
      router.push("/parent/leave/list");
    } catch (error: unknown) {
      toast.error((error as Error).message || "Error submitting leave request");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 sm:py-16">
      <div className="mx-auto max-w-2xl px-6 lg:px-8">
        <Link href="/parent" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
          ← Back to Dashboard
        </Link>

        <div className="mt-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Submit Leave Request
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Submit a leave request for your child. The request will be reviewed by their teacher and then by the administrator.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-10 space-y-8">
          {/* Select Child */}
          <div>
            <label className="block text-sm font-semibold text-slate-900">
              Select Child
            </label>
            <select
              value={selectedChild}
              onChange={(e) => setSelectedChild(e.target.value)}
              className="mt-2 block w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
            >
              <option value="">Choose a child...</option>
              {/* TODO: Fetch children for this parent */}
              <option value="student1">Student 1 (Grade 8-A)</option>
              <option value="student2">Student 2 (Grade 9-B)</option>
            </select>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-semibold text-slate-900">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="mt-2 block w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-900">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="mt-2 block w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
              />
            </div>
          </div>

          {/* Reason */}
          <div>
            <label className="block text-sm font-semibold text-slate-900">
              Reason for Leave *
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g., Medical appointment, Family emergency, etc."
              rows={4}
              className="mt-2 block w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
            />
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-semibold text-slate-900">
              Medical Certificate (Optional)
            </label>
            <p className="mt-1 text-xs text-slate-600">
              Supported formats: PDF, JPG, PNG, DOC (Max 5MB)
            </p>
            <div className="mt-2 flex items-center gap-4">
              <input
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                className="hidden"
                id="document-upload"
              />
              <label
                htmlFor="document-upload"
                className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-slate-300 px-6 py-4 text-center hover:bg-slate-50"
              >
                <svg
                  className="h-5 w-5 text-slate-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <span className="text-sm font-medium text-slate-600">
                  {documentPreview || "Upload file"}
                </span>
              </label>
              {documentPreview && (
                <button
                  type="button"
                  onClick={() => {
                    setDocumentFile(null);
                    setDocumentPreview("");
                  }}
                  className="text-xs text-red-600 hover:text-red-700"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-indigo-500 hover:shadow-md focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Submit Leave Request"}
            </button>
            <Link
              href="/parent/leave/list"
              className="rounded-lg border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50"
            >
              View History
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
