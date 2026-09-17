"use client";

import { useEffect, useState } from "react";
import StudentManagement from "@/app/(dashboard)/admin/students/page";
import TeacherManagement from "@/app/(dashboard)/admin/teachers/page";
import AdminManagement from "@/app/(dashboard)/admin/admins/page";
import ParentManagement from "@/app/(dashboard)/admin/parents/page";
import { apiGet, apiPost } from "@/lib/api";
import toast from "react-hot-toast";

function PendingRegistrationsQueue() {
  const [pendingList, setPendingList] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Approval Modal State
  const [selectedApplicant, setSelectedApplicant] = useState<any>(null);
  const [assignClass, setAssignClass] = useState("Class 8");
  const [assignSection, setAssignSection] = useState("B");
  const [assignRoll, setAssignRoll] = useState("05");
  const [processing, setProcessing] = useState(false);

  // Rejection Modal State
  const [rejectApplicant, setRejectApplicant] = useState<any>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const [pendingRes, classesRes] = await Promise.all([
        apiGet("/api/students/pending"),
        apiGet("/api/classes"),
      ]);

      if (pendingRes.success) setPendingList(pendingRes.data || []);
      if (classesRes.success) setClasses(classesRes.data || []);
    } catch (err) {
      console.error("Failed to load pending queue:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenApproveModal = (applicant: any) => {
    setSelectedApplicant(applicant);
    setAssignClass(applicant.desiredClass || "Class 8");
    setAssignSection("B");
    setAssignRoll("05");
  };

  const handleApprove = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApplicant) return;

    setProcessing(true);
    try {
      const res = await apiPost(`/api/students/${selectedApplicant.studentId}/approve`, {
        className: assignClass,
        section: assignSection,
        roll: assignRoll,
      });

      if (res.success) {
        toast.success(`Application approved! ${selectedApplicant.name} assigned to ${assignClass} – Section ${assignSection}. 🎉`);
        setSelectedApplicant(null);
        fetchData();
      } else {
        toast.error(res.message || "Failed to approve applicant");
      }
    } catch (err: any) {
      toast.error(err.message || "Error approving application");
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectApplicant) return;

    setProcessing(true);
    try {
      const res = await apiPost(`/api/students/${rejectApplicant.studentId}/reject`, {
        rejectionReason,
      });

      if (res.success) {
        toast.success(`Application for ${rejectApplicant.name} has been rejected.`);
        setRejectApplicant(null);
        setRejectionReason("");
        fetchData();
      } else {
        toast.error(res.message || "Failed to reject applicant");
      }
    } catch (err: any) {
      toast.error(err.message || "Error rejecting application");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">Pending Student Registration Applications</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Review applicant documents, verify previous school GPA, and manually assign to class & section with capacity checks
            </p>
          </div>
          <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700 border border-amber-200">
            {pendingList.length} Under Review
          </span>
        </div>

        {loading ? (
          <div className="py-16 text-center text-xs text-slate-400">Loading pending applications...</div>
        ) : pendingList.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-400">
            No pending registration applications in the review queue.
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {pendingList.map((app) => (
              <div
                key={app.studentId}
                className="rounded-2xl border border-slate-200/90 bg-slate-50/60 p-5 space-y-4 hover:border-indigo-300 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-slate-900 text-sm">{app.name}</h4>
                      <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-[11px] font-bold text-indigo-700 border border-indigo-100 font-mono">
                        {app.studentId}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Desired Grade: <strong className="text-indigo-700">{app.desiredClass}</strong> • Applied on {new Date(app.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      onClick={() => setRejectApplicant(app)}
                      className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100 transition-colors"
                    >
                      Reject ✕
                    </button>
                    <button
                      onClick={() => handleOpenApproveModal(app)}
                      className="rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white hover:bg-emerald-500 shadow-md shadow-emerald-600/20 transition-colors"
                    >
                      Verify & Approve ✓
                    </button>
                  </div>
                </div>

                {/* Detail Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-white p-4 rounded-xl border border-slate-200/80">
                  <div>
                    <span className="text-slate-400 block font-medium">Contact Details</span>
                    <span className="font-semibold text-slate-800">{app.email || "No email"}</span>
                    <p className="text-slate-500">{app.phone || "No phone"}</p>
                  </div>

                  <div>
                    <span className="text-slate-400 block font-medium">Guardian / Parent</span>
                    <span className="font-semibold text-slate-800">{app.parentName || "N/A"}</span>
                    <p className="text-slate-500">{app.parentPhone || app.parentEmail || "—"}</p>
                  </div>

                  <div>
                    <span className="text-slate-400 block font-medium">Academic Background</span>
                    <span className="font-semibold text-slate-800">{app.previousSchool || "Not specified"}</span>
                    <p className="text-indigo-600 font-bold">GPA: {app.previousGPA || "N/A"}</p>
                  </div>
                </div>

                {/* Documents Viewer */}
                {app.documents && app.documents.length > 0 && (
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-bold text-slate-700">Uploaded Documents:</span>
                    {app.documents.map((doc: string, i: number) => (
                      <a
                        key={i}
                        href={doc}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700 hover:underline border border-indigo-100"
                      >
                        📄 Document #{i + 1}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Approval & Class/Section Assignment Modal */}
      {selectedApplicant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl">
            <h3 className="text-base font-extrabold text-slate-900">
              Approve Admission for {selectedApplicant.name}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Assign final classroom and section. System enforces maximum section capacity limits.
            </p>

            <form onSubmit={handleApprove} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Assign Class *</label>
                <select
                  value={assignClass}
                  onChange={(e) => setAssignClass(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold"
                >
                  <option value="Class 6">Class 6 (Junior Secondary)</option>
                  <option value="Class 7">Class 7 (Junior Secondary)</option>
                  <option value="Class 8">Class 8 (JSC Batch)</option>
                  <option value="Class 9">Class 9 (Secondary Science)</option>
                  <option value="Class 10">Class 10 (SSC Batch)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Assign Section *</label>
                <select
                  value={assignSection}
                  onChange={(e) => setAssignSection(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold"
                >
                  <option value="A">Section A (Room 201 - Capacity: 40)</option>
                  <option value="B">Section B (Room 201 - Capacity: 45)</option>
                  <option value="C">Section C (Room 202 - Capacity: 40)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Assign Roll Number</label>
                <input
                  type="text"
                  value={assignRoll}
                  onChange={(e) => setAssignRoll(e.target.value)}
                  placeholder="e.g. 05"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-mono"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-4">
                <button
                  type="button"
                  onClick={() => setSelectedApplicant(null)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={processing}
                  className="rounded-xl bg-emerald-600 px-6 py-2 text-xs font-bold text-white hover:bg-emerald-500 shadow-md shadow-emerald-600/20 disabled:opacity-50"
                >
                  {processing ? "Assigning..." : "Confirm & Grant Access ✓"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Rejection Modal */}
      {rejectApplicant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl">
            <h3 className="text-base font-extrabold text-slate-900">
              Reject Application for {rejectApplicant.name}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Provide a clear reason for rejection. This will be sent as a status update notification.
            </p>

            <form onSubmit={handleReject} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Rejection Reason *</label>
                <textarea
                  rows={3}
                  required
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="e.g. Incomplete documentation / Section capacity full / Does not meet GPA threshold..."
                  className="w-full rounded-xl border border-slate-200 p-3 text-xs outline-none focus:border-rose-600"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => setRejectApplicant(null)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={processing}
                  className="rounded-xl bg-rose-600 px-6 py-2 text-xs font-bold text-white hover:bg-rose-500 shadow-md shadow-rose-600/20 disabled:opacity-50"
                >
                  {processing ? "Rejecting..." : "Confirm Rejection ✕"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function UserManagementMasterPage() {
  const [activeTab, setActiveTab] = useState<"pending" | "students" | "teachers" | "admins" | "parents">("pending");

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Top Header */}
      <div className="border-b border-slate-200/80 pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Institutional User Directory & Admissions</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Review pending self-registrations, manage CRUD access for Students, Faculty, Administrators, and Guardians.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab("pending")}
          className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs sm:text-sm font-bold transition-all ${
            activeTab === "pending"
              ? "bg-amber-600 text-white shadow-sm shadow-amber-600/30"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <span>⏳ Pending Registrations</span>
        </button>

        <button
          onClick={() => setActiveTab("students")}
          className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs sm:text-sm font-bold transition-all ${
            activeTab === "students"
              ? "bg-purple-600 text-white shadow-sm shadow-purple-600/30"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <span>🎓 Students Directory</span>
        </button>

        <button
          onClick={() => setActiveTab("teachers")}
          className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs sm:text-sm font-bold transition-all ${
            activeTab === "teachers"
              ? "bg-blue-600 text-white shadow-sm shadow-blue-600/30"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <span>👨‍🏫 Faculty & Teachers</span>
        </button>

        <button
          onClick={() => setActiveTab("admins")}
          className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs sm:text-sm font-bold transition-all ${
            activeTab === "admins"
              ? "bg-indigo-600 text-white shadow-sm shadow-indigo-600/30"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <span>👑 Administrators</span>
        </button>

        <button
          onClick={() => setActiveTab("parents")}
          className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs sm:text-sm font-bold transition-all ${
            activeTab === "parents"
              ? "bg-rose-600 text-white shadow-sm shadow-rose-600/30"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <span>👨‍👩‍👧 Guardians & Parents</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div>
        {activeTab === "pending" && <PendingRegistrationsQueue />}
        {activeTab === "students" && <StudentManagement />}
        {activeTab === "teachers" && <TeacherManagement />}
        {activeTab === "admins" && <AdminManagement />}
        {activeTab === "parents" && <ParentManagement />}
      </div>
    </div>
  );
}
