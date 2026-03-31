// src/components/modules/Dashboard/Reviewer/EditReviewerModal.tsx

"use client";

import { useEffect, useState } from "react";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";

import { updateReviewerAction } from "@/app/(dashboardLayout)/(adminRoutes)/admin/reviewers-management/_actions";
import type { UpdateReviewerInput } from "@/zod/reviewer.validation";
import type { IReviewer } from "@/types/reviewer";

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
  reviewer: IReviewer | null;
  onSuccess: () => void;
}

export default function EditReviewerModal({
  open,
  onOpenChange,
  reviewer,
  onSuccess,
}: Props) {
  const [serverError, setServerError] = useState<string | null>(null);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateReviewerInput;
    }) => updateReviewerAction(id, payload),
  });

  const form = useForm({
    defaultValues: {
      name: "",
      phone: "",
      designation: "",
      expertise: "",
    },
    onSubmit: async ({ value }) => {
      if (!reviewer) return;

      setServerError(null);

      // Clean empty strings → undefined so backend doesn't receive ""
      const cleaned: UpdateReviewerInput = {
        name: value.name.trim() || undefined,
        phone: value.phone.trim() || undefined,
        designation: value.designation.trim() || undefined,
        expertise: value.expertise.trim() || undefined,
      };

      try {
        const result = await mutateAsync({
          id: reviewer.id,
          payload: cleaned,
        });

        if (result.success) {
          toast.success(
            result.message || "Reviewer updated successfully"
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

  // Sync form values when reviewer changes
  useEffect(() => {
    if (!reviewer) return;
    form.setFieldValue("name", reviewer.user.name);
    form.setFieldValue("phone", reviewer.phone ?? "");
    form.setFieldValue("designation", reviewer.designation ?? "");
    form.setFieldValue("expertise", reviewer.expertise ?? "");
    setServerError(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reviewer]);

  if (!reviewer) return null;

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
      <DialogContent className="sm:max-w-140">
        <DialogHeader className="pb-2">
          <DialogTitle>Edit Reviewer</DialogTitle>
          <DialogDescription>
            Update details for{" "}
            <span className="font-medium text-foreground">
              {reviewer.user.name}
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
          {/* Fields — no onChange validators for optional fields */}
          <div className="grid grid-cols-1 gap-x-4 gap-y-5 sm:grid-cols-2">
            <form.Field name="name">
              {(field) => (
                <AppField
                  field={field}
                  label="Name"
                  placeholder="Reviewer name"
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
                  placeholder="Assistant Professor"
                />
              )}
            </form.Field>

            <form.Field name="expertise">
              {(field) => (
                <AppField
                  field={field}
                  label="Expertise"
                  placeholder="Machine Learning"
                />
              )}
            </form.Field>
          </div>

          {/* Server error */}
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

          {/* Submit only — no cancel button */}
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