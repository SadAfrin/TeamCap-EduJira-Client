"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

// --- TYPE DEFINITIONS ---
interface CalendarCategory {
  id: string;
  name: string;
  color: "indigo" | "red" | "emerald" | "amber" | "purple" | "cyan";
  description: string;
  targetRoles: string[]; // ['admin', 'teacher', 'student', 'parent']
}

interface SchoolEvent {
  id: string;
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  location: string;
  calendarId: string;
  targetRoles: string[]; // ['admin', 'teacher', 'student', 'parent']
}

// --- COLOR MAPS ---
const colorMap = {
  indigo: {
    bg: "bg-indigo-50 hover:bg-indigo-100",
    border: "border-indigo-200",
    text: "text-indigo-700",
    badge: "bg-indigo-100 text-indigo-700 border-indigo-200",
    dot: "bg-indigo-500",
    textRaw: "#4f46e5",
  },
  red: {
    bg: "bg-red-50 hover:bg-red-100",
    border: "border-red-200",
    text: "text-red-700",
    badge: "bg-red-100 text-red-700 border-red-200",
    dot: "bg-red-500",
    textRaw: "#dc2626",
  },
  emerald: {
    bg: "bg-emerald-50 hover:bg-emerald-100",
    border: "border-emerald-200",
    text: "text-emerald-700",
    badge: "bg-emerald-100 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
    textRaw: "#059669",
  },
  amber: {
    bg: "bg-amber-50 hover:bg-amber-100",
    border: "border-amber-200",
    text: "text-amber-700",
    badge: "bg-amber-100 text-amber-700 border-amber-200",
    dot: "bg-amber-500",
    textRaw: "#d97706",
  },
  purple: {
    bg: "bg-purple-50 hover:bg-purple-100",
    border: "border-purple-200",
    text: "text-purple-700",
    badge: "bg-purple-100 text-purple-700 border-purple-200",
    dot: "bg-purple-500",
    textRaw: "#9333ea",
  },
  cyan: {
    bg: "bg-cyan-50 hover:bg-cyan-100",
    border: "border-cyan-200",
    text: "text-cyan-700",
    badge: "bg-cyan-100 text-cyan-700 border-cyan-200",
    dot: "bg-cyan-500",
    textRaw: "#0891b2",
  },
};

const allRoles = [
  { id: "admin", label: "Admin" },
  { id: "teacher", label: "Teacher" },
  { id: "student", label: "Student" },
  { id: "parent", label: "Parent" },
];

// --- SEED DATA ---
const defaultCalendars: CalendarCategory[] = [
  {
    id: "cal-academic",
    name: "Academic Calendar",
    color: "indigo",
    description: "Main school terms, parent-teacher meetings, and general notices.",
    targetRoles: ["admin", "teacher", "student", "parent"],
  },
  {
    id: "cal-exams",
    name: "Exams & Tests",
    color: "red",
    description: "Midterms, finals, class quizzes, and assessments.",
    targetRoles: ["admin", "teacher", "student", "parent"],
  },
  {
    id: "cal-activities",
    name: "Sports & Extracurriculars",
    color: "emerald",
    description: "Clubs, sports practices, debate competitions, and cultural events.",
    targetRoles: ["admin", "teacher", "student", "parent"],
  },
  {
    id: "cal-holidays",
    name: "School Holidays",
    color: "amber",
    description: "Scheduled holidays and breaks.",
    targetRoles: ["admin", "teacher", "student", "parent"],
  },
  {
    id: "cal-staff",
    name: "Staff Meetings",
    color: "purple",
    description: "Internal teacher-admin meetings and briefings.",
    targetRoles: ["admin", "teacher"],
  },
];

const defaultEvents: SchoolEvent[] = [
  {
    id: "evt-1",
    title: "Term 2 Commencement",
    description: "Opening assembly and distribution of new syllabus materials.",
    date: "2026-08-03",
    startTime: "08:30",
    endTime: "10:30",
    location: "Auditorium",
    calendarId: "cal-academic",
    targetRoles: ["admin", "teacher", "student", "parent"],
  },
  {
    id: "evt-2",
    title: "Teacher Curriculum Sync",
    description: "Review teaching schedules and progress reports for Term 2.",
    date: "2026-08-12",
    startTime: "14:00",
    endTime: "16:00",
    location: "Staff Lounge Room A",
    calendarId: "cal-staff",
    targetRoles: ["admin", "teacher"],
  },
  {
    id: "evt-3",
    title: "Inter-School Basketball Match",
    description: "EduJira Knights vs Riverdale High. Gate fees are free for students.",
    date: "2026-08-18",
    startTime: "15:30",
    endTime: "18:00",
    location: "Main Gymnasium",
    calendarId: "cal-activities",
    targetRoles: ["admin", "teacher", "student", "parent"],
  },
  {
    id: "evt-4",
    title: "Math Midterm Exam",
    description: "Written algebra and geometry exam. Bring your calculators.",
    date: "2026-08-24",
    startTime: "09:00",
    endTime: "11:30",
    location: "Main Hall / Exam Hall A",
    calendarId: "cal-exams",
    targetRoles: ["admin", "teacher", "student"],
  },
  {
    id: "evt-5",
    title: "Physics Lab Assessment",
    description: "Practical assessment of electricity, voltage, and circuit construction.",
    date: "2026-08-26",
    startTime: "13:30",
    endTime: "15:30",
    location: "Physics Lab 3",
    calendarId: "cal-exams",
    targetRoles: ["admin", "teacher", "student"],
  },
  {
    id: "evt-6",
    title: "Parent-Teacher Conference",
    description: "One-on-one sessions to discuss student progress and midterm performance.",
    date: "2026-08-28",
    startTime: "14:00",
    endTime: "19:00",
    location: "Auditorium & Classrooms",
    calendarId: "cal-academic",
    targetRoles: ["admin", "teacher", "parent"],
  },
  {
    id: "evt-7",
    title: "National Holiday - Break",
    description: "School closed. Dormitories remain open for boarders.",
    date: "2026-08-31",
    startTime: "00:00",
    endTime: "23:59",
    location: "Campus-wide",
    calendarId: "cal-holidays",
    targetRoles: ["admin", "teacher", "student", "parent"],
  },
  {
    id: "evt-8",
    title: "Science Club Registrations",
    description: "Annual signups for robotics, chemistry, and environmental science projects.",
    date: "2026-09-04",
    startTime: "15:00",
    endTime: "16:30",
    location: "Lab Room 101",
    calendarId: "cal-activities",
    targetRoles: ["admin", "teacher", "student"],
  },
];

// Helper to format date YYYY-MM-DD
function formatDateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function CalendarPortal() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roleParam = searchParams.get("role") || "student";

  // --- STATE ---
  const currentRole = roleParam;
  const [calendars, setCalendars] = useState<CalendarCategory[]>([]);
  const [events, setEvents] = useState<SchoolEvent[]>([]);
  const [selectedCalendars, setSelectedCalendars] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [audienceFilter, setAudienceFilter] = useState<string>("all"); // 'all' or specific role

  // Month navigation (Defaults to August 2026)
  const [currentYear, setCurrentYear] = useState<number>(2026);
  const [currentMonth, setCurrentMonth] = useState<number>(7); // 0-indexed, 7 = August

  // Modals state
  const [activeEvent, setActiveEvent] = useState<SchoolEvent | null>(null);
  const [isEventDetailOpen, setIsEventDetailOpen] = useState(false);
  
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<SchoolEvent | null>(null);
  
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const [editingCalendar, setEditingCalendar] = useState<CalendarCategory | null>(null);

  // Form states - Events
  const [eventTitle, setEventTitle] = useState("");
  const [eventDesc, setEventDesc] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventStart, setEventStart] = useState("");
  const [eventEnd, setEventEnd] = useState("");
  const [eventLoc, setEventLoc] = useState("");
  const [eventCalId, setEventCalId] = useState("");
  const [eventRoles, setEventRoles] = useState<string[]>([]);

  // Form states - Calendars
  const [calName, setCalName] = useState("");
  const [calDesc, setCalDesc] = useState("");
  const [calColor, setCalColor] = useState<"indigo" | "red" | "emerald" | "amber" | "purple" | "cyan">("indigo");
  const [calRoles, setCalRoles] = useState<string[]>([]);

  // Load data from LocalStorage or seed defaults
  useEffect(() => {
    const savedCals = localStorage.getItem("edujira_calendars");
    const savedEvts = localStorage.getItem("edujira_events");

    let loadedCals: CalendarCategory[];
    let loadedEvts: SchoolEvent[];

    if (savedCals) {
      loadedCals = JSON.parse(savedCals);
    } else {
      loadedCals = defaultCalendars;
      localStorage.setItem("edujira_calendars", JSON.stringify(defaultCalendars));
    }

    if (savedEvts) {
      loadedEvts = JSON.parse(savedEvts);
    } else {
      loadedEvts = defaultEvents;
      localStorage.setItem("edujira_events", JSON.stringify(defaultEvents));
    }

    /* eslint-disable-next-line react-hooks/set-state-in-effect */
    setCalendars(loadedCals);
    setEvents(loadedEvts);
    setSelectedCalendars(loadedCals.map((c) => c.id));
  }, []);

  // Save changes to localStorage helper
  const saveCalendars = (updated: CalendarCategory[]) => {
    setCalendars(updated);
    localStorage.setItem("edujira_calendars", JSON.stringify(updated));
  };

  const saveEvents = (updated: SchoolEvent[]) => {
    setEvents(updated);
    localStorage.setItem("edujira_events", JSON.stringify(updated));
  };

  // Switch role handler
  const handleRoleChange = (role: string) => {
    router.push(`/calendar?role=${role}`);
  };

  // Has write permissions (Admins and Teachers can edit schedules, students/parents can only read)
  const canManage = currentRole === "admin" || currentRole === "teacher";

  // --- CALENDAR GRID GENERATION ---
  const getGridDays = () => {
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay(); // Weekday index (0 = Sunday)
    const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();
    const prevMonthTotalDays = new Date(currentYear, currentMonth, 0).getDate();

    const days: { date: Date; dateStr: string; isCurrentMonth: boolean; isToday: boolean }[] = [];

    // Fill leading days from previous month
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const d = new Date(currentYear, currentMonth - 1, prevMonthTotalDays - i);
      days.push({
        date: d,
        dateStr: formatDateString(d),
        isCurrentMonth: false,
        isToday: false,
      });
    }

    // Fill current month days
    const todayStr = formatDateString(new Date());
    for (let i = 1; i <= totalDays; i++) {
      const d = new Date(currentYear, currentMonth, i);
      const dateStr = formatDateString(d);
      days.push({
        date: d,
        dateStr,
        isCurrentMonth: true,
        isToday: dateStr === todayStr,
      });
    }

    // Fill trailing days for next month to complete 6-row grid (42 cells)
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      const d = new Date(currentYear, currentMonth + 1, i);
      days.push({
        date: d,
        dateStr: formatDateString(d),
        isCurrentMonth: false,
        isToday: false,
      });
    }

    return days;
  };

  const gridDays = getGridDays();

  // --- FILTERED EVENTS ---
  const filteredEvents = events.filter((evt) => {
    // 1. Is its calendar selected/visible?
    if (!selectedCalendars.includes(evt.calendarId)) return false;

    // 2. Filter by search query (title, description, location)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesTitle = evt.title.toLowerCase().includes(q);
      const matchesDesc = evt.description.toLowerCase().includes(q);
      const matchesLoc = evt.location.toLowerCase().includes(q);
      if (!matchesTitle && !matchesDesc && !matchesLoc) return false;
    }

    // 3. Filter by target audience roles:
    // A role can only see an event if that event is targeted to their role.
    // If the event targetRoles is empty, assume all can see.
    const isTargetedToCurrentRole = 
      evt.targetRoles.length === 0 || evt.targetRoles.includes(currentRole);

    if (!isTargetedToCurrentRole) return false;

    // Additional filter by audience switcher (sidebar filter)
    if (audienceFilter !== "all" && !evt.targetRoles.includes(audienceFilter)) {
      return false;
    }

    return true;
  });

  // Events visible to the current role (regardless of checkbox filters, used for counts)
  const roleVisibleEvents = events.filter((evt) => evt.targetRoles.includes(currentRole));

  // --- EVENT ACTIONS ---
  const handleOpenCreateEvent = (dateStr?: string) => {
    if (!canManage) return;
    setEditingEvent(null);
    setEventTitle("");
    setEventDesc("");
    setEventDate(dateStr || formatDateString(new Date()));
    setEventStart("09:00");
    setEventEnd("10:00");
    setEventLoc("");
    // Pick the first available calendar
    const activeCals = calendars.filter((c) => c.targetRoles.includes(currentRole));
    setEventCalId(activeCals[0]?.id || calendars[0]?.id || "");
    setEventRoles(["student", "teacher", "parent"]);
    setIsEventModalOpen(true);
  };

  const handleOpenEditEvent = (evt: SchoolEvent) => {
    if (!canManage) return;
    setEditingEvent(evt);
    setEventTitle(evt.title);
    setEventDesc(evt.description);
    setEventDate(evt.date);
    setEventStart(evt.startTime);
    setEventEnd(evt.endTime);
    setEventLoc(evt.location);
    setEventCalId(evt.calendarId);
    setEventRoles(evt.targetRoles);
    setIsEventDetailOpen(false);
    setIsEventModalOpen(true);
  };

  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle.trim() || !eventDate || !eventCalId) return;

    if (editingEvent) {
      const updated = events.map((evt) =>
        evt.id === editingEvent.id
          ? {
              ...evt,
              title: eventTitle,
              description: eventDesc,
              date: eventDate,
              startTime: eventStart,
              endTime: eventEnd,
              location: eventLoc,
              calendarId: eventCalId,
              targetRoles: eventRoles,
            }
          : evt
      );
      saveEvents(updated);
    } else {
      const newEvt: SchoolEvent = {
        id: `evt-${Date.now()}`,
        title: eventTitle,
        description: eventDesc,
        date: eventDate,
        startTime: eventStart,
        endTime: eventEnd,
        location: eventLoc,
        calendarId: eventCalId,
        targetRoles: eventRoles,
      };
      saveEvents([...events, newEvt]);
    }

    setIsEventModalOpen(false);
    setEditingEvent(null);
  };

  const handleDeleteEvent = (id: string) => {
    if (!canManage) return;
    if (confirm("Are you sure you want to delete this event?")) {
      const updated = events.filter((evt) => evt.id !== id);
      saveEvents(updated);
      setIsEventDetailOpen(false);
    }
  };

  // --- CALENDAR CATEGORY ACTIONS ---
  const handleOpenCreateCalendar = () => {
    if (currentRole !== "admin") return; // Only admins can create/delete calendars
    setEditingCalendar(null);
    setCalName("");
    setCalDesc("");
    setCalColor("indigo");
    setCalRoles(["admin", "teacher", "student", "parent"]);
    setIsCalendarModalOpen(true);
  };

  const handleOpenEditCalendar = (cal: CalendarCategory) => {
    if (currentRole !== "admin") return;
    setEditingCalendar(cal);
    setCalName(cal.name);
    setCalDesc(cal.description);
    setCalColor(cal.color);
    setCalRoles(cal.targetRoles);
    setIsCalendarModalOpen(true);
  };

  const handleSaveCalendar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!calName.trim()) return;

    if (editingCalendar) {
      const updated = calendars.map((c) =>
        c.id === editingCalendar.id
          ? {
              ...c,
              name: calName,
              description: calDesc,
              color: calColor,
              targetRoles: calRoles,
            }
          : c
      );
      saveCalendars(updated);
    } else {
      const newId = `cal-${Date.now()}`;
      const newCal: CalendarCategory = {
        id: newId,
        name: calName,
        description: calDesc,
        color: calColor,
        targetRoles: calRoles,
      };
      saveCalendars([...calendars, newCal]);
      setSelectedCalendars((prev) => [...prev, newId]);
    }

    setIsCalendarModalOpen(false);
    setEditingCalendar(null);
  };

  const handleDeleteCalendar = (id: string) => {
    if (currentRole !== "admin") return;
    if (
      confirm(
        "Deleting this calendar will permanently delete all events associated with it. Do you want to proceed?"
      )
    ) {
      const updatedCals = calendars.filter((c) => c.id !== id);
      const updatedEvts = events.filter((evt) => evt.calendarId !== id);
      saveCalendars(updatedCals);
      saveEvents(updatedEvts);
    }
  };

  // Month labels
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth());
  };

  // Toggle calendar visible selection
  const handleToggleCalendar = (id: string) => {
    setSelectedCalendars((prev) =>
      prev.includes(id) ? prev.filter((calId) => calId !== id) : [...prev, id]
    );
  };

  // Return upcoming events
  const getUpcomingEvents = () => {
    // Sort by date then startTime
    const sorted = [...filteredEvents].sort((a, b) => {
      const dateDiff = new Date(a.date).getTime() - new Date(b.date).getTime();
      if (dateDiff !== 0) return dateDiff;
      return a.startTime.localeCompare(b.startTime);
    });

    // filter only upcoming or today
    const todayStr = formatDateString(new Date());
    return sorted.filter((evt) => evt.date >= todayStr).slice(0, 5);
  };

  const upcomingEvents = getUpcomingEvents();

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 selection:bg-indigo-100 selection:text-indigo-900">
      <div className="mx-auto max-w-7xl">
        
        {/* --- HEADER --- */}
        <header className="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
              Calendar & Events Hub
            </h1>
            <p className="mt-1.5 text-sm text-slate-500">
              Schedule academic classes, exams, school breaks, meetings, and activities.
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

        {/* --- MAIN GRID --- */}
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-4">
          
          {/* --- SIDEBAR: CONTROLS & CALENDARS --- */}
          <div className="flex flex-col gap-6 lg:col-span-1">
            
            {/* Search Box */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 mb-3">Search Events</h3>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Filter by title, room..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition-all focus:border-indigo-600 focus:bg-white"
                />
                <svg
                  className="absolute left-3 top-3 h-4 w-4 text-slate-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Calendars Checklist */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-900">Calendars</h3>
                {currentRole === "admin" && (
                  <button
                    onClick={handleOpenCreateCalendar}
                    className="inline-flex items-center justify-center rounded-lg bg-indigo-50 p-1.5 text-indigo-600 transition-colors hover:bg-indigo-100"
                    title="Create New Calendar"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                  </button>
                )}
              </div>

              <div className="flex flex-col gap-3">
                {calendars
                  .filter((cal) => cal.targetRoles.includes(currentRole))
                  .map((cal) => {
                    const colorDetails = colorMap[cal.color] || colorMap.indigo;
                    const eventCount = roleVisibleEvents.filter((e) => e.calendarId === cal.id).length;
                    
                    return (
                      <div
                        key={cal.id}
                        className="group flex items-center justify-between rounded-lg p-1 hover:bg-slate-50"
                      >
                        <label className="flex items-center gap-3 cursor-pointer select-none flex-1">
                          <input
                            type="checkbox"
                            checked={selectedCalendars.includes(cal.id)}
                            onChange={() => handleToggleCalendar(cal.id)}
                            className="h-4 w-4 rounded-sm border-slate-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <div>
                            <span className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
                              <span className={`h-2.5 w-2.5 rounded-full ${colorDetails.dot}`} />
                              {cal.name}
                            </span>
                            {cal.description && (
                              <p className="text-xs text-slate-400 line-clamp-1 max-w-[150px]">
                                {cal.description}
                              </p>
                            )}
                          </div>
                        </label>

                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-full">
                            {eventCount}
                          </span>
                          {currentRole === "admin" && (
                            <div className="hidden items-center gap-0.5 group-hover:flex">
                              <button
                                onClick={() => handleOpenEditCalendar(cal)}
                                className="p-1 text-slate-400 hover:text-indigo-600 rounded"
                                title="Edit"
                              >
                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                                </svg>
                              </button>
                              <button
                                onClick={() => handleDeleteCalendar(cal.id)}
                                className="p-1 text-slate-400 hover:text-red-600 rounded"
                                title="Delete"
                              >
                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                </svg>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Sidebar Filters */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 mb-3">Audience Filter</h3>
              <select
                value={audienceFilter}
                onChange={(e) => setAudienceFilter(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3 text-sm outline-none transition-all focus:border-indigo-600 focus:bg-white"
              >
                <option value="all">All Audiences</option>
                <option value="student">Students Only</option>
                <option value="teacher">Teachers Only</option>
                <option value="parent">Parents Only</option>
                <option value="admin">Admins Only</option>
              </select>
            </div>

            {/* Upcoming List */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 mb-4">Upcoming Schedule</h3>
              <div className="flex flex-col gap-4">
                {upcomingEvents.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-4">
                    No upcoming events.
                  </p>
                ) : (
                  upcomingEvents.map((evt) => {
                    const cal = calendars.find((c) => c.id === evt.calendarId);
                    const colorDetails = colorMap[cal?.color || "indigo"];
                    
                    return (
                      <button
                        key={evt.id}
                        onClick={() => {
                          setActiveEvent(evt);
                          setIsEventDetailOpen(true);
                        }}
                        className="flex flex-col items-start text-left gap-1 rounded-lg border border-slate-100 hover:border-indigo-100 hover:bg-slate-50 p-2.5 transition-all w-full"
                      >
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${colorDetails.badge}`}>
                          {cal?.name || "Event"}
                        </span>
                        <h4 className="text-xs font-bold text-slate-800 mt-1 line-clamp-1">
                          {evt.title}
                        </h4>
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mt-0.5">
                          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>{evt.date} • {evt.startTime}</span>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

          </div>

          {/* --- MAIN CALENDAR GRID VIEW --- */}
          <div className="flex flex-col gap-4 lg:col-span-3">
            
            {/* Grid Header Controls */}
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevMonth}
                  className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200"
                  title="Previous Month"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                </button>
                <button
                  onClick={handleToday}
                  className="rounded-lg border border-slate-200 px-3.5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                >
                  Today
                </button>
                <button
                  onClick={handleNextMonth}
                  className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200"
                  title="Next Month"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </button>
              </div>

              <h2 className="text-lg font-bold text-slate-900">
                {monthNames[currentMonth]} {currentYear}
              </h2>

              {canManage && (
                <button
                  onClick={() => handleOpenCreateEvent()}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  New Event
                </button>
              )}
            </div>

            {/* Calendar Table Grid */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              
              {/* Day of Week Headers */}
              <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50 text-center text-xs font-bold uppercase tracking-wider text-slate-500 py-3">
                <div>Sun</div>
                <div>Mon</div>
                <div>Tue</div>
                <div>Wed</div>
                <div>Thu</div>
                <div>Fri</div>
                <div>Sat</div>
              </div>

              {/* Grid Days */}
              <div className="grid grid-cols-7 grid-rows-6 divide-x divide-y divide-slate-100 bg-slate-100">
                {gridDays.map((day, idx) => {
                  const dayEvents = filteredEvents.filter((evt) => evt.date === day.dateStr);

                  return (
                    <div
                      key={`${day.dateStr}-${idx}`}
                      onClick={() => handleOpenCreateEvent(day.dateStr)}
                      className={`relative min-h-[110px] bg-white p-2 transition-all flex flex-col group ${
                        day.isCurrentMonth ? "" : "bg-slate-50/50 text-slate-400"
                      } ${day.isToday ? "ring-2 ring-indigo-600 ring-inset" : ""} ${
                        canManage ? "cursor-pointer hover:bg-slate-50/80" : ""
                      }`}
                    >
                      {/* Date Indicator */}
                      <span
                        className={`inline-flex h-6 w-6 items-center justify-center text-xs font-semibold rounded-full mb-1.5 ${
                          day.isToday
                            ? "bg-indigo-600 text-white"
                            : "text-slate-700"
                        }`}
                      >
                        {day.date.getDate()}
                      </span>

                      {/* Day Events Badges list */}
                      <div className="flex-1 overflow-y-auto space-y-1 pr-0.5 custom-scrollbar max-h-[80px]" onClick={(e) => e.stopPropagation()}>
                        {dayEvents.map((evt) => {
                          const cal = calendars.find((c) => c.id === evt.calendarId);
                          const colorDetails = colorMap[cal?.color || "indigo"];
                          
                          return (
                            <button
                              key={evt.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveEvent(evt);
                                setIsEventDetailOpen(true);
                              }}
                              className={`w-full text-left truncate text-[10px] font-semibold px-1.5 py-1 rounded border transition-all ${
                                colorDetails.badge
                              } hover:opacity-85 shadow-2xs`}
                              title={`${evt.title} (${evt.startTime} - ${evt.endTime})`}
                            >
                              <div className="flex items-center gap-1">
                                <span className={`h-1 w-1 rounded-full ${colorDetails.dot} shrink-0`} />
                                <span className="truncate">{evt.title}</span>
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      {/* Hover add shortcut indicator for staff */}
                      {canManage && (
                        <div className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-200 px-1 rounded">
                            + Add
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* ======================================================== */}
      {/* --- MODAL: EVENT DETAILS --- */}
      {isEventDetailOpen && activeEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between">
              <div>
                {(() => {
                  const cal = calendars.find((c) => c.id === activeEvent.calendarId);
                  const colorDetails = colorMap[cal?.color || "indigo"];
                  return (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${colorDetails.badge}`}>
                      {cal?.name || "General"}
                    </span>
                  );
                })()}
                <h2 className="text-xl font-bold text-slate-900 mt-2">{activeEvent.title}</h2>
              </div>
              <button
                onClick={() => {
                  setIsEventDetailOpen(false);
                  setActiveEvent(null);
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Details Grid */}
            <div className="mt-6 space-y-4">
              
              {/* Date & Time */}
              <div className="flex items-center gap-3 text-sm text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <svg className="h-5 w-5 text-indigo-500 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <span className="font-semibold text-slate-800">{activeEvent.date}</span>
                  <span className="mx-2 text-slate-300">|</span>
                  <span>{activeEvent.startTime} - {activeEvent.endTime}</span>
                </div>
              </div>

              {/* Location */}
              {activeEvent.location && (
                <div className="flex items-center gap-3 text-sm text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <svg className="h-5 w-5 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                  <div>
                    <span className="font-semibold text-slate-800">Location:</span> {activeEvent.location}
                  </div>
                </div>
              )}

              {/* Description */}
              {activeEvent.description && (
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Description</h4>
                  <p className="text-sm text-slate-700 whitespace-pre-line leading-relaxed">
                    {activeEvent.description}
                  </p>
                </div>
              )}

              {/* Audience info */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-semibold text-slate-400 uppercase">Target Audience:</span>
                <div className="flex flex-wrap gap-1">
                  {activeEvent.targetRoles.map((role) => (
                    <span key={role} className="text-[10px] font-semibold px-2 py-0.5 bg-slate-100 border border-slate-200 text-slate-600 rounded">
                      {role}
                    </span>
                  ))}
                </div>
              </div>

            </div>

            {/* Action Buttons for management */}
            {canManage && (
              <div className="mt-8 flex gap-3 border-t border-slate-100 pt-4 justify-end">
                <button
                  onClick={() => handleDeleteEvent(activeEvent.id)}
                  className="rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 px-4 py-2.5 text-sm font-semibold transition-colors flex items-center gap-1.5"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                  Delete Event
                </button>
                <button
                  onClick={() => handleOpenEditEvent(activeEvent)}
                  className="rounded-xl bg-indigo-600 text-white px-5 py-2.5 text-sm font-semibold hover:bg-indigo-500 transition-colors flex items-center gap-1.5"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                  </svg>
                  Edit Event
                </button>
              </div>
            )}
            
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* --- MODAL: CREATE / EDIT EVENT --- */}
      {isEventModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">
                {editingEvent ? "Edit Event Details" : "Create New School Event"}
              </h2>
              <button
                type="button"
                onClick={() => {
                  setIsEventModalOpen(false);
                  setEditingEvent(null);
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveEvent} className="mt-4 space-y-4">
              
              {/* Event Title */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">Event Title *</label>
                <input
                  type="text"
                  required
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  placeholder="e.g. Science Fair Registration"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none transition-all focus:border-indigo-600 focus:bg-white"
                />
              </div>

              {/* Calendar Association */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">Category / Calendar *</label>
                <select
                  required
                  value={eventCalId}
                  onChange={(e) => setEventCalId(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition-all focus:border-indigo-600 focus:bg-white"
                >
                  <option value="" disabled>Select a calendar</option>
                  {calendars
                    .filter((c) => c.targetRoles.includes(currentRole))
                    .map((cal) => (
                      <option key={cal.id} value={cal.id}>
                        {cal.name} ({cal.color})
                      </option>
                    ))}
                </select>
              </div>

              {/* Date */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">Date *</label>
                <input
                  type="date"
                  required
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none transition-all focus:border-indigo-600 focus:bg-white"
                />
              </div>

              {/* Time inputs */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700">Start Time</label>
                  <input
                    type="time"
                    value={eventStart}
                    onChange={(e) => setEventStart(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none transition-all focus:border-indigo-600 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700">End Time</label>
                  <input
                    type="time"
                    value={eventEnd}
                    onChange={(e) => setEventEnd(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none transition-all focus:border-indigo-600 focus:bg-white"
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">Location / Room</label>
                <input
                  type="text"
                  value={eventLoc}
                  onChange={(e) => setEventLoc(e.target.value)}
                  placeholder="e.g. Auditorium, Lab 201, Zoom link"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none transition-all focus:border-indigo-600 focus:bg-white"
                />
              </div>

              {/* Description */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">Description</label>
                <textarea
                  value={eventDesc}
                  onChange={(e) => setEventDesc(e.target.value)}
                  placeholder="Details about syllabus, requirements..."
                  rows={3}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none transition-all focus:border-indigo-600 focus:bg-white resize-none"
                />
              </div>

              {/* Targeted Roles Checklist */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">Target Roles (Who can see this?)</label>
                <div className="flex flex-wrap gap-4 rounded-xl border border-slate-100 bg-slate-50 p-3">
                  {allRoles.map((role) => (
                    <label key={role.id} className="flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-700">
                      <input
                        type="checkbox"
                        checked={eventRoles.includes(role.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setEventRoles((prev) => [...prev, role.id]);
                          } else {
                            setEventRoles((prev) => prev.filter((r) => r !== role.id));
                          }
                        }}
                        className="h-4 w-4 rounded-sm border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      {role.label}
                    </label>
                  ))}
                </div>
              </div>

              {/* Form Buttons */}
              <div className="flex justify-end gap-3 border-t border-slate-100 pt-4 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsEventModalOpen(false);
                    setEditingEvent(null);
                  }}
                  className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500"
                >
                  Save Event
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* --- MODAL: CREATE / EDIT CALENDAR --- */}
      {isCalendarModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">
                {editingCalendar ? "Edit Calendar Category" : "Add New Calendar Category"}
              </h2>
              <button
                type="button"
                onClick={() => {
                  setIsCalendarModalOpen(false);
                  setEditingCalendar(null);
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveCalendar} className="mt-4 space-y-4">
              
              {/* Calendar Name */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">Calendar Name *</label>
                <input
                  type="text"
                  required
                  value={calName}
                  onChange={(e) => setCalName(e.target.value)}
                  placeholder="e.g. Grade 10 Timetable"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none transition-all focus:border-indigo-600 focus:bg-white"
                />
              </div>

              {/* Description */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">Description</label>
                <textarea
                  value={calDesc}
                  onChange={(e) => setCalDesc(e.target.value)}
                  placeholder="e.g. Schedule details for exams and quizzes"
                  rows={2}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none transition-all focus:border-indigo-600 focus:bg-white resize-none"
                />
              </div>

              {/* Color selection */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">Theme Color *</label>
                <div className="grid grid-cols-6 gap-2">
                  {(["indigo", "red", "emerald", "amber", "purple", "cyan"] as const).map((color) => {
                    const colorDetails = colorMap[color];
                    return (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setCalColor(color)}
                        className={`flex h-10 items-center justify-center rounded-xl border transition-all ${
                          calColor === color
                            ? "border-indigo-600 bg-slate-100 ring-2 ring-indigo-600/30 font-bold"
                            : "border-slate-200 bg-white"
                        }`}
                      >
                        <span className={`h-4 w-4 rounded-full ${colorDetails.dot}`} />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Visibility checklist */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">Category Visibility (Roles)</label>
                <div className="flex flex-wrap gap-4 rounded-xl border border-slate-100 bg-slate-50 p-3">
                  {allRoles.map((role) => (
                    <label key={role.id} className="flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-700">
                      <input
                        type="checkbox"
                        checked={calRoles.includes(role.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setCalRoles((prev) => [...prev, role.id]);
                          } else {
                            setCalRoles((prev) => prev.filter((r) => r !== role.id));
                          }
                        }}
                        className="h-4 w-4 rounded-sm border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      {role.label}
                    </label>
                  ))}
                </div>
              </div>

              {/* Form Buttons */}
              <div className="flex justify-end gap-3 border-t border-slate-100 pt-4 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsCalendarModalOpen(false);
                    setEditingCalendar(null);
                  }}
                  className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500"
                >
                  Save Category
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}

export default function CalendarPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center p-8 bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
          <p className="text-sm font-semibold text-slate-500">Loading EduJira Calendars...</p>
        </div>
      </div>
    }>
      <CalendarPortal />
    </Suspense>
  );
}
