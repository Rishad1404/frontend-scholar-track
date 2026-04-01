"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Bot, Loader2, Sparkles, RotateCcw } from "lucide-react";
import { toast } from "sonner";

import {
  aiEvaluateAction,
  aiReEvaluateAction,
} from "@/app/(dashboardLayout)/(adminRoutes)/admin/applications-management/_actions";
import type { IApplication } from "@/types/application";

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
import { Badge } from "@/components/ui/badge";
import {
  APPLICATION_STATUS_LABELS,
  APPLICATION_STATUS_VARIANT,
} from "@/types/application";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  application: IApplication | null;
  onSuccess: () => void;
}

export default function AiEvaluateModal({
  open,
  onOpenChange,
  application,
  onSuccess,
}: Props) {
  const qc = useQueryClient();

  const isReEvaluate = application?.aiScore !== null && application?.aiScore !== undefined;

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (id: string) =>
      isReEvaluate ? aiReEvaluateAction(id) : aiEvaluateAction(id),
  });

  if (!application) return null;

  const canEvaluate =
    application.status === "SCREENING" || application.status === "UNDER_REVIEW";

  const handleEvaluate = async (e: React.MouseEvent) => {
    e.preventDefault();
    const toastId = toast.loading(
      isReEvaluate
        ? "Running AI re-evaluation..."
        : "Running AI evaluation...",
    );

    try {
      const result = await mutateAsync(application.id);

      if (result.success) {
        toast.success(result.message || "AI evaluation completed", {
          id: toastId,
        });
        // Invalidate both list and detail queries
        qc.invalidateQueries({ queryKey: ["applications"] });
        qc.invalidateQueries({
          queryKey: ["application-detail", application.id],
        });
        onOpenChange(false);
        onSuccess();
      } else {
        toast.error(result.message || "AI evaluation failed", { id: toastId });
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "AI evaluation failed";
      toast.error(message, { id: toastId });
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            {isReEvaluate ? "Re-evaluate with AI" : "AI Evaluation"}
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-3">
            {!canEvaluate ? (
              <span>
                AI evaluation can only run on applications with status{" "}
                <strong>Screening</strong> or <strong>Under Review</strong>.
                Current status:{" "}
                <Badge
                  variant={APPLICATION_STATUS_VARIANT[application.status]}
                >
                  {APPLICATION_STATUS_LABELS[application.status]}
                </Badge>
              </span>
            ) : (
              <>
                <span>
                  {isReEvaluate
                    ? "This will reset the existing AI evaluation and run a fresh analysis."
                    : "AI will analyze the student's academic profile, essay, and financial info to produce an eligibility score."}
                </span>
                <span className="block text-sm">
                  <strong>Student:</strong>{" "}
                  {application.student.user.name}
                  <br />
                  <strong>Scholarship:</strong>{" "}
                  {application.scholarship.title}
                </span>
                {isReEvaluate && (
                  <span className="block text-sm">
                    <strong>Current AI Score:</strong>{" "}
                    {application.aiScore?.toFixed(0)}/100{" "}
                    {application.aiEligible ? "✅" : "❌"}
                  </span>
                )}
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleEvaluate}
            disabled={isPending || !canEvaluate}
            className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : isReEvaluate ? (
              <RotateCcw className="h-4 w-4" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            {isPending
              ? "Evaluating..."
              : isReEvaluate
                ? "Re-evaluate"
                : "Run AI Evaluation"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}