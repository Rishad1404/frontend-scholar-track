"use client";

import { useMutation } from "@tanstack/react-query";
import { AlertTriangle, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { deleteScholarshipAction } from "@/app/(dashboardLayout)/(adminRoutes)/admin/scholarships-management/_actions";
import type { IScholarship } from "@/types/scholarship";

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
  scholarship: IScholarship | null;
  onSuccess: () => void;
}

export default function DeleteScholarshipModal({
  open,
  onOpenChange,
  scholarship,
  onSuccess,
}: Props) {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (id: string) => deleteScholarshipAction(id),
  });

  if (!scholarship) return null;

  const canDelete =
    scholarship.status === "DRAFT" || scholarship.status === "CANCELLED";
  const hasApps = (scholarship._count?.applications ?? 0) > 0;

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    const toastId = toast.loading("Deleting scholarship...");

    try {
      const result = await mutateAsync(scholarship.id);

      if (result.success) {
        toast.success(result.message || "Scholarship deleted", {
          id: toastId,
        });
        onOpenChange(false);
        onSuccess();
      } else {
        toast.error(result.message || "Failed to delete", { id: toastId });
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to delete";
      toast.error(message, { id: toastId });
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Delete Scholarship
          </AlertDialogTitle>
          <AlertDialogDescription>
            {!canDelete ? (
              <>
                Only <strong>Draft</strong> or <strong>Cancelled</strong>{" "}
                scholarships can be deleted. Current status:{" "}
                <strong>{scholarship.status}</strong>.
              </>
            ) : hasApps ? (
              <>
                Cannot delete &ldquo;
                <span className="font-semibold text-foreground">
                  {scholarship.title}
                </span>
                &rdquo; because it has active applications. Cancel or close it
                instead.
              </>
            ) : (
              <>
                Are you sure you want to delete &ldquo;
                <span className="font-semibold text-foreground">
                  {scholarship.title}
                </span>
                &rdquo;? This action cannot be undone.
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isPending || !canDelete || hasApps}
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