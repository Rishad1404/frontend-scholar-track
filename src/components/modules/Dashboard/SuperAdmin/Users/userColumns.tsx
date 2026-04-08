// src/app/(dashboardLayout)/(superAdminRoutes)/super-admin/users-management/_components/userColumns.tsx

"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  Building2,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import DateCell from "@/components/shared/cell/DateCell";
import Image from "next/image";
import type { IUser } from "@/types/user";
import {
  USER_ROLE_LABELS,
  USER_ROLE_COLORS,
  USER_STATUS_LABELS,
  USER_STATUS_COLORS,
} from "@/types/user";

// Helper: get university name from any role profile
function getUniversityName(user: IUser): string | null {
  if (user.admin?.university?.name) return user.admin.university.name;
  if (user.student?.university?.name) return user.student.university.name;
  if (user.departmentHead?.university?.name)
    return user.departmentHead.university.name;
  if (user.reviewer?.university?.name) return user.reviewer.university.name;
  return null;
}

export const userColumns: ColumnDef<IUser>[] = [
  {
    accessorKey: "name",
    header: "User",
    enableSorting: true,
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex items-center gap-3 min-w-0 max-w-64">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted/50 text-sm font-bold overflow-hidden border border-border/40">
            {user.image ? (
              <Image
                src={user.image}
                alt={user.name}
                width={36}
                height={36}
                className="h-full w-full object-cover"
              />
            ) : (
              user.name.charAt(0).toUpperCase()
            )}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{user.name}</p>
            <p className="truncate text-xs text-muted-foreground flex items-center gap-1">
              <Mail className="h-3 w-3 shrink-0" />
              {user.email}
            </p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "role",
    header: "Role",
    enableSorting: true,
    cell: ({ row }) => {
      const role = row.original.role;
      const color = USER_ROLE_COLORS[role] ?? "#6b7280";
      return (
        <Badge
          className="text-xs font-bold"
          style={{
            backgroundColor: `${color}15`,
            color,
            border: `1px solid ${color}40`,
          }}
        >
          {USER_ROLE_LABELS[role]}
        </Badge>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    enableSorting: true,
    cell: ({ row }) => {
      const s = row.original.status;
      const color = USER_STATUS_COLORS[s] ?? "#6b7280";
      return (
        <Badge
          className="text-xs font-semibold"
          style={{
            backgroundColor: `${color}15`,
            color,
            border: `1px solid ${color}40`,
          }}
        >
          {USER_STATUS_LABELS[s]}
        </Badge>
      );
    },
  },
  {
    id: "university",
    header: "University",
    enableSorting: false,
    cell: ({ row }) => {
      const uniName = getUniversityName(row.original);
      return uniName ? (
        <span className="text-sm text-muted-foreground flex items-center gap-1.5 truncate max-w-40">
          <Building2 className="h-3.5 w-3.5 shrink-0" />
          {uniName}
        </span>
      ) : (
        <span className="text-sm text-muted-foreground">—</span>
      );
    },
  },
  {
    id: "verified",
    header: "Verified",
    enableSorting: false,
    cell: ({ row }) =>
      row.original.emailVerified ? (
        <CheckCircle2 className="h-4 w-4 text-green-600" />
      ) : (
        <XCircle className="h-4 w-4 text-muted-foreground" />
      ),
  },
  {
    accessorKey: "createdAt",
    header: "Joined",
    enableSorting: true,
    cell: ({ row }) => <DateCell date={row.original.createdAt} />,
  },
];