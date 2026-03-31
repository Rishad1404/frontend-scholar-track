"use client";

import { useMutation } from "@tanstack/react-query";
import { AlertTriangle, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { deleteStudentAction } from "@/app/(dashboardLayout)/(adminRoutes)/admin/students-management/_actions";
import type { IStudent } from "@/types/student";

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
  student: IStudent | null;
  onSuccess: () => void;
}

export default function DeleteStudentModal({
  open,
  onOpenChange,
  student,
  onSuccess,
}: Props) {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (id: string) => deleteStudentAction(id),
  });

  if (!student) return null;

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    const toastId = toast.loading("Deleting student...");

    try {
      const result = await mutateAsync(student.id);

      if (result.success) {
        toast.success(result.message || "Student deleted", { id: toastId });
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
            Delete Student
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-semibold text-foreground">
              &ldquo;{student.name}&rdquo;
            </span>
            ? This action cannot be undone. This will soft-delete their account
            and revoke all active sessions.
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