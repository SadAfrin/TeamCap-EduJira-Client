"use client";

import { useState } from "react";
import toast from "react-hot-toast";

type Notice = {
  id: string;
  title: string;
  targetAudience: string;
  category: "General" | "Exam" | "Holiday" | "Urgent";
  date: string;
  content: string;
  publishedBy: string;
};

const DEFAULT_NOTICES: Notice[] = [
  {
    id: "NTC-01",
    title: "Mid-Term Examination Schedule & Guidelines",
    targetAudience: "All Students & Teachers",
    category: "Exam",
    date: "2026-09-01",
    content: "The upcoming mid-term examinations for Grades 6 through 10 will commence on September 15. All students must bring their admit cards.",
    publishedBy: "Academic Dean",
  },
  {
    id: "NTC-02",
    title: "Upcoming Parent-Teacher Conference (PTC)",
    targetAudience: "All Parents",
    category: "General",
    date: "2026-08-28",
    content: "Parents are warmly invited to attend the quarterly parent-teacher progress review this Saturday from 09:30 AM to 01:00 PM.",
    publishedBy: "Principal",
  },
  {
    id: "NTC-03",
    title: "School Closed for National Holiday",
    targetAudience: "Sitewide",
    category: "Holiday",
    date: "2026-08-20",
    content: "Please note that institutional academic and administrative activities will remain suspended on coming Monday.",
    publishedBy: "Super Admin",
  },
];

export default function NoticeManagementPage() {
  const [notices, setNotices] = useState<Notice[]>(DEFAULT_NOTICES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    targetAudience: "All Students & Teachers",
    category: "General" as Notice["category"],
    content: "",
  });

  function handleCreateNotice(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      toast.error("Please fill in notice title and content");
      return;
    }

    const newNotice: Notice = {
      id: `NTC-${Math.floor(10 + Math.random() * 90)}`,
      title: formData.title,
      targetAudience: formData.targetAudience,
      category: formData.category,
      date: new Date().toISOString().split("T")[0],
      content: formData.content,
      publishedBy: "Admin Portal",
    };

    setNotices([newNotice, ...notices]);
    setIsModalOpen(false);
    toast.success("Notice published successfully to portals!");
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Institutional Notices & Circulars</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Publish, broadcast, and translate school-wide and grade-specific announcements.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-purple-600/30 hover:bg-purple-500"
        >
          <span>+ Broadcast New Notice</span>
        </button>
      </div>

      {/* Notice List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {notices.map((n) => (
          <div key={n.id} className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
            <div>
              <div className="flex items-start justify-between gap-2">
                <span className="rounded-md bg-purple-50 px-2 py-0.5 text-[10px] font-bold text-purple-700 border border-purple-200">
                  {n.category}
                </span>
                <span className="font-mono text-xs text-slate-400">{n.date}</span>
              </div>

              <h3 className="mt-3 font-bold text-slate-900 text-base leading-snug">{n.title}</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed line-clamp-3">{n.content}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Audience: <strong className="text-slate-700">{n.targetAudience}</strong></span>
              <span className="text-[11px] text-slate-400">By {n.publishedBy}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <h2 className="text-lg font-bold text-slate-900">Publish Notice</h2>
            <form onSubmit={handleCreateNotice} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Title *</label>
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
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-900 focus:outline-none"
                  >
                    <option value="General">General</option>
                    <option value="Exam">Exam</option>
                    <option value="Holiday">Holiday</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Target Audience</label>
                  <select
                    value={formData.targetAudience}
                    onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-900 focus:outline-none"
                  >
                    <option value="Sitewide">Sitewide (All)</option>
                    <option value="All Students & Teachers">Students & Teachers</option>
                    <option value="All Parents">Parents & Guardians</option>
                    <option value="Faculty Only">Faculty Only</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Content / Message *</label>
                <textarea
                  rows={4}
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Write notice details..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-purple-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-purple-500"
                >
                  Broadcast Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
