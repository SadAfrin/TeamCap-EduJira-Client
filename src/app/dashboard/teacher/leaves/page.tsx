"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function TeacherLeavesRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/teacher/leave-requests");
  }, [router]);
  return (
    <div className="flex min-h-[40vh] items-center justify-center text-sm text-slate-500">
      Redirecting to leave requests...
    </div>
  );
}
