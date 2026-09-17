"use client";

import { useEffect, useState } from "react";
import { apiGet } from "@/lib/api";
import LinkChildModal from "@/components/dashboard/LinkChildModal";
import { childDisplayName, useParentChildren } from "@/hooks/useParentChildren";

interface SkillItem {
  domain: string;
  score: number;
  color: string;
}

export default function ParentChildProgressPage() {
  const { parent, children, approvedChildren, loading, reload } = useParentChildren();
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [careerData, setCareerData] = useState<Record<string, unknown> | null>(null);
  const [progressLoading, setProgressLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (approvedChildren.length === 0) {
      setSelectedStudentId("");
      return;
    }
    setSelectedStudentId((prev) =>
      approvedChildren.some((child) => child.studentId === prev) ? prev : approvedChildren[0].studentId
    );
  }, [approvedChildren]);

  useEffect(() => {
    if (!selectedStudentId) {
      setCareerData(null);
      return;
    }

    async function loadProgress() {
      try {
        setProgressLoading(true);
        const res = await apiGet(`/api/ai/career-growth?studentId=${selectedStudentId}`);
        if (res.success) {
          setCareerData(res.data as Record<string, unknown>);
        } else {
          setCareerData(null);
        }
      } catch (err) {
        console.error("Failed to load child progress:", err);
        setCareerData(null);
      } finally {
        setProgressLoading(false);
      }
    }
    void loadProgress();
  }, [selectedStudentId]);

  const skillMatrix: SkillItem[] = (careerData?.skillMatrix as SkillItem[]) || [];
  const milestones = (careerData?.milestones as { name: string; status: string; score: string }[]) || [];
  const currentChild = children.find((c) => c.studentId === selectedStudentId);
  const currentName = childDisplayName(currentChild);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Child Progress & Growth Monitor</h1>
          <p className="text-xs text-slate-500 mt-1">
            {currentChild
              ? `Holistic academic performance for ${currentName}`
              : "Link a child from the school database to view academic progress"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {approvedChildren.length > 0 && (
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="bg-white border border-slate-300 text-slate-800 text-xs font-bold rounded-xl px-3 py-2.5 shadow-xs focus:ring-2 focus:ring-indigo-500"
            >
              {approvedChildren.map((c) => (
                <option key={c.studentId} value={c.studentId}>
                  {childDisplayName(c)} ({c.studentId})
                </option>
              ))}
            </select>
          )}

          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition shadow-xs flex items-center gap-1.5"
          >
            + Add Child
          </button>
        </div>
      </div>

      {children.some((c) => c.status === "pending") && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-900">
          {children
            .filter((c) => c.status === "pending")
            .map((c) => childDisplayName(c))
            .join(", ")}{" "}
          {children.filter((c) => c.status === "pending").length > 1 ? "are" : "is"} awaiting verification.
        </div>
      )}

      {loading || (selectedStudentId && progressLoading) ? (
        <div className="p-12 text-center text-slate-500 text-sm">Loading child progress radar...</div>
      ) : approvedChildren.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-10 text-center space-y-3">
          <div className="text-5xl">👦👧</div>
          <h2 className="text-lg font-bold text-slate-800">No Child Linked</h2>
          <p className="text-slate-500 text-sm max-w-md mx-auto">
            You have not linked a student to this parent account yet. Search the school database and verify with
            Student ID, roll number, and date of birth.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl"
          >
            Add / Link Child
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">Subject Mastery & Analytical Radar</h3>

            {skillMatrix.length === 0 ? (
              <p className="text-xs text-slate-500 py-8 text-center">
                No skill growth data is available for {currentName} yet.
              </p>
            ) : (
              <div className="space-y-4 mt-4">
                {skillMatrix.map((item, idx) => (
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
            )}

            {Boolean(careerData?.facultyObservation) && (
              <div className="mt-6 rounded-xl bg-amber-50 p-4 border border-amber-100 text-xs text-amber-900">
                <p className="font-bold">Faculty Observation:</p>
                <p className="mt-0.5">{String(careerData?.facultyObservation)}</p>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">Term Learning Milestones</h3>

            {milestones.length === 0 ? (
              <p className="text-xs text-slate-500 py-8 text-center">No milestone records found for this child.</p>
            ) : (
              <div className="space-y-3 mt-4">
                {milestones.map((m, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 bg-slate-50"
                  >
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
            )}
          </div>
        </div>
      )}

      {isModalOpen && parent?.parentId && (
        <LinkChildModal
          parentId={parent.parentId}
          existingChildren={children}
          onClose={() => setIsModalOpen(false)}
          onLinked={() => {
            void reload();
          }}
        />
      )}
    </div>
  );
}