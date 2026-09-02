import { Role } from "@/hooks/useAuthRole";

export type NavItem = {
  label: string;
  href: string;
  icon?: string;
  badge?: string;
};

export const ROLE_LABELS: Record<Role, string> = {
  admin: "Admin",
  teacher: "Teacher",
  student: "Student",
  parent: "Parent",
};

export const ROLE_COLORS: Record<
  Role,
  { bg: string; text: string; border: string; ring: string; lightBg: string }
> = {
  admin: {
    bg: "bg-purple-600",
    text: "text-purple-700",
    border: "border-purple-200",
    ring: "ring-purple-500/20",
    lightBg: "bg-purple-50",
  },
  teacher: {
    bg: "bg-blue-600",
    text: "text-blue-700",
    border: "border-blue-200",
    ring: "ring-blue-500/20",
    lightBg: "bg-blue-50",
  },
  student: {
    bg: "bg-emerald-600",
    text: "text-emerald-700",
    border: "border-emerald-200",
    ring: "ring-emerald-500/20",
    lightBg: "bg-emerald-50",
  },
  parent: {
    bg: "bg-amber-600",
    text: "text-amber-700",
    border: "border-amber-200",
    ring: "ring-amber-500/20",
    lightBg: "bg-amber-50",
  },
};

export const ROLE_NAV_ITEMS: Record<Role, NavItem[]> = {
  admin: [
    { label: "Dashboard Overview", href: "/admin", icon: "dashboard" },
    { label: "Manage Students", href: "/admin/students", icon: "students", badge: "Core" },
    { label: "Manage Teachers", href: "/admin/teachers", icon: "teachers", badge: "Staff" },
    { label: "Manage Admins", href: "/admin/admins", icon: "admins" },
    { label: "Manage Parents", href: "/admin/parents", icon: "parents" },
    { label: "Classes & Subjects", href: "/admin/classes", icon: "classes" },
    { label: "Daily Attendance", href: "/attendance", icon: "attendance" },
    { label: "Class Timetable", href: "/timetable", icon: "timetable" },
    { label: "Academic Calendar", href: "/calendar", icon: "calendar" },
  ],
  teacher: [
    { label: "Teacher Dashboard", href: "/teacher", icon: "dashboard" },
    { label: "Mark Attendance", href: "/attendance", icon: "attendance", badge: "Daily" },
    { label: "My Students", href: "/admin/students", icon: "students" },
    { label: "Classes & Subjects", href: "/admin/classes", icon: "classes" },
    { label: "Class Routine", href: "/timetable", icon: "timetable" },
    { label: "Academic Calendar", href: "/calendar", icon: "calendar" },
  ],
  student: [
    { label: "Student Dashboard", href: "/student", icon: "dashboard" },
    { label: "My Attendance", href: "/student/attendance", icon: "attendance" },
    { label: "My Subjects & Routine", href: "/timetable", icon: "timetable" },
    { label: "Academic Calendar", href: "/calendar", icon: "calendar" },
  ],
  parent: [
    { label: "Parent Dashboard", href: "/parent", icon: "dashboard" },
    { label: "Child Attendance", href: "/parent/attendance", icon: "attendance" },
    { label: "Class Routine", href: "/timetable", icon: "timetable" },
    { label: "School Calendar", href: "/calendar", icon: "calendar" },
  ],
};