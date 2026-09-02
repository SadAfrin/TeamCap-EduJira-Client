const roles = [
  {
    label: "Admin",
    detail: "School-wide operations, staff, and resource planning.",
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.457 3.077l1.41-.513m14.095-5.13l1.41-.513M5.106 17.785l1.15-.964m11.49-9.642l1.149-.964M7.501 19.795l.75-1.3m7.5-12.99l.75-1.3m-6.063 16.658l.26-1.477m2.605-14.772l.26-1.477m0 17.726l-.26-1.477M10.698 4.614l-.26-1.477M16.5 19.794l-.75-1.299M7.5 4.205L6.75 2.906m12.3 14.069l.75-1.299M17.25 2.906l-.75 1.299" />
      </svg>
    ),
    color: "from-indigo-500 to-violet-500",
    bg: "bg-indigo-50",
    text: "text-indigo-600",
    borderHover: "hover:border-indigo-300",
  },
  {
    label: "Teacher",
    detail: "Attendance, grading, assignments, and class routines.",
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
      </svg>
    ),
    color: "from-emerald-500 to-teal-500",
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    borderHover: "hover:border-emerald-300",
  },
  {
    label: "Student",
    detail: "Results, timetable, homework, and tutoring support.",
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
      </svg>
    ),
    color: "from-cyan-500 to-blue-500",
    bg: "bg-cyan-50",
    text: "text-cyan-600",
    borderHover: "hover:border-cyan-300",
  },
  {
    label: "Parent",
    detail: "Notices, attendance, leave requests, and progress.",
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    ),
    color: "from-amber-500 to-orange-500",
    bg: "bg-amber-50",
    text: "text-amber-600",
    borderHover: "hover:border-amber-300",
  },
];

export default function Roles() {
  return (
    <section id="roles" className="relative overflow-hidden bg-slate-50 py-20 md:py-28">
      {/* Bg decorations */}
      <div className="pointer-events-none absolute top-1/3 right-0 h-80 w-80 rounded-full bg-indigo-100/30 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-80 w-80 rounded-full bg-cyan-100/30 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-2xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-indigo-600">Roles</p>
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
              className={`group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1.5 ${r.borderHover} hover:shadow-xl hover:shadow-slate-900/5`}
            >
              {/* Top accent gradient */}
              <div className={`absolute inset-x-0 top-0 h-1.5 bg-linear-to-r ${r.color} opacity-30 transition-opacity duration-300 group-hover:opacity-100`} />

              {/* Icon */}
              <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl ${r.bg} ${r.text} transition-all duration-300 group-hover:scale-110`}>
                {r.icon}
              </div>

              <h3 className="text-xl font-semibold text-slate-900 transition-colors group-hover:text-indigo-600">
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
