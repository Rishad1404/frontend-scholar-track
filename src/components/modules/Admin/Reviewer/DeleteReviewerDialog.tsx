// src/components/modules/Dashboard/Reviewer/DeleteReviewerDialog.tsx

"use client";

import { useMutation } from "@tanstack/react-query";
import { AlertTriangle, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { deleteReviewerAction } from "@/app/(dashboardLayout)/(adminRoutes)/admin/reviewers-management/_actions";
import type { IReviewer } from "@/types/reviewer";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reviewer: IReviewer | null;
  onSuccess: () => void;
}

export default function DeleteReviewerDialog({
  open,
  onOpenChange,
  reviewer,
  onSuccess,
}: Props) {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (id: string) => deleteReviewerAction(id),
  });

  if (!reviewer) return null;

  const handleDelete = async () => {
    try {
      const result = await mutateAsync(reviewer.id);

      if (result.success) {
        toast.success(result.message || "Reviewer deleted successfully");
        onOpenChange(false);
        onSuccess();
      } else {
        toast.error(result.message || "Failed to delete reviewer");
      }
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to delete reviewer");
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Delete Reviewer
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-semibold text-foreground">
              &ldquo;{reviewer.user.name}&rdquo;
            </span>
            ? This will soft-delete the reviewer, their user account, and sessions.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}