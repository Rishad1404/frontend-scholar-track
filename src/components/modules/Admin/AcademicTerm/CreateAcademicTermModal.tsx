// src/components/modules/Dashboard/AcademicTerm/CreateAcademicTermModal.tsx

"use client";

import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import { createAcademicTermAction } from "@/app/(dashboardLayout)/(adminRoutes)/admin/academic-terms-management/_actions";
import {
  createAcademicTermSchema,
  type CreateAcademicTermInput,
} from "@/zod/academicTerm.validation";

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

export default function CreateAcademicTermModal({ onSuccess }: Props) {
  const [open, setOpen] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: CreateAcademicTermInput) =>
      createAcademicTermAction(payload),
  });

  const form = useForm({
    defaultValues: { name: "" },
    onSubmit: async ({ value }) => {
      setServerError(null);
      try {
        const result = await mutateAsync(value);

        if (result.success) {
          toast.success(
            result.message || "Academic term created successfully"
          );
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
          Add Term
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Academic Term</DialogTitle>
          <DialogDescription>
            Add a new academic term (e.g. Fall 2025, Spring 2025, Summer).
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
          <form.Field
            name="name"
            validators={{
              onChange: createAcademicTermSchema.shape.name,
            }}
          >
            {(field) => (
              <AppField
                field={field}
                label="Name"
                placeholder="e.g. Fall 2025"
              />
            )}
          </form.Field>

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