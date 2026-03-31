// src/components/modules/Dashboard/DepartmentHead/ViewDepartmentHeadDialog.tsx

"use client";

import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import type { IDepartmentHead } from "@/types/departmentHead";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  departmentHead: IDepartmentHead | null;
}

export default function ViewDepartmentHeadDialog({
  open,
  onOpenChange,
  departmentHead,
}: Props) {
  if (!departmentHead) return null;

  const initials = departmentHead.user.name
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase())
    .join("")
    .slice(0, 2);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-140">
        <DialogHeader>
          <DialogTitle>Department Head Details</DialogTitle>
          <DialogDescription>
            View full profile for {departmentHead.user.name}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          {/* Profile header */}
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14">
              <AvatarImage
                src={departmentHead.user.image || undefined}
                alt={departmentHead.user.name}
              />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <p className="text-lg font-semibold">
                {departmentHead.user.name}
              </p>
              <p className="text-sm text-muted-foreground">
                {departmentHead.user.email}
              </p>
              <div className="mt-2 flex gap-2">
                <Badge variant="secondary" className="capitalize">
                  {departmentHead.user.status.toLowerCase()}
                </Badge>
              </div>
            </div>
          </div>

          <Separator />

          {/* Details */}
          <div className="grid gap-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Department</span>
              <span className="font-medium">
                {departmentHead.department?.name ?? "-"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">University</span>
              <span className="font-medium">
                {departmentHead.university?.name ?? "-"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Designation</span>
              <span className="font-medium">
                {departmentHead.designation || "-"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Phone</span>
              <span className="font-medium">
                {departmentHead.phone || "-"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Created</span>
              <span className="font-medium">
                {format(new Date(departmentHead.createdAt), "MMM dd, yyyy")}
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}