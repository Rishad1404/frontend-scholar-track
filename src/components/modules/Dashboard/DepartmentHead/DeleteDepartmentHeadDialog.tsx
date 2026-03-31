// src/components/modules/Dashboard/DepartmentHead/DeleteDepartmentHeadDialog.tsx

"use client";

import { useMutation } from "@tanstack/react-query";
import { AlertTriangle, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { deleteDepartmentHeadAction } from "@/app/(dashboardLayout)/(adminRoutes)/admin/department-heads-management/_actions";
import type { IDepartmentHead } from "@/types/departmentHead";

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
  departmentHead: IDepartmentHead | null;
  onSuccess: () => void;
}

export default function DeleteDepartmentHeadDialog({
  open,
  onOpenChange,
  departmentHead,
  onSuccess,
}: Props) {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (id: string) => deleteDepartmentHeadAction(id),
  });

  if (!departmentHead) return null;

  const handleDelete = async () => {
    try {
      const result = await mutateAsync(departmentHead.id);

      if (result.success) {
        toast.success(result.message || "Department head removed");
        onOpenChange(false);
        onSuccess();
      } else {
        toast.error(result.message || "Failed to remove");
      }
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : "Failed to remove"
      );
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Remove Department Head
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to remove{" "}
            <span className="font-semibold text-foreground">
              &ldquo;{departmentHead.user.name}&rdquo;
            </span>{" "}
            as head of{" "}
            <span className="font-semibold text-foreground">
              {departmentHead.department.name}
            </span>
            ? This will soft-delete their account and end all active sessions.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Remove
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}