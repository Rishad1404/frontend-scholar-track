"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import DateCell from "@/components/shared/cell/DateCell";
import {
  IScholarship,
  SCHOLARSHIP_STATUS_LABELS,
  SCHOLARSHIP_STATUS_VARIANT,
} from "@/types/scholarship";
import { format } from "date-fns";

export const scholarshipColumns: ColumnDef<IScholarship>[] = [
  {
    accessorKey: "title",
    header: "Title",
    enableSorting: true,
    cell: ({ row }) => (
      <div className="min-w-0 max-w-62.5">
        <p className="truncate text-sm font-medium">{row.original.title}</p>
        {row.original.department && (
          <p className="truncate text-xs text-muted-foreground">
            {row.original.department.name}
          </p>
        )}
      </div>
    ),
  },
  {
    id: "status",
    accessorKey: "status",
    header: "Status",
    enableSorting: true,
    cell: ({ row }) => {
      const s = row.original.status;
      return (
        <Badge variant={SCHOLARSHIP_STATUS_VARIANT[s]}>
          {SCHOLARSHIP_STATUS_LABELS[s]}
        </Badge>
      );
    },
  },
  {
    id: "amountPerStudent",
    header: "Per Student",
    enableSorting: true,
    accessorKey: "amountPerStudent",
    cell: ({ row }) => (
      <span className="text-sm font-medium">
        ৳{row.original.amountPerStudent.toLocaleString()}
      </span>
    ),
  },
  {
    id: "quota",
    header: "Quota",
    enableSorting: true,
    accessorKey: "quota",
    cell: ({ row }) => {
      const appCount = row.original._count?.applications ?? 0;
      return (
        <div className="text-sm">
          <span className="font-medium">{appCount}</span>
          <span className="text-muted-foreground">
            {" "}
            / {row.original.quota}
          </span>
        </div>
      );
    },
  },
  {
    id: "level",
    header: "Level",
    enableSorting: false,
    cell: ({ row }) =>
      row.original.level?.name ?? (
        <span className="text-muted-foreground">All</span>
      ),
  },
  {
    id: "deadline",
    header: "Deadline",
    enableSorting: true,
    accessorKey: "deadline",
    cell: ({ row }) => {
      const deadline = new Date(row.original.deadline);
      const isPast = deadline < new Date();
      return (
        <span
          className={`text-sm ${isPast ? "text-destructive" : "text-muted-foreground"}`}
        >
          {format(deadline, "MMM dd, yyyy")}
        </span>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    enableSorting: true,
    cell: ({ row }) => <DateCell date={row.original.createdAt} />,
  },
];