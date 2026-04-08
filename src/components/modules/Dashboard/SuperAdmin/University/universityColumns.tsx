// src/app/(dashboardLayout)/(superAdminRoutes)/super-admin/universities-management/_components/universityColumns.tsx

"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Building2, Globe, Users, GraduationCap, Layers } from "lucide-react";
import DateCell from "@/components/shared/cell/DateCell";
import type { IUniversity } from "@/types/university";
import {
  UNIVERSITY_STATUS_LABELS,
  UNIVERSITY_STATUS_COLORS,
} from "@/types/university";
import Image from "next/image";

export const universityColumns: ColumnDef<IUniversity>[] = [
  {
    accessorKey: "name",
    header: "University",
    enableSorting: true,
    cell: ({ row }) => (
      <div className="flex items-center gap-3 min-w-0 max-w-72">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted/50 border border-border/40 overflow-hidden">
          {row.original.logoUrl ? (
            <Image
              src={row.original.logoUrl}
              alt={row.original.name}
              width={40}
              height={40}
              className="h-full w-full object-cover"
            />
          ) : (
            <Building2 className="h-5 w-5 text-muted-foreground" />
          )}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{row.original.name}</p>
          {row.original.website && (
            <p className="truncate text-xs text-muted-foreground flex items-center gap-1">
              <Globe className="h-3 w-3 shrink-0" />
              {row.original.website.replace(/https?:\/\//, "")}
            </p>
          )}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    enableSorting: true,
    cell: ({ row }) => {
      const s = row.original.status;
      const color = UNIVERSITY_STATUS_COLORS[s] ?? "#6b7280";
      return (
        <Badge
          className="text-xs font-bold gap-1"
          style={{
            backgroundColor: `${color}15`,
            color,
            border: `1px solid ${color}40`,
          }}
        >
          {UNIVERSITY_STATUS_LABELS[s]}
        </Badge>
      );
    },
  },
  {
    id: "admins",
    header: "Admins",
    enableSorting: false,
    cell: ({ row }) => (
      <span className="text-sm font-medium flex items-center gap-1.5">
        <Users className="h-3.5 w-3.5 text-muted-foreground" />
        {row.original._count?.admins ?? 0}
      </span>
    ),
  },
  {
    id: "students",
    header: "Students",
    enableSorting: false,
    cell: ({ row }) => (
      <span className="text-sm font-medium flex items-center gap-1.5">
        <GraduationCap className="h-3.5 w-3.5 text-muted-foreground" />
        {row.original._count?.students ?? 0}
      </span>
    ),
  },
  {
    id: "departments",
    header: "Departments",
    enableSorting: false,
    cell: ({ row }) => (
      <span className="text-sm font-medium flex items-center gap-1.5">
        <Layers className="h-3.5 w-3.5 text-muted-foreground" />
        {row.original._count?.departments ?? 0}
      </span>
    ),
  },
  {
    id: "scholarships",
    header: "Scholarships",
    enableSorting: false,
    cell: ({ row }) => (
      <span className="text-sm font-medium">
        {row.original._count?.scholarships ?? 0}
      </span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Registered",
    enableSorting: true,
    cell: ({ row }) => <DateCell date={row.original.createdAt} />,
  },
];