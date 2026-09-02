"use client";

import { useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";
import { redirect } from "next/navigation";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  if (isPending) {
    return (
      <div className="flex items-center justify-center h-16 bg-stone-50 border-b border-stone-200">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  console.log(user);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md transition-all">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        {/* Logo Section */}
        <Link
          href="/"
          className="text-2xl font-bold tracking-tighter text-slate-900 transition-opacity hover:opacity-80"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          Edu<span className="text-indigo-600">Jira</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="/programs"
            className="text-sm font-semibold text-slate-600 transition-colors hover:text-indigo-600"
          >
            Features
          </Link>

          <Link
            href="/calendar"
            className="text-sm font-semibold text-slate-600 transition-colors hover:text-indigo-600"
          >
            Calendar
          </Link>
          <Link
            href="/timetable"
            className="text-sm font-semibold text-slate-600 transition-colors hover:text-indigo-600"
          >
            Timetable
          </Link>
          <Link
            href="/about"
            className="text-sm font-semibold text-slate-600 transition-colors hover:text-indigo-600"
          >
            About
          </Link>
        </nav>

        {/* Desktop Action Button & Mobile Toggle */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <div className="border-2 w-8 border-green-500 rounded-full">
                <Image
                  src={user?.image || "/profile.png"}
                  width={30}
                  height={30}
                  alt="userimage"
                  className="rounded-full object-cover w-auto h-auto"
                />
              </div>
              <button
                onClick={async () => {
                  await authClient.signOut();
                  redirect("/");
                }}
                className="px-4 py-2 text-sm font-medium bg-red-100 text-red-600 hover:bg-red-200 rounded-md transition-colors"
              >
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50 md:block"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="hidden rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50 md:block"
              >
                Sign Up
              </Link>
            </>
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
              className="text-lg font-semibold text-slate-900 transition-colors hover:text-indigo-600"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Features
            </Link>
            <Link
              href="/calendar"
              className="text-lg font-semibold text-slate-900 transition-colors hover:text-indigo-600"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Calendar
            </Link>
            <Link
              href="/timetable"
              className="text-lg font-semibold text-slate-900 transition-colors hover:text-indigo-600"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Timetable
            </Link>
            <Link
              href="/about"
              className="text-lg font-semibold text-slate-900 transition-colors hover:text-indigo-600"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </Link>

            <div className="mt-4 border-t border-slate-100 pt-6">
              <Link
                href="/login"
                className="flex w-full items-center justify-center rounded-xl bg-indigo-600 px-5 py-3.5 text-base font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-indigo-500 hover:shadow-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sign in to your portal
              </Link>
              <Link
                href="/signup"
                className="flex w-full my-2 items-center justify-center rounded-xl bg-indigo-600 px-5 py-3.5 text-base font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-indigo-500 hover:shadow-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sign up for an account
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
