"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuthRole } from "@/hooks/useAuthRole";
import { apiGet } from "@/lib/api";
import { featureFetch } from "@/lib/featureApi";

interface ChildOption {
  _id: string;
  name: string;
  studentId: string;
  className?: string;
  section?: string;
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
  const [loadingChildren, setLoadingChildren] = useState(true);

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || role !== "parent")) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, role, router]);

  useEffect(() => {
    async function loadChildren() {
      if (!user?.email) return;
      try {
        setLoadingChildren(true);
        const res = await apiGet(
          `/api/stats/parent-portal?email=${encodeURIComponent(user.email)}`
        );
        const list = (res?.data?.children || []) as ChildOption[];
        setChildren(
          list.map((c) => ({
            _id: c._id,
            name: c.name,
            studentId: c.studentId,
            className: c.className,
            section: c.section,
          }))
        );
      } catch (error) {
        console.error(error);
        toast.error("Failed to load children");
      } finally {
        setLoadingChildren(false);
      }
    }

    if (user?.email) loadChildren();
  }, [user?.email]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-slate-400">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated || role !== "parent") return null;

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
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

      if (documentFile) {
        const formData = new FormData();
        formData.append("file", documentFile);

        const uploadRes = await featureFetch("/api/upload", {
          method: "POST",
          body: formData,
          headers: {},
        });

        if (!uploadRes.ok) {
          throw new Error("Failed to upload document");
        }

        const uploadData = await uploadRes.json();
        documentUrl = uploadData.fileUrl;
      }

      const res = await featureFetch("/api/leave", {
        method: "POST",
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
            Submit a leave request for your child. The request will be reviewed by their teacher
            and then by the administrator.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-10 space-y-8">
          <div>
            <label className="block text-sm font-semibold text-slate-900">Select Child</label>
            <select
              value={selectedChild}
              onChange={(e) => setSelectedChild(e.target.value)}
              disabled={loadingChildren}
              className="mt-2 block w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
            >
              <option value="">
                {loadingChildren ? "Loading children..." : "Choose a child..."}
              </option>
              {children.map((child) => (
                <option key={child._id} value={child._id}>
                  {child.name}
                  {child.className
                    ? ` (${child.className}${child.section ? `-${child.section}` : ""})`
                    : ""}
                </option>
              ))}
            </select>
            {!loadingChildren && children.length === 0 && (
              <p className="mt-2 text-xs text-amber-600">
                No linked children found for your account. Ask an admin to link a student.
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-semibold text-slate-900">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="mt-2 block w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-900">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="mt-2 block w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
              />
            </div>
          </div>

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

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={submitting || loadingChildren}
              className="flex-1 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-indigo-500 hover:shadow-md disabled:opacity-50"
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
