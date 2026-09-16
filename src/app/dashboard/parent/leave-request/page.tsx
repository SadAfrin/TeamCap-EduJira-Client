"use client";

import { useEffect, useState } from "react";
import { apiGet, apiPost } from "@/lib/api";
import { useAuthRole } from "@/hooks/useAuthRole";
import LinkChildModal from "@/components/dashboard/LinkChildModal";
import { childDisplayName, useParentChildren } from "@/hooks/useParentChildren";
import toast from "react-hot-toast";

export default function ParentLeaveRequestPage() {
  const { user } = useAuthRole();
  const { parent, children, approvedChildren, loading: childrenLoading, reload } = useParentChildren();
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [leaves, setLeaves] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [doctorNoteUrl, setDoctorNoteUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const selectedChild = approvedChildren.find((c) => c.studentId === selectedStudentId);

  useEffect(() => {
    if (approvedChildren.length === 0) {
      setSelectedStudentId("");
      return;
    }
    setSelectedStudentId((prev) =>
      approvedChildren.some((child) => child.studentId === prev) ? prev : approvedChildren[0].studentId
    );
  }, [approvedChildren]);

  const fetchLeaves = async (studentId: string) => {
    try {
      setLoading(true);
      const res = await apiGet(`/api/leaves?studentId=${studentId}`);
      if (res.success) {
        setLeaves(res.data || []);
      } else {
        setLeaves([]);
      }
    } catch (err) {
      console.error("Failed to load leaves:", err);
      setLeaves([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!selectedStudentId) {
      setLeaves([]);
      setLoading(false);
      return;
    }
    void fetchLeaves(selectedStudentId);
  }, [selectedStudentId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChild) {
      toast.error("Link a child before submitting a leave request.");
      return;
    }
    if (!startDate || !endDate || !reason) {
      toast.error("Please fill in start date, end date, and reason.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await apiPost("/api/leaves", {
        studentId: selectedChild.studentId,
        studentName: childDisplayName(selectedChild),
        className: selectedChild.className || "",
        section: selectedChild.section || "",
        requestedBy: "parent",
        parentName: user?.name || parent?.name || "",
        parentEmail: user?.email || parent?.email || "",
        startDate,
        endDate,
        reason,
        doctorNoteUrl,
      });

      if (res.success) {
        toast.success("Leave application submitted for child! ✓");
        setStartDate("");
        setEndDate("");
        setReason("");
        setDoctorNoteUrl("");
        void fetchLeaves(selectedChild.studentId);
      } else {
        toast.error(res.message || "Failed to submit leave");
      }
    } catch (err: any) {
      toast.error(err.message || "Error submitting leave");
    } finally {
      setSubmitting(false);
    }
  };

  if (childrenLoading) {
    return <div className="p-12 text-center text-slate-500 text-sm">Loading linked children...</div>;
  }

  if (approvedChildren.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-black text-slate-900">Child Leave Applications</h1>
        <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-10 text-center space-y-3">
          <h2 className="text-lg font-bold text-slate-800">No Child Linked</h2>
          <p className="text-sm text-slate-500">Link a student before submitting leave applications.</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl"
          >
            Add / Link Child
          </button>
        </div>
        {isModalOpen && parent?.parentId && (
          <LinkChildModal
            parentId={parent.parentId}
            existingChildren={children}
            onClose={() => setIsModalOpen(false)}
            onLinked={() => void reload()}
          />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Child Leave Applications</h1>
        <p className="text-xs text-slate-500 mt-1">Submit excused medical and family leaves for your child</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs h-fit">
          <h3 className="font-bold text-slate-900 text-sm mb-4">Apply for Child Leave</h3>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Child</label>
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700"
              >
                {approvedChildren.map((c) => (
                  <option key={c.studentId} value={c.studentId}>
                    {childDisplayName(c)}
                    {c.className ? ` (${c.className}${c.section ? ` – Sec ${c.section}` : ""})` : ""}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Start Date *</label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">End Date *</label>
              <input
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Reason for Absence *</label>
              <textarea
                rows={3}
                required
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Medical reason, family event, etc..."
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Doctor's Note / Attachment URL</label>
              <input
                type="url"
                value={doctorNoteUrl}
                onChange={(e) => setDoctorNoteUrl(e.target.value)}
                placeholder="https://example.com/prescription.pdf"
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-amber-600 py-2.5 text-xs font-bold text-white hover:bg-amber-500 shadow-md shadow-amber-600/20 disabled:opacity-50 mt-2"
            >
              {submitting ? "Submitting..." : "Submit Leave Application"}
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <h3 className="font-bold text-slate-900 text-sm mb-4">Leave Application Records & Approval Status</h3>

          {loading ? (
            <p className="text-xs text-slate-400 py-8 text-center">Loading applications...</p>
          ) : leaves.length === 0 ? (
            <p className="text-xs text-slate-400 py-8 text-center">No leave applications submitted yet.</p>
          ) : (
            <div className="space-y-3">
              {leaves.map((item) => (
                <div key={item._id} className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-900">
                        {item.startDate} to {item.endDate} ({item.daysCount} days)
                      </span>
                      <p className="text-xs text-slate-600 mt-1">{item.reason}</p>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
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

                  {item.reviewRemarks && (
                    <p className="text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-200/60">
                      <strong>Teacher/Admin Remarks: </strong> {item.reviewRemarks} (Reviewed by {item.reviewedBy || "Class Teacher"})
                    </p>
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
