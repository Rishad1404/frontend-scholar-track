// components/modules/Student/CompleteProfile/CompleteProfileForm.tsx

"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  GraduationCap,
  Building2,
  User,
  Calendar,
  Droplets,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

import {
  getApprovedUniversities,
  getStudentMyProfile,
} from "@/services/student.services";
import { completeProfileAction } from "@/app/(dashboardLayout)/(studentRoutes)/student/complete-profile/_actions";
import type { IStudentMyProfile } from "@/types/student"; // ✅ IMPORT ADDED

import AppField from "@/components/shared/form/AppField";
import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const BRAND_TEAL = "#0097b2";
const BRAND_PURPLE = "#4b2875";

const GENDER_OPTIONS = [
  { value: "MALE", label: "Male" },
  { value: "FEMALE", label: "Female" },
  { value: "OTHER", label: "Other" },
];

const BLOOD_GROUP_OPTIONS = [
  { value: "A_POS", label: "A+" },
  { value: "A_NEG", label: "A-" },
  { value: "B_POS", label: "B+" },
  { value: "B_NEG", label: "B-" },
  { value: "O_POS", label: "O+" },
  { value: "O_NEG", label: "O-" },
  { value: "AB_POS", label: "AB+" },
  { value: "AB_NEG", label: "AB-" },
];

export default function CompleteProfileForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  // ── Check if profile already completed ──
  const { data: profileRes, isLoading: isProfileLoading } = useQuery({
    queryKey: ["student-my-profile"],
    queryFn: async () => {
      const res = await getStudentMyProfile();
      return res as { data: IStudentMyProfile }; // ✅ FIX: Cast the response type
    },
  });

  const profile = profileRes?.data;
  const isAlreadyCompleted = !!(profile?.universityId && profile?.gender);

  // ── Fetch universities ──
  const { data: uniRes, isLoading: isUniLoading } = useQuery({
    queryKey: ["approved-universities"],
    queryFn: async () => {
      const res = await getApprovedUniversities();
      return res as { data: { id: string; name: string }[] }; // ✅ FIX: Cast the response type
    },
    enabled: !isAlreadyCompleted,
  });

  const universities = uniRes?.data || [];

  // ── Mutation ──
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: {
      universityId: string;
      gender: string;
      dateOfBirth: string;
      bloodGroup?: string;
      phone?: string;
      address?: string;
    }) => completeProfileAction(payload),
  });

  // ── Form ──
  const form = useForm({
    defaultValues: {
      universityId: "",
      gender: "",
      dateOfBirth: "",
      bloodGroup: "",
      phone: "",
      address: "",
    },
    onSubmit: async ({ value }) => {
      setServerError(null);

      if (!value.universityId) {
        setServerError("Please select your university");
        return;
      }
      if (!value.gender) {
        setServerError("Please select your gender");
        return;
      }
      if (!value.dateOfBirth) {
        setServerError("Please enter your date of birth");
        return;
      }

      const payload: {
        universityId: string;
        gender: string;
        dateOfBirth: string;
        bloodGroup?: string;
        phone?: string;
        address?: string;
      } = {
        universityId: value.universityId,
        gender: value.gender,
        dateOfBirth: value.dateOfBirth,
      };

      if (value.bloodGroup) payload.bloodGroup = value.bloodGroup;
      if (value.phone.trim()) payload.phone = value.phone.trim();
      if (value.address.trim()) payload.address = value.address.trim();

      try {
        const result = await mutateAsync(payload);

        if (result.success) {
          toast.success(result.message);
          router.push("/student/profile");
        } else {
          setServerError(result.message);
        }
      } catch (error: unknown) {
        setServerError(
          error instanceof Error ? error.message : "Something went wrong"
        );
      }
    },
  });

  // ── Loading ──
  if (isProfileLoading || isUniLoading) return <FormSkeleton />;

  // ── Already completed ──
  if (isAlreadyCompleted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        <Card className="rounded-2xl shadow-lg border-border/40 overflow-hidden">
          <div
            className="h-1.5 w-full"
            style={{
              background: `linear-gradient(90deg, ${BRAND_TEAL}, ${BRAND_PURPLE})`,
            }}
          />
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
            <div className="mb-4 rounded-full bg-emerald-500/10 p-4">
              <CheckCircle2 className="h-10 w-10 text-emerald-500" />
            </div>
            <h2 className="text-xl font-bold text-foreground">
              Profile Already Completed
            </h2>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              Your profile is already set up. You can update it from your
              profile page.
            </p>
            <button
              onClick={() => router.push("/student/profile")}
              className="mt-6 rounded-xl px-6 py-2.5 font-bold text-white shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${BRAND_PURPLE}, ${BRAND_TEAL})`,
              }}
            >
              Go to My Profile
            </button>
          </div>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="max-w-2xl mx-auto space-y-8 pb-16"
    >
      {/* ─── Header ─── */}
      <div>
        <h1 className="flex items-center gap-3 text-3xl font-black tracking-tight text-foreground">
          <GraduationCap className="h-8 w-8" style={{ color: BRAND_PURPLE }} />
          Complete Your Profile
        </h1>
        <p className="mt-1 text-sm font-medium text-muted-foreground">
          Fill in your personal information to get started with scholarships.
        </p>
      </div>

      {/* ─── Progress Indicator ─── */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div
            className="h-8 w-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
            style={{
              background: `linear-gradient(135deg, ${BRAND_PURPLE}, ${BRAND_TEAL})`,
            }}
          >
            1
          </div>
          <span className="text-sm font-bold text-foreground">
            Personal Info
          </span>
        </div>
        <div className="h-px flex-1 bg-border/60" />
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full flex items-center justify-center bg-muted text-muted-foreground text-sm font-bold">
            2
          </div>
          <span className="text-sm font-medium text-muted-foreground">
            Academic Info
          </span>
        </div>
        <div className="h-px flex-1 bg-border/60" />
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full flex items-center justify-center bg-muted text-muted-foreground text-sm font-bold">
            3
          </div>
          <span className="text-sm font-medium text-muted-foreground">
            Apply
          </span>
        </div>
      </div>

      {/* ─── Form Card ─── */}
      <Card className="rounded-2xl shadow-lg border-border/40 overflow-hidden">
        <div
          className="h-1.5 w-full"
          style={{
            background: `linear-gradient(90deg, ${BRAND_TEAL}, ${BRAND_PURPLE})`,
          }}
        />

        <div className="p-6 sm:p-8">
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
              {/* University Select */}
              <div className="sm:col-span-2 space-y-2">
                <Label className="font-bold text-foreground">
                  University <span className="text-red-500">*</span>
                </Label>
                <form.Field name="universityId">
                  {(field) => (
                    <>
                      <Select
                        value={field.state.value}
                        onValueChange={(val) => field.handleChange(val)}
                        disabled={isPending}
                      >
                        <SelectTrigger className="h-11 rounded-xl bg-muted/30">
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                            <SelectValue placeholder="Select your university" />
                          </div>
                        </SelectTrigger>
                        <SelectContent>
                          {universities.map((uni) => (
                            <SelectItem key={uni.id} value={uni.id}>
                              {uni.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {universities.length === 0 && (
                        <p className="text-xs text-muted-foreground">
                          No approved universities found.
                        </p>
                      )}
                    </>
                  )}
                </form.Field>
              </div>

              {/* Gender Select */}
              <div className="space-y-2">
                <Label className="font-bold text-foreground">
                  Gender <span className="text-red-500">*</span>
                </Label>
                <form.Field name="gender">
                  {(field) => (
                    <Select
                      value={field.state.value}
                      onValueChange={(val) => field.handleChange(val)}
                      disabled={isPending}
                    >
                      <SelectTrigger className="h-11 rounded-xl bg-muted/30">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <SelectValue placeholder="Select gender" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        {GENDER_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </form.Field>
              </div>

              {/* Date of Birth */}
              <form.Field
                name="dateOfBirth"
                validators={{
                  onChange: ({ value }) => {
                    if (!value) return "Date of birth is required";
                    const date = new Date(value);
                    if (isNaN(date.getTime())) return "Invalid date";
                    const age =
                      (Date.now() - date.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
                    if (age < 15) return "You must be at least 15 years old";
                    if (age > 100) return "Invalid date of birth";
                    return undefined;
                  },
                }}
              >
                {(field) => (
                  <div className="space-y-2">
                    <Label className="font-bold text-foreground">
                      Date of Birth <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        type="date"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        disabled={isPending}
                        max={new Date().toISOString().split("T")[0]}
                        className="flex h-11 w-full rounded-xl border border-input bg-muted/30 pl-10 pr-3 py-2 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>
                    {field.state.meta.errors?.[0] && (
                      <p className="text-xs font-medium text-destructive">
                        {field.state.meta.errors[0]}
                      </p>
                    )}
                  </div>
                )}
              </form.Field>

              {/* Blood Group */}
              <div className="space-y-2">
                <Label className="font-bold text-foreground">
                  Blood Group{" "}
                  <span className="text-muted-foreground text-xs">
                    (optional)
                  </span>
                </Label>
                <form.Field name="bloodGroup">
                  {(field) => (
                    <Select
                      value={field.state.value}
                      onValueChange={(val) => field.handleChange(val)}
                      disabled={isPending}
                    >
                      <SelectTrigger className="h-11 rounded-xl bg-muted/30">
                        <div className="flex items-center gap-2">
                          <Droplets className="h-4 w-4 text-muted-foreground" />
                          <SelectValue placeholder="Select blood group" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        {BLOOD_GROUP_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </form.Field>
              </div>

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
                    // ✅ FIX: Removed invalid 'icon' prop
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
                      placeholder="Enter your current address"
                      // ✅ FIX: Removed invalid 'icon' prop
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

            <Separator />

            {/* Submit */}
            <div className="flex justify-end">
              <form.Subscribe
                selector={(s) => [s.canSubmit, s.isSubmitting] as const}
              >
                {([canSubmit, isSubmitting]) => (
                  <AppSubmitButton
                    isPending={isSubmitting || isPending}
                    pendingLabel="Saving..."
                    disabled={!canSubmit}
                  >
                    Complete Profile
                  </AppSubmitButton>
                )}
              </form.Subscribe>
            </div>
          </form>
        </div>
      </Card>
    </motion.div>
  );
}

// ═══════════════════════════════════════════
// Skeleton
// ═══════════════════════════════════════════

function FormSkeleton() {
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-10 w-64 rounded-xl" />
        <Skeleton className="h-4 w-96 rounded-lg" />
      </div>
      <Skeleton className="h-12 w-full rounded-xl" />
      <Skeleton className="h-[500px] rounded-2xl" />
    </div>
  );
}