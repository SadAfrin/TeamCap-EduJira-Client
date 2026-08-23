import Link from "next/link";
import ReportCardWidget from "./ReportCardWidget";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-slate-50 px-6 py-20 md:py-32 lg:px-8">
      {/* Background Glow Effect */}
      <div className="absolute top-0 left-1/2 -z-10 -translate-x-1/2 transform-gpu blur-3xl sm:-top-80">
        <div
          className="aspect-1155/678 w-288.75 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-20"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        ></div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-2 md:items-center">
        <div className="max-w-2xl">
          {/* Modern Pill Badge */}
          <div className="mb-6 inline-flex items-center rounded-full border border-indigo-500/30 bg-indigo-50/50 px-3 py-1 text-sm font-medium text-indigo-600 backdrop-blur-sm">
            <span className="mr-2 flex h-2 w-2 animate-pulse rounded-full bg-indigo-600"></span>
            Smart School Management
          </div>

          {/* Gradient Headline */}
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Every student&apos;s record, <br className="hidden md:block" />
            <span className="bg-linear-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent">
              kept the way it deserves.
            </span>
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-8 text-slate-600">
            EduJira centralizes attendance, grades, notices, and scheduling for
            your school, with AI that catches what a spreadsheet never will.
          </p>

          {/* Upgraded Buttons */}
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="/programs"
              className="rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-indigo-500 hover:shadow-md focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Explore features
            </Link>
            <Link
              href="/login"
              className="rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-900 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50"
            >
              Sign in to your portal{" "}
              <span aria-hidden="true" className="ml-1 text-slate-400">
                →
              </span>
            </Link>
          </div>
        </div>

        {/* Widget Container with Floating Depth */}
        <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
          {/* Subtle back-glow for the widget */}
          <div className="absolute -inset-1 rounded-2xl bg-linear-to-r from-indigo-500 to-cyan-500 opacity-20 blur-lg transition duration-1000 group-hover:opacity-30"></div>

          <div className="relative rounded-2xl bg-white shadow-2xl ring-1 ring-slate-900/5">
            <ReportCardWidget />
          </div>
        </div>
      </div>
    </section>
  );
}
