export type InviteRole = "DEPARTMENT_HEAD" | "COMMITTEE_REVIEWER";

export interface IInvite {
  id: string;
  email: string;
  role: InviteRole;
  token: string;
  used: boolean;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  departmentId: string | null;  // ← Make sure this exists
  department: {
    id: string;
    name: string;
  } | null;
  university: {
    id: string;
    name: string;
  };
  invitedBy: {
    id: string;
    name: string;
    email: string;
  };
}

export interface ICreateInvitePayload {
  email: string;
  role: InviteRole;
  departmentId?: string;
}

export interface IAcceptInvitePayload {
  token: string;
  name: string;
  password: string;
  phone?: string;
}

export interface IDepartment {
  id: string;
  name: string;
  universityId: string;
}