// src/components/modules/Dashboard/AcademicLevel/CreateAcademicLevelModal.tsx

"use client";

import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import { createAcademicLevelAction } from "@/app/(dashboardLayout)/(adminRoutes)/admin/academic-levels-management/_actions";
import {
  createAcademicLevelSchema,
  type CreateAcademicLevelInput,
} from "@/zod/academicLevel.validation";

import AppField from "@/components/shared/form/AppField";
import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Props {
  onSuccess: () => void;
}

export default function CreateAcademicLevelModal({ onSuccess }: Props) {
  const [open, setOpen] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: CreateAcademicLevelInput) =>
      createAcademicLevelAction(payload),
  });

  const form = useForm({
    defaultValues: { name: "" },
    onSubmit: async ({ value }) => {
      setServerError(null);
      try {
        const result = await mutateAsync(value);

        if (result.success) {
          toast.success(result.message || "Academic level created successfully");
          form.reset();
          setOpen(false);
          onSuccess();
        } else {
          setServerError(result.message || "Something went wrong");
        }
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : "Something went wrong";
        setServerError(message);
      }
    },
  });

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      form.reset();
      setServerError(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Level
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Academic Level</DialogTitle>
          <DialogDescription>
            Add a new academic level (e.g. Undergraduate, Graduate, Diploma).
            Name must be 5–20 characters.
          </DialogDescription>
        </DialogHeader>

        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          {/* Name field */}
          <form.Field
            name="name"
            validators={{
              onChange: createAcademicLevelSchema.shape.name,
            }}
          >
            {(field) => (
              <AppField
                field={field}
                label="Name"
                placeholder="e.g. Undergraduate"
              />
            )}
          </form.Field>

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

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>

            <form.Subscribe
              selector={(s) => [s.canSubmit, s.isSubmitting] as const}
            >
              {([canSubmit, isSubmitting]) => (
                <AppSubmitButton
                  isPending={isSubmitting || isPending}
                  pendingLabel="Creating..."
                  disabled={!canSubmit}
                >
                  Create
                </AppSubmitButton>
              )}
            </form.Subscribe>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}