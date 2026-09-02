import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          {/* Brand & Copyright */}
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold tracking-tighter text-slate-900">
              Edu<span className="text-indigo-600">Jira</span>
            </span>
            <span
              className="hidden h-4 w-px bg-slate-300 sm:block"
              aria-hidden="true"
            ></span>
            <p className="text-sm text-slate-500">
              &copy; {new Date().getFullYear()} Built for schools.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="flex gap-8">
            <Link
              href="/programs"
              className="text-sm font-medium text-slate-500 transition-colors hover:text-indigo-600"
            >
              Features
            </Link>
            <Link
              href="/login"
              className="text-sm font-medium text-slate-500 transition-colors hover:text-indigo-600"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
