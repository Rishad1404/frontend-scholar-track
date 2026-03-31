// src/components/modules/Dashboard/Reviewer/reviewerColumns.tsx

"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import DateCell from "@/components/shared/cell/DateCell";
import UserInfoCell from "@/components/shared/cell/UserInfoCell";
import type { IReviewer, ReviewerUserStatus } from "@/types/reviewer";

const statusClassMap: Record<ReviewerUserStatus, string> = {
  ACTIVE: "bg-emerald-500 hover:bg-emerald-600 text-white",
  BANNED: "bg-amber-500 hover:bg-amber-600 text-white",
  DELETED: "bg-slate-500 hover:bg-slate-600 text-white",
};

export const reviewerColumns: ColumnDef<IReviewer>[] = [
  {
    accessorKey: "user.name",
    header: "Reviewer",
    cell: ({ row }) => (
      <UserInfoCell
        name={row.original.user.name}
        email={row.original.user.email}
        profilePhoto={row.original.user.image || undefined}
      />
    ),
  },
  {
    accessorKey: "university.name",
    header: "University",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {row.original.university?.name ?? "-"}
      </span>
    ),
  },
  {
    accessorKey: "designation",
    header: "Designation",
    cell: ({ row }) => (
      <span className="text-sm">
        {row.original.designation || "-"}
      </span>
    ),
  },
  {
    accessorKey: "expertise",
    header: "Expertise",
    cell: ({ row }) => (
      <span className="text-sm">
        {row.original.expertise || "-"}
      </span>
    ),
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => (
      <span className="text-sm">
        {row.original.phone || "-"}
      </span>
    ),
  },
  {
    accessorKey: "user.status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.user.status;
      return (
        <Badge className={statusClassMap[status]}>
          <span className="text-xs capitalize">{status.toLowerCase()}</span>
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