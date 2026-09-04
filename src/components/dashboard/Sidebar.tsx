"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useAuthRole } from "@/hooks/useAuthRole";
import { UserRole, RoleType, NavItem } from "@/types/navigation";
import { ROLE_NAVIGATION_CONFIG, ROLE_DETAILS } from "@/config/navigation";

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
    switch (icon) {
      case "overview":
        return (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.75" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
          </svg>
        );
      case "users":
        return (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.75" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
          </svg>
        );
      case "academic":
        return (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.75" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
          </svg>
        );
      case "routine":
        return (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.75" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case "ai-warning":
      case "ai-tutor":
        return (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.75" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
          </svg>
        );
      case "notices":
        return (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.75" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
          </svg>
        );
      case "leaves":
      case "leave-request":
        return (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.75" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
        );
      case "attendance":
        return (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.75" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case "classes":
        return (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.75" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.62 48.62 0 0112 20.904a48.62 48.62 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.636 50.636 0 00-2.658-.813A59.906 59.906 0 0112 3.493a59.903 59.903 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
          </svg>
        );
      case "assignments":
        return (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.75" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
          </svg>
        );
      case "grades":
      case "results":
        return (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.75" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
          </svg>
        );
      case "messages":
        return (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.75" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a.75.75 0 01-.818-.818 5.97 5.97 0 011.057-2.035C4.03 16.556 3 14.398 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
          </svg>
        );
      case "career":
        return (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.75" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
          </svg>
        );
      case "child-progress":
        return (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.75" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
          </svg>
        );
      default:
        return (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.75" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        );
    }
  }

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between">
      <div>
        {/* Workspace Header */}
        <div className="border-b border-slate-200/80 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${roleMeta.color.bg} text-white shadow-sm shadow-indigo-500/20`}>
              <span className="font-bold text-base uppercase">{currentRole.charAt(0)}</span>
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-sm font-bold text-slate-900 tracking-tight truncate">{roleMeta.title}</h2>
              <p className="text-[11px] text-slate-500 truncate">{roleMeta.subtitle}</p>
            </div>
          </div>
        </div>

        {/* User Card */}
        <div className="mx-3 my-3.5 rounded-xl border border-slate-200/90 bg-slate-50/80 p-3">
          <div className="flex items-center gap-3">
            <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full border border-indigo-200 bg-white">
              <Image
                src={user?.image || "/profile.png"}
                width={36}
                height={36}
                alt={user?.name || "User"}
                className="h-full w-full object-cover"
                unoptimized
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-slate-900">{user?.name || "User"}</p>
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
                      : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
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
      <div className="border-t border-slate-200/80 p-3">
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.75" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
          </svg>
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop static sidebar */}
      <aside className="hidden w-68 shrink-0 flex-col border-r border-slate-200/80 bg-white md:flex">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-76 flex-col border-r border-slate-200 bg-white transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div className="flex items-center gap-2 font-bold text-slate-900">
            <span className="text-indigo-600">EduJira</span> {roleMeta.title}
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
            aria-label="Close menu"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.75" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">{sidebarContent}</div>
      </aside>
    </>
  );
}