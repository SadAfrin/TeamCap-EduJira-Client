"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuthRole } from "@/hooks/useAuthRole";
import { ROLE_LABELS, ROLE_COLORS } from "@/lib/constants";
import Sidebar from "@/components/dashboard/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { role, user, isAuthenticated, isLoading } = useAuthRole();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-9 w-9 animate-spin rounded-full border-3 border-indigo-600 border-t-transparent" />
          <p className="text-sm font-medium text-slate-500">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const roleColor = role ? ROLE_COLORS[role] : ROLE_COLORS.student;
  const roleLabel = role ? ROLE_LABELS[role] : "Workspace";

  return (
    <div className="flex min-h-[calc(100vh-65px)] flex-col md:flex-row bg-slate-50">
      {/* Mobile top bar */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 md:hidden">
        <div className="flex items-center gap-2.5">
          <div className="relative h-8 w-8 overflow-hidden rounded-full border border-indigo-200 bg-indigo-50">
            <Image
              src={user?.image || "/profile.png"}
              width={32}
              height={32}
              alt={user?.name || "User"}
              className="h-full w-full object-cover"
              unoptimized
            />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-900 leading-tight">{user?.name || "User"}</p>
            <span className={`inline-block rounded px-1.5 py-0.2 text-[9px] font-bold uppercase tracking-wider ${roleColor.lightBg} ${roleColor.text} border ${roleColor.border}`}>
              {roleLabel} Portal
            </span>
          </div>
        </div>

        <button
          onClick={() => setMobileOpen(true)}
          className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
          aria-label="Open menu"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
          <span>Menu</span>
        </button>
      </div>

      <Sidebar isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <main className="flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8">{children}</main>
    </div>
  );
}