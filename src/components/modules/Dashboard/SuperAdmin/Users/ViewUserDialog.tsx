// src/app/(dashboardLayout)/(superAdminRoutes)/super-admin/users-management/_components/ViewUserDialog.tsx

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
  User,
  Mail,
  Shield,
  Building2,
  Layers,
  CheckCircle2,
  XCircle,
  Calendar,
  Ban,
  UserCheck,
  Trash2,
  Crown,
  CreditCard,
} from "lucide-react";
import type { IUser } from "@/types/user";
import {
  USER_ROLE_LABELS,
  USER_ROLE_COLORS,
  USER_STATUS_LABELS,
  USER_STATUS_COLORS,
} from "@/types/user";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: IUser | null;
  onChangeStatus: (user: IUser) => void;
  onDelete: (user: IUser) => void;
}


export default function ViewUserDialog({
  open,
  onOpenChange,
  user,
  onChangeStatus,
  onDelete,
}: Props) {
  if (!user) return null;

  const roleColor = USER_ROLE_COLORS[user.role] ?? "#6b7280";
  const statusColor = USER_STATUS_COLORS[user.status] ?? "#6b7280";
  const isSuperAdmin = user.role === "SUPER_ADMIN";

  // Get university info from any role profile
  const universityName =
    user.admin?.university?.name ??
    user.student?.university?.name ??
    user.departmentHead?.university?.name ??
    user.reviewer?.university?.name ??
    null;

  const departmentName = user.departmentHead?.department?.name ?? null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-125 p-0 overflow-hidden rounded-[1.5rem] border-border/40 bg-background/95 backdrop-blur-xl shadow-2xl">
        <VisuallyHidden>
          <DialogTitle>User: {user.name}</DialogTitle>
        </VisuallyHidden>

        {/* ─── Header ─── */}
        <div className="border-b border-border/40 bg-muted/10 px-6 pt-8 pb-6 sm:px-8">
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div className="h-14 w-14 sm:h-16 sm:w-16 shrink-0 rounded-full overflow-hidden border-2 border-border/40 bg-muted/30 flex items-center justify-center">
              {user.image ? (
                <Image
                  src={user.image}
                  alt={user.name}
                  width={64}
                  height={64}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-2xl font-black text-muted-foreground">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>

            <div className="flex-1 pt-0.5">
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground leading-tight">
                {user.name}
              </h2>
              <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                <Mail className="h-3.5 w-3.5" />
                {user.email}
              </p>
              <div className="mt-2.5 flex flex-wrap items-center gap-2">
                <Badge
                  className="px-2.5 py-0.5 text-xs font-bold"
                  style={{
                    backgroundColor: `${roleColor}15`,
                    color: roleColor,
                    border: `1px solid ${roleColor}40`,
                  }}
                >
                  <Shield className="h-3 w-3 mr-1" />
                  {USER_ROLE_LABELS[user.role]}
                </Badge>
                <Badge
                  className="px-2.5 py-0.5 text-xs font-bold"
                  style={{
                    backgroundColor: `${statusColor}15`,
                    color: statusColor,
                    border: `1px solid ${statusColor}40`,
                  }}
                >
                  {USER_STATUS_LABELS[user.status]}
                </Badge>
                {user.emailVerified ? (
                  <Badge className="px-2.5 py-0.5 text-xs font-bold bg-green-500/10 text-green-600 border border-green-500/30">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="px-2.5 py-0.5 text-xs font-bold">
                    <XCircle className="h-3 w-3 mr-1" />
                    Unverified
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ─── Body ─── */}
        <div className="max-h-[65vh] overflow-y-auto custom-scrollbar px-6 py-6 sm:px-8 space-y-5">
          {/* Role-specific Info */}
          {universityName && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Organization
              </h4>
              <InfoRow
                icon={Building2}
                label="University"
                value={universityName}
              />
              {departmentName && (
                <InfoRow
                  icon={Layers}
                  label="Department"
                  value={departmentName}
                />
              )}
              {user.admin?.isOwner && (
                <InfoRow
                  icon={Crown}
                  label="Admin Role"
                  value="Owner"
                  valueClass="text-amber-600 font-bold"
                />
              )}
              {user.admin?.subscriptionStatus && (
                <InfoRow
                  icon={CreditCard}
                  label="Subscription"
                  value={user.admin.subscriptionStatus}
                />
              )}
            </div>
          )}

          {/* Dates */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Account Info
            </h4>
            <InfoRow
              icon={Calendar}
              label="Joined"
              value={format(new Date(user.createdAt), "MMMM dd, yyyy")}
            />
            <InfoRow
              icon={Calendar}
              label="Last Updated"
              value={format(new Date(user.updatedAt), "MMMM dd, yyyy")}
            />
            <InfoRow
              icon={User}
              label="Password Change Required"
              value={user.needPasswordChange ? "Yes" : "No"}
            />
          </div>
        </div>

        {/* ─── Footer ─── */}
        {!isSuperAdmin && (
          <div className="border-t border-border/40 bg-muted/10 px-6 py-4 sm:px-8 flex flex-wrap items-center justify-end gap-3">
            {user.status === "ACTIVE" && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onChangeStatus(user)}
                className="rounded-xl font-bold gap-1.5"
              >
                <Ban className="h-3.5 w-3.5" />
                Ban User
              </Button>
            )}
            {user.status === "BANNED" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onChangeStatus(user)}
                className="rounded-xl font-bold gap-1.5"
              >
                <UserCheck className="h-3.5 w-3.5" />
                Unban User
              </Button>
            )}
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                onOpenChange(false);
                setTimeout(() => onDelete(user), 150);
              }}
              className="rounded-xl font-bold gap-1.5"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
  valueClass = "",
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-border/50 bg-card p-3 shadow-sm transition-colors hover:bg-muted/10">
      <span className="text-xs sm:text-sm font-medium text-muted-foreground flex items-center gap-2">
        <Icon className="h-4 w-4 opacity-70" /> {label}
      </span>
      <span
        className={`text-xs sm:text-sm font-semibold text-foreground text-right truncate max-w-[55%] ${valueClass}`}
      >
        {value}
      </span>
    </div>
  );
}