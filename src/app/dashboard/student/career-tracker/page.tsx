"use client";

import { useEffect, useState } from "react";
import { apiGet } from "@/lib/api";

export default function StudentCareerTrackerPage() {
  const [careerData, setCareerData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCareerInsights() {
      try {
        setLoading(true);
        const res = await apiGet(`/api/ai/career-growth?studentId=STD-801`);
        if (res.success) {
          setCareerData(res.data);
        }
      } catch (err) {
        console.error("Failed to load career insights:", err);
      } finally {
        setLoading(false);
      }
    }
    loadCareerInsights();
  }, []);

  const skillMatrix = careerData?.skillMatrix || [
    { domain: "Logical & Problem Solving", score: 92, color: "#6366f1" },
    { domain: "Computing & Software", score: 95, color: "#10b981" },
    { domain: "Scientific Enquiry", score: 88, color: "#8b5cf6" },
    { domain: "Language & Communication", score: 81, color: "#f59e0b" },
    { domain: "Creative Design", score: 80, color: "#ec4899" },
  ];

  const recommendedCareers = careerData?.recommendedCareers || [
    {
      title: "Software Engineering & Artificial Intelligence",
      matchPercentage: 94,
      rationale: "Outstanding aptitude in Computing and Mathematical reasoning.",
      nextSteps: ["Learn Python and Web Basics", "Participate in National Junior Informatics Olympiad"],
    },
    {
      title: "Data Science & Quantitative Analytics",
      matchPercentage: 88,
      rationale: "Consistently high scores in Mathematics and Analytical Subjects.",
      nextSteps: ["Foundational statistics", "Data exploration exercises"],
    },
    {
      title: "Biomedical & Engineering Technology",
      matchPercentage: 82,
      rationale: "Solid conceptual grasp in General Science and Logic.",
      nextSteps: ["Join Science & Robotics Club", "Submit science fair project"],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-purple-900 via-indigo-900 to-slate-900 p-6 sm:p-8 text-white shadow-xl shadow-purple-950/10">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <span className="rounded-full bg-purple-500/20 px-3 py-1 text-xs font-bold text-purple-300 backdrop-blur-md border border-purple-400/30">
              AI Growth Engine
            </span>
            <h1 className="mt-2 text-2xl sm:text-3xl font-black tracking-tight">
              Career & Skill Growth Tracker 🚀
            </h1>
            <p className="mt-1 text-sm text-purple-200 max-w-xl">
              AI analysis aggregating your academic scores, subject competencies, and problem-solving patterns into personalized career trajectories.
            </p>
          </div>
          <span className="text-3xl font-black text-purple-300">Class 8 JSC</span>
        </div>
      </div>

      {/* Grid: Strengths & Skill Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Competency Meter */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900">Academic Competency Radar</h2>
          <p className="text-xs text-slate-500">Calculated from recent term examinations & coursework</p>

          <div className="space-y-4 mt-4">
            {skillMatrix.map((item: any, idx: number) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">{item.domain}</span>
                  <span className="font-mono font-bold text-slate-900">{item.score}%</span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${item.score}%`, backgroundColor: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-xl bg-purple-50 p-4 border border-purple-100 text-xs text-purple-900">
            <p className="font-bold">AI Strength Summary:</p>
            <p className="mt-0.5 leading-relaxed">
              {careerData?.strengthsSummary ||
                "High analytical competence with notable prowess in computing technologies and mathematical problem-solving."}
            </p>
          </div>
        </div>

        {/* Recommended Career Fields */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900">Top Recommended Career Paths</h2>
          <p className="text-xs text-slate-500">Domains matching your academic profile</p>

          <div className="space-y-3 mt-4">
            {recommendedCareers.map((c: any, idx: number) => (
              <div key={idx} className="rounded-2xl border border-slate-200/90 bg-slate-50/60 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-slate-900 text-sm">{c.title}</h4>
                  <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                    {c.matchPercentage}% Match
                  </span>
                </div>
                <p className="text-xs text-slate-600">{c.rationale}</p>
                <div className="pt-2 border-t border-slate-200/60 text-[11px] text-slate-700">
                  <span className="font-bold text-indigo-700">Recommended Steps: </span>
                  {c.nextSteps?.join(" • ")}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
