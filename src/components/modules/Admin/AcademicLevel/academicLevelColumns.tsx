// src/components/modules/Dashboard/AcademicLevel/academicLevelColumns.tsx

"use client";

import { ColumnDef } from "@tanstack/react-table";
import { IAcademicLevel } from "@/types/academicLevel";
import { Badge } from "@/components/ui/badge";
import DateCell from "@/components/shared/cell/DateCell";

export const academicLevelColumns: ColumnDef<IAcademicLevel>[] = [
  {
    accessorKey: "name",
    header: "Name",
    enableSorting: true,
    cell: ({ row }) => (
      <Badge variant="secondary" className="text-sm font-medium">
        {row.original.name}
      </Badge>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    enableSorting: true,
    cell: ({ row }) => <DateCell date={row.original.createdAt} />,
  },
  {
    accessorKey: "updatedAt",
    header: "Updated",
    enableSorting: true,
    cell: ({ row }) => <DateCell date={row.original.updatedAt} />,
  },
];