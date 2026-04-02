// components/modules/Student/Scholarships/Steps/StepEssay.tsx

"use client";

import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { FileText, DollarSign } from "lucide-react";
import { toast } from "sonner";


import AppField from "@/components/shared/form/AppField";
import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { IScholarship } from "@/types/scholarshipForStudents";
import { createApplicationAction, updateApplicationAction } from "@/app/(dashboardLayout)/(studentRoutes)/student/my-applications/_actions";

interface Props {
  scholarship: IScholarship;
  applicationId: string | null;
  onNext: (applicationId: string) => void;
}

export default function StepEssay({
  scholarship,
  applicationId,
  onNext,
}: Props) {
  const [serverError, setServerError] = useState<string | null>(null);
  const isUpdate = !!applicationId;

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: {
      scholarshipId: string;
      essay?: string;
      financialInfo?: Record<string, string>;
    }) =>
      isUpdate
        ? updateApplicationAction(applicationId!, {
            essay: payload.essay,
            financialInfo: payload.financialInfo,
          })
        : createApplicationAction(payload),
  });

  const form = useForm({
    defaultValues: {
      essay: "",
      familyIncome: "",
      financialNeedReason: "",
    },
    onSubmit: async ({ value }) => {
      setServerError(null);

      const payload: {
        scholarshipId: string;
        essay?: string;
        financialInfo?: Record<string, string>;
      } = {
        scholarshipId: scholarship.id,
      };

      if (value.essay.trim()) payload.essay = value.essay.trim();

      if (scholarship.financialNeedRequired) {
        if (!value.familyIncome.trim() || !value.financialNeedReason.trim()) {
          setServerError(
            "Financial information is required for this scholarship"
          );
          return;
        }
        payload.financialInfo = {
          familyIncome: value.familyIncome.trim(),
          reason: value.financialNeedReason.trim(),
        };
      }

      try {
        const result = await mutateAsync(payload);

        if (result.success && result.data) {
          toast.success(result.message);
          onNext(result.data.id);
        } else {
          setServerError(result.message);
        }
      } catch (error: unknown) {
        setServerError(
          error instanceof Error ? error.message : "Something went wrong"
        );
      }
    },
  });

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="space-y-6"
    >
      <div>
        <h3 className="flex items-center gap-2 text-lg font-bold text-foreground">
          <FileText className="h-5 w-5 text-muted-foreground" />
          Essay & Financial Information
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          {isUpdate
            ? "Update your essay and financial details."
            : "Write your scholarship essay and provide any required financial information."}
        </p>
      </div>

      <Separator />

      {/* Essay */}
      <div className="space-y-2">
        <Label className="font-bold text-foreground">
          Essay / Personal Statement
        </Label>
        <form.Field
          name="essay"
          validators={{
            onChange: ({ value }) => {
              if (value.length > 10000)
                return "Essay must not exceed 10,000 characters";
              return undefined;
            },
          }}
        >
          {(field) => (
            <>
              <Textarea
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                placeholder="Write your scholarship essay here. Explain why you deserve this scholarship, your academic goals, and how it will help you..."
                className="min-h-[200px] rounded-xl bg-muted/30 resize-none"
                maxLength={10000}
                disabled={isPending}
              />
              <div className="flex justify-between">
                {field.state.meta.errors?.[0] && (
                  <p className="text-xs font-medium text-destructive">
                    {field.state.meta.errors[0]}
                  </p>
                )}
                <p className="text-xs text-muted-foreground ml-auto">
                  {field.state.value.length}/10,000
                </p>
              </div>
            </>
          )}
        </form.Field>
      </div>

      {/* Financial Info (if required) */}
      {scholarship.financialNeedRequired && (
        <div className="space-y-4 rounded-xl border border-amber-200 bg-amber-50/50 p-5 dark:border-amber-800 dark:bg-amber-950/20">
          <h4 className="flex items-center gap-2 text-sm font-bold text-foreground">
            <DollarSign className="h-4 w-4 text-amber-600" />
            Financial Information{" "}
            <span className="text-red-500">* Required</span>
          </h4>

          <form.Field
            name="familyIncome"
            validators={{
              onChange: ({ value }) => {
                if (!value.trim()) return "Family income is required";
                return undefined;
              },
            }}
          >
            {(field) => (
              <AppField
                field={field}
                label="Annual Family Income"
                placeholder="e.g. $30,000 or 30,000 USD"
              />
            )}
          </form.Field>

          <div className="space-y-2">
            <Label className="font-bold text-foreground">
              Why do you need financial assistance?{" "}
              <span className="text-red-500">*</span>
            </Label>
            <form.Field
              name="financialNeedReason"
              validators={{
                onChange: ({ value }) => {
                  if (!value.trim()) return "Please explain your financial need";
                  return undefined;
                },
              }}
            >
              {(field) => (
                <>
                  <Textarea
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    placeholder="Explain your financial situation and why you need this scholarship..."
                    className="min-h-[120px] rounded-xl bg-background resize-none"
                    disabled={isPending}
                  />
                  {field.state.meta.errors?.[0] && (
                    <p className="text-xs font-medium text-destructive">
                      {field.state.meta.errors[0]}
                    </p>
                  )}
                </>
              )}
            </form.Field>
          </div>
        </div>
      )}

      {/* Server Error */}
      <AnimatePresence mode="wait">
        {serverError && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Alert variant="destructive">
              <AlertDescription>{serverError}</AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      <Separator />

      <div className="flex justify-end">
        <form.Subscribe
          selector={(s) => [s.canSubmit, s.isSubmitting] as const}
        >
          {([canSubmit, isSubmitting]) => (
            <AppSubmitButton
              isPending={isSubmitting || isPending}
              pendingLabel="Saving..."
              disabled={!canSubmit}
            >
              {isUpdate ? "Update & Continue" : "Save Draft & Continue"}
            </AppSubmitButton>
          )}
        </form.Subscribe>
      </div>
    </form>
  );
}