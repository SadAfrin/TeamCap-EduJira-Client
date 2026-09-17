"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api";

type Notice = {
  _id: string;
  title: string;
  body: string;
  targetType: "all" | "class" | "role";
  className: string;
  targetRole: "all" | "admin" | "teacher" | "student" | "parent";
  category: "Academic" | "Event" | "Holiday" | "Urgent" | "General";
  priority: "normal" | "high" | "urgent";
  createdBy: string;
  isDeleted: boolean;
  createdAt: string;
};

type FormData = {
  title: string;
  body: string;
  targetType: "all" | "class" | "role";
  className: string;
  targetRole: "all" | "admin" | "teacher" | "student" | "parent";
  category: "Academic" | "Event" | "Holiday" | "Urgent" | "General";
  priority: "normal" | "high" | "urgent";
};

const EMPTY_FORM: FormData = {
  title: "",
  body: "",
  targetType: "all",
  className: "",
  targetRole: "all",
  category: "General",
  priority: "normal",
};

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Academic: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  Event: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  Holiday: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  Urgent: { bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200" },
  General: { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
};

const PRIORITY_BADGES: Record<string, { label: string; dot: string }> = {
  normal: { label: "Normal", dot: "bg-slate-400" },
  high: { label: "High", dot: "bg-amber-500" },
  urgent: { label: "Urgent", dot: "bg-rose-500" },
};

export default function NoticeManagementPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM);

  useEffect(() => {
    fetchNotices();
  }, []);

  async function fetchNotices() {
    try {
      setLoading(true);
      const res = await apiGet("/api/notices");
      setNotices(res.data || []);
    } catch {
      toast.error("Failed to load notices");
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setEditingId(null);
    setFormData(EMPTY_FORM);
    setModalOpen(true);
  }

  function openEdit(n: Notice) {
    setEditingId(n._id);
    setFormData({
      title: n.title,
      body: n.body,
      targetType: n.targetType,
      className: n.className || "",
      targetRole: n.targetRole,
      category: n.category,
      priority: n.priority,
    });
    setModalOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.title.trim() || !formData.body.trim()) {
      toast.error("Title and content are required");
      return;
    }

    try {
      if (editingId) {
        await apiPut(`/api/notices/${editingId}`, formData);
        toast.success("Notice updated successfully");
      } else {
        await apiPost("/api/notices", { ...formData, createdBy: "Admin Portal" });
        toast.success("Notice published successfully");
      }
      setModalOpen(false);
      fetchNotices();
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this notice?")) return;
    try {
      await apiDelete(`/api/notices/${id}`);
      toast.success("Notice deleted");
      setNotices((prev) => prev.filter((n) => n._id !== id));
    } catch {
      toast.error("Failed to delete notice");
    }
  }

  function getTargetLabel(n: Notice) {
    if (n.targetType === "all") return "Sitewide (All)";
    if (n.targetType === "class") return `Class: ${n.className || "N/A"}`;
    if (n.targetType === "role") {
      const roleMap: Record<string, string> = {
        admin: "Admins",
        teacher: "Teachers",
        student: "Students",
        parent: "Parents",
        all: "Everyone",
      };
      return roleMap[n.targetRole] || n.targetRole;
    }
    return "Unknown";
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Institutional Notices & Circulars
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Publish, broadcast, and translate school-wide and grade-specific announcements.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-purple-600/30 hover:bg-purple-500"
        >
          <span>+ Broadcast New Notice</span>
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-600 border-t-transparent" />
        </div>
      ) : notices.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center">
          <p className="text-sm text-slate-500">No notices yet. Click &quot;Broadcast New Notice&quot; to create one.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {notices.map((n) => {
            const colors = CATEGORY_COLORS[n.category] || CATEGORY_COLORS.General;
            const badge = PRIORITY_BADGES[n.priority] || PRIORITY_BADGES.normal;
            return (
              <div
                key={n._id}
                className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded-md ${colors.bg} px-2 py-0.5 text-[10px] font-bold ${colors.text} border ${colors.border}`}
                      >
                        {n.category}
                      </span>
                      <span className="flex items-center gap-1 text-[10px] font-medium text-slate-500">
                        <span className={`h-1.5 w-1.5 rounded-full ${badge.dot}`} />
                        {badge.label}
                      </span>
                    </div>
                    <span className="font-mono text-xs text-slate-400">
                      {new Date(n.createdAt).toLocaleDateString("en-CA")}
                    </span>
                  </div>

                  <h3 className="mt-3 font-bold text-slate-900 text-base leading-snug">
                    {n.title}
                  </h3>
                  <p className="mt-2 text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {n.body}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                    <span>
                      Target: <strong className="text-slate-700">{getTargetLabel(n)}</strong>
                    </span>
                    <span className="text-[11px] text-slate-400">By {n.createdBy}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEdit(n)}
                      className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(n._id)}
                      className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700 transition-colors"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <h2 className="text-lg font-bold text-slate-900">
              {editingId ? "Edit Notice" : "Publish Notice"}
            </h2>
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Annual Sports Day 2026"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-900 focus:outline-none"
                  >
                    <option value="General">General</option>
                    <option value="Academic">Academic</option>
                    <option value="Event">Event</option>
                    <option value="Holiday">Holiday</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-900 focus:outline-none"
                  >
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Target
                  </label>
                  <select
                    value={formData.targetType}
                    onChange={(e) =>
                      setFormData({ ...formData, targetType: e.target.value as any })
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-900 focus:outline-none"
                  >
                    <option value="all">Sitewide (All)</option>
                    <option value="role">By Role</option>
                    <option value="class">By Class</option>
                  </select>
                </div>

                {formData.targetType === "role" && (
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                      Role
                    </label>
                    <select
                      value={formData.targetRole}
                      onChange={(e) =>
                        setFormData({ ...formData, targetRole: e.target.value as any })
                      }
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-900 focus:outline-none"
                    >
                      <option value="all">Everyone</option>
                      <option value="admin">Admins</option>
                      <option value="teacher">Teachers</option>
                      <option value="student">Students</option>
                      <option value="parent">Parents</option>
                    </select>
                  </div>
                )}

                {formData.targetType === "class" && (
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                      Class Name
                    </label>
                    <input
                      type="text"
                      value={formData.className}
                      onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                      placeholder="e.g. Class 8"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Content / Message *
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.body}
                  onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                  placeholder="Write notice details..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-purple-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-purple-500"
                >
                  {editingId ? "Update Notice" : "Broadcast Notice"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
