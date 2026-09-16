"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { apiGet } from "@/lib/api";
import { useAuthRole } from "./useAuthRole";

export interface LinkedChild {
  studentId: string;
  studentName: string;
  name?: string;
  className?: string;
  section?: string;
  roll?: string | number;
  relationship?: string;
  status?: "pending" | "approved" | "rejected";
}

export interface ParentProfile {
  _id?: string;
  parentId: string;
  name: string;
  email: string;
  phone?: string;
  children: LinkedChild[];
}

export function childDisplayName(child?: LinkedChild | null) {
  if (!child) return "Child";
  return child.studentName || child.name || "Child";
}

export function useParentChildren() {
  const { user, isLoading: authLoading } = useAuthRole();
  const [parent, setParent] = useState<ParentProfile | null>(null);
  const [children, setChildren] = useState<LinkedChild[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const loadedEmailRef = useRef<string | null>(null);
  const userRef = useRef(user);
  userRef.current = user;

  const reload = useCallback(async (opts?: { silent?: boolean }) => {
    const currentUser = userRef.current;
    const email = currentUser?.email;
    if (!email) {
      return;
    }

    const isInitialForEmail = loadedEmailRef.current !== email;
    if (!opts?.silent && isInitialForEmail) {
      setLoading(true);
    }

    try {
      setError(null);
      const res = await apiGet(
        `/api/parents/me?email=${encodeURIComponent(email)}&name=${encodeURIComponent(currentUser?.name || "")}`
      );

      if (res.success && res.data) {
        const profile = res.data as ParentProfile;
        setParent(profile);
        setChildren(Array.isArray(profile.children) ? profile.children : []);
        loadedEmailRef.current = email;
      } else if (isInitialForEmail) {
        setParent(null);
        setChildren([]);
        setError((res.message as string) || "Failed to load parent profile");
      }
    } catch (err) {
      if (isInitialForEmail) {
        setParent(null);
        setChildren([]);
        setError(err instanceof Error ? err.message : "Failed to load parent profile");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (!user?.email) {
      setLoading(false);
      return;
    }
    if (loadedEmailRef.current === user.email) return;
    void reload();
  }, [authLoading, user?.email, reload]);

  const approvedChildren = useMemo(
    () => children.filter((child) => !child.status || child.status === "approved"),
    [children]
  );

  const reloadSilent = useCallback(() => reload({ silent: true }), [reload]);

  return {
    parent,
    children,
    approvedChildren,
    loading: Boolean((authLoading || loading) && !parent),
    error,
    reload: reloadSilent,
  };
}
