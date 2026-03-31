// src/components/modules/Dashboard/DepartmentHead/departmentHeadColumns.tsx

"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import DateCell from "@/components/shared/cell/DateCell";
import UserInfoCell from "@/components/shared/cell/UserInfoCell";
import type { IDepartmentHead, DeptHeadUserStatus } from "@/types/departmentHead";

const statusClassMap: Record<DeptHeadUserStatus, string> = {
  ACTIVE: "bg-emerald-500 hover:bg-emerald-600 text-white",
  BANNED: "bg-amber-500 hover:bg-amber-600 text-white",
  DELETED: "bg-slate-500 hover:bg-slate-600 text-white",
};

export const departmentHeadColumns: ColumnDef<IDepartmentHead>[] = [
  {
    accessorKey: "user.name",
    header: "Department Head",
    cell: ({ row }) => (
      <UserInfoCell
        name={row.original.user.name}
        email={row.original.user.email}
        profilePhoto={row.original.user.image || undefined}
      />
    ),
  },
  {
    accessorKey: "department.name",
    header: "Department",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="text-sm font-medium">
          {row.original.department?.name ?? "-"}
        </span>
        {row.original.university && (
          <span className="text-xs text-muted-foreground">
            {row.original.university.name}
          </span>
        )}
      </div>
    ),
  },
  {
    accessorKey: "designation",
    header: "Designation",
    cell: ({ row }) => (
      <span className="text-sm">{row.original.designation || "-"}</span>
    ),
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => (
      <span className="text-sm">{row.original.phone || "-"}</span>
    ),
  },
  {
    accessorKey: "user.status",
    header: "Status",
    cell: ({ row }) => {
      const userStatus = row.original.user.status;
      return (
        <Badge className={statusClassMap[userStatus]}>
          <span className="text-xs capitalize">
            {userStatus.toLowerCase()}
          </span>
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => <DateCell date={row.original.createdAt} />,
  },
];