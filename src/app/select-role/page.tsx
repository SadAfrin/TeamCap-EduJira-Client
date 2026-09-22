"use client";

import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { FiBookOpen, FiMonitor, FiUsers, FiLoader } from "react-icons/fi";

export default function SelectRolePage() {
  const [isUpdating, setIsUpdating] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  const handleRoleSelection = async (
    selectedRole: "student" | "teacher" | "parent",
  ) => {
    setIsUpdating(true);
    setSelected(selectedRole);

    // 1. Update the database
    const { error } = await authClient.updateUser({
      role: selectedRole,
    });

    if (!error) {
      await authClient.getSession();

      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.href = `/dashboard/${selectedRole}`;
    } else {
      console.error("Failed to update role:", error);
      setIsUpdating(false);
      setSelected(null);
    }
  };

  return (
    <main className="min-h-[70vh] flex items-center justify-center p-4 bg-gray-50/50">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Welcome to EduJira!
          </h1>
          <p className="text-lg text-gray-500">
            To customize your dashboard, please tell us how you&apos;ll be using
            the platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* STUDENT BUTTON */}
          <button
            type="button" // <--- ADD THIS CRITICAL FIX
            onClick={() => handleRoleSelection("student")}
            disabled={isUpdating}
            className="group relative flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-gray-100 bg-white hover:border-indigo-600 hover:bg-indigo-50/50 transition-all duration-200 text-left disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="h-16 w-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200">
              <FiBookOpen size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Student</h3>
            <p className="text-sm text-gray-500 text-center">
              Access your classes, assignments, and timetable.
            </p>
            {isUpdating && selected === "student" && (
              <FiLoader className="absolute top-4 right-4 animate-spin text-indigo-600" />
            )}
          </button>

          {/* TEACHER BUTTON */}
          <button
            type="button" // <--- ADD THIS CRITICAL FIX
            onClick={() => handleRoleSelection("teacher")}
            disabled={isUpdating}
            className="group relative flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-gray-100 bg-white hover:border-indigo-600 hover:bg-indigo-50/50 transition-all duration-200 text-left disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="h-16 w-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200">
              <FiMonitor size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Teacher</h3>
            <p className="text-sm text-gray-500 text-center">
              Manage classes, grade assignments, and track attendance.
            </p>
            {isUpdating && selected === "teacher" && (
              <FiLoader className="absolute top-4 right-4 animate-spin text-purple-600" />
            )}
          </button>

          {/* PARENT BUTTON */}
          <button
            type="button" // <--- ADD THIS CRITICAL FIX
            onClick={() => handleRoleSelection("parent")}
            disabled={isUpdating}
            className="group relative flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-gray-100 bg-white hover:border-indigo-600 hover:bg-indigo-50/50 transition-all duration-200 text-left disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="h-16 w-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200">
              <FiUsers size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Parent</h3>
            <p className="text-sm text-gray-500 text-center">
              Monitor academic progress and stay connected.
            </p>
            {isUpdating && selected === "parent" && (
              <FiLoader className="absolute top-4 right-4 animate-spin text-blue-600" />
            )}
          </button>
        </div>
      </div>
    </main>
  );
}
