"use client";

export default function CareerSkillTrackerPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="border-b border-slate-200/80 pb-5">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Skill & Career Growth Tracker</h1>
          <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800 border border-emerald-200">
            AI Career Advisor
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Analyzes your academic performance, subject strengths, and problem-solving patterns to recommend future careers.
        </p>
      </div>

      {/* Recommended Career Tracks */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="rounded-2xl border border-emerald-300 bg-emerald-50/60 p-6 shadow-xs">
          <span className="text-xs font-bold uppercase text-emerald-800">Top Match (94% Compatibility)</span>
          <h3 className="mt-2 text-lg font-bold text-slate-900">Computer Science & AI Engineering</h3>
          <p className="mt-2 text-xs text-slate-600 leading-relaxed">
            High aptitude in ICT (95%) and Mathematics (92%). Recommended higher study courses: Advanced Calculus & Algorithms.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <span className="text-xs font-bold uppercase text-slate-400">Match (88% Compatibility)</span>
          <h3 className="mt-2 text-lg font-bold text-slate-900">Applied Physics & Robotics</h3>
          <p className="mt-2 text-xs text-slate-600 leading-relaxed">
            Strong scientific reasoning and mechanics scores. Suggested extracurricular: Robotics club participation.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <span className="text-xs font-bold uppercase text-slate-400">Match (82% Compatibility)</span>
          <h3 className="mt-2 text-lg font-bold text-slate-900">Data Analytics & Actuarial Science</h3>
          <p className="mt-2 text-xs text-slate-600 leading-relaxed">
            High statistical and quantitative scores. Recommended focus: Statistics and Data Visualization.
          </p>
        </div>
      </div>
    </div>
  );
}
