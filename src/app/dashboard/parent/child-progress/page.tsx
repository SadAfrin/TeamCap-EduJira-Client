"use client";

import { useEffect, useState } from "react";
import { apiGet } from "@/lib/api";

export default function ParentChildProgressPage() {
  const [careerData, setCareerData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProgress() {
      try {
        setLoading(true);
        const res = await apiGet(`/api/ai/career-growth?studentId=STD-801`);
        if (res.success) {
          setCareerData(res.data);
        }
      } catch (err) {
        console.error("Failed to load child progress:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProgress();
  }, []);

  const skillMatrix = careerData?.skillMatrix || [
    { domain: "Logical & Problem Solving", score: 92, color: "#6366f1" },
    { domain: "Computing & Software", score: 95, color: "#10b981" },
    { domain: "Scientific Enquiry", score: 88, color: "#8b5cf6" },
    { domain: "Language & Communication", score: 81, color: "#f59e0b" },
    { domain: "Creative Design", score: 80, color: "#ec4899" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Child Progress & Growth Monitor</h1>
        <p className="text-xs text-slate-500 mt-1">Holistic academic performance and subject proficiency radar for Rahim Uddin</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Competency Meter */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-sm">Subject Mastery & Analytical Radar</h3>

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

          <div className="mt-6 rounded-xl bg-amber-50 p-4 border border-amber-100 text-xs text-amber-900">
            <p className="font-bold">Faculty Observation:</p>
            <p className="mt-0.5">
              Rahim demonstrates sharp conceptual clarity in Mathematics and Computing. Homework submissions have been submitted on time with great precision.
            </p>
          </div>
        </div>

        {/* Milestone Tracker */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-sm">Term Learning Milestones</h3>

          <div className="space-y-3 mt-4">
            {[
              { name: "Algebra & Number Systems Mastery", status: "Completed", score: "94%" },
              { name: "Science Lab Practical Experiments", status: "Completed", score: "88%" },
              { name: "ICT Coding Problem Set", status: "Completed", score: "95%" },
              { name: "English Essay & Grammar Unit", status: "In Progress", score: "81%" },
            ].map((m, idx) => (
              <div key={idx} className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 bg-slate-50">
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">{m.name}</h4>
                  <span className="text-[10px] text-slate-500 font-medium">Status: {m.status}</span>
                </div>
                <span className="font-mono text-xs font-bold text-indigo-600 bg-white px-2.5 py-1 rounded-md border border-slate-200">
                  {m.score}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
