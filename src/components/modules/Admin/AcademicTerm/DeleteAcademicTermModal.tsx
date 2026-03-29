// src/components/modules/Dashboard/AcademicTerm/DeleteAcademicTermModal.tsx

"use client";

import { useMutation } from "@tanstack/react-query";
import { AlertTriangle, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { deleteAcademicTermAction } from "@/app/(dashboardLayout)/(adminRoutes)/admin/academic-terms-management/_actions";
import type { IAcademicTerm } from "@/types/academicTerm";

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
  term: IAcademicTerm | null;
  onSuccess: () => void;
}

export default function DeleteAcademicTermModal({
  open,
  onOpenChange,
  term,
  onSuccess,
}: Props) {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (id: string) => deleteAcademicTermAction(id),
  });

  if (!term) return null;

  const handleDelete = async () => {
    try {
      const result = await mutateAsync(term.id);

      if (result.success) {
        toast.success(result.message || "Academic term deleted");
        onOpenChange(false);
        onSuccess();
      } else {
        toast.error(result.message || "Failed to delete");
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to delete";
      toast.error(message);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Delete Academic Term
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-semibold text-foreground">
              &ldquo;{term.name}&rdquo;
            </span>
            ? This action cannot be undone. Any student academic records
            linked to this term will lose their association.
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