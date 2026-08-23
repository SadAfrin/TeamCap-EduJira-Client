"use client";

import { useState } from "react";
import Link from "next/link";

const roles = [
  { id: "admin", label: "Admin" },
  { id: "teacher", label: "Teacher" },
  { id: "student", label: "Student" },
  { id: "parent", label: "Parent" },
] as const;

type RoleId = (typeof roles)[number]["id"];

export default function LoginPage() {
  const [activeRole, setActiveRole] = useState<RoleId>("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) {
      setError("Enter your email and password to continue.");
      return;
    }
    setError("");
    // Hook up to your auth flow here.
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-6 py-16 sm:px-12">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 transform-gpu blur-3xl">
        <div
          className="aspect-1155/678 w-288.75 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-20"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        ></div>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white/80 p-8 shadow-xl shadow-slate-200/50 backdrop-blur-xl sm:p-10">
        {/* Header / Logo */}
        <div className="flex flex-col items-center text-center">
          <Link
            href="/"
            className="text-2xl font-bold tracking-tighter text-slate-900 transition-opacity hover:opacity-80"
          >
            Edu<span className="text-indigo-600">Jira</span>
          </Link>
          <h1 className="mt-8 text-2xl font-bold tracking-tight text-slate-900">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Choose your role, then enter your details.
          </p>
        </div>

        {/* Role Selector (Segmented Control Style) */}
        <div className="mt-8 grid grid-cols-4 gap-2 rounded-xl bg-slate-100 p-1.5">
          {roles.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => setActiveRole(r.id)}
              aria-pressed={activeRole === r.id}
              className={`rounded-lg py-2 text-xs font-semibold transition-all duration-200 ${
                activeRole === r.id
                  ? "bg-white text-indigo-600 shadow-sm ring-1 ring-slate-900/5"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Email address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@school.edu"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700"
              >
                Password
              </label>
              <Link
                href="#"
                className="text-xs font-medium text-indigo-600 hover:text-indigo-500 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
            />
          </div>

          {error && (
            <div
              className="rounded-lg bg-red-50 p-3 text-sm text-red-600"
              role="alert"
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            className="mt-2 w-full rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-indigo-500 hover:shadow-md focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Sign in as {roles.find((r) => r.id === activeRole)?.label}
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-slate-500">
          Trouble signing in?{" "}
          <a href="#" className="font-medium text-indigo-600 hover:underline">
            Contact your administrator.
          </a>
        </p>
      </div>
    </div>
  );
}
