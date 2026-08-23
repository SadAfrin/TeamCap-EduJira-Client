import Link from "next/link";
import { highlightFeatures } from "@/data/home";

export default function FeatureHighlights() {
  return (
    <section className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-20 md:py-28 lg:px-8">
        {/* Header Section */}
        <div className="mb-12 flex items-end justify-between border-b border-slate-100 pb-6">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            What EduJira handles for you
          </h2>
          <Link
            href="/programs"
            className="hidden text-sm font-semibold text-indigo-600 transition-colors hover:text-indigo-500 md:flex md:items-center md:gap-1"
          >
            See all 12 features <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {highlightFeatures.map((f) => (
            <div
              key={f.title}
              className="group relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50 p-8 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:bg-white hover:shadow-lg hover:shadow-indigo-900/5"
            >
              <div>
                {/* Decorative Icon Wrapper */}
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
                  {/* Standard Heroicon - Replace with f.icon if your data includes icons */}
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
                      d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
                    />
                  </svg>
                </div>

                <h3 className="text-lg font-semibold text-slate-900">
                  {f.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  {f.body}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Link */}
        <Link
          href="/programs"
          className="mt-10 inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 transition-colors hover:text-indigo-500 md:hidden"
        >
          See all 12 features <span aria-hidden="true">&rarr;</span>
        </Link>
      </div>
    </section>
  );
}
