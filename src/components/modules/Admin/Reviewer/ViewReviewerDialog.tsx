// src/components/modules/Dashboard/Reviewer/ViewReviewerDialog.tsx

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
import type { IReviewer } from "@/types/reviewer";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reviewer: IReviewer | null;
}

export default function ViewReviewerDialog({
  open,
  onOpenChange,
  reviewer,
}: Props) {
  if (!reviewer) return null;

  const initials = reviewer.user.name
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase())
    .join("")
    .slice(0, 2);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-140">
        <DialogHeader>
          <DialogTitle>Reviewer Details</DialogTitle>
          <DialogDescription>
            View full profile information for {reviewer.user.name}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14">
              <AvatarImage
                src={reviewer.user.image || undefined}
                alt={reviewer.user.name}
              />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <p className="text-lg font-semibold">{reviewer.user.name}</p>
              <p className="text-sm text-muted-foreground">{reviewer.user.email}</p>
              <div className="mt-2 flex gap-2">
                <Badge variant="secondary" className="capitalize">
                  {reviewer.user.status.toLowerCase()}
                </Badge>
                {reviewer.user.emailVerified && (
                  <Badge variant="outline">Email verified</Badge>
                )}
              </div>
            </div>
          </div>

          <Separator />

          <div className="grid gap-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">University</span>
              <span className="font-medium">{reviewer.university?.name ?? "-"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Designation</span>
              <span className="font-medium">{reviewer.designation || "-"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Expertise</span>
              <span className="font-medium">{reviewer.expertise || "-"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Phone</span>
              <span className="font-medium">{reviewer.phone || "-"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Created</span>
              <span className="font-medium">
                {format(new Date(reviewer.createdAt), "MMM dd, yyyy")}
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}