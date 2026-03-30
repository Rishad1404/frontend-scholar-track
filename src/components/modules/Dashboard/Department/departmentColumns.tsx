// src/components/modules/Dashboard/Department/departmentColumns.tsx

"use client";

import { ColumnDef } from "@tanstack/react-table";
import { IDepartment } from "@/types/department";
import { Badge } from "@/components/ui/badge";
import DateCell from "@/components/shared/cell/DateCell";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const departmentColumns: ColumnDef<IDepartment>[] = [
  {
    accessorKey: "name",
    header: "Department Name",
    enableSorting: true,
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium text-sm">{row.original.name}</span>
      </div>
    ),
  },
  {
    accessorKey: "departmentHeads",
    header: "Dept. Heads",
    enableSorting: false,
    cell: ({ row }) => {
      const heads = row.original.departmentHeads;
      const headCount = row.original._count?.departmentHeads ?? 0;

      // If departmentHeads array is available (admin view)
      if (heads && heads.length > 0) {
        return (
          <div className="flex flex-col gap-1.5">
            {heads.slice(0, 2).map((head) => {
              const initials = head.user.name
                .split(" ")
                .map((p) => p.charAt(0).toUpperCase())
                .join("")
                .slice(0, 2);

              return (
                <div key={head.id} className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage
                      src={head.user.image || undefined}
                      alt={head.user.name}
                    />
                    <AvatarFallback className="text-[10px]">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{head.user.name}</span>
                </div>
              );
            })}
            {heads.length > 2 && (
              <span className="text-xs text-muted-foreground pl-8">
                +{heads.length - 2} more
              </span>
            )}
          </div>
        );
      }

      // Fallback to count if array not available
      if (headCount > 0) {
        return (
          <Badge variant="secondary" className="text-xs">
            {headCount} assigned
          </Badge>
        );
      }

      return (
        <span className="text-sm text-muted-foreground">
          No heads assigned
        </span>
      );
    },
  },
  {
    id: "scholarshipsCount",
    accessorFn: (row) => row._count?.scholarships ?? 0,
    header: "Scholarships",
    enableSorting: false,
    cell: ({ row }) => (
      <Badge variant="secondary" className="text-xs">
        {row.original._count?.scholarships ?? 0}
      </Badge>
    ),
  },
  {
    id: "studentsCount",
    accessorFn: (row) => row._count?.studentAcademicInfos ?? 0,
    header: "Students",
    enableSorting: false,
    cell: ({ row }) => (
      <Badge variant="outline" className="text-xs">
        {row.original._count?.studentAcademicInfos ?? 0}
      </Badge>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    enableSorting: true,
    cell: ({ row }) => <DateCell date={row.original.createdAt} />,
  },
];