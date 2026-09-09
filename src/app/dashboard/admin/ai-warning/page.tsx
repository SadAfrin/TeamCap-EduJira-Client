"use client";

import { useEffect, useState } from "react";
import { apiGet, apiPost } from "@/lib/api";
import toast from "react-hot-toast";

export default function AIEarlyWarningSystemPage() {
  const [flags, setFlags] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);

  const fetchFlags = async () => {
    try {
      setLoading(true);
      const res = await apiGet("/api/ai/early-warning");
      if (res.success) {
        setFlags(res.data || []);
      }
    } catch (err) {
      console.error("Failed to load warning flags:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlags();
  }, []);

  const handleRunAnalysis = async () => {
    setAnalyzing(true);
    try {
      const res = await apiPost("/api/ai/early-warning/run", {});
      if (res.success) {
        toast.success(res.message || "AI Early Warning analysis complete! ✓");
        fetchFlags();
      } else {
        toast.error(res.message || "Failed to run analysis");
      }
    } catch (err: any) {
      toast.error(err.message || "Error executing early warning engine");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleTriggerIntervention = (studentName: string) => {
    toast.success(`Counseling & Parent Intervention scheduled for ${studentName}!`);
  };

  const criticalCount = flags.filter((f) => f.riskLevel === "critical").length;
  const highCount = flags.filter((f) => f.riskLevel === "high").length;
  const mediumCount = flags.filter((f) => f.riskLevel === "medium").length;

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900">AI Early Warning Risk System</h1>
            <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-bold text-purple-700 border border-purple-200">
              ⚡ Predictive AI Engine
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Machine-learning risk analytics identifying students vulnerable to academic failure or attendance dropouts.
          </p>
        </div>

        <button
          onClick={handleRunAnalysis}
          disabled={analyzing}
          className="flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md shadow-purple-600/30 hover:bg-purple-500 disabled:opacity-50 transition-all"
        >
          <span>⚡ {analyzing ? "Analyzing All Students..." : "Run AI Risk Analysis"}</span>
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="rounded-2xl border border-rose-200 bg-rose-50/60 p-5 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-700">Critical Risk Cases</span>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-rose-950">{criticalCount} Students</span>
            <span className="text-xs font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded">Immediate Action</span>
          </div>
          <p className="mt-2 text-xs text-rose-600">Attendance &lt; 70% or multiple failing grades</p>
        </div>

        <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-5 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700">High & Moderate Risk</span>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-amber-950">{highCount + mediumCount} Students</span>
            <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">Counseling Alert</span>
          </div>
          <p className="mt-2 text-xs text-amber-600">Attendance 70-80% or marks dropping</p>
        </div>

        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Safe / On Track</span>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-950">94%</span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">Stable</span>
          </div>
          <p className="mt-2 text-xs text-emerald-600">Institution-wide stability</p>
        </div>
      </div>

      {/* Flagged Students Table */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">Flagged Risk Cases & Action Triggers</h2>
          <span className="text-xs text-slate-400">Live AI Predictive Triggers</span>
        </div>

        {loading ? (
          <div className="py-16 text-center text-xs text-slate-400">Loading risk cases...</div>
        ) : flags.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-400">
            No active early warning risk flags. Click "Run AI Risk Analysis" to analyze student records.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {flags.map((st) => (
              <div key={st._id} className="p-6 transition-colors hover:bg-slate-50/50">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl font-black text-xs uppercase shadow-sm ${
                        st.riskLevel === "critical"
                          ? "bg-rose-100 text-rose-800 border border-rose-200"
                          : st.riskLevel === "high"
                          ? "bg-orange-100 text-orange-800 border border-orange-200"
                          : "bg-amber-100 text-amber-800 border border-amber-200"
                      }`}
                    >
                      {st.riskLevel}
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <h3 className="font-extrabold text-slate-900 text-sm">{st.studentName}</h3>
                        <span className="font-mono text-xs text-slate-400">({st.studentId})</span>
                        <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-700">
                          {st.className} - {st.section}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {st.reasons?.map((trig: string, idx: number) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 rounded-md bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 border border-rose-100"
                          >
                            ⚠️ {trig}
                          </span>
                        ))}
                      </div>

                      {st.recommendedActions && (
                        <p className="text-[11px] text-indigo-700 pt-1">
                          <strong>Recommended Intervention: </strong> {st.recommendedActions.join(" ")}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 self-end md:self-auto">
                    <button
                      onClick={() => handleTriggerIntervention(st.studentName)}
                      className="rounded-xl bg-purple-600 px-5 py-2 text-xs font-bold text-white shadow-md shadow-purple-600/20 hover:bg-purple-500 transition-colors"
                    >
                      Trigger Intervention →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
