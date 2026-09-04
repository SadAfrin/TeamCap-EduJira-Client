import Link from "next/link";

export default function AboutSection() {
  return (
    <section
      id="about"
      className="relative isolate overflow-hidden bg-slate-900 py-24 sm:py-32"
    >
      {/* Decorative Blobs */}
      <div className="pointer-events-none absolute -top-32 -right-32 -z-0 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 -left-32 -z-0 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />

      {/* Mesh gradient */}
      <div
        className="absolute -top-24 -right-24 -z-0 transform-gpu blur-3xl"
        aria-hidden="true"
      >
        <div
          className="aspect-1404/767 w-351 bg-linear-to-r from-indigo-500 to-cyan-500 opacity-15"
          style={{
            clipPath:
              "polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 58.9% 0.2%, 73.6% 51.7%)",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-indigo-400">About EduJira</p>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Made for the{" "}
            <span className="bg-linear-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              education sector
            </span>
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-slate-300">
            EduJira is built for schools looking to move off paper registers and
            scattered spreadsheets, reducing manual work for admins and teachers
            while giving parents real visibility into their child&apos;s
            progress.
          </p>

          {/* CTA */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/signup"
              className="group rounded-xl bg-indigo-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition-all hover:-translate-y-0.5 hover:bg-indigo-500 hover:shadow-xl hover:shadow-indigo-600/30"
            >
              <span className="flex items-center gap-2">
                Get Started Free
                <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </span>
            </Link>
            <Link
              href="/about"
              className="rounded-xl border border-slate-700 bg-slate-800/50 px-7 py-3.5 text-sm font-semibold text-slate-300 transition-all hover:border-slate-600 hover:bg-slate-800 hover:text-white"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
