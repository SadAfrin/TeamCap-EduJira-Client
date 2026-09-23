"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  Bot,
  CalendarDays,
  ChartColumn,
  CircleUser,
  ClipboardCheck,
  FileText,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Megaphone,
  MessageSquare,
  NotebookPen,
  School,
  Timer,
  TrendingUp,
  TriangleAlert,
  Trophy,
  Users,
  X,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useAuthRole } from "@/hooks/useAuthRole";
import { UserRole, RoleType, NavItem } from "@/types/navigation";
import { ROLE_NAVIGATION_CONFIG, ROLE_DETAILS } from "@/config/navigation";
import UserAvatar from "@/components/common/UserAvatar";

const NAV_ICONS: Record<string, LucideIcon> = {
  overview: LayoutDashboard,
  users: Users,
  academic: GraduationCap,
  routine: CalendarDays,
  "ai-warning": TriangleAlert,
  "ai-tutor": Bot,
  notices: Megaphone,
  leaves: FileText,
  "leave-request": FileText,
  attendance: ClipboardCheck,
  classes: School,
  assignments: NotebookPen,
  grades: ChartColumn,
  results: Trophy,
  messages: MessageSquare,
  career: TrendingUp,
  "child-progress": TrendingUp,
  profile: CircleUser,
  "focus-room": Timer,
};

type SidebarProps = {
  role?: RoleType;
  isOpen?: boolean;
  onClose?: () => void;
};

export default function Sidebar({ role: propRole, isOpen, onClose }: SidebarProps) {
  const { role: authRole, user } = useAuthRole();
  const pathname = usePathname();
  const router = useRouter();

  // Normalize role to lowercase enum value
  const rawRole = (propRole || authRole || "student").toString().toLowerCase() as UserRole;
  const currentRole: UserRole = Object.values(UserRole).includes(rawRole) ? rawRole : UserRole.STUDENT;

  const roleMeta = ROLE_DETAILS[currentRole] || ROLE_DETAILS[UserRole.STUDENT];
  const navItems: NavItem[] = ROLE_NAVIGATION_CONFIG[currentRole] || [];

  async function handleSignOut() {
    await authClient.signOut();
    router.push("/login");
    router.refresh();
  }

  function renderIcon(icon: string) {
    const Icon = NAV_ICONS[icon] ?? ArrowRight;
    return <Icon className="h-5 w-5" strokeWidth={1.75} />;
  }

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between">
      <div>
        {/* Workspace Header */}
        <div className="border-b border-slate-200/80 px-6 py-5 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${roleMeta.color.bg} text-white shadow-sm shadow-indigo-500/20`}>
              <span className="font-bold text-base uppercase">{currentRole.charAt(0)}</span>
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-sm font-bold text-slate-900 tracking-tight truncate dark:text-slate-100">{roleMeta.title}</h2>
              <p className="text-[11px] text-slate-500 truncate">{roleMeta.subtitle}</p>
            </div>
          </div>
        </div>

        {/* User Card */}
        <div className="mx-3 my-3.5 rounded-xl border border-slate-200/90 bg-slate-50/80 p-3 dark:border-slate-800 dark:bg-slate-900/80">
          <div className="flex items-center gap-3">
            <UserAvatar
              src={user?.image}
              name={user?.name}
              role={currentRole}
              size={36}
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-slate-900 dark:text-slate-100">{user?.name || "User"}</p>
              <div className="mt-0.5 flex items-center gap-1.5">
                <span className={`inline-block rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${roleMeta.color.lightBg} ${roleMeta.color.text} border ${roleMeta.color.border}`}>
                  {currentRole}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="px-3 pt-2">
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Navigation Menu</p>
          <nav className="mt-2 space-y-1">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`group flex items-center justify-between rounded-xl px-3.5 py-2 text-xs sm:text-sm font-semibold transition-all ${
                    active
                      ? `${roleMeta.color.lightBg} ${roleMeta.color.text} shadow-xs border ${roleMeta.color.border}`
                      : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={active ? roleMeta.color.text : "text-slate-400 group-hover:text-slate-700"}>
                      {renderIcon(item.icon)}
                    </span>
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold shrink-0 ${active ? "bg-white text-indigo-700" : "bg-slate-200/70 text-slate-600"}`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer / Sign Out */}
      <div className="border-t border-slate-200/80 p-3 dark:border-slate-800">
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
        >
          <LogOut className="h-5 w-5" strokeWidth={1.75} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop static sidebar */}
      <aside className="hidden w-68 shrink-0 flex-col border-r border-slate-200/80 bg-white md:flex print:hidden dark:border-slate-800 dark:bg-slate-950">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs md:hidden print:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-76 flex-col border-r border-slate-200 bg-white transition-transform duration-300 ease-in-out md:hidden print:hidden dark:border-slate-800 dark:bg-slate-950 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">
          <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-slate-100">
            <span className="text-indigo-600">EduJira</span> {roleMeta.title}
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" strokeWidth={1.75} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">{sidebarContent}</div>
      </aside>
    </>
  );
}