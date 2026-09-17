export enum UserRole {
  ADMIN = "admin",
  TEACHER = "teacher",
  STUDENT = "student",
  PARENT = "parent",
}

export type RoleType = "admin" | "teacher" | "student" | "parent" | "ADMIN" | "TEACHER" | "STUDENT" | "PARENT";

export interface NavItem {
  label: string;
  href: string;
  icon: string;
  badge?: string;
  description?: string;
}

export type RoleNavigationMap = {
  [key in UserRole]: NavItem[];
};
