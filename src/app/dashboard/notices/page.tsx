"use client";

import { useEffect, useState } from "react";
import { useAuthRole } from "@/hooks/useAuthRole";
import { apiGet } from "@/lib/api";

type Notice = {
  _id: string;
  title: string;
  body: string;
  targetType: "all" | "class" | "role";
  className: string;
  targetRole: string;
  category: "Academic" | "Event" | "Holiday" | "Urgent" | "General";
  priority: "normal" | "high" | "urgent";
  createdBy: string;
  createdAt: string;
};

const CATEGORY_CONFIG: Record<string, { bg: string; text: string; border: string; icon: string }> = {
  Academic: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", icon: "📚" },
  Event: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", icon: "🎉" },
  Holiday: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", icon: "🏖️" },
  Urgent: { bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200", icon: "🚨" },
  General: { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200", icon: "📢" },
};

const PRIORITY_CONFIG: Record<string, { label: string; dot: string; bg: string }> = {
  normal: { label: "Normal", dot: "bg-slate-400", bg: "bg-slate-50 text-slate-600" },
  high: { label: "High", dot: "bg-amber-500", bg: "bg-amber-50 text-amber-700" },
  urgent: { label: "Urgent", dot: "bg-rose-500", bg: "bg-rose-50 text-rose-700" },
};

const FILTERS = ["All", "Academic", "Event", "Holiday", "Urgent", "General"] as const;

export default function NoticesPage() {
  const { role } = useAuthRole();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await apiGet(`/api/notices?role=${role || "all"}`);
        setNotices(res.data || []);
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [role]);

  const filtered = notices.filter((n) => {
    const matchCategory = activeFilter === "All" || n.category === activeFilter;
    const matchSearch =
      !search ||
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.body.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  const unreadCount = filtered.length;

  function getRelativeTime(dateStr: string) {
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHrs = Math.floor(diffMins / 60);
    if (diffHrs < 24) return `${diffHrs}h ago`;
    const diffDays = Math.floor(diffHrs / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString("en-CA");
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-fuchsia-600 p-6 sm:p-8 text-white shadow-xl shadow-indigo-500/20">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight">Notice Board</h1>
              <p className="text-xs text-white/70 mt-0.5">
                Stay updated with school announcements and circulars
              </p>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <div className="rounded-xl bg-white/15 px-4 py-2 text-sm font-bold backdrop-blur-sm">
              {unreadCount} notice{unreadCount !== 1 ? "s" : ""}
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search notices..."
            className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm text-slate-900 shadow-xs placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`whitespace-nowrap rounded-lg px-3.5 py-2 text-xs font-bold transition-all ${
                activeFilter === f
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/25"
                  : "bg-white text-slate-600 border border-slate-200 hover:border-indigo-300 hover:text-indigo-700"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Notices */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
            <p className="text-xs font-medium text-slate-400">Loading notices...</p>
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
            <svg className="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-slate-600">No notices found</p>
          <p className="text-xs text-slate-400 mt-1">
            {search ? "Try a different search term" : "No announcements match this filter"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((n, i) => {
            const cat = CATEGORY_CONFIG[n.category] || CATEGORY_CONFIG.General;
            const pri = PRIORITY_CONFIG[n.priority] || PRIORITY_CONFIG.normal;
            const isExpanded = expandedId === n._id;

            return (
              <div
                key={n._id}
                className={`group rounded-2xl border bg-white shadow-xs transition-all hover:shadow-md ${
                  isExpanded ? "border-indigo-200 shadow-indigo-100" : "border-slate-200/80"
                }`}
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div
                  className="flex cursor-pointer items-start gap-4 p-5"
                  onClick={() => setExpandedId(isExpanded ? null : n._id)}
                >
                  {/* Category Icon */}
                  <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${cat.bg} text-lg`}>
                    {cat.icon}
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1.5">
                          <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold border ${cat.bg} ${cat.text} ${cat.border}`}>
                            {n.category}
                          </span>
                          {n.priority !== "normal" && (
                            <span className={`flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold ${pri.bg}`}>
                              <span className={`h-1.5 w-1.5 rounded-full ${pri.dot}`} />
                              {pri.label}
                            </span>
                          )}
                        </div>
                        <h3 className="font-bold text-slate-900 text-sm leading-snug">
                          {n.title}
                        </h3>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <span className="text-[11px] text-slate-400 font-mono whitespace-nowrap">
                          {getRelativeTime(n.createdAt)}
                        </span>
                        <svg
                          className={`h-4 w-4 text-slate-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                        </svg>
                      </div>
                    </div>

                    {/* Preview text when collapsed */}
                    {!isExpanded && (
                      <p className="mt-1.5 text-xs text-slate-500 line-clamp-1">{n.body}</p>
                    )}
                  </div>
                </div>

                {/* Expanded content */}
                {isExpanded && (
                  <div className="border-t border-slate-100 px-5 pb-5 pt-4">
                    <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                      {n.body}
                    </p>
                    <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                      <div className="flex items-center gap-4 text-[11px] text-slate-400">
                        <span className="flex items-center gap-1">
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                          </svg>
                          {n.createdBy}
                        </span>
                        <span className="flex items-center gap-1">
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                          </svg>
                          {new Date(n.createdAt).toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      {n.targetType !== "all" && (
                        <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-600">
                          {n.targetType === "class" ? `Class: ${n.className}` : `Role: ${n.targetRole}`}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
