"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { apiGet, apiPost } from "@/lib/api";
import type { LinkedChild } from "@/hooks/useParentChildren";

interface StudentSearchResult {
  studentId: string;
  name: string;
  className?: string;
  section?: string;
  roll?: string | number;
  status?: string;
}

interface LinkChildModalProps {
  parentId: string;
  existingChildren: LinkedChild[];
  onClose: () => void;
  onLinked: () => void;
}

function formatDateOfBirth(value: string): string {
  const raw = (value || "").trim();
  if (!raw) return "";

  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) return "";

  return parsed.toISOString().split("T")[0];
}

function sanitizeRoll(value: string): string {
  const trimmed = (value || "").trim();
  if (!trimmed) return "";
  const parsed = parseInt(trimmed, 10);
  return Number.isNaN(parsed) ? trimmed : String(parsed);
}

type FieldErrorKey = "studentId" | "dateOfBirth" | "alreadyLinked";

export default function LinkChildModal({
  parentId,
  existingChildren,
  onClose,
  onLinked,
}: LinkChildModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<StudentSearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentSearchResult | null>(null);
  const [roll, setRoll] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [relationship, setRelationship] = useState("Guardian");
  const [linking, setLinking] = useState(false);
  const [message, setMessage] = useState<{ type: "success"; text: string } | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<FieldErrorKey, string>>>({});
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const runSearch = useCallback(async (query: string) => {
    if (query.trim().length < 2) {
      setSearchResults([]);
      setSearching(false);
      return;
    }

    try {
      setSearching(true);
      const res = await apiGet(`/api/parents/search-students?q=${encodeURIComponent(query.trim())}`);
      if (res.success && Array.isArray(res.data)) {
        setSearchResults(res.data as StudentSearchResult[]);
      } else {
        setSearchResults([]);
      }
    } catch (err) {
      console.error("Search failed:", err);
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  }, []);

  const handleSearchStudents = (query: string) => {
    setSearchQuery(query);
    setMessage(null);
    setFieldErrors((prev) => ({ ...prev, studentId: undefined, alreadyLinked: undefined }));

    const stillMatchesSelected =
      selectedStudent &&
      (selectedStudent.name.toLowerCase().includes(query.trim().toLowerCase()) ||
        selectedStudent.studentId.toLowerCase().includes(query.trim().toLowerCase()));
    if (selectedStudent && !stillMatchesSelected) {
      setSelectedStudent(null);
    }

    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);

    if (query.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    searchTimerRef.current = setTimeout(() => {
      void runSearch(query);
    }, 250);
  };

  useEffect(() => {
    return () => {
      if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    };
  }, []);

  const handleSelectStudent = (student: StudentSearchResult) => {
    setSelectedStudent(student);
    setMessage(null);
    setFieldErrors({});
  };

  const handleRequestLink = async (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: Partial<Record<FieldErrorKey, string>> = {};

    if (!selectedStudent) {
      nextErrors.studentId = "Please select a student from the search results.";
    }
    if (!dateOfBirth) {
      nextErrors.dateOfBirth = "Enter the student's date of birth.";
    }

    const formattedDob = formatDateOfBirth(dateOfBirth);
    if (dateOfBirth && !formattedDob) {
      nextErrors.dateOfBirth = "Enter a valid date of birth.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors);
      setMessage(null);
      return;
    }

    try {
      setLinking(true);
      setMessage(null);
      setFieldErrors({});

      const res = await apiPost(`/api/parents/${parentId}/link-child`, {
        studentId: selectedStudent?.studentId,
        className: selectedStudent?.className,
        roll: sanitizeRoll(roll) || selectedStudent?.roll,
        dateOfBirth: formattedDob,
        relationship,
      });

      if (res.success) {
        setMessage({ type: "success", text: (res.message as string) || "Child verified and linked successfully." });
        onLinked();
        return;
      }

      const errorField = (res as { errorField?: FieldErrorKey }).errorField;
      const errorText = (res.message as string) || "Failed to link child";
      if (errorField === "studentId" || errorField === "dateOfBirth" || errorField === "alreadyLinked") {
        setFieldErrors({ [errorField]: errorText });
      } else {
        setFieldErrors({ studentId: errorText });
      }
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Something went wrong";
      setFieldErrors({ studentId: errMsg });
    } finally {
      setLinking(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-slate-900 text-base">Add Child / Link Student</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 font-bold text-sm"
            type="button"
          >
            ✕
          </button>
        </div>

        <p className="text-xs text-slate-500">
          Search the school database, then verify with Student ID, roll number, and date of birth.
        </p>

        {message && (
          <div className="p-3 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
            {message.text}
          </div>
        )}

        {fieldErrors.alreadyLinked && (
          <p className="text-[11px] font-semibold text-rose-600">{fieldErrors.alreadyLinked}</p>
        )}

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700">Search Student (Name, ID, or Roll)</label>
          <input
            type="text"
            name="link-child-search"
            autoComplete="off"
            placeholder="Type student name or student ID..."
            value={searchQuery}
            onChange={(e) => handleSearchStudents(e.target.value)}
            className={`w-full text-xs px-3.5 py-2.5 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none ${
              fieldErrors.studentId ? "border-rose-400" : "border-slate-300"
            }`}
          />
          {fieldErrors.studentId && (
            <p className="text-[11px] font-semibold text-rose-600">{fieldErrors.studentId}</p>
          )}
        </div>

        <div className="max-h-40 overflow-y-auto space-y-2 border border-slate-100 rounded-xl p-2 bg-slate-50">
          {searching ? (
            <p className="text-xs text-slate-500 text-center py-4">Searching students...</p>
          ) : searchResults.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-4">
              {searchQuery ? "No enrolled student found" : "Type at least 2 characters to search"}
            </p>
          ) : (
            searchResults.map((st) => {
              const isAlreadyAdded = existingChildren.some(
                (c) => c.studentId === st.studentId && c.status !== "rejected"
              );
              const isSelected = selectedStudent?.studentId === st.studentId;
              return (
                <button
                  key={st.studentId}
                  type="button"
                  disabled={isAlreadyAdded}
                  onClick={() => handleSelectStudent(st)}
                  className={`w-full text-left flex items-center justify-between p-2.5 rounded-lg border transition ${
                    isAlreadyAdded
                      ? "bg-slate-100 border-slate-200 cursor-not-allowed"
                      : isSelected
                        ? "bg-indigo-50 border-indigo-300"
                        : "bg-white border-slate-200 hover:border-indigo-200"
                  }`}
                >
                  <div>
                    <p className="text-xs font-bold text-slate-800">{st.name}</p>
                    <p className="text-[10px] text-slate-500">
                      ID: {st.studentId} | Class: {st.className || "N/A"} {st.section ? `– ${st.section}` : ""}
                    </p>
                  </div>
                  <span className={`text-[11px] font-bold ${isAlreadyAdded ? "text-slate-400" : "text-indigo-600"}`}>
                    {isAlreadyAdded ? "Added" : isSelected ? "Selected" : "Select"}
                  </span>
                </button>
              );
            })
          )}
        </div>

        <form onSubmit={handleRequestLink} autoComplete="off" className="space-y-3 pt-1">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700">Roll Number *</label>
              <input
                type="text"
                name="link-child-roll"
                autoComplete="off"
                value={roll}
                onChange={(e) => {
                  setRoll(e.target.value);
                  setFieldErrors((prev) => ({ ...prev, studentId: undefined }));
                }}
                placeholder="e.g. 01"
                className="mt-1 w-full text-xs px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700">Date of Birth *</label>
              <input
                type="date"
                name="link-child-dob"
                autoComplete="off"
                value={dateOfBirth}
                onChange={(e) => {
                  setDateOfBirth(e.target.value);
                  setFieldErrors((prev) => ({ ...prev, dateOfBirth: undefined }));
                }}
                className={`mt-1 w-full text-xs px-3.5 py-2.5 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none ${
                  fieldErrors.dateOfBirth ? "border-rose-400" : "border-slate-300"
                }`}
              />
              {fieldErrors.dateOfBirth && (
                <p className="mt-1 text-[11px] font-semibold text-rose-600">{fieldErrors.dateOfBirth}</p>
              )}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700">Relationship</label>
            <select
              name="link-child-relationship"
              value={relationship}
              onChange={(e) => setRelationship(e.target.value)}
              className="mt-1 w-full text-xs px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
            >
              <option value="Guardian">Guardian</option>
              <option value="Father">Father</option>
              <option value="Mother">Mother</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="pt-1 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="text-xs font-bold text-slate-600 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200"
            >
              Close
            </button>
            <button
              type="submit"
              disabled={linking || !selectedStudent}
              className="text-xs font-bold text-white px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
            >
              {linking ? "Verifying..." : "Verify & Link Child"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
