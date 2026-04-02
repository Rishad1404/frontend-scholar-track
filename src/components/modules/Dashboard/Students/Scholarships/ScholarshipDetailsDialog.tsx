// components/modules/Student/Scholarships/ScholarshipDetailDialog.tsx

"use client";

import {
  GraduationCap,
  Calendar,
  BookOpen,
  Building2,
  Clock,
  FileText,
  TrendingUp,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Coins,
  Tags,
} from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { IScholarship } from "@/types/scholarshipForStudents";

interface Props {
  open: boolean;
  onClose: () => void;
  scholarship: IScholarship | null;
  formatCurrency: (n: number) => string;
  getDaysRemaining: (d: string) => number;
}

const BRAND_TEAL = "#0097b2";
const BRAND_PURPLE = "#4b2875";

export default function ScholarshipDetailDialog({
  open,
  onClose,
  scholarship,
  formatCurrency,
  getDaysRemaining,
}: Props) {
  if (!scholarship) return null;

  const daysLeft = getDaysRemaining(scholarship.deadline);
  const isExpired = daysLeft <= 0;
  const isUrgent = daysLeft <= 7 && daysLeft > 0;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl p-0">
        {/* Decorative Top Bar */}
        <div
          className="h-2 w-full sticky top-0 z-50"
          style={{ background: `linear-gradient(90deg, ${BRAND_TEAL}, ${BRAND_PURPLE})` }}
        />

        <div className="p-6 sm:p-8 pt-6">
          <DialogHeader className="mb-6">
            <DialogTitle className="flex items-center gap-2 text-xl font-black">
              <GraduationCap
                className="h-6 w-6"
                style={{ color: BRAND_PURPLE }}
              />
              Scholarship Details
            </DialogTitle>
            <DialogDescription>
              Review all funding details, requirements, and deadlines before applying.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* ── Title & Institution ── */}
            <div className="rounded-2xl border border-border/40 bg-muted/10 p-5 shadow-sm">
              <h3 className="text-xl font-extrabold text-foreground leading-tight">
                {scholarship.title}
              </h3>
              <div className="flex items-center gap-2 mt-3">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-bold text-muted-foreground">
                  {scholarship.university?.name || "University Wide"}
                </span>
              </div>

              {/* Badges / Tags */}
              <div className="flex flex-wrap gap-2 mt-4">
                {scholarship.category && (
                  <Badge variant="secondary" className="text-xs font-bold gap-1 bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                    <Tags className="h-3 w-3" />
                    {scholarship.category.replace(/_/g, " ")}
                  </Badge>
                )}
                {scholarship.department && (
                  <Badge variant="outline" className="text-xs font-semibold gap-1">
                    <BookOpen className="h-3 w-3 text-muted-foreground" />
                    {scholarship.department.name}
                  </Badge>
                )}
                {scholarship.level && (
                  <Badge variant="outline" className="text-xs font-semibold gap-1">
                    <TrendingUp className="h-3 w-3 text-muted-foreground" />
                    {scholarship.level.name}
                  </Badge>
                )}
                {isExpired ? (
                  <Badge variant="destructive" className="text-xs font-bold border-none">
                    Expired
                  </Badge>
                ) : isUrgent ? (
                  <Badge
                    className="text-xs font-bold"
                    style={{
                      backgroundColor: "#dc262615",
                      color: "#dc2626",
                      border: "1px solid #dc262640",
                    }}
                  >
                    <Clock className="h-3 w-3 mr-1" />
                    {daysLeft} days left
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-xs font-bold">
                    <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                    {daysLeft} days left
                  </Badge>
                )}
              </div>
            </div>

            {/* ── Description ── */}
            {scholarship.description && (
              <div className="rounded-2xl border border-border/40 bg-card p-5 shadow-sm">
                <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-3 flex items-center">
                  <FileText className="h-3.5 w-3.5 mr-2" />
                  Description & Overview
                </h4>
                <p className="text-sm font-medium text-foreground/90 whitespace-pre-wrap leading-relaxed">
                  {scholarship.description}
                </p>
              </div>
            )}

            {/* ── Grid: Financials & Requirements ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Financial Details */}
              <div className="rounded-2xl border border-border/40 bg-muted/10 p-5 shadow-sm">
                <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4 flex items-center">
                  <Coins className="h-3.5 w-3.5 mr-2" />
                  Funding & Quota
                </h4>
                <div className="space-y-4">
                  <InfoBlock
                    label="Amount Per Student"
                    value={formatCurrency(scholarship.amountPerStudent)}
                    highlight
                  />
                  <InfoBlock
                    label="Total Fund Available"
                    value={formatCurrency(scholarship.totalAmount)}
                  />
                  <InfoBlock 
                    label="Available Slots (Quota)" 
                    value={`${scholarship.quota} Students`} 
                  />
                </div>
              </div>

              {/* Eligibility Requirements */}
              <div className="rounded-2xl border border-border/40 bg-muted/10 p-5 shadow-sm">
                <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4 flex items-center">
                  <CheckCircle2 className="h-3.5 w-3.5 mr-2" />
                  Eligibility Criteria
                </h4>
                <div className="space-y-4">
                  <InfoBlock
                    label="Minimum GPA"
                    value={scholarship.minGpa ? String(scholarship.minGpa) : "No minimum required"}
                  />
                  <InfoBlock
                    label="Minimum CGPA"
                    value={scholarship.minCgpa ? String(scholarship.minCgpa) : "No minimum required"}
                  />
                  <InfoBlock
                    label="Financial Need Condition"
                    value={scholarship.financialNeedRequired ? "Demonstrated Need Required" : "Not Required"}
                    warning={scholarship.financialNeedRequired}
                  />
                </div>
              </div>
            </div>

            {/* ── Required Documents ── */}
            {scholarship.requiredDocTypes && scholarship.requiredDocTypes.length > 0 && (
              <div className="rounded-2xl border border-border/40 bg-card p-5 shadow-sm">
                <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4 flex items-center">
                  <FileText className="h-3.5 w-3.5 mr-2" />
                  Documents You Must Submit
                </h4>
                <div className="flex flex-wrap gap-2">
                  {scholarship.requiredDocTypes.map((doc, idx) => (
                    <Badge
                      key={idx}
                      variant="secondary"
                      className="text-xs font-bold px-3 py-1.5"
                    >
                      {doc.replace(/_/g, " ")}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* ── Scholarship PDF / Official Document ── */}
            {scholarship.document && (
              <div className="rounded-2xl border border-border/40 bg-muted/10 p-5 shadow-sm">
                <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-3">
                  Official Circular / PDF
                </h4>
                <a
                  href={scholarship.document}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-xl border border-border/60 bg-background p-4 hover:bg-muted/50 hover:border-primary/30 transition-all group"
                >
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FileText className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-sm font-bold text-foreground flex-1 group-hover:text-primary transition-colors">
                    View Full Scholarship Document
                  </span>
                  <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </a>
              </div>
            )}

            {/* ── Warning if expired ── */}
            {isExpired && (
              <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-5 dark:border-red-800/30 dark:bg-red-900/10">
                <AlertTriangle className="h-6 w-6 text-red-500 shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-red-800 dark:text-red-400">Deadline Passed</h4>
                  <p className="text-sm font-medium text-red-700/80 dark:text-red-400/80 mt-0.5">
                    This scholarship stopped accepting applications on {new Date(scholarship.deadline).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}.
                  </p>
                </div>
              </div>
            )}

            <Separator className="my-2" />

            {/* ── Actions ── */}
            <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium w-full sm:w-auto justify-center sm:justify-start">
                <Calendar className="h-4 w-4" />
                Closes: {new Date(scholarship.deadline).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
              </div>

              <div className="flex w-full sm:w-auto justify-end gap-3">
                <Button
                  variant="ghost"
                  onClick={onClose}
                  className="rounded-xl font-bold h-12 px-6 w-full sm:w-auto"
                >
                  Close
                </Button>

                {!isExpired && (
                  <Button
                    asChild
                    className="rounded-xl h-12 px-8 font-black text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all w-full sm:w-auto"
                    style={{
                      background: `linear-gradient(135deg, ${BRAND_PURPLE}, ${BRAND_TEAL})`,
                    }}
                  >
                    <Link href={`/student/available-scholarships/${scholarship.id}/apply`}>
                      <GraduationCap className="h-5 w-5 mr-2" />
                      Apply Now
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ═══════════════════════════════════════════
// Sub-Component
// ═══════════════════════════════════════════
function InfoBlock({ 
  label, 
  value, 
  highlight = false,
  warning = false
}: { 
  label: string; 
  value: string;
  highlight?: boolean;
  warning?: boolean;
}) {
  return (
    <div className="flex flex-col">
      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">
        {label}
      </span>
      <span className={`text-sm font-bold ${highlight ? 'text-primary text-base' : warning ? 'text-amber-600 dark:text-amber-500' : 'text-foreground'}`}>
        {value}
      </span>
    </div>
  );
}