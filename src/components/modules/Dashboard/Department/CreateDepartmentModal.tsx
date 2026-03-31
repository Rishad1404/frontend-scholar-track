// src/components/modules/Dashboard/Department/CreateDepartmentModal.tsx

"use client";

import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import { createDepartmentAction } from "@/app/(dashboardLayout)/(adminRoutes)/admin/departments-management/_actions";
import {
  createDepartmentSchema,
  type CreateDepartmentInput,
} from "@/zod/department.validation";

import AppField from "@/components/shared/form/AppField";
import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Props {
  onSuccess: () => void;
}

const BRAND_TEAL = "#0097b2";
const BRAND_PURPLE = "#4b2875";

export default function CreateDepartmentModal({ onSuccess }: Props) {
  const [open, setOpen] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: CreateDepartmentInput) =>
      createDepartmentAction(payload),
  });

  const form = useForm({
    defaultValues: { name: "" },
    onSubmit: async ({ value }) => {
      setServerError(null);
      const toastId = toast.loading("Creating department...");

      try {
        const result = await mutateAsync(value);
        if (result.success) {
          toast.success(result.message || "Department created successfully", { id: toastId });
          form.reset();
          setOpen(false);
          onSuccess();
        } else {
          setServerError(result.message || "Something went wrong");
          toast.error(result.message || "Something went wrong", { id: toastId });
        }
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : "Something went wrong";
        setServerError(message);
        toast.error(message, { id: toastId });
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
        <Button className="gap-2 shadow-sm">
          <Plus className="h-4 w-4" />
          Add Department
        </Button>
      </DialogTrigger>

      {/* Premium styling: wider max-width, zero default padding, blur, and custom rounded corners */}
      <DialogContent className="sm:max-w-137.5 p-0 overflow-hidden border-border/50 bg-card/95 backdrop-blur-xl shadow-2xl rounded-3xl">
        
        {/* Header Section */}
        <div className="px-6 pt-8 sm:px-8">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-2xl font-extrabold tracking-tight text-foreground">
              Create Department
            </DialogTitle>
            <DialogDescription className="text-base font-medium text-muted-foreground mt-1.5">
              Add a new department to your university. Name must be 7–255 characters.
            </DialogDescription>
          </DialogHeader>
        </div>

        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="flex flex-col"
        >
          {/* Form Body Section */}
          <div className="px-6 py-6 sm:px-8 space-y-6">
            <form.Field
              name="name"
              validators={{
                onChange: createDepartmentSchema.shape.name,
              }}
            >
              {(field) => (
                <AppField
                  field={field}
                  label="Department Name"
                  placeholder="e.g. Computer Science and Engineering"
                />
              )}
            </form.Field>

            <AnimatePresence mode="wait">
              {serverError && (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: -10 }}
                  animate={{ opacity: 1, height: "auto", y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <Alert variant="destructive" className="border-rose-500/30 bg-rose-500/10 text-rose-600">
                    <AlertDescription className="font-semibold">{serverError}</AlertDescription>
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer Section */}
          <DialogFooter className="border-t border-border/40 bg-muted/10 px-6 py-5 sm:px-8 flex items-center justify-end">
            <form.Subscribe
              selector={(s) => [s.canSubmit, s.isSubmitting] as const}
            >
              {([canSubmit, isSubmitting]) => (
                <AppSubmitButton
                  isPending={isSubmitting || isPending}
                  pendingLabel="Creating..."
                  disabled={!canSubmit}
                  className="h-11 px-8 rounded-xl font-bold text-white shadow-lg transition-all hover:opacity-90 active:scale-95"
                  style={{
                    background: `linear-gradient(135deg, ${BRAND_PURPLE}, ${BRAND_TEAL})`,
                  }}
                >
                  Create Department
                </AppSubmitButton>
              )}
            </form.Subscribe>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}