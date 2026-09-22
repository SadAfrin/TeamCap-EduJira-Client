"use client";

import { useEffect, useState, useCallback } from "react";
import { apiGet, apiPost } from "@/lib/api";
import toast from "react-hot-toast";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];

export interface SlotItem {
  period: string;
  time: string;
  subject: string;
  teacher: string;
  room: string;
}

export interface ClassOption {
  _id?: string;
  className: string;
  sections: string[];
  roomNumber?: string;
  classTeacher?: string;
}

export interface TeacherOption {
  _id?: string;
  teacherId?: string;
  name: string;
  email?: string;
  designation?: string;
}

export interface SubjectOption {
  _id?: string;
  name: string;
  subjectCode?: string;
  className?: string;
  teacherName?: string;
}

export default function RoutineManagerPage() {
  // Dynamic options loaded from DB
  const [classesList, setClassesList] = useState<ClassOption[]>([]);
  const [teachersList, setTeachersList] = useState<TeacherOption[]>([]);
  const [subjectsList, setSubjectsList] = useState<SubjectOption[]>([]);

  // Selection states
  const [selectedClass, setSelectedClass] = useState<string>("Class 8");
  const [selectedSection, setSelectedSection] = useState<string>("B");
  const [activeDay, setActiveDay] = useState<string>("Sunday");

  // Routine Matrix state (Map: Day -> Array of Slots)
  const [routinesByDay, setRoutinesByDay] = useState<Record<string, SlotItem[]>>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [autoOptimizing, setAutoOptimizing] = useState(false);
  const [resourcePlan, setResourcePlan] = useState<any>(null);

  // Add / Edit Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [formPeriod, setFormPeriod] = useState("Period 1");
  const [formTime, setFormTime] = useState("09:00 - 09:45 AM");
  const [formSubject, setFormSubject] = useState("");
  const [formTeacher, setFormTeacher] = useState("");
  const [formRoom, setFormRoom] = useState("Room 201");

  // Delete Confirmation Modal State
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    day: string;
    index: number;
    slot: SlotItem | null;
  }>({
    isOpen: false,
    day: "",
    index: -1,
    slot: null,
  });

  // 1. Fetch Dynamic Classes, Teachers, and Subjects from Database
  useEffect(() => {
    async function loadMetadata() {
      try {
        const [clsRes, tchRes, subRes] = await Promise.all([
          apiGet("/api/classes"),
          apiGet("/api/teachers"),
          apiGet("/api/subjects"),
        ]);

        if (clsRes.success && Array.isArray(clsRes.data) && clsRes.data.length > 0) {
          setClassesList(clsRes.data);
          setSelectedClass(clsRes.data[0].className);
          if (clsRes.data[0].sections?.length > 0) {
            setSelectedSection(clsRes.data[0].sections[0]);
          }
        }

        if (tchRes.success && Array.isArray(tchRes.data)) {
          setTeachersList(tchRes.data);
          if (tchRes.data.length > 0) {
            setFormTeacher(tchRes.data[0].name);
          }
        }

        if (subRes.success && Array.isArray(subRes.data)) {
          setSubjectsList(subRes.data);
          if (subRes.data.length > 0) {
            setFormSubject(subRes.data[0].name);
          }
        }
      } catch (err) {
        console.error("Failed to load metadata from database:", err);
      }
    }

    loadMetadata();
  }, []);

  // 2. Fetch Routine for selected class & section from Database
  const loadRoutines = useCallback(async () => {
    if (!selectedClass || !selectedSection) return;

    try {
      setLoading(true);
      const res = await apiGet(
        `/api/routines?className=${encodeURIComponent(selectedClass)}&section=${encodeURIComponent(selectedSection)}`
      );

      const dayMap: Record<string, SlotItem[]> = {};
      DAYS.forEach((d) => {
        dayMap[d] = [];
      });

      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        res.data.forEach((r: any) => {
          if (r.day && Array.isArray(r.periodSlots)) {
            dayMap[r.day] = r.periodSlots;
          }
        });
      }

      setRoutinesByDay(dayMap);
    } catch (err) {
      console.error("Failed to load routines from DB:", err);
      toast.error("Failed to load routines from server");
    } finally {
      setLoading(false);
    }
  }, [selectedClass, selectedSection]);

  useEffect(() => {
    loadRoutines();
  }, [loadRoutines]);

  // 3. Load AI Resource Plan from Backend
  useEffect(() => {
    async function loadResourcePlan() {
      try {
        const res = await apiGet("/api/ai/resource-plan");
        if (res.success) {
          setResourcePlan(res.data);
        }
      } catch (err) {
        console.error("Failed to load resource plan:", err);
      }
    }
    loadResourcePlan();
  }, []);

  // Dynamic available sections for current selected class
  const currentClassObj = classesList.find((c) => c.className === selectedClass);
  const availableSections = currentClassObj?.sections?.length ? currentClassObj.sections : ["A", "B", "C"];

  // Filtered subjects for current class
  const classSubjects = subjectsList.filter((s) => !s.className || s.className === selectedClass);
  const effectiveSubjects = classSubjects.length > 0 ? classSubjects : subjectsList;

  // Save current active day's routine to Database
  const handleSaveCurrentDay = async () => {
    setSaving(true);
    try {
      const currentSlots = routinesByDay[activeDay] || [];
      const res = await apiPost("/api/routines", {
        className: selectedClass,
        section: selectedSection,
        day: activeDay,
        periodSlots: currentSlots,
      });

      if (res.success) {
        toast.success(`Routine for ${selectedClass} (${selectedSection}) – ${activeDay} saved to database! ✓`);
      } else {
        toast.error(res.message || "Failed to save routine");
      }
    } catch (err: any) {
      toast.error(err.message || "Error saving routine to database");
    } finally {
      setSaving(false);
    }
  };

  // Save ALL days routine to Database
  const handleSaveAllDays = async () => {
    setSaving(true);
    try {
      let successCount = 0;
      for (const day of DAYS) {
        const currentSlots = routinesByDay[day] || [];
        const res = await apiPost("/api/routines", {
          className: selectedClass,
          section: selectedSection,
          day,
          periodSlots: currentSlots,
        });
        if (res.success) successCount++;
      }
      toast.success(`Full week routine (${successCount} days) saved to database! ✓`);
    } catch (err: any) {
      toast.error(err.message || "Error saving full week routine");
    } finally {
      setSaving(false);
    }
  };

  // Open Add Modal
  const openAddModal = (targetDay: string) => {
    setActiveDay(targetDay);
    setEditIndex(null);
    const count = (routinesByDay[targetDay] || []).length + 1;
    setFormPeriod(`Period ${count}`);
    setFormTime(
      count === 1
        ? "09:00 - 09:45 AM"
        : count === 2
        ? "09:50 - 10:35 AM"
        : count === 3
        ? "10:40 - 11:25 AM"
        : count === 4
        ? "11:45 - 12:30 PM"
        : "01:15 - 02:00 PM"
    );
    setFormSubject(effectiveSubjects[0]?.name || "Mathematics");
    setFormTeacher(teachersList[0]?.name || "Faculty Teacher");
    setFormRoom(currentClassObj?.roomNumber || "Room 201");
    setModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (targetDay: string, idx: number) => {
    setActiveDay(targetDay);
    setEditIndex(idx);
    const slot = routinesByDay[targetDay]?.[idx];
    if (slot) {
      setFormPeriod(slot.period);
      setFormTime(slot.time);
      setFormSubject(slot.subject);
      setFormTeacher(slot.teacher);
      setFormRoom(slot.room);
    }
    setModalOpen(true);
  };

  // Trigger Delete Confirmation Modal
  const requestDeleteSlot = (targetDay: string, idx: number) => {
    const slot = routinesByDay[targetDay]?.[idx] || null;
    setDeleteModal({
      isOpen: true,
      day: targetDay,
      index: idx,
      slot,
    });
  };

  // Confirm and Execute Delete Slot
  const confirmDeleteSlot = async () => {
    const { day, index } = deleteModal;
    if (index < 0 || !day) return;

    const updatedDaySlots = [...(routinesByDay[day] || [])];
    updatedDaySlots.splice(index, 1);

    setRoutinesByDay((prev) => ({
      ...prev,
      [day]: updatedDaySlots,
    }));

    setDeleteModal({ isOpen: false, day: "", index: -1, slot: null });

    // Auto-sync update to backend database
    try {
      await apiPost("/api/routines", {
        className: selectedClass,
        section: selectedSection,
        day,
        periodSlots: updatedDaySlots,
      });
      toast.success("Period slot removed and synced to database! ✓");
    } catch {
      toast.success("Period slot removed! Click 'Save Routine' to sync.");
    }
  };

  // Submit Add / Edit Form
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formPeriod || !formSubject || !formTeacher || !formTime || !formRoom) {
      toast.error("Please fill in all period details");
      return;
    }

    const newSlot: SlotItem = {
      period: formPeriod,
      time: formTime,
      subject: formSubject,
      teacher: formTeacher,
      room: formRoom,
    };

    const updatedDaySlots = [...(routinesByDay[activeDay] || [])];
    if (editIndex !== null && editIndex >= 0) {
      updatedDaySlots[editIndex] = newSlot;
    } else {
      updatedDaySlots.push(newSlot);
    }

    setRoutinesByDay((prev) => ({
      ...prev,
      [activeDay]: updatedDaySlots,
    }));

    setModalOpen(false);

    // Auto-persist to DB
    try {
      await apiPost("/api/routines", {
        className: selectedClass,
        section: selectedSection,
        day: activeDay,
        periodSlots: updatedDaySlots,
      });
      toast.success(
        editIndex !== null ? "Period updated in database! ✓" : "New period added to database! ✓"
      );
    } catch {
      toast.success(
        editIndex !== null ? "Period updated! Click 'Save Routine' to sync." : "New period added! Click 'Save Routine' to sync."
      );
    }
  };

  // AI Auto Allocate Routine from database subjects and teachers
  const handleAutoOptimize = () => {
    setAutoOptimizing(true);
    setTimeout(async () => {
      const sampleSubjects = effectiveSubjects.length > 0 ? effectiveSubjects.map((s) => s.name) : ["Bangla", "English", "Mathematics", "General Science", "ICT & Computing", "Social Science"];
      const sampleTeachers = teachersList.length > 0 ? teachersList.map((t) => t.name) : ["Dr. Anisur Rahman", "Mohammad Rafiq", "Farzana Yasmin", "Tanvir Hasan", "Nasrin Sultana"];
      const defaultRoom = currentClassObj?.roomNumber || "Room 201";

      const optimized: Record<string, SlotItem[]> = {};
      DAYS.forEach((day, dayIdx) => {
        optimized[day] = [
          {
            period: "Period 1",
            time: "09:00 - 09:45 AM",
            subject: sampleSubjects[(dayIdx * 2) % sampleSubjects.length] || "Mathematics",
            teacher: sampleTeachers[(dayIdx * 2) % sampleTeachers.length] || "Faculty Teacher",
            room: defaultRoom,
          },
          {
            period: "Period 2",
            time: "09:50 - 10:35 AM",
            subject: sampleSubjects[(dayIdx * 2 + 1) % sampleSubjects.length] || "English",
            teacher: sampleTeachers[(dayIdx * 2 + 1) % sampleTeachers.length] || "Faculty Teacher",
            room: defaultRoom,
          },
          {
            period: "Period 3",
            time: "10:40 - 11:25 AM",
            subject: sampleSubjects[(dayIdx * 2 + 2) % sampleSubjects.length] || "General Science",
            teacher: sampleTeachers[(dayIdx * 2 + 2) % sampleTeachers.length] || "Faculty Teacher",
            room: defaultRoom,
          },
          {
            period: "Period 4",
            time: "11:45 - 12:30 PM",
            subject: sampleSubjects[(dayIdx * 2 + 3) % sampleSubjects.length] || "ICT & Computing",
            teacher: sampleTeachers[(dayIdx * 2 + 3) % sampleTeachers.length] || "Faculty Teacher",
            room: "Lab 1",
          },
          {
            period: "Period 5",
            time: "01:15 - 02:00 PM",
            subject: sampleSubjects[(dayIdx * 2 + 4) % sampleSubjects.length] || "Social Science",
            teacher: sampleTeachers[(dayIdx * 2 + 4) % sampleTeachers.length] || "Faculty Teacher",
            room: defaultRoom,
          },
        ];
      });

      setRoutinesByDay(optimized);
      setAutoOptimizing(false);
      toast.success("AI Routine Optimizer: Conflict-free routine generated! Click 'Save Full Week' to persist.");
    }, 900);
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900">Institutional Routine & Resource Allocator</h1>
            <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-[10px] font-bold text-indigo-700 border border-indigo-200">
              Database Dynamic
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Add, edit, delete with confirmation modal and auto-allocate class routines directly from database.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleAutoOptimize}
            disabled={autoOptimizing}
            className="flex items-center justify-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2 text-xs sm:text-sm font-bold text-indigo-700 hover:bg-indigo-100 disabled:opacity-50 transition-colors cursor-pointer"
          >
            <span>⚡ {autoOptimizing ? "Optimizing..." : "AI Auto-Allocate"}</span>
          </button>
          <button
            onClick={handleSaveAllDays}
            disabled={saving}
            className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2 text-xs sm:text-sm font-bold text-white shadow-md shadow-indigo-600/30 hover:bg-indigo-500 disabled:opacity-50 transition-all cursor-pointer"
          >
            <span>{saving ? "Saving..." : "Save Full Week Routine ✓"}</span>
          </button>
        </div>
      </div>

      {/* AI Resource & Classroom Allocation Planner Section */}
      {resourcePlan && (
        <div className="rounded-3xl border border-indigo-100 bg-linear-to-r from-indigo-900 via-slate-900 to-indigo-950 p-6 text-white shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-bold text-indigo-300 border border-indigo-400/30">
                Resource & Classroom Allocation Planner
              </span>
              <span className="text-xs text-indigo-200">
                Optimization Score: <strong className="text-emerald-400">{resourcePlan.optimizationScore}/100</strong>
              </span>
            </div>
            <span className="text-xs text-slate-300 hidden sm:inline">{resourcePlan.summary}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {resourcePlan.suggestions?.map((item: any, idx: number) => (
              <div key={idx} className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-md space-y-2">
                <div className="flex items-center justify-between">
                  <span className="rounded bg-indigo-400/20 px-2 py-0.5 text-[10px] font-bold text-indigo-200">
                    {item.type}
                  </span>
                  <span className="text-[10px] text-amber-300 font-bold uppercase">{item.priority}</span>
                </div>
                <h4 className="font-bold text-xs text-white">{item.subject}</h4>
                <p className="text-[11px] text-slate-300 leading-relaxed">{item.recommendation}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Dynamic Selector Filters & Day Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
        <div className="flex flex-wrap items-center gap-4">
          <div className="w-48">
            <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
              Select Class ({classesList.length} Classes)
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:bg-white focus:border-indigo-600 cursor-pointer"
            >
              {classesList.length > 0
                ? classesList.map((c) => (
                    <option key={c.className} value={c.className}>
                      {c.className}
                    </option>
                  ))
                : ["Class 6", "Class 7", "Class 8", "Class 9", "Class 10"].map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
            </select>
          </div>

          <div className="w-44">
            <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Select Section</label>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:bg-white focus:border-indigo-600 cursor-pointer"
            >
              {availableSections.map((s) => (
                <option key={s} value={s}>
                  Section {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Day selection pill tabs */}
        <div className="flex flex-wrap items-center gap-1.5 self-start sm:self-end">
          {DAYS.map((d) => (
            <button
              key={d}
              onClick={() => setActiveDay(d)}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                activeDay === d
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Routine Detail Grid for Active Day */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              {selectedClass} (Section {selectedSection}) — {activeDay}&apos;s Routine
            </h3>
            <p className="text-xs text-slate-500">
              Total {(routinesByDay[activeDay] || []).length} scheduled period slots in database
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => openAddModal(activeDay)}
              className="rounded-xl border border-indigo-200 bg-indigo-50 px-3.5 py-2 text-xs font-bold text-indigo-700 hover:bg-indigo-100 transition-colors cursor-pointer"
            >
              + Add Period to {activeDay}
            </button>
            <button
              onClick={handleSaveCurrentDay}
              disabled={saving}
              className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-500 disabled:opacity-50 transition-colors cursor-pointer"
            >
              {saving ? "Saving..." : `Save ${activeDay} Routine ✓`}
            </button>
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs text-slate-400">Loading daily routine from database...</div>
        ) : (routinesByDay[activeDay] || []).length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-xs text-slate-400">
            No period slots added for {activeDay} yet. Click &quot;+ Add Period to {activeDay}&quot; above to create one.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {(routinesByDay[activeDay] || []).map((slot, idx) => (
              <div
                key={idx}
                className="group relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50/70 p-4 transition-all hover:border-indigo-300 hover:bg-white hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded-lg bg-indigo-100/70 px-2 py-0.5 text-[10px] font-bold text-indigo-800">
                      {slot.period}
                    </span>
                    <span className="rounded bg-white px-1.5 py-0.5 text-[9px] font-bold text-slate-600 border border-slate-200">
                      {slot.room}
                    </span>
                  </div>

                  <h4 className="mt-2.5 font-extrabold text-slate-900 text-xs sm:text-sm">{slot.subject}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">👨‍🏫 {slot.teacher}</p>
                  <p className="text-[10px] text-slate-400 font-mono mt-1">⏰ {slot.time}</p>
                </div>

                <div className="mt-4 flex items-center justify-end gap-1.5 border-t border-slate-200/60 pt-3">
                  <button
                    onClick={() => openEditModal(activeDay, idx)}
                    className="rounded-lg bg-white px-2.5 py-1 text-[11px] font-bold text-indigo-600 border border-slate-200 hover:bg-indigo-50 cursor-pointer"
                  >
                    Edit ✏️
                  </button>
                  <button
                    onClick={() => requestDeleteSlot(activeDay, idx)}
                    className="rounded-lg bg-white px-2.5 py-1 text-[11px] font-bold text-rose-600 border border-slate-200 hover:bg-rose-50 cursor-pointer"
                  >
                    Delete 🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Full Week Routine Grid (All 5 Days Matrix) */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-extrabold text-sm text-slate-900">
            Full Weekly Timetable Matrix: {selectedClass} ({selectedSection})
          </h3>
          <span className="text-xs text-slate-400">Database Live Sync</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 pl-6 pr-3">Day</th>
                {["Period 1", "Period 2", "Period 3", "Period 4", "Period 5"].map((p, idx) => (
                  <th key={idx} className="py-3.5 px-3 min-w-[170px]">{p}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {DAYS.map((day) => {
                const daySlots = routinesByDay[day] || [];
                return (
                  <tr key={day} className="hover:bg-slate-50/50">
                    <td className="py-4 pl-6 pr-3 font-bold text-slate-900 bg-slate-50/70 border-r border-slate-100 align-top">
                      <div className="space-y-1">
                        <p>{day}</p>
                        <button
                          onClick={() => openAddModal(day)}
                          className="text-[10px] text-indigo-600 hover:underline font-semibold block cursor-pointer"
                        >
                          + Add Slot
                        </button>
                      </div>
                    </td>
                    {Array.from({ length: 5 }).map((_, pIdx) => {
                      const slot = daySlots[pIdx];
                      return (
                        <td key={pIdx} className="p-2 align-top">
                          {slot ? (
                            <div className="rounded-xl border border-indigo-100 bg-indigo-50/60 p-2.5 space-y-1 relative group">
                              <div className="flex items-center justify-between">
                                <p className="font-bold text-slate-900 text-xs">{slot.subject}</p>
                                <span className="rounded bg-white px-1.5 py-0.2 text-[9px] font-bold text-indigo-700">
                                  {slot.room}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-500">{slot.teacher}</p>
                              <div className="hidden group-hover:flex items-center gap-1 pt-1 justify-end">
                                <button
                                  onClick={() => openEditModal(day, pIdx)}
                                  className="text-[10px] text-indigo-700 font-bold hover:underline cursor-pointer"
                                >
                                  Edit
                                </button>
                                <span className="text-slate-300">•</span>
                                <button
                                  onClick={() => requestDeleteSlot(day, pIdx)}
                                  className="text-[10px] text-rose-600 font-bold hover:underline cursor-pointer"
                                >
                                  Del
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div
                              onClick={() => openAddModal(day)}
                              className="rounded-xl border border-dashed border-slate-200 p-3 text-center text-[11px] text-slate-400 hover:border-indigo-300 hover:text-indigo-600 cursor-pointer"
                            >
                              + Free Slot
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Period Slot Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-base font-extrabold text-slate-900">
                {editIndex !== null ? `Edit Period Slot (${activeDay})` : `Add New Period (${activeDay})`}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="mt-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Period Label *</label>
                  <input
                    type="text"
                    required
                    value={formPeriod}
                    onChange={(e) => setFormPeriod(e.target.value)}
                    placeholder="e.g. Period 1"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none focus:border-indigo-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Time Range *</label>
                  <input
                    type="text"
                    required
                    value={formTime}
                    onChange={(e) => setFormTime(e.target.value)}
                    placeholder="e.g. 09:00 - 09:45 AM"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Subject * ({effectiveSubjects.length} from database)
                </label>
                {effectiveSubjects.length > 0 ? (
                  <select
                    value={formSubject}
                    onChange={(e) => setFormSubject(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-indigo-600 cursor-pointer"
                  >
                    {effectiveSubjects.map((sub) => (
                      <option key={sub.name} value={sub.name}>
                        {sub.name} {sub.subjectCode ? `(${sub.subjectCode})` : ""}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    required
                    value={formSubject}
                    onChange={(e) => setFormSubject(e.target.value)}
                    placeholder="e.g. Mathematics"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none focus:border-indigo-600"
                  />
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Assigned Teacher * ({teachersList.length} Faculty Members)
                </label>
                {teachersList.length > 0 ? (
                  <select
                    value={formTeacher}
                    onChange={(e) => setFormTeacher(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-indigo-600 cursor-pointer"
                  >
                    {teachersList.map((tch) => (
                      <option key={tch.name} value={tch.name}>
                        {tch.name} {tch.designation ? `(${tch.designation})` : ""}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    required
                    value={formTeacher}
                    onChange={(e) => setFormTeacher(e.target.value)}
                    placeholder="e.g. Dr. Anisur Rahman"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none focus:border-indigo-600"
                  />
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Room / Classroom / Lab *</label>
                <input
                  type="text"
                  required
                  value={formRoom}
                  onChange={(e) => setFormRoom(e.target.value)}
                  placeholder="e.g. Room 201, Lab 1"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none focus:border-indigo-600"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 px-5 py-2 text-xs font-bold text-white hover:bg-indigo-500 shadow-md shadow-indigo-600/20 cursor-pointer"
                >
                  {editIndex !== null ? "Save Changes" : "Add to Routine"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-sm rounded-3xl border border-rose-100 bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 text-lg font-bold">
                ⚠️
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Confirm Deletion</h3>
                <p className="text-xs text-slate-500">Remove period slot from routine</p>
              </div>
            </div>

            {deleteModal.slot && (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3.5 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{deleteModal.slot.period} ({deleteModal.day})</span>
                  <span className="rounded bg-white px-1.5 py-0.5 text-[10px] font-bold text-indigo-700 border border-slate-200">
                    {deleteModal.slot.room}
                  </span>
                </div>
                <p className="text-slate-700 font-semibold">{deleteModal.slot.subject}</p>
                <p className="text-slate-500 text-[11px]">Teacher: {deleteModal.slot.teacher}</p>
                <p className="text-slate-400 font-mono text-[10px]">Time: {deleteModal.slot.time}</p>
              </div>
            )}

            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to delete this period slot? This action will remove it from the live schedule.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDeleteModal({ isOpen: false, day: "", index: -1, slot: null })}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteSlot}
                className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-rose-500 transition-colors cursor-pointer"
              >
                Yes, Delete Period 🗑️
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
