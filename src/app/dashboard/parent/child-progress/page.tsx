"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ChildProgressRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard/parent");
  }, [router]);

  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center text-center">
      <div className="h-8 w-8 animate-spin rounded-full border-3 border-amber-600 border-t-transparent" />
      <p className="mt-3 text-xs font-semibold text-slate-500">Redirecting to Parent Dashboard...</p>
    </div>
  );
}
