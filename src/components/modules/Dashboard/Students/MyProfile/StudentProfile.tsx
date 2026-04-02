// components/modules/Student/MyProfile/StudentProfile.tsx

"use client";

import { useRef, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "@tanstack/react-form";
import { AnimatePresence, motion } from "framer-motion";
import {
  User,
  Phone,
  GraduationCap,
  BookOpen,
  Edit3,
  X,
  AlertCircle,
  ImagePlus,
  Building2,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

import { getStudentMyProfile } from "@/services/student.services";
import {
  updateStudentProfileAction,
  uploadStudentPhotoAction,
} from "@/app/(dashboardLayout)/(studentRoutes)/student/profile/_actions";
import type { IStudentMyProfile } from "@/types/student";

import AppField from "@/components/shared/form/AppField";
import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

const BRAND_TEAL = "#0097b2";
const BRAND_PURPLE = "#4b2875";

export default function StudentProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // Photo upload
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Fetch ──
  const {
    data: response,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["student-my-profile"],
    queryFn: async () => {
      const res = await getStudentMyProfile();
      return res as { data: IStudentMyProfile };
    },
  });
  const profile = response?.data;

  // ── Mutations ──
  const { mutateAsync: updateProfile, isPending: isUpdating } = useMutation({
    mutationFn: (payload: {
      student: {
        name?: string;
        phone?: string;
        address?: string;
        gender?: string;
      };
    }) => updateStudentProfileAction(payload),
  });

  const { mutateAsync: uploadPhoto, isPending: isUploading } = useMutation({
    mutationFn: (formData: FormData) => uploadStudentPhotoAction(formData),
  });

  const isPending = isUpdating || isUploading;

  // ── Form ──
  const form = useForm({
    defaultValues: {
      name: profile?.user?.name ?? "",
      phone: profile?.phone ?? "",
      address: profile?.address ?? "",
    },
    onSubmit: async ({ value }) => {
      setServerError(null);

      const payload: Record<string, string> = {};
      if (value.name.trim()) payload.name = value.name.trim();
      if (value.phone.trim()) payload.phone = value.phone.trim();
      if (value.address.trim()) payload.address = value.address.trim();

      const hasFieldChanges = Object.keys(payload).length > 0;

      if (!hasFieldChanges && !photoFile) {
        setServerError("No changes to save");
        return;
      }

      try {
        // Upload photo first if selected
        if (photoFile) {
          const photoFormData = new FormData();
          photoFormData.append("profilePhoto", photoFile);
          const photoResult = await uploadPhoto(photoFormData);
          if (!photoResult.success) {
            setServerError(photoResult.message);
            return;
          }
        }

        // Update profile fields
        if (hasFieldChanges) {
          const result = await updateProfile({ student: payload });
          if (!result.success) {
            setServerError(result.message);
            return;
          }
        }

        toast.success("Profile updated successfully");
        setPhotoFile(null);
        setPhotoPreview(null);
        setIsEditing(false);
        refetch();
      } catch (error: unknown) {
        setServerError(error instanceof Error ? error.message : "Something went wrong");
      }
    },
  });

  // ── Photo Handlers ──
  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be smaller than 2MB");
      return;
    }
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const clearPhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ── Helpers ──
  const getInitials = (name: string) =>
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
        address: profile.address || "",
      });
    }
    setPhotoFile(null);
    setPhotoPreview(null);
    setServerError(null);
    setIsEditing(true);
  };

  const handleCancel = () => {
    form.reset();
    setPhotoFile(null);
    setPhotoPreview(null);
    setServerError(null);
    setIsEditing(false);
  };

  if (isLoading) return <ProfileSkeleton />;

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
          We couldn&apos;t locate your student profile.
        </p>
      </motion.div>
    );
  }

  const avatarSrc = photoPreview || profile.profilePhoto || profile.user?.image;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="max-w-6xl mx-auto space-y-8 pb-16"
    >
      {/* ─── Header ─── */}
      <div>
        <h1 className="flex items-center gap-3 text-3xl font-black tracking-tight text-foreground">
          <GraduationCap className="h-8 w-8" style={{ color: BRAND_PURPLE }} />
          My Profile
        </h1>
        <p className="mt-1 text-sm font-medium text-muted-foreground">
          View and manage your personal and academic information.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ═══════════════════════════════════════════ */}
        {/* LEFT — Summary Cards                      */}
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
              {avatarSrc && !isEditing ? (
                <div className="relative h-24 w-24 mb-4">
                  <Image
                    src={avatarSrc}
                    alt={profile.user?.name || "Profile"}
                    fill
                    sizes="96px"
                    priority
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
                    {getInitials(profile.user?.name || "S")}
                  </span>
                </div>
              )}

              <h2 className="text-xl font-extrabold text-foreground">
                {profile.user?.name}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">{profile.user?.email}</p>

              <Badge variant="secondary" className="mt-3 font-bold text-xs tracking-wide">
                Student
              </Badge>

              <Separator className="my-5" />

              <div className="w-full space-y-3 text-left">
                <InfoRow icon={Phone} label="Phone" value={profile.phone} />
                <InfoRow icon={User} label="Gender" value={profile.gender} />
                <InfoRow
                  icon={ShieldCheck}
                  label="Email Verified"
                  value={profile.user?.emailVerified ? "Yes" : "No"}
                />
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
              </div>
            </Card>
          )}
        </div>

        {/* ═══════════════════════════════════════════ */}
        {/* RIGHT — Details / Edit / Academic         */}
        {/* ═══════════════════════════════════════════ */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Details Card */}
          <Card className="rounded-2xl shadow-lg border-border/40 overflow-hidden">
            <div
              className="h-1.5 w-full"
              style={{
                background: `linear-gradient(90deg, ${BRAND_TEAL}, ${BRAND_PURPLE})`,
              }}
            />

            <div className="flex items-center justify-between border-b border-border/40 bg-muted/10 px-6 sm:px-8 py-5">
              <div>
                <h3 className="text-lg font-bold text-foreground">Personal Details</h3>
                <p className="text-sm text-muted-foreground">
                  {isEditing
                    ? "Update your personal information below"
                    : "Your personal information at a glance"}
                </p>
              </div>

              {/* ACTION BUTTON MOVED TO TOP HEADER */}
              <div>
                {!isEditing ? (
                  <Button
                    onClick={handleEditClick}
                    variant="outline"
                    className="h-9 rounded-xl font-bold shadow-sm hover:bg-muted"
                  >
                    <Edit3 className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={handleCancel}
                    variant="ghost"
                    className="h-9 rounded-xl font-bold text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    disabled={isPending}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                )}
              </div>
            </div>

            <div className="p-6 sm:p-8">
              <AnimatePresence mode="wait">
                {!isEditing ? (
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
                    <DetailField label="Phone Number" value={profile.phone} />
                    <DetailField label="Gender" value={profile.gender} />
                    <DetailField
                      label="Date of Birth"
                      value={
                        profile.dateOfBirth
                          ? new Date(profile.dateOfBirth).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })
                          : undefined
                      }
                    />
                    <DetailField
                      label="Blood Group"
                      value={profile.bloodGroup?.replace("_", " ")}
                    />
                    <DetailField label="Address" value={profile.address} />
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

                        {/* Address */}
                        <form.Field
                          name="address"
                          validators={{
                            onChange: ({ value }) => {
                              if (value.trim().length > 500)
                                return "Address must be at most 500 characters";
                              return undefined;
                            },
                          }}
                        >
                          {(field) => (
                            <div className="sm:col-span-2">
                              <AppField
                                field={field}
                                label="Address"
                                placeholder="Enter your address"
                              />
                            </div>
                          )}
                        </form.Field>

                        {/* Photo Upload */}
                        <div className="sm:col-span-2 space-y-2">
                          <Label className="font-bold text-foreground">
                            Profile Photo
                          </Label>
                          <div className="flex items-center gap-4">
                            {(photoPreview ||
                              profile.profilePhoto ||
                              profile.user?.image) && (
                              <div className="relative">
                                <Image
                                  src={
                                    photoPreview ||
                                    profile.profilePhoto ||
                                    profile.user.image!
                                  }
                                  alt="Profile"
                                  className="rounded-full border object-cover shadow-sm"
                                  width={64}
                                  height={64}
                                />
                                {photoPreview && (
                                  <button
                                    type="button"
                                    onClick={clearPhoto}
                                    className="absolute -right-1.5 -top-1.5 rounded-full bg-destructive p-1 text-white shadow-sm hover:bg-destructive/90 transition-colors"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                )}
                              </div>
                            )}
                            <div>
                              <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handlePhotoSelect}
                                className="hidden"
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isPending}
                                className="gap-2 rounded-xl font-bold shadow-sm hover:bg-muted"
                              >
                                <ImagePlus className="h-4 w-4" />
                                {photoPreview
                                  ? "Change Photo"
                                  : profile.profilePhoto
                                    ? "Replace Photo"
                                    : "Upload Photo"}
                              </Button>
                              <p className="mt-1.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                                PNG, JPG. Max 2MB.
                              </p>
                            </div>
                          </div>
                        </div>
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
                            <Alert
                              variant="destructive"
                              className="rounded-xl border-rose-500/30 bg-rose-500/10 text-rose-600"
                            >
                              <AlertCircle className="h-4 w-4" />
                              <AlertDescription className="font-bold ml-2">
                                {serverError}
                              </AlertDescription>
                            </Alert>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* We removed the Cancel button from here, keeping just the Submit button */}
                      <div className="flex justify-end pt-2">
                        <form.Subscribe
                          selector={(s) => [s.canSubmit, s.isSubmitting] as const}
                        >
                          {([canSubmit, isSubmitting]) => (
                            <AppSubmitButton
                              isPending={isSubmitting || isPending}
                              pendingLabel="Saving Updates..."
                              disabled={!canSubmit}
                              className="rounded-xl font-black px-8 shadow-md"
                              style={{
                                background: `linear-gradient(135deg, ${BRAND_PURPLE}, ${BRAND_TEAL})`,
                              }}
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

          {profile.academicInfo && (
            <Card className="rounded-2xl shadow-lg border-border/40 overflow-hidden">
              <div
                className="h-1.5 w-full"
                style={{
                  background: `linear-gradient(90deg, ${BRAND_TEAL}, ${BRAND_PURPLE})`,
                }}
              />
              <div className="px-6 sm:px-8 py-5 border-b border-border/40 bg-muted/10">
                <h3 className="flex items-center gap-2 text-lg font-bold text-foreground">
                  <BookOpen className="h-5 w-5" style={{ color: BRAND_PURPLE }} />
                  Academic Information
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Your official university records and current status.
                </p>
              </div>

              <div className="p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-2 gap-8">
                <DetailField
                  label="Student ID"
                  value={profile.academicInfo.studentIdNo}
                />
                <DetailField
                  label="Department"
                  value={profile.academicInfo.department?.name}
                />
                <DetailField
                  label="Academic Level"
                  value={profile.academicInfo.level?.name}
                />
                <DetailField
                  label="Current Term"
                  value={profile.academicInfo.term?.name}
                />
                <DetailField
                  label="GPA / CGPA"
                  value={`${profile.academicInfo.gpa} / ${profile.academicInfo.cgpa}`}
                  highlight
                />
                <DetailField
                  label="Academic Status"
                  value={profile.academicInfo.academicStatus?.replace("_", " ")}
                />
              </div>
            </Card>
          )}
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
  value?: string | number | null;
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
        <p className="text-sm font-semibold text-foreground truncate">
          {value !== null && value !== undefined && value !== "" ? String(value) : "—"}
        </p>
      </div>
    </div>
  );
}

function DetailField({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value?: string | number | null;
  highlight?: boolean;
}) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      <p
        className={`mt-1.5 text-base font-semibold leading-tight ${highlight ? "text-primary font-black" : "text-foreground"}`}
      >
        {value !== null && value !== undefined && value !== "" ? String(value) : "—"}
      </p>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      <div className="space-y-2">
        <Skeleton className="h-10 w-48 rounded-xl" />
        <Skeleton className="h-4 w-72 rounded-lg" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-6">
          <Skeleton className="h-80 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
        </div>
        <div className="lg:col-span-2 space-y-6">
          <Skeleton className="h-96 rounded-2xl" />
          <Skeleton className="h-64 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
