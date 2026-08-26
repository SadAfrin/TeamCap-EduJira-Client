/* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

// --- TYPE DEFINITIONS ---
interface TimetableSlot {
  id: string;
  day: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday";
  periodId: string; // "p1", "p2", etc.
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  subject: string;
  teacher: string;
  room: string;
  grade: string; // "Grade 9", "Grade 10", "Grade 11", "Grade 12"
  section: string; // "A", "B"
}

interface PeriodPreset {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  isBreak?: boolean;
}

// --- CONFIG PRESETS ---
const periodPresets: PeriodPreset[] = [
  { id: "p1", name: "Period 1", startTime: "08:30", endTime: "09:30" },
  { id: "p2", name: "Period 2", startTime: "09:45", endTime: "10:45" },
  { id: "p3", name: "Period 3", startTime: "11:00", endTime: "12:00" },
  { id: "lunch", name: "Lunch Break", startTime: "12:00", endTime: "13:00", isBreak: true },
  { id: "p4", name: "Period 4", startTime: "13:00", endTime: "14:00" },
  { id: "p5", name: "Period 5", startTime: "14:15", endTime: "15:15" },
  { id: "activities", name: "Extracurriculars", startTime: "15:30", endTime: "16:30" },
];

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] as const;
type DayType = (typeof daysOfWeek)[number];

const gradesList = ["Grade 9", "Grade 10", "Grade 11", "Grade 12"];
const sectionsList = ["A", "B"];

const defaultTimetableSlots: TimetableSlot[] = [
  // Grade 10-A
  {
    id: "slot-1",
    day: "Monday",
    periodId: "p1",
    startTime: "08:30",
    endTime: "09:30",
    subject: "Mathematics",
    teacher: "Mr. Rahman",
    room: "Room 301",
    grade: "Grade 10",
    section: "A",
  },
  {
    id: "slot-2",
    day: "Monday",
    periodId: "p2",
    startTime: "09:45",
    endTime: "10:45",
    subject: "Physics",
    teacher: "Mrs. Sultana",
    room: "Lab 204",
    grade: "Grade 10",
    section: "A",
  },
  {
    id: "slot-3",
    day: "Monday",
    periodId: "p3",
    startTime: "11:00",
    endTime: "12:00",
    subject: "Bangla",
    teacher: "Mr. Hasan",
    room: "Room 301",
    grade: "Grade 10",
    section: "A",
  },
  {
    id: "slot-4",
    day: "Monday",
    periodId: "p4",
    startTime: "13:00",
    endTime: "14:00",
    subject: "English",
    teacher: "Miss Smith",
    room: "Room 301",
    grade: "Grade 10",
    section: "A",
  },
  {
    id: "slot-5",
    day: "Monday",
    periodId: "p5",
    startTime: "14:15",
    endTime: "15:15",
    subject: "History",
    teacher: "Mr. David",
    room: "Room 102",
    grade: "Grade 10",
    section: "A",
  },
  
  // Tuesday Grade 10-A
  {
    id: "slot-6",
    day: "Tuesday",
    periodId: "p1",
    startTime: "08:30",
    endTime: "09:30",
    subject: "Chemistry",
    teacher: "Dr. Karim",
    room: "Lab 105",
    grade: "Grade 10",
    section: "A",
  },
  {
    id: "slot-7",
    day: "Tuesday",
    periodId: "p2",
    startTime: "09:45",
    endTime: "10:45",
    subject: "Mathematics",
    teacher: "Mr. Rahman",
    room: "Room 301",
    grade: "Grade 10",
    section: "A",
  },
  {
    id: "slot-8",
    day: "Tuesday",
    periodId: "p3",
    startTime: "11:00",
    endTime: "12:00",
    subject: "Biology",
    teacher: "Mrs. Yasmin",
    room: "Lab 102",
    grade: "Grade 10",
    section: "A",
  },
  {
    id: "slot-9",
    day: "Tuesday",
    periodId: "p4",
    startTime: "13:00",
    endTime: "14:00",
    subject: "ICT",
    teacher: "Mr. Iqbal",
    room: "Computer Lab 1",
    grade: "Grade 10",
    section: "A",
  },
  
  // Wednesday Grade 10-A
  {
    id: "slot-10",
    day: "Wednesday",
    periodId: "p1",
    startTime: "08:30",
    endTime: "09:30",
    subject: "Physics",
    teacher: "Mrs. Sultana",
    room: "Lab 204",
    grade: "Grade 10",
    section: "A",
  },
  {
    id: "slot-11",
    day: "Wednesday",
    periodId: "p2",
    startTime: "09:45",
    endTime: "10:45",
    subject: "English",
    teacher: "Miss Smith",
    room: "Room 301",
    grade: "Grade 10",
    section: "A",
  },
  {
    id: "slot-12",
    day: "Wednesday",
    periodId: "p3",
    startTime: "11:00",
    endTime: "12:00",
    subject: "Chemistry",
    teacher: "Dr. Karim",
    room: "Lab 105",
    grade: "Grade 10",
    section: "A",
  },
  {
    id: "slot-13",
    day: "Wednesday",
    periodId: "p4",
    startTime: "13:00",
    endTime: "14:00",
    subject: "Bangla",
    teacher: "Mr. Hasan",
    room: "Room 301",
    grade: "Grade 10",
    section: "A",
  },

  // Thursday Grade 10-A
  {
    id: "slot-14",
    day: "Thursday",
    periodId: "p1",
    startTime: "08:30",
    endTime: "09:30",
    subject: "Mathematics",
    teacher: "Mr. Rahman",
    room: "Room 301",
    grade: "Grade 10",
    section: "A",
  },
  {
    id: "slot-15",
    day: "Thursday",
    periodId: "p2",
    startTime: "09:45",
    endTime: "10:45",
    subject: "Geography",
    teacher: "Mrs. Begum",
    room: "Room 301",
    grade: "Grade 10",
    section: "A",
  },
  {
    id: "slot-16",
    day: "Thursday",
    periodId: "p3",
    startTime: "11:00",
    endTime: "12:00",
    subject: "English",
    teacher: "Miss Smith",
    room: "Room 301",
    grade: "Grade 10",
    section: "A",
  },
  {
    id: "slot-17",
    day: "Thursday",
    periodId: "p5",
    startTime: "14:15",
    endTime: "15:15",
    subject: "Physical Education",
    teacher: "Coach Russell",
    room: "Gymnasium",
    grade: "Grade 10",
    section: "A",
  },

  // Friday Grade 10-A
  {
    id: "slot-18",
    day: "Friday",
    periodId: "p1",
    startTime: "08:30",
    endTime: "09:30",
    subject: "Biology",
    teacher: "Mrs. Yasmin",
    room: "Lab 102",
    grade: "Grade 10",
    section: "A",
  },
  {
    id: "slot-19",
    day: "Friday",
    periodId: "p2",
    startTime: "09:45",
    endTime: "10:45",
    subject: "Ethics",
    teacher: "Mr. Ali",
    room: "Room 301",
    grade: "Grade 10",
    section: "A",
  },
  {
    id: "slot-20",
    day: "Friday",
    periodId: "p3",
    startTime: "11:00",
    endTime: "12:00",
    subject: "Arts & Crafts",
    teacher: "Mrs. Roy",
    room: "Art Studio",
    grade: "Grade 10",
    section: "A",
  },

  // Seed Grade 9-A Monday
  {
    id: "slot-21",
    day: "Monday",
    periodId: "p1",
    startTime: "08:30",
    endTime: "09:30",
    subject: "General Science",
    teacher: "Dr. Karim",
    room: "Room 201",
    grade: "Grade 9",
    section: "A",
  },
  {
    id: "slot-22",
    day: "Monday",
    periodId: "p2",
    startTime: "09:45",
    endTime: "10:45",
    subject: "English",
    teacher: "Miss Smith",
    room: "Room 201",
    grade: "Grade 9",
    section: "A",
  },
];

const allRoles = [
  { id: "admin", label: "Admin" },
  { id: "teacher", label: "Teacher" },
  { id: "student", label: "Student" },
  { id: "parent", label: "Parent" },
];

function TimetablePortal() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roleParam = searchParams.get("role") || "student";

  // --- STATE ---
  const currentRole = roleParam;
  const [slots, setSlots] = useState<TimetableSlot[]>([]);
  const [selectedGrade, setSelectedGrade] = useState("Grade 10");
  const [selectedSection, setSelectedSection] = useState("A");

  // Filters for Teacher view
  const [selectedTeacher, setSelectedTeacher] = useState("Mr. Rahman");
  const [teachersList, setTeachersList] = useState<string[]>([]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState<TimetableSlot | null>(null);

  // Form State
  const [formDay, setFormDay] = useState<DayType>("Monday");
  const [formPeriodId, setFormPeriodId] = useState("p1");
  const [formSubject, setFormSubject] = useState("");
  const [formTeacher, setFormTeacher] = useState("");
  const [formRoom, setFormRoom] = useState("");
  const [formGrade, setFormGrade] = useState("Grade 10");
  const [formSection, setFormSection] = useState("A");

  // Conflicts state
  const [teacherConflict, setTeacherConflict] = useState<TimetableSlot | null>(null);
  const [roomConflict, setRoomConflict] = useState<TimetableSlot | null>(null);

  // Fetch from LocalStorage or seed defaults
  useEffect(() => {
    const savedSlots = localStorage.getItem("edujira_timetable");
    let loadedSlots: TimetableSlot[];

    if (savedSlots) {
      loadedSlots = JSON.parse(savedSlots);
    } else {
      loadedSlots = defaultTimetableSlots;
      localStorage.setItem("edujira_timetable", JSON.stringify(defaultTimetableSlots));
    }

    setSlots(loadedSlots);

    // Extract unique teacher names for the teacher filter view
    const teachers = Array.from(
      new Set(loadedSlots.map((s) => s.teacher).filter((t) => t.trim() !== ""))
    ).sort();
    setTeachersList(teachers);
    if (teachers.length > 0 && !teachers.includes(selectedTeacher)) {
      setSelectedTeacher(teachers[0]);
    }
  }, []);

  // Save updates to localStorage
  const saveSlots = (updated: TimetableSlot[]) => {
    setSlots(updated);
    localStorage.setItem("edujira_timetable", JSON.stringify(updated));

    // Update teacher list
    const teachers = Array.from(
      new Set(updated.map((s) => s.teacher).filter((t) => t.trim() !== ""))
    ).sort();
    setTeachersList(teachers);
  };

  const handleRoleChange = (role: string) => {
    router.push(`/timetable?role=${role}`);
  };

  const canManage = currentRole === "admin";

  // --- CONFLICT DETECTION LOGIC ---
  useEffect(() => {
    if (!isModalOpen) {
      setTeacherConflict(null);
      setRoomConflict(null);
      return;
    }

    // Find times for selected period preset
    const preset = periodPresets.find((p) => p.id === formPeriodId);
    if (!preset) return;

    // Check teacher double-booking
    if (formTeacher.trim()) {
      const match = slots.find(
        (s) =>
          s.id !== editingSlot?.id &&
          s.day === formDay &&
          s.periodId === formPeriodId &&
          s.teacher.trim().toLowerCase() === formTeacher.trim().toLowerCase()
      );
      setTeacherConflict(match || null);
    } else {
      setTeacherConflict(null);
    }

    // Check room double-booking
    if (formRoom.trim()) {
      const match = slots.find(
        (s) =>
          s.id !== editingSlot?.id &&
          s.day === formDay &&
          s.periodId === formPeriodId &&
          s.room.trim().toLowerCase() === formRoom.trim().toLowerCase()
      );
      setRoomConflict(match || null);
    } else {
      setRoomConflict(null);
    }
  }, [formDay, formPeriodId, formTeacher, formRoom, slots, isModalOpen, editingSlot]);

  // --- CRUD ACTIONS ---
  const handleOpenCreateSlot = (day: DayType, periodId: string) => {
    if (!canManage) return;
    setEditingSlot(null);
    setFormDay(day);
    setFormPeriodId(periodId);
    setFormSubject("");
    setFormTeacher("");
    setFormRoom("");
    setFormGrade(selectedGrade);
    setFormSection(selectedSection);
    setIsModalOpen(true);
  };

  const handleOpenEditSlot = (slot: TimetableSlot) => {
    if (!canManage) return;
    setEditingSlot(slot);
    setFormDay(slot.day);
    setFormPeriodId(slot.periodId);
    setFormSubject(slot.subject);
    setFormTeacher(slot.teacher);
    setFormRoom(slot.room);
    setFormGrade(slot.grade);
    setFormSection(slot.section);
    setIsModalOpen(true);
  };

  const handleDeleteSlot = (id: string) => {
    if (!canManage) return;
    if (confirm("Are you sure you want to delete this period from the routine?")) {
      const updated = slots.filter((s) => s.id !== id);
      saveSlots(updated);
      setIsModalOpen(false);
    }
  };

  const handleSaveSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formSubject.trim() || !formTeacher.trim() || !formRoom.trim()) return;

    const preset = periodPresets.find((p) => p.id === formPeriodId);
    if (!preset) return;

    const slotData: Omit<TimetableSlot, "id"> = {
      day: formDay,
      periodId: formPeriodId,
      startTime: preset.startTime,
      endTime: preset.endTime,
      subject: formSubject,
      teacher: formTeacher,
      room: formRoom,
      grade: formGrade,
      section: formSection,
    };

    if (editingSlot) {
      const updated = slots.map((s) =>
        s.id === editingSlot.id ? { ...s, ...slotData } : s
      );
      saveSlots(updated);
    } else {
      const newSlot: TimetableSlot = {
        id: `slot-${Date.now()}`,
        ...slotData,
      };
      saveSlots([...slots, newSlot]);
    }

    setIsModalOpen(false);
    setEditingSlot(null);
  };

  // --- RENDER ROUTINE MAPS ---
  // Get slots filtered by current view settings
  const getVisibleSlots = () => {
    if (currentRole === "teacher") {
      // In teacher view, filter by selected teacher
      return slots.filter(
        (s) => s.teacher.toLowerCase() === selectedTeacher.toLowerCase()
      );
    } else {
      // For Admins, Students, Parents: Filter by Grade and Section
      return slots.filter(
        (s) => s.grade === selectedGrade && s.section === selectedSection
      );
    }
  };

  const visibleSlots = getVisibleSlots();

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 selection:bg-indigo-100 selection:text-indigo-900">
      <div className="mx-auto max-w-7xl">
        
        {/* --- HEADER --- */}
        <header className="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
              Class Timetable & Scheduler
            </h1>
            <p className="mt-1.5 text-sm text-slate-500">
              {currentRole === "admin"
                ? "Schedule routines, assign teachers, allocate rooms, and check for conflicts."
                : currentRole === "teacher"
                ? `Personalized teaching routine and schedule overview for staff.`
                : `Timetable for ${selectedGrade} - Section ${selectedSection}.`}
            </p>
          </div>

          {/* Quick Role Simulator */}
          <div className="flex items-center gap-2 rounded-xl bg-white p-2 shadow-sm border border-slate-200">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-2">
              Viewing As:
            </span>
            <div className="flex gap-1">
              {allRoles.map((role) => (
                <button
                  key={role.id}
                  onClick={() => handleRoleChange(role.id)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                    currentRole === role.id
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  {role.label}
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* --- CONTROLS / FILTERS BAR --- */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          
          {/* Main Filters depending on Role */}
          <div className="flex flex-wrap items-center gap-4">
            
            {currentRole === "teacher" ? (
              // Teacher filter selector
              <div className="flex items-center gap-2">
                <label className="text-sm font-semibold text-slate-500">Select Teacher:</label>
                <select
                  value={selectedTeacher}
                  onChange={(e) => setSelectedTeacher(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-sm font-semibold text-slate-800 outline-none focus:border-indigo-600 focus:bg-white"
                >
                  {teachersList.length === 0 ? (
                    <option>No teachers found</option>
                  ) : (
                    teachersList.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))
                  )}
                </select>
              </div>
            ) : (
              // Admin, Student, Parent class selection filters
              <>
                <div className="flex items-center gap-2">
                  <label className="text-sm font-semibold text-slate-500">Grade:</label>
                  <select
                    value={selectedGrade}
                    onChange={(e) => setSelectedGrade(e.target.value)}
                    className="rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-sm font-semibold text-slate-800 outline-none focus:border-indigo-600 focus:bg-white"
                  >
                    {gradesList.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <label className="text-sm font-semibold text-slate-500">Section:</label>
                  <select
                    value={selectedSection}
                    onChange={(e) => setSelectedSection(e.target.value)}
                    className="rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-sm font-semibold text-slate-800 outline-none focus:border-indigo-600 focus:bg-white"
                  >
                    {sectionsList.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}

          </div>

          {/* Quick Stats/Legends */}
          <div className="flex items-center gap-3 text-xs font-semibold text-slate-400">
            <span className="flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded-sm bg-indigo-50 border border-indigo-200" />
              Classes Scheduled: {visibleSlots.length}
            </span>
          </div>

        </div>

        {/* --- WEEKLY TIMETABLE GRID --- */}
        <div className="mt-8 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full min-w-[800px] table-fixed border-collapse divide-y divide-slate-200">
            
            {/* Headers: Days */}
            <thead className="bg-slate-50">
              <tr className="divide-x divide-slate-200">
                <th className="w-32 py-4 text-center text-xs font-bold uppercase tracking-wider text-slate-500">
                  Time / Periods
                </th>
                {daysOfWeek.map((day) => (
                  <th key={day} className="py-4 text-center text-sm font-bold text-slate-700">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>

            {/* Rows: Period presets */}
            <tbody className="divide-y divide-slate-200 bg-white">
              {periodPresets.map((preset) => (
                <tr key={preset.id} className={`divide-x divide-slate-200 ${preset.isBreak ? "bg-amber-50/40" : ""}`}>
                  
                  {/* Row header: period name & time */}
                  <td className="p-4 text-center flex flex-col justify-center h-24">
                    <span className="text-xs font-extrabold text-slate-800 uppercase">
                      {preset.name}
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold mt-1">
                      {preset.startTime} - {preset.endTime}
                    </span>
                  </td>

                  {/* Day cells */}
                  {daysOfWeek.map((day) => {
                    // Check if static break
                    if (preset.isBreak) {
                      return (
                        <td key={`${day}-${preset.id}`} className="p-4 text-center bg-amber-50/20 text-xs font-bold text-amber-600/70 select-none tracking-wide">
                          ☕ {preset.name}
                        </td>
                      );
                    }

                    // Get slot matching day and period preset
                    const slot = visibleSlots.find(
                      (s) => s.day === day && s.periodId === preset.id
                    );

                    return (
                      <td
                        key={`${day}-${preset.id}`}
                        className={`p-2 h-24 align-middle group relative ${
                          slot ? "bg-indigo-50/20 hover:bg-indigo-50/40" : "bg-white"
                        }`}
                      >
                        {slot ? (
                          // Render existing slot entry
                          <div className="flex flex-col h-full justify-between p-1">
                            <div>
                              <div className="flex justify-between items-start">
                                <span className="text-xs font-extrabold text-slate-800 line-clamp-1">
                                  {slot.subject}
                                </span>
                                
                                {canManage && (
                                  <button
                                    onClick={() => handleOpenEditSlot(slot)}
                                    className="opacity-0 group-hover:opacity-100 absolute top-2 right-2 p-1 bg-white hover:bg-indigo-100 text-indigo-600 rounded-md border border-slate-200 transition-opacity shadow-xs"
                                    title="Edit Slot"
                                  >
                                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                                    </svg>
                                  </button>
                                )}
                              </div>
                              
                              <p className="text-[10px] text-slate-500 font-medium mt-0.5 flex items-center gap-1">
                                <svg className="h-2.5 w-2.5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                </svg>
                                {currentRole === "teacher" ? `Grade ${slot.grade}-${slot.section}` : slot.teacher}
                              </p>
                            </div>

                            <span className="inline-flex w-fit items-center gap-1 rounded bg-indigo-50 border border-indigo-150 px-1.5 py-0.5 text-[9px] font-bold text-indigo-700">
                              🏫 {slot.room}
                            </span>
                          </div>
                        ) : (
                          // Render empty scheduler slot (Admin only)
                          canManage && (
                            <button
                              onClick={() => handleOpenCreateSlot(day, preset.id)}
                              className="w-full h-full flex items-center justify-center border border-dashed border-slate-200 hover:border-indigo-400 hover:bg-slate-50/50 rounded-xl transition-all"
                            >
                              <span className="text-[10px] font-semibold text-slate-400 group-hover:text-indigo-600 flex items-center gap-1">
                                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                </svg>
                                Add Slot
                              </span>
                            </button>
                          )
                        )}
                      </td>
                    );
                  })}

                </tr>
              ))}
            </tbody>

          </table>
        </div>

      </div>

      {/* ======================================================== */}
      {/* --- SCHEDULER DIALOG MODAL (ADMIN ONLY) --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">
                {editingSlot ? "Edit Timetable Period" : "Schedule Timetable Period"}
              </h2>
              <button
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingSlot(null);
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveSlot} className="mt-4 space-y-4">
              
              {/* Day & Period presets info */}
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div>
                  <span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400">Day</span>
                  <span className="text-sm font-bold text-slate-800">{formDay}</span>
                </div>
                <div>
                  <span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400">Period</span>
                  <span className="text-sm font-bold text-slate-800">
                    {periodPresets.find((p) => p.id === formPeriodId)?.name}
                  </span>
                </div>
              </div>

              {/* Class Scope Selector */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700">Grade *</label>
                  <select
                    value={formGrade}
                    onChange={(e) => setFormGrade(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none transition-all focus:border-indigo-600 focus:bg-white"
                  >
                    {gradesList.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700">Section *</label>
                  <select
                    value={formSection}
                    onChange={(e) => setFormSection(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none transition-all focus:border-indigo-600 focus:bg-white"
                  >
                    {sectionsList.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Subject Input */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">Subject Name *</label>
                <input
                  type="text"
                  required
                  value={formSubject}
                  onChange={(e) => setFormSubject(e.target.value)}
                  placeholder="e.g. Mathematics, Chemistry"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none transition-all focus:border-indigo-600 focus:bg-white"
                />
              </div>

              {/* Teacher Input */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">Teacher *</label>
                <input
                  type="text"
                  required
                  value={formTeacher}
                  onChange={(e) => setFormTeacher(e.target.value)}
                  placeholder="e.g. Mr. Rahman"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none transition-all focus:border-indigo-600 focus:bg-white"
                />
              </div>

              {/* Classroom Room Input */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">Classroom / Room *</label>
                <input
                  type="text"
                  required
                  value={formRoom}
                  onChange={(e) => setFormRoom(e.target.value)}
                  placeholder="e.g. Room 301, Lab 202"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none transition-all focus:border-indigo-600 focus:bg-white"
                />
              </div>

              {/* --- CONFLICT DETECTION DISPLAY --- */}
              {teacherConflict && (
                <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-xs text-amber-700 flex items-start gap-2">
                  <span className="text-base">⚠️</span>
                  <div>
                    <span className="font-bold">Teacher double-booking:</span> {formTeacher} is already scheduled to teach {teacherConflict.subject} for {teacherConflict.grade}-{teacherConflict.section} in {teacherConflict.room} at this period!
                  </div>
                </div>
              )}

              {roomConflict && (
                <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-xs text-amber-700 flex items-start gap-2">
                  <span className="text-base">⚠️</span>
                  <div>
                    <span className="font-bold">Room booking conflict:</span> {formRoom} is already booked for {roomConflict.subject} ({roomConflict.grade}-{roomConflict.section}) at this period!
                  </div>
                </div>
              )}

              {/* Form Action buttons */}
              <div className="flex justify-between items-center border-t border-slate-100 pt-4 mt-6">
                {editingSlot ? (
                  <button
                    type="button"
                    onClick={() => handleDeleteSlot(editingSlot.id)}
                    className="rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 px-4 py-2.5 text-sm font-semibold transition-colors"
                  >
                    Delete Slot
                  </button>
                ) : (
                  <div />
                )}

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setEditingSlot(null);
                    }}
                    className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500"
                  >
                    Save Slot
                  </button>
                </div>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}

export default function TimetablePage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center p-8 bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
          <p className="text-sm font-semibold text-slate-500">Loading EduJira Timetable...</p>
        </div>
      </div>
    }>
      <TimetablePortal />
    </Suspense>
  );
}
