"use client";

import { cn } from "@/lib/utils";

interface InviteStatusBadgeProps {
  used: boolean;
  expiresAt: string;
}

function getInviteStatus(
  used: boolean,
  expiresAt: string
): { label: string; variant: "success" | "warning" | "destructive" } {
  if (used) return { label: "Accepted", variant: "success" };
  if (new Date(expiresAt) < new Date())
    return { label: "Expired", variant: "destructive" };
  return { label: "Pending", variant: "warning" };
}

const InviteStatusBadge = ({ used, expiresAt }: InviteStatusBadgeProps) => {
  const { label, variant } = getInviteStatus(used, expiresAt);

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold uppercase tracking-wide",
        variant === "success" &&
          "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
        variant === "warning" &&
          "bg-amber-500/10 text-amber-600 dark:text-amber-400",
        variant === "destructive" &&
          "bg-rose-500/10 text-rose-600 dark:text-rose-400"
      )}
    >
      {label}
    </span>
  );
};

export default InviteStatusBadge;