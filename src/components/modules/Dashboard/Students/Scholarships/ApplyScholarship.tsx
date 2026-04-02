// components/modules/Student/Scholarships/ApplyScholarship.tsx

"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  GraduationCap,
  ArrowLeft,
  CheckCircle2,
  FileText,
  Upload,
  Send,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

import { getScholarshipById } from "@/services/scholarship.services";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import StepEssay from "./StepEssay";
import StepDocuments from "./StepDocuments";
import StepReviewSubmit from "./StepReviewSubmit";
import { IScholarship } from "@/types/scholarshipForStudents";



const BRAND_TEAL = "#0097b2";
const BRAND_PURPLE = "#4b2875";

interface Props {
  scholarshipId: string;
}

const STEPS = [
  { id: 1, label: "Essay & Info", icon: FileText },
  { id: 2, label: "Documents", icon: Upload },
  { id: 3, label: "Review & Submit", icon: Send },
];

export default function ApplyScholarship({ scholarshipId }: Props) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [applicationId, setApplicationId] = useState<string | null>(null);

  // ── Fetch scholarship details ──
  const { data: response, isLoading } = useQuery({
    queryKey: ["scholarship-detail", scholarshipId],
    queryFn: () => getScholarshipById(scholarshipId),
    enabled: !!scholarshipId,
  });

  const scholarship = response?.data as unknown as IScholarship | undefined;

  if (isLoading) return <ApplySkeleton />;

  if (!scholarship) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex min-h-[50vh] flex-col items-center justify-center text-center"
      >
        <div className="mb-4 rounded-full bg-rose-500/10 p-4">
          <AlertCircle className="h-10 w-10 text-rose-500" />
        </div>
        <h2 className="text-xl font-bold text-foreground">
          Scholarship Not Found
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          This scholarship may no longer be available.
        </p>
      </motion.div>
    );
  }

  const isExpired = new Date(scholarship.deadline) < new Date();

  if (isExpired) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex min-h-[50vh] flex-col items-center justify-center text-center"
      >
        <div className="mb-4 rounded-full bg-amber-500/10 p-4">
          <AlertCircle className="h-10 w-10 text-amber-500" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Deadline Passed</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The deadline for this scholarship has passed.
        </p>
        <Link
          href="/student/scholarships"
          className="mt-4 text-sm font-bold text-primary hover:underline"
        >
          Browse other scholarships
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-3xl mx-auto space-y-8 pb-16"
    >
      {/* ─── Header ─── */}
      <div>
        <Link
          href="/student/scholarships"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground mb-3"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Scholarships
        </Link>

        <h1 className="flex items-center gap-3 text-2xl font-black tracking-tight text-foreground">
          <GraduationCap className="h-7 w-7" style={{ color: BRAND_PURPLE }} />
          Apply for Scholarship
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {scholarship.title} — {scholarship.university?.name}
        </p>
      </div>

      {/* ─── Step Indicator ─── */}
      <div className="flex items-center gap-2">
        {STEPS.map((step, index) => {
          const Icon = step.icon;
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;

          return (
            <div key={step.id} className="flex items-center gap-2 flex-1">
              <div className="flex items-center gap-2 flex-1">
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-all ${
                    isCompleted
                      ? "bg-emerald-500 text-white"
                      : isActive
                        ? "text-white shadow-lg"
                        : "bg-muted text-muted-foreground"
                  }`}
                  style={
                    isActive
                      ? {
                          background: `linear-gradient(135deg, ${BRAND_PURPLE}, ${BRAND_TEAL})`,
                        }
                      : undefined
                  }
                >
                  {isCompleted ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    <Icon className="h-4 w-4" />
                  )}
                </div>
                <span
                  className={`text-xs font-bold hidden sm:block ${
                    isActive
                      ? "text-foreground"
                      : isCompleted
                        ? "text-emerald-600"
                        : "text-muted-foreground"
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {index < STEPS.length - 1 && (
                <div
                  className={`h-px flex-1 ${
                    isCompleted ? "bg-emerald-500" : "bg-border"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* ─── Step Content ─── */}
      <Card className="rounded-2xl shadow-lg border-border/40 overflow-hidden">
        <div
          className="h-1.5 w-full"
          style={{
            background: `linear-gradient(90deg, ${BRAND_TEAL}, ${BRAND_PURPLE})`,
          }}
        />

        <div className="p-6 sm:p-8">
          {currentStep === 1 && (
            <StepEssay
              scholarship={scholarship}
              applicationId={applicationId}
              onNext={(appId: string) => {
                setApplicationId(appId);
                setCurrentStep(2);
              }}
            />
          )}

          {currentStep === 2 && applicationId && (
            <StepDocuments
              scholarship={scholarship}
              applicationId={applicationId}
              onNext={() => setCurrentStep(3)}
              onBack={() => setCurrentStep(1)}
            />
          )}

          {currentStep === 3 && applicationId && (
            <StepReviewSubmit
              scholarship={scholarship}
              applicationId={applicationId}
              onBack={() => setCurrentStep(2)}
              onSubmitted={() => router.push("/student/my-applications")}
            />
          )}
        </div>
      </Card>
    </motion.div>
  );
}

function ApplySkeleton() {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-4 w-32 rounded-lg" />
        <Skeleton className="h-8 w-64 rounded-xl" />
      </div>
      <Skeleton className="h-12 w-full rounded-xl" />
      <Skeleton className="h-[500px] rounded-2xl" />
    </div>
  );
}