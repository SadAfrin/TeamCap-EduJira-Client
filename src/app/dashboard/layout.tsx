"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuthRole } from "@/hooks/useAuthRole";
import { UserRole } from "@/types/navigation";
import { ROLE_DETAILS } from "@/config/navigation";
import Sidebar from "@/components/dashboard/Sidebar";
import NotificationBell from "@/components/dashboard/NotificationBell";
import { authClient } from "@/lib/auth-client";
import { apiGet } from "@/lib/api";
import toast from "react-hot-toast";

export default function DashboardRootLayout({ children }: { children: React.ReactNode }) {
  const { role, user, isAuthenticated, isLoading } = useAuthRole();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [checkingApproval, setCheckingApproval] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Normalize role
  const userRole = (role?.toLowerCase() as UserRole) || UserRole.STUDENT;
  const roleMeta = ROLE_DETAILS[userRole] || ROLE_DETAILS[UserRole.STUDENT];

  useEffect(() => {
    async function verifyStudentApproval() {
      if (userRole === "student" && user?.email) {
        try {
          setCheckingApproval(true);
          const res = await apiGet(`/api/students/status?email=${encodeURIComponent(user.email)}`);
          if (res.success && res.exists) {
            if (res.status === "pending" || res.status === "rejected") {
              router.push(`/pending-review?email=${encodeURIComponent(user.email)}&name=${encodeURIComponent(user.name || "")}`);
              return;
            }
          }
        } catch (err) {
          console.error("Failed to check approval status:", err);
        } finally {
          setCheckingApproval(false);
        }
      }
    }

    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/login");
        return;
      }

      // Route authorization check
      const roleSegments = ["admin", "teacher", "student", "parent"];
      for (const seg of roleSegments) {
        if (pathname.startsWith(`/dashboard/${seg}`) && userRole !== seg) {
          router.push(`/dashboard/${userRole}`);
          return;
        }
      }

      verifyStudentApproval();
    }
  }, [isLoading, isAuthenticated, role, pathname, router, userRole, user]);

  const handleSignOut = async () => {
    try {
      await authClient.signOut();
      toast.success("Signed out successfully");
      router.push("/login");
    } catch {
      router.push("/login");
    }
  };

  if (isLoading || checkingApproval) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900 text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-3 border-indigo-500 border-t-transparent" />
          <p className="text-sm font-semibold tracking-wide text-slate-300">
            Authenticating EduJira Workspace...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      {/* Universal Top Navbar */}
      <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/95 px-4 sm:px-6 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 md:hidden"
            aria-label="Toggle menu"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>

          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white font-black text-base shadow-sm">
              E
            </div>
            <span className="text-lg font-black tracking-tight text-slate-900">
              Edu<span className="text-indigo-600">Jira</span>
            </span>
          </Link>

          <span className={`hidden md:inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider ${roleMeta.color.lightBg} ${roleMeta.color.text} border ${roleMeta.color.border} ml-2`}>
            {userRole} Workspace
          </span>
        </div>

        {/* Right Action Icons: Notification Bell & User Profile */}
        <div className="flex items-center gap-3">
          <NotificationBell />

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 rounded-xl p-1.5 hover:bg-slate-100 transition-colors focus:outline-none"
            >
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
              <div className="hidden text-left lg:block">
                <p className="text-xs font-bold text-slate-900 leading-tight truncate max-w-[120px]">{user?.name || "User"}</p>
                <p className="text-[10px] font-medium text-slate-500 capitalize">{userRole}</p>
              </div>
              <svg className="h-3.5 w-3.5 text-slate-400 hidden lg:block" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="border-b border-slate-100 p-2 text-xs">
                  <p className="font-bold text-slate-900 truncate">{user?.name || "User"}</p>
                  <p className="text-slate-500 font-mono text-[11px] truncate">{user?.email}</p>
                  <span className={`mt-1.5 inline-block rounded px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${roleMeta.color.lightBg} ${roleMeta.color.text}`}>
                    Role: {userRole}
                  </span>
                </div>
                <div className="mt-1 space-y-0.5">
                  <Link
                    href={`/dashboard/${userRole}`}
                    onClick={() => setShowProfileMenu(false)}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    <span>🏠 Dashboard Home</span>
                  </Link>
                  <Link
                    href={`/dashboard/${userRole}/profile`}
                    onClick={() => setShowProfileMenu(false)}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 font-bold"
                  >
                    <span>👤 My Profile & Edit</span>
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <span>🚪 Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Body with Sidebar */}
      <div className="flex flex-1">
        <Sidebar role={userRole} isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
        <main className="flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
