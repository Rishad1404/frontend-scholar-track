// components/modules/DepartmentHead/MyProfile/DepartmentHeadProfile.tsx

"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "@tanstack/react-form";
import { AnimatePresence, motion } from "framer-motion";
import {
  Mail,
  Phone,
  Briefcase,
  Edit3,
  Building2,
  AlertCircle,
  GraduationCap,
  BookOpen,
} from "lucide-react";
import { toast } from "sonner";

import { getDepartmentHeadById } from "@/services/departmentHead.services";
import type { IDepartmentHead } from "@/types/departmentHead";

import AppField from "@/components/shared/form/AppField";
import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { updateDepartmentHeadAction } from "@/app/(dashboardLayout)/(adminRoutes)/admin/department-heads-management/_actions";

// ═══════════════════════════════════════════
// Constants
// ═══════════════════════════════════════════
const BRAND_TEAL = "#0097b2";
const BRAND_PURPLE = "#4b2875";

// ═══════════════════════════════════════════
// Props
// ═══════════════════════════════════════════
interface Props {
  deptHeadId: string;
}

// ═══════════════════════════════════════════
// Main Component
// ═══════════════════════════════════════════
export default function DepartmentHeadProfile({ deptHeadId }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // ── Fetch Profile ──
  const {
    data: response,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["dept-head-profile", deptHeadId],
    queryFn: () => getDepartmentHeadById(deptHeadId),
    enabled: !!deptHeadId,
  });

  const profile: IDepartmentHead | undefined = response?.data;

  // ── Mutation ──
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: { name?: string; phone?: string; designation?: string }) =>
      updateDepartmentHeadAction(deptHeadId, payload),
  });

  // ── Form ──
  const form = useForm({
    defaultValues: {
      name: profile?.user?.name ?? "",
      phone: profile?.phone ?? "",
      designation: profile?.designation ?? "",
    },
    onSubmit: async ({ value }) => {
      setServerError(null);

      const payload: Record<string, string> = {};

      const trimmedName = value.name.trim();
      const trimmedPhone = value.phone.trim();
      const trimmedDesignation = value.designation.trim();

      if (trimmedName) payload.name = trimmedName;
      if (trimmedPhone) payload.phone = trimmedPhone;
      if (trimmedDesignation) payload.designation = trimmedDesignation;

      if (Object.keys(payload).length === 0) {
        setServerError("No changes to save");
        return;
      }

      try {
        const result = await mutateAsync(payload);

        if (result.success) {
          toast.success(result.message);
          setIsEditing(false);
          refetch();
        } else {
          setServerError(result.message);
        }
      } catch (error: unknown) {
        setServerError(error instanceof Error ? error.message : "Something went wrong");
      }
    },
  });

  // ── Helpers ──
  const getInitials = (name: string): string =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  const handleEditClick = () => {
    if (profile) {
      form.reset({
        name: profile.user?.name || "",
        phone: profile.phone || "",
        designation: profile.designation || "",
      });
    }
    setServerError(null);
    setIsEditing(true);
  };

  const handleCancel = () => {
    form.reset();
    setServerError(null);
    setIsEditing(false);
  };

  // ── Loading ──
  if (isLoading) return <ProfileSkeleton />;

  // ── No Profile ──
  if (!profile) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex min-h-[50vh] flex-col items-center justify-center text-center px-4"
      >
        <div className="mb-5 rounded-full bg-rose-500/10 p-4 ring-8 ring-rose-500/5">
          <AlertCircle className="h-10 w-10 text-rose-500" />
        </div>
        <h2 className="text-2xl font-extrabold tracking-tight text-foreground">
          Profile Not Found
        </h2>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          We couldn&apos;t locate your profile. Please contact support if you believe this
          is an error.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-7xl mx-auto space-y-6 pb-12 px-4 sm:px-6 lg:px-8"
    >
      {/* ─── Page Header ─── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/40 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center rounded-xl bg-primary/10 p-2">
              <GraduationCap className="h-6 w-6" style={{ color: BRAND_PURPLE }} />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
              My Profile
            </h1>
          </div>
          <p className="text-sm font-medium text-muted-foreground ml-1">
            View and manage your personal information and department designation.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* ═══════════════════════════════════════════ */}
        {/* LEFT — Profile Summary                    */}
        {/* ═══════════════════════════════════════════ */}
        <div className="xl:col-span-4 space-y-6">
          {/* Profile Card */}
          <Card className="rounded-3xl border-border/50 shadow-sm overflow-hidden bg-card/50 backdrop-blur-xl">
            <div
              className="h-1.5 w-full opacity-90"
              style={{
                background: `linear-gradient(90deg, ${BRAND_TEAL}, ${BRAND_PURPLE})`,
              }}
            />
            <div className="px-6 pt-8 pb-6 flex flex-col items-center text-center">
              {/* Avatar */}
              <div className="relative mb-5 group">
                <div
                  className="absolute inset-0 rounded-full blur-lg opacity-30 transition-opacity duration-500 group-hover:opacity-60"
                  style={{
                    background: `linear-gradient(135deg, ${BRAND_PURPLE}, ${BRAND_TEAL})`,
                  }}
                />
                <div
                  className="relative h-24 w-24 rounded-full flex items-center justify-center shadow-md ring-4 ring-background"
                  style={{
                    background: `linear-gradient(135deg, ${BRAND_PURPLE}, ${BRAND_TEAL})`,
                  }}
                >
                  <span className="text-2xl font-black text-white tracking-wide">
                    {getInitials(profile.user?.name || "D")}
                  </span>
                </div>
              </div>

              <h2 className="text-xl font-extrabold text-foreground tracking-tight">
                {profile.user?.name}
              </h2>

              <p className="text-sm font-medium text-muted-foreground mt-1">
                {profile.designation || "No designation set"}
              </p>

              <Badge
                variant="secondary"
                className="mt-3 px-3 py-1 font-bold text-[10px] tracking-wider uppercase bg-secondary/60"
              >
                Department Head
              </Badge>

              <Separator className="my-6 opacity-50" />

              <div className="w-full space-y-1 text-left">
                <InfoRow icon={Mail} label="Email Address" value={profile.user?.email} />
                <InfoRow
                  icon={Phone}
                  label="Phone Number"
                  value={profile.phone || "Not provided"}
                />
                <InfoRow
                  icon={Briefcase}
                  label="Account Status"
                  value={profile.user?.status}
                />
              </div>
            </div>
          </Card>

          {/* University & Department Card */}
          <Card className="rounded-3xl border-border/50 shadow-sm overflow-hidden bg-card/50 backdrop-blur-xl">
            <div className="px-6 py-4 border-b border-border/40 bg-muted/20 flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-primary/10">
                <Building2 className="h-4 w-4 text-primary" />
              </div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-foreground/80">
                Institution
              </h3>
            </div>
            <div className="p-6 space-y-2">
              <InfoRow
                icon={Building2}
                label="University"
                value={profile.university?.name || "—"}
              />
              <InfoRow
                icon={BookOpen}
                label="Department"
                value={profile.department?.name || "—"}
              />
            </div>
          </Card>
        </div>

        {/* ═══════════════════════════════════════════ */}
        {/* RIGHT — Details / Edit Form                */}
        {/* ═══════════════════════════════════════════ */}
        <div className="xl:col-span-8">
          <Card className="rounded-3xl border-border/50 shadow-sm bg-card/50 backdrop-blur-xl h-full flex flex-col">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border/40 px-6 sm:px-8 py-5 gap-4">
              <div>
                <h3 className="text-lg font-extrabold text-foreground tracking-tight">
                  Personal Details
                </h3>
                <p className="text-xs font-medium text-muted-foreground mt-0.5">
                  {isEditing
                    ? "Update your personal information below."
                    : "Review your personal information at a glance."}
                </p>
              </div>

              {!isEditing && (
                <Button
                  onClick={handleEditClick}
                  variant="outline"
                  className="h-9 px-4 rounded-xl font-bold shadow-sm hover:bg-primary hover:text-primary-foreground transition-colors border-border/60 text-xs"
                >
                  <Edit3 className="h-3.5 w-3.5 mr-2" />
                  Edit Profile
                </Button>
              )}
            </div>

            {/* Content */}
            <div className="p-6 sm:p-8 flex-1">
              <AnimatePresence mode="wait">
                {!isEditing ? (
                  /* ─── View Mode ─── */
                  <motion.div
                    key="view"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.2 }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-8"
                  >
                    <DetailField label="Full Name" value={profile.user?.name} />
                    <DetailField label="Email Address" value={profile.user?.email} />
                    <DetailField label="Phone Number" value={profile.phone || "—"} />
                    <DetailField label="Designation" value={profile.designation || "—"} />
                    <DetailField
                      label="University"
                      value={profile.university?.name || "—"}
                    />
                    <DetailField
                      label="Department"
                      value={profile.department?.name || "—"}
                    />
                    <div className="sm:col-span-2">
                      <DetailField
                        label="Member Since"
                        value={new Date(profile.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      />
                    </div>
                  </motion.div>
                ) : (
                  /* ─── Edit Mode ─── */
                  <motion.div
                    key="edit"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <form
                      noValidate
                      onSubmit={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        form.handleSubmit();
                      }}
                      className="space-y-6"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {/* Name */}
                        <form.Field
                          name="name"
                          validators={{
                            onChange: ({ value }) => {
                              if (!value.trim()) return "Name is required";
                              if (value.trim().length < 2)
                                return "Name must be at least 2 characters";
                              if (value.trim().length > 100)
                                return "Name must be at most 100 characters";
                              return undefined;
                            },
                          }}
                        >
                          {(field) => (
                            <AppField
                              field={field}
                              label="Full Name"
                              placeholder="Enter your full name"
                            />
                          )}
                        </form.Field>

                        {/* Phone */}
                        <form.Field
                          name="phone"
                          validators={{
                            onChange: ({ value }) => {
                              if (
                                value.trim() &&
                                (value.trim().length < 11 || value.trim().length > 15)
                              )
                                return "Phone must be between 11 and 15 characters";
                              return undefined;
                            },
                          }}
                        >
                          {(field) => (
                            <AppField
                              field={field}
                              label="Phone Number"
                              placeholder="e.g. 01712345678"
                            />
                          )}
                        </form.Field>

                        {/* Designation */}
                        <form.Field
                          name="designation"
                          validators={{
                            onChange: ({ value }) => {
                              if (value.trim().length > 100)
                                return "Designation must be at most 100 characters";
                              return undefined;
                            },
                          }}
                        >
                          {(field) => (
                            <div className="sm:col-span-2">
                              <AppField
                                field={field}
                                label="Designation"
                                placeholder="e.g. Head of Computer Science"
                              />
                            </div>
                          )}
                        </form.Field>
                      </div>

                      {/* Server Error */}
                      <AnimatePresence mode="wait">
                        {serverError && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Alert variant="destructive" className="rounded-xl">
                              <AlertDescription className="font-medium text-xs">
                                {serverError}
                              </AlertDescription>
                            </Alert>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Action Buttons */}
                      <div className="pt-4 border-t border-border/40 mt-4">
                        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3">
                          <Button
                            type="button"
                            onClick={handleCancel}
                            variant="ghost"
                            className="h-10 w-full sm:w-auto px-6 rounded-xl font-bold hover:bg-muted/50 text-sm"
                            disabled={isPending}
                          >
                            Cancel
                          </Button>

                          <form.Subscribe
                            selector={(s) => [s.canSubmit, s.isSubmitting] as const}
                          >
                            {([canSubmit, isSubmitting]) => (
                              <AppSubmitButton
                                isPending={isSubmitting || isPending}
                                pendingLabel="Saving..."
                                disabled={!canSubmit}
                                className="h-10 w-full sm:w-auto px-6 rounded-xl font-bold text-sm shadow-sm"
                              >
                                Save Changes
                              </AppSubmitButton>
                            )}
                          </form.Subscribe>
                        </div>
                      </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════
// Sub-Components
// ═══════════════════════════════════════════

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value?: string | null;
}) {
  return (
    <div className="flex items-center gap-3.5 py-2.5 px-2 rounded-xl transition-colors hover:bg-muted/30 group">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-muted/40 border border-border/40 text-muted-foreground group-hover:bg-background group-hover:text-foreground transition-all">
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80 mb-0.5">
          {label}
        </p>
        <p className="text-sm font-semibold text-foreground truncate">{value}</p>
      </div>
    </div>
  );
}

function DetailField({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="space-y-1">
      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">
        {label}
      </p>
      <p className="text-sm font-semibold text-foreground leading-tight">{value}</p>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 px-4 sm:px-6 lg:px-8 pb-12">
      <div className="space-y-3 border-b border-border/40 pb-5">
        <Skeleton className="h-8 w-48 rounded-xl" />
        <Skeleton className="h-4 w-72 rounded-lg" />
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-4 space-y-6">
          <Skeleton className="h-95 rounded-3xl" />
          <Skeleton className="h-45 rounded-3xl" />
        </div>
        <Skeleton className="xl:col-span-8 h-125 rounded-3xl" />
      </div>
    </div>
  );
}
