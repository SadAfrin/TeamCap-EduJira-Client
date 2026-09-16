import Link from "next/link";

const features = [
  {
    title: "AI early warning system",
    body: "Flags students at risk of failing before report card day, so teachers can step in early.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
      </svg>
    ),
    color: "from-red-500 to-orange-500",
    bg: "bg-red-50",
    text: "text-red-600",
    hoverBorder: "hover:border-red-200",
  },
  {
    title: "Automated report card narratives",
    body: "Turns raw grades into a personal, readable comment for every student, every term.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
    color: "from-indigo-500 to-violet-500",
    bg: "bg-indigo-50",
    text: "text-indigo-600",
    hoverBorder: "hover:border-indigo-200",
  },
  {
    title: "Digital attendance",
    body: "Teachers mark attendance in seconds. Parents see it the same day.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: "from-emerald-500 to-teal-500",
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    hoverBorder: "hover:border-emerald-200",
  },
  {
    title: "Role-based dashboards",
    body: "Admins, teachers, students, and parents each see exactly what they need, nothing else.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
      </svg>
    ),
    color: "from-cyan-500 to-blue-500",
    bg: "bg-cyan-50",
    text: "text-cyan-600",
    hoverBorder: "hover:border-cyan-200",
  },
  {
    title: "Multilingual notices",
    body: "School announcements reach every parent in the language they read best.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 01-3.827-5.802" />
      </svg>
    ),
    color: "from-amber-500 to-yellow-500",
    bg: "bg-amber-50",
    text: "text-amber-600",
    hoverBorder: "hover:border-amber-200",
  },
  {
    title: "Virtual tutoring bot",
    body: "A 24/7 study companion for homework questions and concept explanations.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
      </svg>
    ),
    color: "from-violet-500 to-purple-500",
    bg: "bg-violet-50",
    text: "text-violet-600",
    hoverBorder: "hover:border-violet-200",
  },
];

export default function FeatureHighlights() {
  return (
    <section className="relative overflow-hidden border-t border-slate-200 bg-white">
      {/* Subtle bg decoration */}
      <div className="pointer-events-none absolute top-0 right-0 h-72 w-72 rounded-full bg-indigo-50/50 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-72 w-72 rounded-full bg-cyan-50/50 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6 py-20 md:py-28 lg:px-8">
        {/* Header */}
        <div className="mb-14 flex items-end justify-between border-b border-slate-100 pb-6">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-indigo-600">Features</p>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              What EduJira handles for you
            </h2>
          </div>
          <Link
            href="/programs"
            className="group hidden items-center gap-1.5 text-sm font-semibold text-indigo-600 transition-colors hover:text-indigo-500 md:flex"
          >
            See all 12 features
            <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className={`group relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50/80 p-8 transition-all duration-300 hover:-translate-y-1.5 ${f.hoverBorder} hover:bg-white hover:shadow-xl hover:shadow-slate-900/5`}
            >
              {/* Icon */}
              <div>
                <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl ${f.bg} ${f.text} transition-all duration-300 group-hover:scale-110`}>
                  {f.icon}
                </div>
                <h3 className="text-lg font-semibold text-slate-900">
                  {f.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  {f.body}
                </p>
              </div>
              {/* Bottom accent line */}
              <div className={`mt-6 h-0.5 w-0 bg-linear-to-r ${f.color} transition-all duration-300 group-hover:w-full rounded-full`} />
            </div>
          ))}
        </div>

        {/* Mobile Link */}
        <Link
          href="/programs"
          className="mt-10 inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 transition-colors hover:text-indigo-500 md:hidden"
        >
          See all 12 features
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </Link>
      </div>
    </section>
  );
}
