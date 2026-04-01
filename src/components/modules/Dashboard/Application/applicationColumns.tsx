"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import DateCell from "@/components/shared/cell/DateCell";
import {
  IApplication,
  APPLICATION_STATUS_LABELS,
  APPLICATION_STATUS_VARIANT,
} from "@/types/application";
import { Bot } from "lucide-react";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export const applicationColumns: ColumnDef<IApplication>[] = [
  {
    id: "student",
    header: "Student",
    enableSorting: false,
    cell: ({ row }) => {
      const user = row.original.student.user;
      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src={user.image || ""} alt={user.name} />
            <AvatarFallback className="text-xs">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate font-medium">{user.name}</p>
            <p className="truncate text-sm text-muted-foreground">
              {user.email}
            </p>
          </div>
        </div>
      );
    },
  },
  {
    id: "scholarship",
    header: "Scholarship",
    enableSorting: false,
    cell: ({ row }) => {
      const s = row.original.scholarship;
      return (
        <div className="min-w-0 max-w-50">
          <p className="truncate text-sm font-medium">{s.title}</p>
          {s.department && (
            <p className="truncate text-xs text-muted-foreground">
              {s.department.name}
            </p>
          )}
        </div>
      );
    },
  },
  {
    id: "status",
    accessorKey: "status",
    header: "Status",
    enableSorting: true,
    cell: ({ row }) => {
      const s = row.original.status;
      return (
        <Badge variant={APPLICATION_STATUS_VARIANT[s]}>
          {APPLICATION_STATUS_LABELS[s]}
        </Badge>
      );
    },
  },
  {
    id: "aiScore",
    header: "AI Score",
    enableSorting: false,
    cell: ({ row }) => {
      const score = row.original.aiScore;
      const eligible = row.original.aiEligible;

      if (score === null || score === undefined) {
        return (
          <span className="text-xs text-muted-foreground italic">
            Not evaluated
          </span>
        );
      }

      return (
        <div className="flex items-center gap-1.5">
          <Bot className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-sm font-medium">{score.toFixed(0)}</span>
          <span className="text-xs text-muted-foreground">/100</span>
          {eligible !== null && (
            <span className="text-xs">
              {eligible ? "✅" : "❌"}
            </span>
          )}
        </div>
      );
    },
  },
  {
    id: "amount",
    header: "Amount",
    enableSorting: false,
    cell: ({ row }) => (
      <span className="text-sm font-medium">
        ৳{row.original.scholarship.amountPerStudent.toLocaleString()}
      </span>
    ),
  },
  {
    id: "submittedAt",
    header: "Submitted",
    enableSorting: true,
    accessorKey: "submittedAt",
    cell: ({ row }) =>
      row.original.submittedAt ? (
        <DateCell date={row.original.submittedAt} />
      ) : (
        <span className="text-muted-foreground">—</span>
      ),
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    enableSorting: true,
    cell: ({ row }) => <DateCell date={row.original.createdAt} />,
  },
];