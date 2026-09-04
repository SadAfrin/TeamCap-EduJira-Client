import { UserRole, NavItem, RoleNavigationMap } from "@/types/navigation";

export const ROLE_NAVIGATION_CONFIG: RoleNavigationMap = {
  [UserRole.ADMIN]: [
    {
      label: "Dashboard Overview",
      href: "/dashboard/admin",
      icon: "overview",
      description: "Analytics, stats, and system health overview",
    },
    {
      label: "User Management",
      href: "/dashboard/admin/users",
      icon: "users",
      badge: "Core",
      description: "CRUD for Admins, Teachers, Students, Parents",
    },
    {
      label: "Academic Setup",
      href: "/dashboard/admin/academic",
      icon: "academic",
      description: "Classes, Sections, Subjects, Teacher Assignments",
    },
    {
      label: "Routine Manager",
      href: "/dashboard/admin/routine",
      icon: "routine",
      description: "Automated Resource & Timetable Allocation",
    },
    {
      label: "AI Early Warning",
      href: "/dashboard/admin/ai-warning",
      icon: "ai-warning",
      badge: "AI",
      description: "Risk Analytics for student failure/dropout",
    },
    {
      label: "Notice & Announcements",
      href: "/dashboard/admin/notices",
      icon: "notices",
      description: "Publish sitewide or class-specific notices",
    },
    {
      label: "Leave Management",
      href: "/admin/leave-requests",
      icon: "leaves",
      description: "Final approval/rejection of leave requests",
    },
  ],

  [UserRole.TEACHER]: [
    {
      label: "Dashboard Overview",
      href: "/dashboard/teacher",
      icon: "overview",
      description: "Class schedules, quick actions",
    },
    {
      label: "Digital Attendance",
      href: "/dashboard/teacher/attendance",
      icon: "attendance",
      badge: "Daily",
      description: "Mark Present/Absent/Late",
    },
    {
      label: "My Classes & Subjects",
      href: "/dashboard/teacher/classes",
      icon: "classes",
      description: "Assigned subjects and rosters",
    },
    {
      label: "Assignments & Homework",
      href: "/dashboard/teacher/assignments",
      icon: "assignments",
      description: "Create tasks, set deadlines, grade work",
    },
    {
      label: "Marks & Grade Entry",
      href: "/dashboard/teacher/grades",
      icon: "grades",
      badge: "AI Report",
      description: "Enter marks, auto-calculate GPA, AI report card comments",
    },
    {
      label: "Parent Communication",
      href: "/messages",
      icon: "messages",
      description: "Direct messaging with parents",
    },
    {
      label: "Leave Requests",
      href: "/teacher/leave-requests",
      icon: "leaves",
      description: "Review & approve student leave requests",
    },
  ],

  [UserRole.STUDENT]: [
    {
      label: "Dashboard Overview",
      href: "/dashboard/student",
      icon: "overview",
      description: "Personal summary, upcoming tests, attendance rate",
    },
    {
      label: "My Attendance",
      href: "/dashboard/student/attendance",
      icon: "attendance",
      description: "Personal attendance logs and percentages",
    },
    {
      label: "My Subjects & Routine",
      href: "/dashboard/student/routine",
      icon: "routine",
      description: "Daily class timetable and teacher info",
    },
    {
      label: "Assignments & Homework",
      href: "/dashboard/student/assignments",
      icon: "assignments",
      description: "View pending/submitted tasks and submit files",
    },
    {
      label: "Exam Results & Transcripts",
      href: "/dashboard/student/results",
      icon: "results",
      description: "View grades, term GPA, transcripts",
    },
    {
      label: "AI Tutor & Assistant",
      href: "/dashboard/student/ai-tutor",
      icon: "ai-tutor",
      badge: "AI 24/7",
      description: "Interactive AI study/homework helper",
    },
    {
      label: "Career & Skill Tracker",
      href: "/dashboard/student/career-tracker",
      icon: "career",
      badge: "Growth",
      description: "AI-based skill growth and career insights",
    },
  ],

  [UserRole.PARENT]: [
    {
      label: "Dashboard Overview",
      href: "/dashboard/parent",
      icon: "overview",
      description: "Child overview, quick alerts",
    },
    {
      label: "Child Profile & Progress",
      href: "/dashboard/parent/child-progress",
      icon: "child-progress",
      description: "Overall academic performance monitor",
    },
    {
      label: "Attendance Tracker",
      href: "/dashboard/parent/attendance",
      icon: "attendance",
      description: "Child's daily presence/lateness trends",
    },
    {
      label: "Result & Report Cards",
      href: "/dashboard/parent/results",
      icon: "results",
      badge: "AI Insights",
      description: "View child's report cards and AI narrative comments",
    },
    {
      label: "Leave Application",
      href: "/parent/leave",
      icon: "leave-request",
      description: "Apply for child leave with attachment/doctor's note",
    },
    {
      label: "Leave History",
      href: "/parent/leave/list",
      icon: "leaves",
      description: "Track leave request status and comments",
    },
    {
      label: "Multilingual Notices",
      href: "/dashboard/parent/notices",
      icon: "notices",
      badge: "Auto-Translate",
      description: "Read school announcements with auto-translation",
    },
    {
      label: "Teacher Communication",
      href: "/messages",
      icon: "messages",
      description: "Message subject and class teachers",
    },
  ],
};

export const ROLE_DETAILS = {
  [UserRole.ADMIN]: {
    title: "Administrator Portal",
    subtitle: "Institution & System Management",
    color: {
      bg: "bg-purple-600",
      text: "text-purple-700",
      border: "border-purple-200",
      lightBg: "bg-purple-50",
      ring: "ring-purple-500/20",
    },
  },
  [UserRole.TEACHER]: {
    title: "Teacher Workspace",
    subtitle: "Academics & Classroom Operations",
    color: {
      bg: "bg-blue-600",
      text: "text-blue-700",
      border: "border-blue-200",
      lightBg: "bg-blue-50",
      ring: "ring-blue-500/20",
    },
  },
  [UserRole.STUDENT]: {
    title: "Student Portal",
    subtitle: "Academic Journey & Learning Assistant",
    color: {
      bg: "bg-emerald-600",
      text: "text-emerald-700",
      border: "border-emerald-200",
      lightBg: "bg-emerald-50",
      ring: "ring-emerald-500/20",
    },
  },
  [UserRole.PARENT]: {
    title: "Parent & Guardian Portal",
    subtitle: "Student Progress & School Communication",
    color: {
      bg: "bg-amber-600",
      text: "text-amber-700",
      border: "border-amber-200",
      lightBg: "bg-amber-50",
      ring: "ring-amber-500/20",
    },
  },
};
