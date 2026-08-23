export default function MetricsSection() {
  const stats = [
    { label: "Hours saved per week on admin tasks", value: "15+" },
    { label: "Increase in parent engagement", value: "40%" },
    { label: "Reduction in paper waste", value: "95%" },
    { label: "Early warning AI interventions", value: "2.5x" },
  ];

  return (
    <section className="border-t border-slate-200 bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Measurable impact for your school
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            EduJira isn&apos;t just about digitizing records; it&apos;s about
            reclaiming time for what actually matters: teaching.
          </p>
        </div>
        <dl className="mt-16 grid grid-cols-1 gap-8 sm:mt-20 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col-reverse items-center justify-between gap-y-4 rounded-2xl bg-slate-50 p-8 shadow-sm ring-1 ring-slate-200 transition-all hover:-translate-y-1 hover:ring-indigo-200 hover:shadow-md hover:shadow-indigo-900/5"
            >
              <dt className="text-center text-sm leading-relaxed text-slate-600">
                {stat.label}
              </dt>
              <dd className="text-4xl font-extrabold tracking-tight text-slate-900">
                <span className="bg-linear-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent">
                  {stat.value}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
