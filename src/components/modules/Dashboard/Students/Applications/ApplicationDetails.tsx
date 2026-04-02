/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  GraduationCap,
  Building2,
  Calendar,
  FileText,
  CheckCircle2,
  Clock,
  Search,
  XCircle,
  Coins,
  ExternalLink,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

import { getApplicationById } from "@/services/application.services";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

const BRAND_TEAL = "#0097b2";
const BRAND_PURPLE = "#4b2875";

interface Props {
  applicationId: string;
}

const STATUS_CONFIG: Record<
  string,
  { label: string; icon: any; color: string; bg: string; border: string; step: number }
> = {
  DRAFT: { label: "Draft", icon: FileText, color: "#6b7280", bg: "#6b728015", border: "#6b728040", step: 0 },
  SCREENING: { label: "Screening", icon: Search, color: "#3b82f6", bg: "#3b82f615", border: "#3b82f640", step: 1 },
  UNDER_REVIEW: { label: "Under Review", icon: Clock, color: "#8b5cf6", bg: "#8b5cf615", border: "#8b5cf640", step: 2 },
  APPROVED: { label: "Approved", icon: CheckCircle2, color: "#16a34a", bg: "#16a34a15", border: "#16a34a40", step: 3 },
  REJECTED: { label: "Rejected", icon: XCircle, color: "#dc2626", bg: "#dc262615", border: "#dc262640", step: 3 },
  DISBURSED: { label: "Disbursed", icon: Coins, color: "#d97706", bg: "#d9770615", border: "#d9770640", step: 4 },
};

const TRACKER_STEPS = [
  { id: 1, label: "Screening", keys: ["SCREENING"] },
  { id: 2, label: "Review", keys: ["UNDER_REVIEW"] },
  { id: 3, label: "Decision", keys: ["APPROVED", "REJECTED"] },
  { id: 4, label: "Disbursed", keys: ["DISBURSED"] },
];

export default function ApplicationDetails({ applicationId }: Props) {
  const { data: response, isLoading } = useQuery({
    queryKey: ["application-details", applicationId],
    queryFn: () => getApplicationById(applicationId),
  });

  const app: any = response?.data;

  const formatCurrency = (amount: number) => {
    return `Tk ${new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(amount)}`;
  };

  if (isLoading) return <DetailsSkeleton />;

  if (!app) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
        <AlertCircle className="h-12 w-12 text-rose-500 mb-4" />
        <h2 className="text-xl font-bold">Application Not Found</h2>
        <Link href="/student/my-applications" className="text-primary mt-4 hover:underline">
          Go back to my applications
        </Link>
      </div>
    );
  }

  const currentStatus = STATUS_CONFIG[app.status] || STATUS_CONFIG.UNDER_REVIEW;
  const StatusIcon = currentStatus.icon;
  const isRejected = app.status === "REJECTED";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-5xl mx-auto space-y-6 pb-16"
    >
      {/* ─── Header & Navigation ─── */}
      <div>
        <Link
          href="/student/my-applications"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground mb-4 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Applications
        </Link>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-foreground flex items-center gap-3">
              <GraduationCap className="h-8 w-8" style={{ color: BRAND_PURPLE }} />
              {app.scholarship?.title}
            </h1>
            <div className="flex items-center gap-4 mt-2">
              <span className="flex items-center gap-1.5 text-sm font-semibold text-muted-foreground">
                <Building2 className="h-4 w-4" />
                {app.scholarship?.university?.name || "University Wide"}
              </span>
              <span className="text-sm font-semibold text-muted-foreground hidden sm:block">•</span>
              <span className="flex items-center gap-1.5 text-sm font-semibold text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Applied: {new Date(app.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
          <Badge
            className="font-bold text-sm px-4 py-1.5 uppercase tracking-wider self-start md:self-auto"
            style={{ backgroundColor: currentStatus.bg, color: currentStatus.color, border: `1px solid ${currentStatus.border}` }}
          >
            <StatusIcon className="h-4 w-4 mr-2" />
            {currentStatus.label}
          </Badge>
        </div>
      </div>

      {/* ─── Status Tracker (Only show if not a draft) ─── */}
      {app.status !== "DRAFT" && (
        <Card className="p-6 rounded-2xl border-border/40 shadow-sm bg-card overflow-x-auto">
          <div className="min-w-125">
            <div className="relative flex items-center justify-between">
              {/* Connecting Line */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-muted rounded-full" />
              <div 
                className="absolute left-0 top-1/2 -translate-y-1/2 h-1 rounded-full transition-all duration-500" 
                style={{ 
                  width: `${(Math.min(currentStatus.step, 4) / 4) * 100}%`,
                  background: isRejected ? '#dc2626' : `linear-gradient(90deg, ${BRAND_PURPLE}, ${BRAND_TEAL})`
                }} 
              />

              {/* Steps */}
              {TRACKER_STEPS.map((step, idx) => {
                const isCompleted = currentStatus.step > step.id || (currentStatus.step === step.id && !isRejected);
                const isCurrent = currentStatus.step === step.id;
                const isStepRejected = isCurrent && isRejected;

                return (
                  <div key={step.id} className="relative z-10 flex flex-col items-center gap-2">
                    <div 
                      className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 shadow-sm
                        ${isStepRejected ? "bg-red-500 text-white" 
                        : isCompleted ? "bg-emerald-500 text-white" 
                        : isCurrent ? "bg-primary text-white" 
                        : "bg-background border-2 border-muted text-muted-foreground"}`}
                    >
                      {isStepRejected ? <XCircle className="h-5 w-5" /> : isCompleted ? <CheckCircle2 className="h-5 w-5" /> : idx + 1}
                    </div>
                    <span className={`text-xs font-bold uppercase tracking-wider ${isCurrent ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {isStepRejected ? "Rejected" : step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      )}

      {/* ─── Main Content Grid ─── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column: Details */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Essay Section */}
          {app.essay && (
            <Card className="rounded-2xl border-border/40 shadow-sm overflow-hidden">
              <div className="h-1.5 w-full bg-primary/20" />
              <div className="p-6 sm:p-8">
                <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground mb-4 flex items-center">
                  <FileText className="h-4 w-4 mr-2" /> Application Essay
                </h3>
                <p className="text-sm font-medium text-foreground/90 whitespace-pre-wrap leading-relaxed">
                  {app.essay}
                </p>
              </div>
            </Card>
          )}

          {/* Uploaded Documents */}
          <Card className="rounded-2xl border-border/40 shadow-sm overflow-hidden">
            <div className="h-1.5 w-full bg-primary/20" />
            <div className="p-6 sm:p-8">
              <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground mb-4 flex items-center">
                <FileText className="h-4 w-4 mr-2" /> Submitted Documents ({app.documents?.length || 0})
              </h3>
              <div className="space-y-3">
                {app.documents?.map((doc: any) => (
                  <div key={doc.id} className="flex items-center justify-between p-4 rounded-xl border border-border/40 bg-muted/10 hover:bg-muted/20 transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-foreground truncate">{doc.fileName}</p>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-0.5">
                          {doc.type.replace(/_/g, " ")}
                        </p>
                      </div>
                    </div>
                    <a 
                      href={doc.fileUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center h-10 w-10 rounded-lg bg-background border border-border/50 text-muted-foreground hover:text-primary hover:border-primary/50 transition-all shrink-0"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                ))}
                {(!app.documents || app.documents.length === 0) && (
                  <p className="text-sm text-muted-foreground italic">No documents uploaded.</p>
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Scholarship Summary */}
        <div className="space-y-6">
          <Card className="rounded-2xl border-border/40 shadow-sm overflow-hidden sticky top-6">
            <div className="h-1.5 w-full" style={{ background: `linear-gradient(90deg, ${BRAND_TEAL}, ${BRAND_PURPLE})` }} />
            <div className="p-6">
              <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4">
                Funding Details
              </h3>
              
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-muted/20 border border-border/40 flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                    <Coins className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Grant Amount</p>
                    <p className="text-lg font-black text-foreground">
                      {formatCurrency(app.scholarship?.amountPerStudent || 0)}
                    </p>
                  </div>
                </div>

                <Separator />

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Department</p>
                  <p className="text-sm font-bold text-foreground mt-0.5">
                    {app.scholarship?.department?.name || "All Departments"}
                  </p>
                </div>
                
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Level</p>
                  <p className="text-sm font-bold text-foreground mt-0.5">
                    {app.scholarship?.level?.name || "All Levels"}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

      </div>
    </motion.div>
  );
}

function DetailsSkeleton() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <Skeleton className="h-6 w-32 rounded-lg" />
      <div className="flex justify-between items-start">
        <Skeleton className="h-12 w-96 rounded-xl" />
        <Skeleton className="h-10 w-32 rounded-full" />
      </div>
      <Skeleton className="h-24 w-full rounded-2xl" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Skeleton className="h-64 w-full rounded-2xl" />
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    </div>
  );
}