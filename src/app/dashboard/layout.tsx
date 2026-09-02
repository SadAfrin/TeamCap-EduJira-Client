"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useAuthRole } from "@/hooks/useAuthRole";
import { UserRole } from "@/types/navigation";
import { ROLE_DETAILS } from "@/config/navigation";
import Sidebar from "@/components/dashboard/Sidebar";

export default function DashboardRootLayout({ children }: { children: React.ReactNode }) {
  const { role, user, isAuthenticated, isLoading } = useAuthRole();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Normalize role
  const userRole = (role?.toLowerCase() as UserRole) || UserRole.STUDENT;
  const roleMeta = ROLE_DETAILS[userRole] || ROLE_DETAILS[UserRole.STUDENT];

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/login");
        return;
      }

      // Check route authorization under /dashboard
      const roleSegments = ["admin", "teacher", "student", "parent"];
      for (const seg of roleSegments) {
        if (pathname.startsWith(`/dashboard/${seg}`) && userRole !== seg) {
          // Redirect to their own dashboard
          router.push(`/dashboard/${userRole}`);
          return;
        }
      }
    }
  }, [isLoading, isAuthenticated, role, pathname, router, userRole]);

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

  return (
    <div className="flex min-h-[calc(100vh-65px)] flex-col md:flex-row bg-slate-50">
      {/* Mobile top header */}
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
            <span className={`inline-block rounded px-1.5 py-0.2 text-[9px] font-bold uppercase tracking-wider ${roleMeta.color.lightBg} ${roleMeta.color.text} border ${roleMeta.color.border}`}>
              {userRole} Portal
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

      <Sidebar role={userRole} isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <main className="flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8">{children}</main>
    </div>
  );
}
