// src/components/modules/Dashboard/Department/ViewDepartmentDialog.tsx

"use client";

import type { IDepartment } from "@/types/department";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Building2,
  Users,
  GraduationCap,
  BookOpen,
  Calendar,
} from "lucide-react";
import { format } from "date-fns";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  department: IDepartment | null;
}

export default function ViewDepartmentDialog({
  open,
  onOpenChange,
  department,
}: Props) {
  if (!department) return null;

  const heads = department.departmentHeads ?? [];
  const scholarshipCount = department._count?.scholarships ?? 0;
  const studentCount = department._count?.studentAcademicInfos ?? 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            Department Details
          </DialogTitle>
          <DialogDescription>
            Viewing details for &ldquo;{department.name}&rdquo;
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          {/* Basic Info */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Name</span>
              <span className="text-sm font-medium">{department.name}</span>
            </div>

            {department.university && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  University
                </span>
                <span className="text-sm font-medium">
                  {department.university.name}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                Created
              </span>
              <span className="text-sm">
                {format(new Date(department.createdAt), "MMM dd, yyyy")}
              </span>
            </div>
          </div>

          <Separator />

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col items-center rounded-lg border p-3">
              <Users className="h-5 w-5 text-muted-foreground mb-1" />
              <span className="text-lg font-bold">{heads.length}</span>
              <span className="text-xs text-muted-foreground">Dept. Heads</span>
            </div>
            <div className="flex flex-col items-center rounded-lg border p-3">
              <GraduationCap className="h-5 w-5 text-muted-foreground mb-1" />
              <span className="text-lg font-bold">{scholarshipCount}</span>
              <span className="text-xs text-muted-foreground">Scholarships</span>
            </div>
            <div className="flex flex-col items-center rounded-lg border p-3">
              <BookOpen className="h-5 w-5 text-muted-foreground mb-1" />
              <span className="text-lg font-bold">{studentCount}</span>
              <span className="text-xs text-muted-foreground">Students</span>
            </div>
          </div>

          {/* Department Heads */}
          {heads.length > 0 && (
            <>
              <Separator />
              <div className="space-y-3">
                <h4 className="text-sm font-semibold">Department Heads</h4>
                <div className="space-y-2">
                  {heads.map((head) => {
                    const initials = head.user.name
                      .split(" ")
                      .map((p) => p.charAt(0).toUpperCase())
                      .join("")
                      .slice(0, 2);

                    return (
                      <div
                        key={head.id}
                        className="flex items-center gap-3 rounded-lg border p-3"
                      >
                        <Avatar className="h-9 w-9">
                          <AvatarImage
                            src={head.user.image || undefined}
                            alt={head.user.name}
                          />
                          <AvatarFallback className="text-xs">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {head.user.name}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {head.user.email}
                          </p>
                        </div>
                        {head.designation && (
                          <Badge variant="secondary" className="text-xs shrink-0">
                            {head.designation}
                          </Badge>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {heads.length === 0 && (
            <>
              <Separator />
              <p className="text-sm text-muted-foreground text-center py-2">
                No department heads assigned yet.
              </p>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}