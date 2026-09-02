const stats = [
  {
    label: "Hours saved per week on admin tasks",
    value: "15+",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: "from-indigo-500 to-violet-500",
  },
  {
    label: "Increase in parent engagement",
    value: "40%",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
      </svg>
    ),
    color: "from-cyan-500 to-blue-500",
  },
  {
    label: "Reduction in paper waste",
    value: "95%",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
      </svg>
    ),
    color: "from-emerald-500 to-teal-500",
  },
  {
    label: "Early warning AI interventions",
    value: "2.5x",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
    color: "from-amber-500 to-orange-500",
  },
];

export default function MetricsSection() {
  return (
    <section className="relative overflow-hidden border-t border-slate-200 bg-white py-24 sm:py-32">
      {/* Bg decorations */}
      <div className="pointer-events-none absolute top-0 right-0 h-64 w-64 rounded-full bg-indigo-50/60 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-64 w-64 rounded-full bg-cyan-50/60 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-indigo-600">Impact</p>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Measurable impact for your school
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-slate-600">
            EduJira isn&apos;t just about digitizing records; it&apos;s about
            reclaiming time for what actually matters: teaching.
          </p>
        </div>

        <dl className="mt-16 grid grid-cols-1 gap-6 sm:mt-20 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="group relative flex flex-col items-center gap-y-5 rounded-2xl bg-slate-50/80 p-8 shadow-sm ring-1 ring-slate-200 transition-all duration-300 hover:-translate-y-1.5 hover:ring-indigo-200 hover:shadow-xl hover:shadow-indigo-900/5"
            >
              {/* Icon */}
              <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br ${stat.color} text-white shadow-lg transition-transform duration-300 group-hover:scale-110`}>
                {stat.icon}
              </div>
              {/* Value */}
              <dd className="text-4xl font-extrabold tracking-tight text-slate-900">
                <span className="bg-linear-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent">
                  {stat.value}
                </span>
              </dd>
              {/* Label */}
              <dt className="text-center text-sm leading-relaxed text-slate-600">
                {stat.label}
              </dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
