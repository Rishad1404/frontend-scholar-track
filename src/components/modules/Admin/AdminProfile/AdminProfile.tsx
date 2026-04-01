// components/modules/Admin/AdminProfile/AdminProfile.tsx

"use client";

import {  useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "@tanstack/react-form";
import { AnimatePresence, motion } from "framer-motion";
import {
  Mail,
  Phone,
  Briefcase,
  ShieldCheck,
  Edit3,
  Building2,
  Globe,
  MapPin,
  X,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

import { getAdminProfile } from "@/services/admin.services";
import { updateAdminAction } from "@/app/(dashboardLayout)/(adminRoutes)/admin/my-profile/_actions";

import AppField from "@/components/shared/form/AppField";
import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

// ═══════════════════════════════════════════
// Types
// ═══════════════════════════════════════════
interface IAdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  profilePhoto?: string | null;
}

interface IAdminUniversity {
  id: string;
  name: string;
  website?: string;
  address?: string;
  country?: string;
}

interface IAdminProfile {
  id: string;
  userId: string;
  universityId: string;
  designation: string | null;
  phone: string | null;
  isOwner: boolean;
  createdAt: string;
  user: IAdminUser;
  university: IAdminUniversity;
}

// ═══════════════════════════════════════════
// Constants
// ═══════════════════════════════════════════
const BRAND_TEAL = "#0097b2";
const BRAND_PURPLE = "#4b2875";

// ═══════════════════════════════════════════
// Props
// ═══════════════════════════════════════════
interface AdminProfileProps {
  adminId: string;
}

// ═══════════════════════════════════════════
// Main Component
// ═══════════════════════════════════════════
export default function AdminProfile({ adminId }: AdminProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // ── Photo Upload State ──
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  // ── Fetch Profile ──
  const {
    data: response,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["admin-profile", adminId],
    queryFn: async () => {
      // 🚨 Fetch the data, then explicitly tell TypeScript what shape it is
      const res = await getAdminProfile(adminId);
      return res as { data: IAdminProfile };
    },
    enabled: !!adminId,
  });

  const profile = response?.data;

  // ── Mutation ──
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (formData: FormData) => updateAdminAction(adminId, formData),
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

      const formData = new FormData();

      // ── Build admin payload ──
      const adminPayload: Record<string, string> = {};

      const trimmedName = value.name.trim();
      const trimmedPhone = value.phone.trim();
      const trimmedDesignation = value.designation.trim();

      if (trimmedName) adminPayload.name = trimmedName;
      if (trimmedPhone) adminPayload.phone = trimmedPhone;
      if (trimmedDesignation) adminPayload.designation = trimmedDesignation;

      if (Object.keys(adminPayload).length > 0) {
        formData.append("admin", JSON.stringify(adminPayload));
      }

      // ── Attach photo if selected ──
      if (photoFile) {
        formData.append("profilePhoto", photoFile);
      }

      // ── Nothing to update? ──
      if (!Object.keys(adminPayload).length && !photoFile) {
        setServerError("No changes to save");
        return;
      }

      try {
        const result = await mutateAsync(formData);

        if (result.success) {
          toast.success(result.message || "Profile updated successfully");
          setPhotoFile(null);
          setPhotoPreview(null);
          setIsEditing(false);
          refetch();
        } else {
          setServerError(result.message || "Something went wrong");
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

  const getRoleBadge = (isOwner: boolean) =>
    isOwner ? "University Owner" : "Administrator";

  // ── Start Editing ──
  const handleEditClick = () => {
    if (profile) {
      form.reset({
        name: profile.user?.name || "",
        phone: profile.phone || "",
        designation: profile.designation || "",
      });
    }
    setPhotoFile(null);
    setPhotoPreview(null);
    setServerError(null);
    setIsEditing(true);
  };

  // ── Cancel ──
  const handleCancel = () => {
    form.reset();
    setPhotoFile(null);
    setPhotoPreview(null);
    setServerError(null);
    setIsEditing(false);
  };

  // ── Loading ──
  if (isLoading) return <ProfileSkeleton />;

  // ── No Profile ──
  if (!profile) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex min-h-[50vh] flex-col items-center justify-center text-center"
      >
        <div className="mb-4 rounded-full bg-rose-500/10 p-4">
          <AlertCircle className="h-10 w-10 text-rose-500" />
        </div>
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          Profile Not Found
        </h2>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          We couldn&apos;t locate your admin profile. Please contact support if you
          believe this is an error.
        </p>
      </motion.div>
    );
  }

  // ── Resolve avatar source ──
  const avatarSrc = photoPreview || profile.user?.profilePhoto;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="max-w-5xl mx-auto space-y-8 pb-16"
    >
      {/* ─── Page Header ─── */}
      <div>
        <h1 className="flex items-center gap-3 text-3xl font-black tracking-tight text-foreground">
          <ShieldCheck className="h-8 w-8" style={{ color: BRAND_PURPLE }} />
          My Profile
        </h1>
        <p className="mt-1 text-sm font-medium text-muted-foreground">
          View and manage your personal information and university designation.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ═══════════════════════════════════════════ */}
        {/* LEFT — Profile Summary                     */}
        {/* ═══════════════════════════════════════════ */}
        <div className="lg:col-span-1 space-y-6">
          {/* Profile Card */}
          <Card className="rounded-2xl shadow-lg border-border/40 overflow-hidden">
            <div
              className="h-1.5 w-full"
              style={{
                background: `linear-gradient(90deg, ${BRAND_TEAL}, ${BRAND_PURPLE})`,
              }}
            />
            <div className="pt-8 pb-6 px-6 flex flex-col items-center text-center">
              {/* Avatar */}
              {avatarSrc && !isEditing ? (
                <div className="relative h-24 w-24 mb-4">
                  <Image
                    src={avatarSrc}
                    alt={profile.user?.name || "Profile"}
                    fill
                    className="rounded-full object-cover border-4 border-background shadow-lg"
                  />
                </div>
              ) : (
                <div
                  className="h-24 w-24 rounded-full flex items-center justify-center mb-4 shadow-lg"
                  style={{
                    background: `linear-gradient(135deg, ${BRAND_PURPLE}, ${BRAND_TEAL})`,
                  }}
                >
                  <span className="text-2xl font-black text-white">
                    {getInitials(profile.user?.name || "A")}
                  </span>
                </div>
              )}

              <h2 className="text-xl font-extrabold text-foreground">
                {profile.user?.name}
              </h2>

              <p className="text-sm text-muted-foreground mt-1">
                {profile.designation || "No designation set"}
              </p>

              <Badge variant="secondary" className="mt-3 font-bold text-xs tracking-wide">
                {getRoleBadge(profile.isOwner)}
              </Badge>

              <Separator className="my-5" />

              <div className="w-full space-y-3 text-left">
                <InfoRow icon={Mail} label="Email" value={profile.user?.email} />
                <InfoRow
                  icon={Phone}
                  label="Phone"
                  value={profile.phone || "Not provided"}
                />
                <InfoRow icon={Briefcase} label="Status" value={profile.user?.status} />
              </div>
            </div>
          </Card>

          {/* University Card */}
          {profile.university && (
            <Card className="rounded-2xl shadow-lg border-border/40 overflow-hidden">
              <div className="px-6 py-4 border-b border-border/40 bg-muted/10">
                <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground">
                  <Building2 className="h-4 w-4" />
                  University
                </h3>
              </div>
              <div className="p-6 space-y-3">
                <InfoRow icon={Building2} label="Name" value={profile.university.name} />
                {profile.university.website && (
                  <InfoRow
                    icon={Globe}
                    label="Website"
                    value={profile.university.website}
                  />
                )}
                {profile.university.country && (
                  <InfoRow
                    icon={MapPin}
                    label="Country"
                    value={profile.university.country}
                  />
                )}
              </div>
            </Card>
          )}
        </div>

        {/* ═══════════════════════════════════════════ */}
        {/* RIGHT — Details / Edit Form                */}
        {/* ═══════════════════════════════════════════ */}
        <div className="lg:col-span-2">
          <Card className="rounded-2xl shadow-lg border-border/40 overflow-hidden">
            <div
              className="h-1.5 w-full"
              style={{
                background: `linear-gradient(90deg, ${BRAND_TEAL}, ${BRAND_PURPLE})`,
              }}
            />

            {/* Header */}
            <div className="flex items-center justify-between border-b border-border/40 bg-muted/10 px-6 sm:px-8 py-5">
              <div>
                <h3 className="text-lg font-bold text-foreground">Personal Details</h3>
                <p className="text-sm text-muted-foreground">
                  {isEditing
                    ? "Update your personal information below"
                    : "Your personal information at a glance"}
                </p>
              </div>

              {!isEditing && (
                <Button
                  onClick={handleEditClick}
                  variant="outline"
                  className="h-9 rounded-xl font-bold shadow-sm"
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              )}
            </div>

            {/* Content */}
            <div className="p-6 sm:p-8">
              <AnimatePresence mode="wait">
                {!isEditing ? (
                  /* ─── View Mode ─── */
                  <motion.div
                    key="view"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-8"
                  >
                    <DetailField label="Full Name" value={profile.user?.name} />
                    <DetailField label="Email Address" value={profile.user?.email} />
                    <DetailField label="Phone Number" value={profile.phone || "—"} />
                    <DetailField label="Designation" value={profile.designation || "—"} />
                    <DetailField label="Role" value={getRoleBadge(profile.isOwner)} />
                    <DetailField
                      label="Member Since"
                      value={new Date(profile.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    />
                  </motion.div>
                ) : (
                  /* ─── Edit Mode ─── */
                  <motion.div
                    key="edit"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
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
                                placeholder="e.g. Registrar, Dean of Students"
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
                            <Alert variant="destructive">
                              <AlertDescription>{serverError}</AlertDescription>
                            </Alert>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Action Buttons */}
                      <Separator />

                      <div className="flex justify-end gap-3">
                        <Button
                          type="button"
                          onClick={handleCancel}
                          variant="ghost"
                          className="h-11 rounded-xl font-bold"
                          disabled={isPending}
                        >
                          <X className="h-4 w-4 mr-2" />
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
                            >
                              Save Changes
                            </AppSubmitButton>
                          )}
                        </form.Subscribe>
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
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border/40 bg-muted/10 p-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-background border border-border/50">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          {label}
        </p>
        <p className="text-sm font-semibold text-foreground truncate">{value}</p>
      </div>
    </div>
  );
}

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      <p className="mt-1.5 text-base font-semibold text-foreground">{value}</p>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-10 w-48 rounded-xl" />
        <Skeleton className="h-4 w-72 rounded-lg" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-6">
          <Skeleton className="h-80 rounded-2xl" />
          <Skeleton className="h-40 rounded-2xl" />
        </div>
        <Skeleton className="h-96 lg:col-span-2 rounded-2xl" />
      </div>
    </div>
  );
}
