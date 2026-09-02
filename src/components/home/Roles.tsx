import { roles } from "@/data/home";

export default function Roles() {
  return (
    <section id="roles" className="bg-slate-50 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header Section */}
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Built around who&apos;s using it
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            One platform, four distinct views. Nobody wades through a dashboard
            meant for someone else&apos;s job.
          </p>
        </div>

        {/* Roles Grid */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {roles.map((r) => (
            <div
              key={r.label}
              className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg hover:shadow-indigo-900/5"
            >
              {/* Animated Accent Line */}
              <div className="absolute inset-x-0 top-0 h-1.5 bg-linear-to-r from-indigo-500 to-cyan-500 opacity-40 transition-opacity duration-300 group-hover:opacity-100"></div>

              <h3 className="mt-2 text-xl font-semibold text-slate-900 transition-colors group-hover:text-indigo-600">
                {r.label}
              </h3>

              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                {r.detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
