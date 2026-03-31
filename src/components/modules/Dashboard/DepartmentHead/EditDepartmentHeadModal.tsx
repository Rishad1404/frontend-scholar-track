// src/components/modules/Dashboard/DepartmentHead/EditDepartmentHeadModal.tsx

"use client";

import { useEffect, useState } from "react";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";

import { updateDepartmentHeadAction } from "@/app/(dashboardLayout)/(adminRoutes)/admin/department-heads-management/_actions";
import type { UpdateDepartmentHeadInput } from "@/zod/departmentHead.validation";
import type { IDepartmentHead } from "@/types/departmentHead";

import AppField from "@/components/shared/form/AppField";
import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  departmentHead: IDepartmentHead | null;
  onSuccess: () => void;
}

export default function EditDepartmentHeadModal({
  open,
  onOpenChange,
  departmentHead,
  onSuccess,
}: Props) {
  const [serverError, setServerError] = useState<string | null>(null);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateDepartmentHeadInput;
    }) => updateDepartmentHeadAction(id, payload),
  });

  const form = useForm({
    defaultValues: {
      name: "",
      phone: "",
      designation: "",
    },
    onSubmit: async ({ value }) => {
      if (!departmentHead) return;

      setServerError(null);

      const cleaned: UpdateDepartmentHeadInput = {
        name: value.name.trim() || undefined,
        phone: value.phone.trim() || undefined,
        designation: value.designation.trim() || undefined,
      };

      try {
        const result = await mutateAsync({
          id: departmentHead.id,
          payload: cleaned,
        });

        if (result.success) {
          toast.success(
            result.message || "Department head updated successfully"
          );
          onOpenChange(false);
          onSuccess();
        } else {
          setServerError(result.message || "Something went wrong");
        }
      } catch (error: unknown) {
        setServerError(
          error instanceof Error ? error.message : "Something went wrong"
        );
      }
    },
  });

  useEffect(() => {
    if (!departmentHead) return;
    form.setFieldValue("name", departmentHead.user.name);
    form.setFieldValue("phone", departmentHead.phone ?? "");
    form.setFieldValue("designation", departmentHead.designation ?? "");
    setServerError(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [departmentHead]);

  if (!departmentHead) return null;

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        onOpenChange(nextOpen);
        if (!nextOpen) {
          form.reset();
          setServerError(null);
        }
      }}
    >
      <DialogContent className="sm:max-w-120">
        <DialogHeader className="pb-2">
          <DialogTitle>Edit Department Head</DialogTitle>
          <DialogDescription>
            Update details for{" "}
            <span className="font-medium text-foreground">
              {departmentHead.user.name}
            </span>{" "}
            —{" "}
            <span className="text-muted-foreground">
              {departmentHead.department.name}
            </span>
          </DialogDescription>
        </DialogHeader>

        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-5 pt-1"
        >
          <div className="space-y-5">
            <form.Field name="name">
              {(field) => (
                <AppField
                  field={field}
                  label="Name"
                  placeholder="Department head name"
                />
              )}
            </form.Field>

            <form.Field name="phone">
              {(field) => (
                <AppField
                  field={field}
                  label="Phone"
                  placeholder="01XXXXXXXXX"
                />
              )}
            </form.Field>

            <form.Field name="designation">
              {(field) => (
                <AppField
                  field={field}
                  label="Designation"
                  placeholder="Professor"
                />
              )}
            </form.Field>
          </div>

          <AnimatePresence mode="wait">
            {serverError && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Alert variant="destructive">
                  <AlertDescription>{serverError}</AlertDescription>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex justify-end pt-1">
            <form.Subscribe
              selector={(s) => [s.canSubmit, s.isSubmitting] as const}
            >
              {([canSubmit, isSubmitting]) => (
                <AppSubmitButton
                  isPending={isSubmitting || isPending}
                  pendingLabel="Saving..."
                  disabled={!canSubmit}
                >
                  Save Changes
                </AppSubmitButton>
              )}
            </form.Subscribe>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}