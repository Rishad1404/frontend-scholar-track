/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/modules/Dashboard/Scholarships/ViewScholarshipDialog.tsx

"use client";

import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  GraduationCap,
  Calendar,
  DollarSign,
  Users,
  BookOpen,
  RefreshCw,
  Pencil,
  ExternalLink,
  Building2,
  FileCheck2,
  Wallet,
  Target
} from "lucide-react";
import type { IScholarship } from "@/types/scholarship";
import {
  SCHOLARSHIP_STATUS_LABELS,
  SCHOLARSHIP_STATUS_VARIANT,
  DOCUMENT_TYPE_LABELS,
} from "@/types/scholarship";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  scholarship: IScholarship | null;
  onChangeStatus: (scholarship: IScholarship) => void;
  onEdit?: (scholarship: IScholarship) => void;
}

const BRAND_TEAL = "#0097b2";
const BRAND_PURPLE = "#4b2875";

export default function ViewScholarshipDialog({
  open,
  onOpenChange,
  scholarship,
  onChangeStatus,
  onEdit,
}: Props) {
  if (!scholarship) return null;

  const deadline = new Date(scholarship.deadline);
  const isPastDeadline = deadline < new Date();
  const appCount = scholarship._count?.applications ?? 0;
  const canEdit = scholarship.status === "DRAFT" || scholarship.status === "PAUSED";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* ─── Medium Premium Container (600px) ─── */}
      <DialogContent className="sm:max-w-150 p-0 overflow-hidden rounded-[1.5rem] border-border/40 bg-background/95 backdrop-blur-xl shadow-2xl">
        <VisuallyHidden>
          <DialogTitle>Details for {scholarship.title}</DialogTitle>
        </VisuallyHidden>

        {/* ─── Compact Premium Header ─── */}
        <div className="border-b border-border/40 bg-muted/10 px-6 pt-8 pb-6 sm:px-8">
          <div className="flex items-start gap-4 sm:gap-5">
            <div 
              className="flex h-14 w-14 sm:h-16 sm:w-16 shrink-0 items-center justify-center rounded-2xl shadow-inner border border-primary/20 bg-card"
              style={{ background: `linear-gradient(135deg, ${BRAND_PURPLE}15, ${BRAND_TEAL}15)` }}
            >
              <GraduationCap className="h-7 w-7 sm:h-8 sm:w-8 text-primary" style={{ color: BRAND_TEAL }} />
            </div>
            
            <div className="flex-1 pt-1">
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground leading-tight pr-4">
                {scholarship.title}
              </h2>
              
              <div className="mt-2.5 flex flex-wrap items-center gap-2">
                <Badge 
                  variant={SCHOLARSHIP_STATUS_VARIANT[scholarship.status]} 
                  className="px-2.5 py-0.5 shadow-sm text-[10px] sm:text-xs font-bold uppercase tracking-wider"
                >
                  {SCHOLARSHIP_STATUS_LABELS[scholarship.status]}
                </Badge>
                {scholarship.financialNeedRequired && (
                  <Badge variant="outline" className="border-amber-500/30 bg-amber-500/10 text-amber-600 px-2.5 py-0.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                    Financial Need
                  </Badge>
                )}
                {isPastDeadline && (
                  <Badge variant="destructive" className="px-2.5 py-0.5 shadow-sm text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                    Expired
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ─── Scrollable Body ─── */}
        <div className="max-h-[65vh] overflow-y-auto overflow-x-hidden custom-scrollbar px-6 py-6 sm:px-8 space-y-6">
          
          {/* ─── 2x2 Fast Stats Grid ─── */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <StatCard 
              icon={Wallet} 
              color="#10b981" 
              value={`৳${scholarship.totalAmount.toLocaleString()}`} 
              label="Total Fund" 
            />
            <StatCard 
              icon={DollarSign} 
              color={BRAND_TEAL} 
              value={`৳${scholarship.amountPerStudent.toLocaleString()}`} 
              label="Per Student" 
            />
            <StatCard 
              icon={Users} 
              color={BRAND_PURPLE} 
              value={`${appCount} / ${scholarship.quota}`} 
              label="Applications" 
            />
            <StatCard 
              icon={Calendar} 
              color={isPastDeadline ? "#ef4444" : "currentColor"} 
              value={format(deadline, "MMM dd, yyyy")} 
              label="Deadline" 
            />
          </div>

          {/* ─── Program & Academic Details (Tight Grid) ─── */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Program Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <InfoRow icon={Building2} label="Department" value={scholarship.department?.name || "All Departments"} />
              <InfoRow icon={BookOpen} label="Level" value={scholarship.level?.name || "All Levels"} />
              
              {scholarship.minGpa ? (
                <InfoRow icon={Target} label="Min GPA" value={scholarship.minGpa.toFixed(2)} valueClass="text-primary font-black" />
              ) : null}
              {scholarship.minCgpa ? (
                <InfoRow icon={Target} label="Min CGPA" value={scholarship.minCgpa.toFixed(2)} valueClass="text-primary font-black" />
              ) : null}
            </div>
          </div>

          {/* ─── Description ─── */}
          {scholarship.description && (
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                About the Program
              </h4>
              <div className="rounded-xl border border-border/50 bg-muted/10 p-4 text-sm leading-relaxed text-muted-foreground shadow-sm">
                {scholarship.description}
              </div>
            </div>
          )}

          {/* ─── Documents & Links ─── */}
          {(scholarship.requiredDocTypes?.length > 0 || scholarship.document) && (
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">
                Attachments & Requirements
              </h4>
              
              {scholarship.requiredDocTypes?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {scholarship.requiredDocTypes.map((dt) => (
                    <div key={dt} className="flex items-center gap-2 rounded-lg border border-border/40 bg-card px-3 py-1.5 shadow-sm">
                      <FileCheck2 className="h-3.5 w-3.5 opacity-70" />
                      <span className="text-xs font-semibold text-foreground">
                        {DOCUMENT_TYPE_LABELS[dt]}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {scholarship.document && (
                <a
                  href={scholarship.document}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group mt-2 flex w-full items-center justify-between rounded-xl border border-primary/20 bg-primary/5 p-3.5 transition-all hover:bg-primary/10"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-background shadow-sm">
                      <ExternalLink className="h-3.5 w-3.5 text-primary" style={{ color: BRAND_PURPLE }} />
                    </div>
                    <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                      View Official Guidelines
                    </span>
                  </div>
                </a>
              )}
            </div>
          )}
        </div>

        {/* ─── Footer Actions ─── */}
        <div className="border-t border-border/40 bg-muted/10 px-6 py-4 sm:px-8 flex flex-wrap items-center justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => onChangeStatus(scholarship)}
            className="h-10 rounded-xl px-5 font-bold shadow-sm transition-all hover:bg-muted"
          >
            <RefreshCw className="mr-2 h-4 w-4 text-muted-foreground" />
            Change Status
          </Button>
          
          {canEdit && onEdit && (
            <Button
              onClick={() => {
                onOpenChange(false);
                onEdit(scholarship);
              }}
              className="h-10 rounded-xl px-6 font-bold text-white shadow-lg transition-all hover:opacity-90 active:scale-95"
              style={{ background: `linear-gradient(135deg, ${BRAND_PURPLE}, ${BRAND_TEAL})` }}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Edit Program
            </Button>
          )}
        </div>

      </DialogContent>
    </Dialog>
  );
}

// ─── Reusable Micro-Components ───

function StatCard({ icon: Icon, color, value, label }: { icon: any, color: string, value: string, label: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-border/50 bg-card p-3 sm:p-4 shadow-sm transition-colors hover:bg-muted/10">
      <Icon className="mb-2 h-5 w-5" style={{ color }} />
      <span className="text-lg sm:text-xl font-black text-foreground truncate max-w-full">{value}</span>
      <span className="mt-0.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{label}</span>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value, valueClass = "" }: { icon: any, label: string, value: string, valueClass?: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-border/50 bg-card p-3 shadow-sm transition-colors hover:bg-muted/10">
      <span className="text-xs sm:text-sm font-medium text-muted-foreground flex items-center gap-2">
        <Icon className="h-4 w-4 opacity-70" /> {label}
      </span>
      <span className={`text-xs sm:text-sm font-semibold text-foreground text-right truncate max-w-[50%] ${valueClass}`}>
        {value}
      </span>
    </div>
  );
}