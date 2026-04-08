// src/types/user.ts

export type UserRole =
  | "SUPER_ADMIN"
  | "UNIVERSITY_ADMIN"
  | "DEPARTMENT_HEAD"
  | "COMMITTEE_REVIEWER"
  | "STUDENT";

export type UserStatus = "ACTIVE" | "DELETED" | "BANNED";

export interface IUser {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  role: UserRole;
  status: UserStatus;
  needPasswordChange: boolean;
  createdAt: string;
  updatedAt: string;
  admin?: {
    id: string;
    universityId: string;
    isOwner: boolean;
    subscriptionStatus: string;
    university: { id: string; name: string };
  } | null;
  student?: {
    id: string;
    universityId: string | null;
    university: { id: string; name: string } | null;
  } | null;
  departmentHead?: {
    id: string;
    universityId: string;
    departmentId: string;
    university: { id: string; name: string };
    department: { id: string; name: string };
  } | null;
  reviewer?: {
    id: string;
    universityId: string;
    university: { id: string; name: string };
  } | null;
}

export interface IUserDetail extends IUser {
  _count?: {
    notifications: number;
    sentInvites: number;
    sessions: number;
  };
}

// ─── Labels & Colors ───

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  SUPER_ADMIN: "Super Admin",
  UNIVERSITY_ADMIN: "University Admin",
  DEPARTMENT_HEAD: "Department Head",
  COMMITTEE_REVIEWER: "Committee Reviewer",
  STUDENT: "Student",
};

export const USER_ROLE_COLORS: Record<UserRole, string> = {
  SUPER_ADMIN: "#dc2626",
  UNIVERSITY_ADMIN: "#4b2875",
  DEPARTMENT_HEAD: "#0097b2",
  COMMITTEE_REVIEWER: "#8b5cf6",
  STUDENT: "#16a34a",
};

export const USER_STATUS_LABELS: Record<UserStatus, string> = {
  ACTIVE: "Active",
  BANNED: "Banned",
  DELETED: "Deleted",
};

export const USER_STATUS_COLORS: Record<UserStatus, string> = {
  ACTIVE: "#16a34a",
  BANNED: "#dc2626",
  DELETED: "#6b7280",
};

export const USER_STATUS_VARIANT: Record<
  UserStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  ACTIVE: "default",
  BANNED: "destructive",
  DELETED: "secondary",
};

// Valid transitions
export const VALID_USER_STATUS_TRANSITIONS: Record<UserStatus, UserStatus[]> = {
  ACTIVE: ["BANNED"],
  BANNED: ["ACTIVE"],
  DELETED: [],
};

export interface IUserListResponse {
  success: boolean;
  message: string;
  data: IUser[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}