"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import DateCell from "@/components/shared/cell/DateCell";
import {
  ACADEMIC_STATUS_LABELS,
  ACADEMIC_STATUS_VARIANT,
  USER_STATUS_VARIANT,
  IStudent,
} from "@/types/student";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export const studentColumns: ColumnDef<IStudent>[] = [
  {
    accessorKey: "name",
    header: "Student",
    enableSorting: true,
    cell: ({ row }) => {
      const s = row.original;
      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            {/* 🚨 Added ?. user safely */}
            <AvatarImage src={s.profilePhoto || s.user?.image || ""} alt={s.name} />
            <AvatarFallback className="text-xs">{getInitials(s.name)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate font-medium">{s.name}</p>
            <p className="truncate text-sm text-muted-foreground">{s.email}</p>
          </div>
        </div>
      );
    },
  },
  {
    id: "studentId",
    header: "Student ID",
    enableSorting: false,
    cell: ({ row }) =>
      row.original.academicInfo?.studentIdNo ? (
        <span className="font-mono text-sm">{row.original.academicInfo.studentIdNo}</span>
      ) : (
        <span className="text-muted-foreground">—</span>
      ),
  },
  {
    id: "department",
    header: "Department",
    enableSorting: false,
    cell: ({ row }) =>
      row.original.academicInfo?.department.name ?? (
        <span className="text-muted-foreground">—</span>
      ),
  },
  {
    id: "level",
    header: "Level",
    enableSorting: false,
    cell: ({ row }) =>
      row.original.academicInfo?.level.name ?? (
        <span className="text-muted-foreground">—</span>
      ),
  },
  {
    id: "gpa",
    header: "GPA / CGPA",
    enableSorting: false,
    cell: ({ row }) => {
      const ai = row.original.academicInfo;
      if (!ai) return <span className="text-muted-foreground">—</span>;
      return (
        <span className="text-sm">
          {ai.gpa.toFixed(2)}{" "}
          <span className="text-muted-foreground">/ {ai.cgpa.toFixed(2)}</span>
        </span>
      );
    },
  },
  {
    id: "academicStatus",
    header: "Academic Status",
    enableSorting: true,
    cell: ({ row }) => {
      const status = row.original.academicInfo?.academicStatus;
      if (!status) return <span className="text-muted-foreground">—</span>;
      return (
        <Badge variant={ACADEMIC_STATUS_VARIANT[status]}>
          {ACADEMIC_STATUS_LABELS[status]}
        </Badge>
      );
    },
  },
  {
    id: "accountStatus",
    header: "Account",
    enableSorting: true,
    cell: ({ row }) => {
      // 🚨 Added ?. to prevent crashes if user object is missing from backend
      const us = row.original.user?.status;
      if (!us) return <Badge variant="outline">Unknown</Badge>;

      return <Badge variant={USER_STATUS_VARIANT[us]}>{us}</Badge>;
    },
  },
  {
    accessorKey: "createdAt",
    header: "Joined",
    enableSorting: true,
    cell: ({ row }) => <DateCell date={row.original.createdAt} />,
  },
];
