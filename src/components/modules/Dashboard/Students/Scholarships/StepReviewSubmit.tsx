// components/modules/Student/Scholarships/Steps/StepReviewSubmit.tsx

"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import {
  Send,
  ArrowLeft,
  FileText,
  DollarSign,
  GraduationCap,
  CheckCircle2,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

import { getApplicationById } from "@/services/application.services";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { submitApplicationAction } from "@/app/(dashboardLayout)/(studentRoutes)/student/available-scholarships/[scholarshipId]/apply/_actions";
import { IScholarship } from "@/types/scholarshipForStudents";

const BRAND_PURPLE = "#4b2875";
const BRAND_TEAL = "#0097b2";

interface Props {
  scholarship: IScholarship;
  applicationId: string;
  onBack: () => void;
  onSubmitted: () => void;
}

export default function StepReviewSubmit({
  scholarship,
  applicationId,
  onBack,
  onSubmitted,
}: Props) {
  const [serverError, setServerError] = useState<string | null>(null);

  const { data: appResponse, isLoading } = useQuery({
    queryKey: ["application-review", applicationId],
    queryFn: () => getApplicationById(applicationId),
    enabled: !!applicationId,
  });

  const application = appResponse?.data;

  const { mutateAsync, isPending } = useMutation({
    mutationFn: () => submitApplicationAction(applicationId),
  });

  const handleSubmit = async () => {
    setServerError(null);

    try {
      const result = await mutateAsync();

      if (result.success) {
        toast.success(result.message);
        onSubmitted();
      } else {
        setServerError(result.message);
      }
    } catch (error: unknown) {
      setServerError(
        error instanceof Error ? error.message : "Something went wrong"
      );
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48 rounded-xl" />
        <Skeleton className="h-32 rounded-xl" />
        <Skeleton className="h-24 rounded-xl" />
        <Skeleton className="h-24 rounded-xl" />
      </div>
    );
  }

  const documents = application?.documents || [];
  const financialInfo = application?.financialInfo as Record<string, string> | null;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="flex items-center gap-2 text-lg font-bold text-foreground">
          <Send className="h-5 w-5 text-muted-foreground" />
          Review & Submit
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Review your application before submitting. This action cannot be
          undone.
        </p>
      </div>

      <Separator />

      {/* Scholarship Info */}
      <div className="rounded-xl border border-border/40 bg-muted/10 p-5">
        <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
          <GraduationCap className="h-3.5 w-3.5 inline mr-1.5" />
          Scholarship
        </h4>
        <p className="text-base font-bold text-foreground">
          {scholarship.title}
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          {scholarship.university?.name}
        </p>
      </div>

      {/* Essay */}
      <div className="rounded-xl border border-border/40 bg-muted/10 p-5">
        <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
          <FileText className="h-3.5 w-3.5 inline mr-1.5" />
          Essay
        </h4>
        {application?.essay ? (
          <p className="text-sm text-foreground/90 whitespace-pre-wrap max-h-48 overflow-y-auto">
            {application.essay}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground italic">
            No essay provided
          </p>
        )}
      </div>

      {/* Financial Info */}
      {financialInfo && (
        <div className="rounded-xl border border-border/40 bg-muted/10 p-5">
          <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
            <DollarSign className="h-3.5 w-3.5 inline mr-1.5" />
            Financial Information
          </h4>
          <div className="space-y-2">
            {Object.entries(financialInfo).map(([key, value]) => (
              <div key={key}>
                <p className="text-xs font-bold text-muted-foreground uppercase">
                  {key.replace(/([A-Z])/g, " $1").trim()}
                </p>
                <p className="text-sm font-semibold text-foreground">{value}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Documents */}
      <div className="rounded-xl border border-border/40 bg-muted/10 p-5">
        <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
          <FileText className="h-3.5 w-3.5 inline mr-1.5" />
          Documents ({documents.length})
        </h4>
        {documents.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {documents.map((doc: { id: string; type: string; fileName: string }) => (
              <Badge
                key={doc.id}
                variant="secondary"
                className="text-xs font-semibold gap-1"
              >
                <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                {doc.type.replace(/_/g, " ")}
              </Badge>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground italic">
            No documents uploaded
          </p>
        )}
      </div>

      {/* Warning */}
      <Alert className="rounded-xl">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription className="text-xs">
          Once submitted, you cannot edit your application. Make sure all
          information is correct before proceeding.
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
            <Alert variant="destructive" className="rounded-xl">
              <AlertDescription>{serverError}</AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      <Separator />

      {/* Actions */}
      <div className="flex justify-between">
        <Button
          type="button"
          onClick={onBack}
          variant="ghost"
          className="rounded-xl font-bold"
          disabled={isPending}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <Button
          onClick={handleSubmit}
          disabled={isPending}
          className="rounded-xl px-8 font-black text-white shadow-lg"
          style={{
            background: `linear-gradient(135deg, ${BRAND_PURPLE}, ${BRAND_TEAL})`,
          }}
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              Submit Application
            </>
          )}
        </Button>
      </div>
    </div>
  );
}