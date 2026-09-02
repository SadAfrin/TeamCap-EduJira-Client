"use client";

export default function ChildProgressPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="border-b border-slate-200/80 pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Child Academic Profile & Progress</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Real-time performance metrics, term exam scores, and classroom engagement summaries.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <span className="text-xs font-bold uppercase text-slate-400">Current Term GPA</span>
          <div className="mt-2 text-3xl font-extrabold text-slate-900">4.85 / 5.00</div>
          <span className="inline-block mt-2 rounded bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700">Top 5% in Class 8-B</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <span className="text-xs font-bold uppercase text-slate-400">Monthly Attendance</span>
          <div className="mt-2 text-3xl font-extrabold text-slate-900">96% Regular</div>
          <p className="mt-2 text-xs text-slate-500">22 / 23 Days present</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <span className="text-xs font-bold uppercase text-slate-400">Homework Submissions</span>
          <div className="mt-2 text-3xl font-extrabold text-slate-900">100% On Time</div>
          <p className="mt-2 text-xs text-slate-500">All 8 tasks graded</p>
        </div>
      </div>
    </div>
  );
}
