import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatEnumLabel } from "@/lib/formatters";

// ═══════════════════════════════════════════
// COLOR VARIANTS
// ═══════════════════════════════════════════

type ColorVariant =
  | "success"
  | "warning"
  | "destructive"
  | "info"
  | "secondary"
  | "purple"
  | "teal"
  | "default";

const variantStyles: Record<ColorVariant, string> = {
  success:
    "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  warning:
    "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  destructive:
    "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
  info: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  secondary:
    "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20",
  purple:
    "bg-[#4b2875]/10 text-[#4b2875] dark:text-purple-300 border-[#4b2875]/20",
  teal: "bg-[#0097b2]/10 text-[#0097b2] dark:text-cyan-300 border-[#0097b2]/20",
  default:
    "bg-muted text-muted-foreground border-border",
};

// ═══════════════════════════════════════════
// STATUS → COLOR MAPPING
// Covers ALL enums in your Prisma schema
// ═══════════════════════════════════════════

const STATUS_COLOR_MAP: Record<string, ColorVariant> = {
  // UserStatus
  ACTIVE: "success",
  BANNED: "destructive",
  DELETED: "secondary",

  // UniversityStatus
  PENDING: "warning",
  APPROVED: "success",
  SUSPENDED: "destructive",

  // SubscriptionStatus
  INACTIVE: "secondary",
  EXPIRED: "destructive",
  CANCELLED: "destructive",

  // ApplicationStatus
  DRAFT: "secondary",
  SUBMITTED: "info",
  SCREENING: "warning",
  UNDER_REVIEW: "purple",
  REJECTED: "destructive",

  // ScholarshipStatus
  PAUSED: "warning",
  CLOSED: "secondary",

  // DisbursementStatus
  PROCESSING: "info",
  COMPLETED: "success",
  FAILED: "destructive",

  // SubscriptionPaymentStatus
  REFUNDED: "warning",

  // StudentAcademicStatus
  REGULAR: "success",
  PROBATION: "warning",
  DROPPED_OUT: "destructive",

  // Scholarship / Application shared
  DISBURSED: "teal",
};


interface StatusBadgeCellProps {
  status: string;
  className?: string;
}

const StatusBadgeCell = ({ status, className }: StatusBadgeCellProps) => {
  const variant = STATUS_COLOR_MAP[status] || "default";

  return (
    <Badge
      variant="outline"
      className={cn(
        "border font-semibold text-xs tracking-wide",
        variantStyles[variant],
        className
      )}
    >
      {formatEnumLabel(status)}
    </Badge>
  );
};

export default StatusBadgeCell;