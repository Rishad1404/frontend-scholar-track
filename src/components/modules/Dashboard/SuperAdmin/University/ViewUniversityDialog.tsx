// src/app/(dashboardLayout)/(superAdminRoutes)/super-admin/universities-management/_components/ViewUniversityDialog.tsx

"use client";

import { format } from "date-fns";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Building2,
  Globe,
  Users,
  GraduationCap,
  Layers,
  RefreshCw,
  Trash2,
  UserCog,
  Shield,
  Eye,
  Calendar,
} from "lucide-react";
import type { IUniversity } from "@/types/university";
import {
  UNIVERSITY_STATUS_LABELS,
  UNIVERSITY_STATUS_COLORS,
} from "@/types/university";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import Link from "next/link";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  university: IUniversity | null;
  onChangeStatus: (university: IUniversity) => void;
  onDelete: (university: IUniversity) => void;
}

const BRAND_TEAL = "#0097b2";
const BRAND_PURPLE = "#4b2875";

export default function ViewUniversityDialog({
  open,
  onOpenChange,
  university,
  onChangeStatus,
  onDelete,
}: Props) {
  if (!university) return null;

  const statusColor = UNIVERSITY_STATUS_COLORS[university.status] ?? "#6b7280";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-150 p-0 overflow-hidden rounded-[1.5rem] border-border/40 bg-background/95 backdrop-blur-xl shadow-2xl">
        <VisuallyHidden>
          <DialogTitle>Details for {university.name}</DialogTitle>
        </VisuallyHidden>

        {/* ─── Header ─── */}
        <div className="border-b border-border/40 bg-muted/10 px-6 pt-8 pb-6 sm:px-8">
          <div className="flex items-start gap-4 sm:gap-5">
            <div className="flex h-14 w-14 sm:h-16 sm:w-16 shrink-0 items-center justify-center rounded-2xl shadow-inner border border-primary/20 bg-card overflow-hidden"
              style={{
                background: university.logoUrl
                  ? undefined
                  : `linear-gradient(135deg, ${BRAND_PURPLE}15, ${BRAND_TEAL}15)`,
              }}
            >
              {university.logoUrl ? (
                <Image
                  src={university.logoUrl}
                  alt={university.name}
                  width={64}
                  height={64}
                  className="h-full w-full object-cover"
                />
              ) : (
                <Building2
                  className="h-7 w-7 sm:h-8 sm:w-8"
                  style={{ color: BRAND_TEAL }}
                />
              )}
            </div>

            <div className="flex-1 pt-1">
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground leading-tight pr-4">
                {university.name}
              </h2>
              <div className="mt-2.5 flex flex-wrap items-center gap-2">
                <Badge
                  className="px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider"
                  style={{
                    backgroundColor: `${statusColor}15`,
                    color: statusColor,
                    border: `1px solid ${statusColor}40`,
                  }}
                >
                  {UNIVERSITY_STATUS_LABELS[university.status]}
                </Badge>
                {university.website && (
                  <a
                    href={university.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-muted-foreground hover:text-primary hover:underline flex items-center gap-1 transition-colors"
                  >
                    <Globe className="h-3 w-3" />
                    {university.website.replace(/https?:\/\//, "")}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ─── Body ─── */}
        <div className="max-h-[65vh] overflow-y-auto custom-scrollbar px-6 py-6 sm:px-8 space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <StatCard
              icon={UserCog}
              color={BRAND_PURPLE}
              value={university._count?.admins ?? 0}
              label="Admins"
            />
            <StatCard
              icon={GraduationCap}
              color={BRAND_TEAL}
              value={university._count?.students ?? 0}
              label="Students"
            />
            <StatCard
              icon={Layers}
              color="#f59e0b"
              value={university._count?.departments ?? 0}
              label="Departments"
            />
            <StatCard
              icon={Shield}
              color="#8b5cf6"
              value={university._count?.scholarships ?? 0}
              label="Scholarships"
            />
            <StatCard
              icon={Users}
              color="#0ea5e9"
              value={university._count?.departmentHeads ?? 0}
              label="Dept Heads"
            />
            <StatCard
              icon={Users}
              color="#16a34a"
              value={university._count?.reviewers ?? 0}
              label="Reviewers"
            />
          </div>

          {/* Meta Info */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Registration Info
            </h4>
            <InfoRow
              icon={Calendar}
              label="Registered"
              value={format(new Date(university.createdAt), "MMMM dd, yyyy")}
            />
            <InfoRow
              icon={Calendar}
              label="Last Updated"
              value={format(new Date(university.updatedAt), "MMMM dd, yyyy")}
            />
            {university.stripeCustomerId && (
              <InfoRow
                icon={Shield}
                label="Stripe Customer"
                value={university.stripeCustomerId}
                mono
              />
            )}
          </div>
        </div>

        {/* ─── Footer ─── */}
        <div className="border-t border-border/40 bg-muted/10 px-6 py-4 sm:px-8 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onChangeStatus(university)}
              className="rounded-xl font-bold"
            >
              <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
              Change Status
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                onOpenChange(false);
                setTimeout(() => onDelete(university), 150);
              }}
              className="rounded-xl font-bold"
            >
              <Trash2 className="mr-1.5 h-3.5 w-3.5" />
              Delete
            </Button>
          </div>

          <Button
            asChild
            className="rounded-xl font-bold text-white shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${BRAND_PURPLE}, ${BRAND_TEAL})`,
            }}
          >
            <Link
              href={`/super-admin/universities-management/${university.id}`}
            >
              <Eye className="mr-1.5 h-4 w-4" />
              Full Details
            </Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Micro-components ───

function StatCard({
  icon: Icon,
  color,
  value,
  label,
}: {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  color: string;
  value: number;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-border/50 bg-card p-3 shadow-sm transition-colors hover:bg-muted/10">
      <Icon className="mb-2 h-5 w-5" style={{ color }} />
      <span className="text-xl font-black text-foreground">{value}</span>
      <span className="mt-0.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
  mono = false,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-border/50 bg-card p-3 shadow-sm transition-colors hover:bg-muted/10">
      <span className="text-xs sm:text-sm font-medium text-muted-foreground flex items-center gap-2">
        <Icon className="h-4 w-4 opacity-70" /> {label}
      </span>
      <span
        className={`text-xs sm:text-sm font-semibold text-foreground text-right truncate max-w-[55%] ${mono ? "font-mono text-xs" : ""}`}
      >
        {value}
      </span>
    </div>
  );
}