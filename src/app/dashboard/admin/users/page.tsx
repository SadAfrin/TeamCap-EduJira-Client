"use client";

import { useState } from "react";
import StudentManagement from "@/app/(dashboard)/admin/students/page";
import TeacherManagement from "@/app/(dashboard)/admin/teachers/page";
import AdminManagement from "@/app/(dashboard)/admin/admins/page";
import ParentManagement from "@/app/(dashboard)/admin/parents/page";

export default function UserManagementMasterPage() {
  const [activeTab, setActiveTab] = useState<"students" | "teachers" | "admins" | "parents">("students");

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Top Header */}
      <div className="border-b border-slate-200/80 pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Institutional User Directory & Management</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Centralized user management portal for Students, Faculty, Administrators, and Guardians.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab("students")}
          className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs sm:text-sm font-bold transition-all ${
            activeTab === "students"
              ? "bg-purple-600 text-white shadow-sm shadow-purple-600/30"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <span>🎓 Students Directory</span>
        </button>

        <button
          onClick={() => setActiveTab("teachers")}
          className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs sm:text-sm font-bold transition-all ${
            activeTab === "teachers"
              ? "bg-blue-600 text-white shadow-sm shadow-blue-600/30"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <span>👨‍🏫 Faculty & Teachers</span>
        </button>

        <button
          onClick={() => setActiveTab("admins")}
          className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs sm:text-sm font-bold transition-all ${
            activeTab === "admins"
              ? "bg-indigo-600 text-white shadow-sm shadow-indigo-600/30"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <span>👑 Administrators</span>
        </button>

        <button
          onClick={() => setActiveTab("parents")}
          className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs sm:text-sm font-bold transition-all ${
            activeTab === "parents"
              ? "bg-amber-600 text-white shadow-sm shadow-amber-600/30"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <span>👨‍👩‍👧 Guardians & Parents</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div>
        {activeTab === "students" && <StudentManagement />}
        {activeTab === "teachers" && <TeacherManagement />}
        {activeTab === "admins" && <AdminManagement />}
        {activeTab === "parents" && <ParentManagement />}
      </div>
    </div>
  );
}
