import { Role } from "@/hooks/useAuthRole";

export type NavItem = { label: string; href: string };

export const ROLE_LABELS: Record<Role, string> = {
  admin: "Admin",
  teacher: "Teacher",
  student: "Student",
  parent: "Parent",
};

export const ROLE_NAV_ITEMS: Record<Role, NavItem[]> = {
  admin: [
    { label: "Manage Students", href: "/admin/students" },
    { label: "Manage Teachers", href: "/admin/teachers" },
    { label: "Manage Classes", href: "/admin/classes" },
    { label: "Leave Requests", href: "/admin/leave-requests" },
    { label: "Attendance", href: "/attendance" },
    { label: "Results", href: "/admin/results" },
    { label: "Routine", href: "/routine" },
    { label: "Notices", href: "/notices" },
    { label: "Messages", href: "/messages" },
    { label: "AI Analytics", href: "/admin/ai-analytics" },
    { label: "School Settings", href: "/admin/settings" },
  ],
  teacher: [
    { label: "Leave Requests", href: "/teacher/leave-requests" },
    { label: "Students", href: "/teacher/students" },
    { label: "Attendance", href: "/attendance" },
    { label: "Results", href: "/teacher/results" },
    { label: "Behavior", href: "/teacher/behavior" },
    { label: "Messages", href: "/messages" },
    { label: "Routine", href: "/routine" },
    { label: "Report Cards", href: "/teacher/report-cards" },
    { label: "AI Insights", href: "/teacher/ai-insights" },
  ],
  student: [
    { label: "Dashboard", href: "/student" },
    { label: "Results", href: "/student/results" },
    { label: "Attendance", href: "/student/attendance" },
    { label: "Messages", href: "/messages" },
    { label: "Routine", href: "/routine" },
    { label: "Notices", href: "/notices" },
    { label: "Skills", href: "/student/skills" },
    { label: "AI Tutor", href: "/student/ai-tutor" },
  ],
  parent: [
    { label: "Child Dashboard", href: "/parent" },
    { label: "Leave Application", href: "/parent/leave" },
    { label: "Leave History", href: "/parent/leave/list" },
    { label: "Attendance", href: "/parent/attendance" },
    { label: "Results", href: "/parent/results" },
    { label: "Messages", href: "/messages" },
    { label: "Notices", href: "/notices" },
    { label: "Report Cards", href: "/parent/report-cards" },
  ],
};