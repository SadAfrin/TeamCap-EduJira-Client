"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** Redirect stub dashboard page to the real leave UI */
export default function ParentLeaveRequestRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/parent/leave");
  }, [router]);
  return (
    <div className="flex min-h-[40vh] items-center justify-center text-sm text-slate-500">
      Redirecting to leave application...
    </div>
  );
}
