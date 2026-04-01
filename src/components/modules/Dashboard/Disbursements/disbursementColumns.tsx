"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { IDisbursement, DISBURSEMENT_STATUS_LABELS } from "@/types/disbursement";
import { Badge } from "@/components/ui/badge";

export const disbursementColumns: ColumnDef<IDisbursement>[] = [
  {
    accessorKey: "student.user.name",
    header: "Student",
    cell: ({ row }) => (
      <div>
        <p className="font-bold text-foreground">{row.original.student.user.name}</p>
        <p className="text-xs font-medium text-muted-foreground">{row.original.student.user.email}</p>
      </div>
    ),
  },
  {
    accessorKey: "scholarship.title",
    header: "Scholarship",
    cell: ({ row }) => (
      <p className="max-w-50 truncate font-medium" title={row.original.scholarship.title}>
        {row.original.scholarship.title}
      </p>
    ),
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => (
      <span className="font-black text-emerald-600 dark:text-emerald-400">
        ৳{row.original.amount.toLocaleString()}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      const variants: Record<string, string> = {
        PENDING: "border-amber-500/30 bg-amber-500/10 text-amber-600",
        PROCESSING: "border-blue-500/30 bg-blue-500/10 text-blue-600",
        COMPLETED: "border-emerald-500/30 bg-emerald-500/10 text-emerald-600",
        FAILED: "border-rose-500/30 bg-rose-500/10 text-rose-600",
      };
      
      return (
        <Badge variant="outline" className={`px-3 py-1 font-bold ${variants[status]}`}>
          {DISBURSEMENT_STATUS_LABELS[status]}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created Date",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {format(new Date(row.original.createdAt), "MMM dd, yyyy")}
      </span>
    ),
  },
];