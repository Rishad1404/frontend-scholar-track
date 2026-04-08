// src/app/(dashboardLayout)/(superAdminRoutes)/super-admin/universities-management/_components/DeleteUniversityModal.tsx

"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { Trash2, AlertTriangle, Building2 } from "lucide-react";

import type { IUniversity } from "@/types/university";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { deleteUniversityAction } from "@/app/(dashboardLayout)/(superAdminRoutes)/super-admin/universities-management/_actions";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  university: IUniversity | null;
  onSuccess: () => void;
}

export default function DeleteUniversityModal({
  open,
  onOpenChange,
  university,
  onSuccess,
}: Props) {
  const [serverError, setServerError] = useState<string | null>(null);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: () => deleteUniversityAction(university!.id),
  });

  const handleDelete = async () => {
    if (!university) return;
    setServerError(null);
    const toastId = toast.loading("Deleting university...");

    try {
      const result = await mutateAsync();
      if (result.success) {
        toast.success(result.message, { id: toastId });
        onOpenChange(false);
        onSuccess();
      } else {
        setServerError(result.message);
        toast.error(result.message, { id: toastId });
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Something went wrong";
      setServerError(message);
      toast.error(message, { id: toastId });
    }
  };

  if (!university) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm p-0 overflow-hidden rounded-2xl border-border/40 bg-background/95 backdrop-blur-xl shadow-2xl">
        <VisuallyHidden>
          <DialogTitle>Delete {university.name}</DialogTitle>
        </VisuallyHidden>

        {/* Header */}
        <div className="px-5 pt-5 pb-3 border-b border-border/40 bg-muted/10">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-destructive/10 border border-destructive/20">
              <Trash2 className="h-4.5 w-4.5 text-destructive" />
            </div>
            <div>
              <h2 className="text-base font-extrabold tracking-tight text-foreground">
                Delete University
              </h2>
              <p className="text-xs font-medium text-muted-foreground">
                This action cannot be undone.
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="px-5 py-4 space-y-3">
          {/* University Info */}
          <div className="flex items-center gap-3 rounded-xl border border-border/50 bg-muted/10 p-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted/50">
              <Building2 className="h-4.5 w-4.5 text-muted-foreground" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold truncate">{university.name}</p>
              <p className="text-[11px] text-muted-foreground">
                {university._count?.admins ?? 0} admins ·{" "}
                {university._count?.students ?? 0} students ·{" "}
                {university._count?.departments ?? 0} depts
              </p>
            </div>
          </div>

          {/* Warning */}
          <Alert className="border-amber-500/30 bg-amber-500/10 rounded-lg py-2.5">
            <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
            <AlertDescription className="text-amber-700 dark:text-amber-400 font-semibold ml-1.5 text-xs leading-relaxed">
              All associated data must be removed first. The backend will reject
              deletion if active records exist.
            </AlertDescription>
          </Alert>

          {/* Server Error */}
          <AnimatePresence mode="wait">
            {serverError && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <Alert
                  variant="destructive"
                  className="border-rose-500/30 bg-rose-500/10 text-rose-600 rounded-lg py-2.5"
                >
                  <AlertDescription className="font-semibold ml-1.5 text-xs">
                    {serverError}
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="border-t border-border/40 bg-muted/10 px-5 py-3.5 flex items-center justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="rounded-lg font-bold"
          >
            Cancel
          </Button>
          <Button
            size="sm"
            disabled={isPending}
            onClick={handleDelete}
            className="rounded-lg font-bold bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-md"
          >
            {isPending ? (
              <>
                <span className="mr-1.5 h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                Delete
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}