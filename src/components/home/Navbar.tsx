"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { ROLE_LABELS, ROLE_COLORS } from "@/lib/constants";
import { Role } from "@/hooks/useAuthRole";

export default function Navbar() {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user as
    | (typeof session & {
        role?: Role;
        image?: string;
        name?: string;
        email?: string;
      })
    | undefined;
  const userRole = (user?.role as Role) || "student";

  const roleColor = ROLE_COLORS[userRole] || ROLE_COLORS.student;
  const roleLabel = ROLE_LABELS[userRole] || "Student";
  const dashboardHref = `/${userRole}`;

  if (isPending) {
    return (
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <Link
            href="/"
            className="text-2xl font-bold tracking-tighter text-slate-900"
          >
            Edu<span className="text-indigo-600">Jira</span>
          </Link>
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/90 shadow-xs backdrop-blur-md transition-all">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5 lg:px-8">
        {/* Logo Section */}
        <Link
          href="/"
          className="flex items-center gap-2 text-2xl font-bold tracking-tighter text-slate-900 transition-opacity hover:opacity-85"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-tr from-indigo-600 to-indigo-500 text-white shadow-sm shadow-indigo-500/30">
            <span className="font-extrabold text-lg">E</span>
          </div>
          <span>
            Edu<span className="text-indigo-600">Jira</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="/programs"
            className="text-sm font-medium text-slate-600 transition-colors hover:text-indigo-600"
          >
            Features
          </Link>
          <Link
            href="/calendar"
            className="text-sm font-medium text-slate-600 transition-colors hover:text-indigo-600"
          >
            Calendar
          </Link>
          <Link
            href="/timetable"
            className="text-sm font-medium text-slate-600 transition-colors hover:text-indigo-600"
          >
            Timetable
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium text-slate-600 transition-colors hover:text-indigo-600"
          >
            About
          </Link>
        </nav>

        {/* Desktop Action Buttons / Profile Section */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              {/* Profile Card & Role Badge */}
              <Link
                href={dashboardHref}
                className="group flex items-center gap-2.5 rounded-full border border-slate-200/90 bg-slate-50/80 py-1 pr-3.5 pl-1 transition-all hover:border-slate-300 hover:bg-slate-100/90"
              >
                <div className="relative h-8 w-8 overflow-hidden rounded-full border-2 border-indigo-500/30 bg-indigo-100">
                  <Image
                    src={user?.image || "/profile.png"}
                    width={32}
                    height={32}
                    alt={user?.name || "User"}
                    className="h-full w-full object-cover"
                    unoptimized
                  />
                </div>
                <div className="flex items-center gap-2 text-left">
                  <span className="max-w-[120px] truncate text-xs font-semibold text-slate-800">
                    {user?.name || "User"}
                  </span>
                  <span
                    className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-bold tracking-wide uppercase ${roleColor.lightBg} ${roleColor.text} border ${roleColor.border}`}
                  >
                    {roleLabel}
                  </span>
                </div>
              </Link>

              {/* Log Out Button */}
              <button
                onClick={async () => {
                  await authClient.signOut();
                  router.push("/");
                  router.refresh();
                }}
                className="flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50/80 px-3.5 py-1.5 text-xs font-semibold text-red-600 transition-all hover:bg-red-100 hover:text-red-700"
              >
                <svg
                  className="h-3.5 w-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
                  />
                </svg>
                <span>Log Out</span>
              </button>
            </div>
          ) : (
            <div className="hidden items-center gap-3 md:flex">
              <Link
                href="/login"
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-xs transition-all hover:border-slate-300 hover:bg-slate-50"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="rounded-xl bg-indigo-600 px-4.5 py-2 text-sm font-semibold text-white shadow-xs shadow-indigo-600/30 transition-all hover:bg-indigo-500 hover:shadow-indigo-600/40"
              >
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-expanded={isMobileMenuOpen}
          >
            <span className="sr-only">Open main menu</span>
            {isMobileMenuOpen ? (
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="border-t border-slate-200 bg-white/95 px-6 py-6 backdrop-blur-md md:hidden">
          <nav className="flex flex-col gap-6">
            <Link
              href="/programs"
              className="text-base font-semibold text-slate-800 hover:text-indigo-600"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Features
            </Link>
            <Link
              href="/calendar"
              className="text-base font-semibold text-slate-800 hover:text-indigo-600"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Calendar
            </Link>
            <Link
              href="/timetable"
              className="text-base font-semibold text-slate-800 hover:text-indigo-600"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Timetable
            </Link>
            <Link
              href="/about"
              className="text-base font-semibold text-slate-800 hover:text-indigo-600"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </Link>
            {user ? (
              <Link
                href="/admin"
                className="text-lg font-semibold text-slate-900 transition-colors hover:text-indigo-600"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
            ) : (
              ""
            )}

            <div className="mt-2 border-t border-slate-100 pt-4">
              {user ? (
                <button
                  onClick={async () => {
                    await authClient.signOut();
                    setIsMobileMenuOpen(false);
                    router.push("/");
                    router.refresh();
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-50 py-3 text-sm font-semibold text-red-600"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
                    />
                  </svg>
                  <span>Log Out</span>
                </button>
              ) : (
                <div className="flex flex-col gap-2.5">
                  <Link
                    href="/login"
                    className="flex w-full items-center justify-center rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white shadow-sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    className="flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white py-3 text-sm font-semibold text-slate-800"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
