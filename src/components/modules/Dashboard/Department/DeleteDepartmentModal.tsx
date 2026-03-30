// src/components/modules/Dashboard/Department/DeleteDepartmentModal.tsx

"use client";

import { useMutation } from "@tanstack/react-query";
import { AlertTriangle, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { deleteDepartmentAction } from "@/app/(dashboardLayout)/(adminRoutes)/admin/departments-management/_actions";
import type { IDepartment } from "@/types/department";

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
  department: IDepartment | null;
  onSuccess: () => void;
}

export default function DeleteDepartmentModal({
  open,
  onOpenChange,
  department,
  onSuccess,
}: Props) {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (id: string) => deleteDepartmentAction(id),
  });

  if (!department) return null;

  const handleDelete = async (e: React.MouseEvent) => {
    // 🚨 Prevent the dialog from auto-closing so we can see the loading spinner
    e.preventDefault();
    
    // 🚨 Start the premium loading toast
    const toastId = toast.loading("Deleting department...");

    try {
      const result = await mutateAsync(department.id);

      if (result.success) {
        // 🚨 Update toast to success
        toast.success(result.message || "Department deleted", { id: toastId });
        onOpenChange(false); // Close dialog manually upon success
        onSuccess();
      } else {
        // 🚨 Update toast to error
        toast.error(result.message || "Failed to delete", { id: toastId });
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to delete";
      // 🚨 Update toast to error
      toast.error(message, { id: toastId });
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Delete Department
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-semibold text-foreground">
              &ldquo;{department.name}&rdquo;
            </span>
            ? This action cannot be undone. Departments with active department
            heads cannot be deleted.
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