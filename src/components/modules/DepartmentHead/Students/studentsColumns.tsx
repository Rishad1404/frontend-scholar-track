"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { IStudent, StudentAcademicStatus, STATUS_CONFIG } from "@/types/student";
import { User as UserIcon, GraduationCap, Mail } from "lucide-react";

export const studentColumns: ColumnDef<IStudent>[] = [
  {
    accessorKey: "user.name",
    header: "Student Information",
    cell: ({ row }) => {
      const student = row.original;
      return (
        <div className="flex items-center gap-3 py-1">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 shadow-inner">
            <UserIcon className="h-5 w-5 text-primary" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="truncate text-sm font-bold text-foreground">
              {student.user?.name}
            </span>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Mail className="h-3 w-3" />
              <span className="truncate text-[11px] font-medium">
                {student.user?.email}
              </span>
            </div>
          </div>
        </div>
      );
    },
  },
  {
    id: "studentIdNo",
    header: "Student ID",
    accessorFn: (row) => row.academicInfo?.studentIdNo,
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <GraduationCap className="h-3.5 w-3.5 text-muted-foreground/70" />
        <span className="font-mono text-xs font-bold text-muted-foreground bg-muted/30 px-2 py-0.5 rounded-md">
          {row.original.academicInfo?.studentIdNo || "N/A"}
        </span>
      </div>
    ),
  },
  {
    id: "cgpa",
    header: "Current CGPA",
    accessorFn: (row) => row.academicInfo?.cgpa,
    cell: ({ row }) => {
      const cgpa = row.original.academicInfo?.cgpa;
      return (
        <div className="flex items-center gap-2">
           <span className={`text-sm font-black ${Number(cgpa) < 2.5 ? 'text-rose-500' : 'text-foreground'}`}>
            {cgpa?.toFixed(2) || "0.00"}
          </span>
          <div className="h-1.5 w-16 bg-muted rounded-full overflow-hidden hidden sm:block">
            <div 
              className="h-full bg-primary/60" 
              style={{ width: `${(Number(cgpa) / 4) * 100}%` }}
            />
          </div>
        </div>
      );
    },
  },
  {
    id: "status",
    header: "Academic Status",
    accessorFn: (row) => row.academicInfo?.academicStatus,
    cell: ({ row }) => {
      const status = (row.original.academicInfo?.academicStatus || "REGULAR") as StudentAcademicStatus;
      const config = STATUS_CONFIG[status] || STATUS_CONFIG.REGULAR;
      
      return (
        <Badge 
          className="font-bold text-[10px] uppercase tracking-wider shadow-sm px-2.5 py-0.5"
          style={{ 
            backgroundColor: config.bg, 
            color: config.color, 
            border: `1px solid ${config.border}` 
          }}
        >
          {config.label}
        </Badge>
      );
    },
  },
  // NOTE: "actions" column removed. 
  // It is injected automatically by <DataTable actions={tableActions} />
];