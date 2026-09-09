import Link from "next/link";

export default function NotFound() {
  return (
    <section className="relative flex min-h-[70vh] flex-col items-center justify-center overflow-hidden px-4">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-indigo-100/60 via-purple-50/40 to-sky-100/50 blur-3xl" />
        <div className="ledger-rules absolute inset-0 opacity-30" />
      </div>

      {/* Floating illustration */}
      <div className="relative mb-8">
        <div className="relative flex h-40 w-40 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-500 via-purple-500 to-sky-500 shadow-2xl shadow-indigo-500/25">
          <span className="font-display text-7xl font-bold text-white drop-shadow-lg">
            404
          </span>
          {/* Decorative dots */}
          <div className="absolute -right-3 -top-3 h-5 w-5 rounded-full bg-amber-400 shadow-lg shadow-amber-400/40" />
          <div className="absolute -bottom-2 -left-3 h-4 w-4 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/40" />
          <div className="absolute -bottom-3 right-4 h-3 w-3 rounded-full bg-rose-400 shadow-lg shadow-rose-400/40" />
        </div>
        {/* Notebook lines effect */}
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 space-y-2.5 opacity-20">
          <div className="h-px w-48 bg-indigo-300" />
          <div className="h-px w-44 bg-indigo-300" />
          <div className="h-px w-40 bg-indigo-300" />
        </div>
      </div>

      {/* Text content */}
      <h1 className="mb-3 font-display text-3xl font-semibold text-slate-800 md:text-4xl">
        Page Not Found
      </h1>
      <p className="mb-10 max-w-md text-center text-base text-slate-500 md:text-lg">
        Oops! The page you&apos;re looking for doesn&apos;t exist or has been
        moved. Let&apos;s get you back on track.
      </p>

      {/* Action buttons */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-7 py-3 font-medium text-white shadow-lg shadow-indigo-500/25 transition-all hover:scale-105 hover:shadow-xl hover:shadow-indigo-500/30 active:scale-95"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1"
            />
          </svg>
          Back to Home
        </Link>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-7 py-3 font-medium text-slate-700 shadow-sm transition-all hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 hover:shadow-md active:scale-95"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
            />
          </svg>
          Go to Dashboard
        </Link>
      </div>
    </section>
  );
}
