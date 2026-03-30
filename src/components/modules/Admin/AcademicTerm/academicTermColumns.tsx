
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { IAcademicTerm } from "@/types/academicTerm";
import { Badge } from "@/components/ui/badge";
import DateCell from "@/components/shared/cell/DateCell";

export const academicTermColumns: ColumnDef<IAcademicTerm>[] = [
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
    enableSorting: false,
    cell: ({ row }) => <DateCell date={row.original.updatedAt} />,
  },
];