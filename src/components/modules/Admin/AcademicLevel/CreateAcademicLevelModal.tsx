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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Props {
  onSuccess: () => void;
  children?: React.ReactNode; 
}

const BRAND_TEAL = "#0097b2";
const BRAND_PURPLE = "#4b2875";

export default function CreateAcademicLevelModal({ onSuccess, children }: Props) {
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
      // 🚨 Added: Start the premium loading toast
      const toastId = toast.loading("Creating academic level...");

      try {
        const result = await mutateAsync(value);

        if (result.success) {
          // 🚨 Added: Update toast to success
          toast.success(result.message || "Academic level created successfully", {
            id: toastId,
          });
          form.reset();
          setOpen(false);
          onSuccess();
        } else {
          setServerError(result.message || "Something went wrong");
          // 🚨 Added: Update toast to error
          toast.error(result.message || "Something went wrong", { id: toastId });
        }
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : "Something went wrong";
        setServerError(message);
        // 🚨 Added: Update toast to error
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
        {children ? (
          children
        ) : (
          <Button className="gap-2 shadow-sm">
            <Plus className="h-4 w-4" />
            Add Level
          </Button>
        )}
      </DialogTrigger>

      {/* Increased width to 550px and removed default padding to manage our own layout */}
      <DialogContent className="sm:max-w-137.5 p-0 overflow-hidden border-border/50 bg-card/95 backdrop-blur-xl shadow-2xl rounded-3xl">
        
        <div className="px-6 pt-8 sm:px-8">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-2xl font-extrabold tracking-tight text-foreground">
              Create Academic Level
            </DialogTitle>
            <DialogDescription className="text-base font-medium text-muted-foreground mt-1.5">
              Add a new academic level (e.g. Level 1, Level 2). Name must be 5–20 characters.
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
          {/* Ample breathing room for the input area */}
          <div className="px-6 py-6 sm:px-8 space-y-6">
            <form.Field
              name="name"
              validators={{
                onChange: createAcademicLevelSchema.shape.name,
              }}
            >
              {(field) => (
                <AppField
                  field={field}
                  label="Level Name"
                  placeholder="e.g. Level 1"
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

          {/* Spacious, distinctly styled footer */}
          <DialogFooter className="border-t border-border/40 bg-muted/10 px-6 py-5 sm:px-8 flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="ghost"
              className="h-11 px-6 rounded-xl font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
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
                  className="h-11 px-8 rounded-xl font-bold text-white shadow-lg transition-all hover:opacity-90 active:scale-95"
                  style={{
                    background: `linear-gradient(135deg, ${BRAND_PURPLE}, ${BRAND_TEAL})`,
                  }}
                >
                  Create Level
                </AppSubmitButton>
              )}
            </form.Subscribe>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}