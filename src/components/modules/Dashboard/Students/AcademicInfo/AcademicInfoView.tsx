/* eslint-disable @typescript-eslint/no-explicit-any */
// components/modules/Student/AcademicInfo/AcademicInfoView.tsx

"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "@tanstack/react-form";
import { AnimatePresence, motion } from "framer-motion";
import {
  BookOpen,
  GraduationCap,
  Hash,
  Calendar,
  Activity,
  Edit3,
  X,
  AlertCircle,
  Lock,
} from "lucide-react";
import { toast } from "sonner";

import {
  getDepartmentsByUniversity,
  getAcademicLevels,
  getAcademicTerms,
} from "@/services/student.services";
import {
  completeAcademicInfoAction,
  updateAcademicInfoAction,
} from "@/app/(dashboardLayout)/(studentRoutes)/student/academic-info/_actions";
import type { IStudentMyProfile } from "@/types/student";

import AppField from "@/components/shared/form/AppField";
import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const BRAND_TEAL = "#0097b2";
const BRAND_PURPLE = "#4b2875";

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; bg: string; border: string }
> = {
  REGULAR: { label: "Regular", color: "#16a34a", bg: "#16a34a15", border: "#16a34a40" },
  PROBATION: {
    label: "Probation",
    color: "#d97706",
    bg: "#d9770615",
    border: "#d9770640",
  },
  SUSPENDED: {
    label: "Suspended",
    color: "#dc2626",
    bg: "#dc262615",
    border: "#dc262640",
  },
  DROPPED_OUT: {
    label: "Dropped Out",
    color: "#6b7280",
    bg: "#6b728015",
    border: "#6b728040",
  },
};

interface Props {
  profile: IStudentMyProfile | null | undefined;
  onUpdate: () => void;
}

export default function AcademicInfoView({ profile, onUpdate }: Props) {
  // 1. Safely derive variables first (NO returns yet)
  const academicInfo = profile?.academicInfo;
  const universityId = profile?.universityId;
  const isPersonalComplete = !!universityId;

  // 2. ALL HOOKS MUST GO HERE AT THE TOP
  const [isEditing, setIsEditing] = useState(isPersonalComplete && !academicInfo);
  const [serverError, setServerError] = useState<string | null>(null);

  const { data: departmentsRes } = useQuery({
    queryKey: ["departments", universityId],
    queryFn: async () => {
      if (!universityId) return { data: [] };
      const res = await getDepartmentsByUniversity(universityId);
      return res as { data: { id: string; name: string }[] };
    },
    enabled: !!universityId && isEditing,
  });

  const { data: levelsRes } = useQuery({
    queryKey: ["academic-levels"],
    queryFn: async () => {
      const res = await getAcademicLevels();
      return res as { data: { id: string; name: string }[] };
    },
    enabled: isEditing,
  });

  const { data: termsRes } = useQuery({
    queryKey: ["academic-terms"],
    queryFn: async () => {
      const res = await getAcademicTerms();
      return res as { data: { id: string; name: string }[] };
    },
    enabled: isEditing,
  });

  const departments = departmentsRes?.data || [];
  const levels = levelsRes?.data || [];
  const terms = termsRes?.data || [];

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: any) =>
      academicInfo
        ? updateAcademicInfoAction(payload)
        : completeAcademicInfoAction(payload),
  });

  const form = useForm({
    defaultValues: {
      departmentId: academicInfo?.departmentId ?? "",
      levelId: academicInfo?.levelId ?? "",
      termId: academicInfo?.termId ?? "",
      studentIdNo: academicInfo?.studentIdNo ?? "",
      gpa: String(academicInfo?.gpa ?? ""),
      cgpa: String(academicInfo?.cgpa ?? ""),
      creditHoursCompleted: String(academicInfo?.creditHoursCompleted ?? ""),
    },
    onSubmit: async ({ value }) => {
      setServerError(null);

      const payload: Record<string, string | number> = {};

      if (value.departmentId && value.departmentId !== academicInfo?.departmentId)
        payload.departmentId = value.departmentId;
      if (value.levelId && value.levelId !== academicInfo?.levelId)
        payload.levelId = value.levelId;
      if (value.termId && value.termId !== academicInfo?.termId)
        payload.termId = value.termId;
      if (
        value.studentIdNo.trim() &&
        value.studentIdNo.trim() !== academicInfo?.studentIdNo
      )
        payload.studentIdNo = value.studentIdNo.trim();
      if (value.gpa.trim() && Number(value.gpa) !== academicInfo?.gpa)
        payload.gpa = Number(value.gpa);
      if (value.cgpa.trim() && Number(value.cgpa) !== academicInfo?.cgpa)
        payload.cgpa = Number(value.cgpa);
      if (
        value.creditHoursCompleted.trim() &&
        Number(value.creditHoursCompleted) !== academicInfo?.creditHoursCompleted
      )
        payload.creditHoursCompleted = Number(value.creditHoursCompleted);

      if (academicInfo && Object.keys(payload).length === 0) {
        setServerError("No changes to save");
        return;
      }

      const finalPayload = academicInfo
        ? { academicInfo: payload }
        : {
            departmentId: value.departmentId,
            levelId: value.levelId,
            termId: value.termId,
            studentIdNo: value.studentIdNo.trim(),
            gpa: Number(value.gpa),
            cgpa: Number(value.cgpa),
            creditHoursCompleted: Number(value.creditHoursCompleted || 0),
          };

      try {
        const result = await mutateAsync(finalPayload);
        if (result.success) {
          toast.success(result.message);
          setIsEditing(false);
          onUpdate();
        } else {
          setServerError(result.message);
        }
      } catch (error: unknown) {
        setServerError(error instanceof Error ? error.message : "Something went wrong");
      }
    },
  });

  const handleEditClick = () => {
    if (academicInfo) {
      form.reset({
        departmentId: academicInfo.departmentId ?? "",
        levelId: academicInfo.levelId ?? "",
        termId: academicInfo.termId ?? "",
        studentIdNo: academicInfo.studentIdNo ?? "",
        gpa: String(academicInfo.gpa ?? ""),
        cgpa: String(academicInfo.cgpa ?? ""),
        creditHoursCompleted: String(academicInfo.creditHoursCompleted ?? ""),
      });
    }
    setServerError(null);
    setIsEditing(true);
  };

  const handleCancel = () => {
    if (!academicInfo) {
      toast.error("You must complete your academic info first.");
      return;
    }
    form.reset();
    setServerError(null);
    setIsEditing(false);
  };

  // 3. NOW IT IS SAFE TO DO EARLY RETURNS!
  // If profile is totally missing, render nothing (handled by parent loading state usually)
  if (!profile) return null;

  // If personal info isn't done, lock them out
  if (!isPersonalComplete) {
    return (
      <Card className="rounded-2xl shadow-lg border-border/40 overflow-hidden bg-muted/10 p-12 flex flex-col items-center justify-center text-center">
        <div className="h-16 w-16 rounded-full bg-background border border-border/50 flex items-center justify-center mb-4 shadow-sm">
          <Lock className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-extrabold text-foreground mb-2">Section Locked</h3>
        <p className="text-sm font-medium text-muted-foreground max-w-md">
          Please complete your Personal Details and select a University before adding your
          Academic Information.
        </p>
      </Card>
    );
  }

  // 4. Safe status parsing and main render
  const currentStatus = academicInfo?.academicStatus || "REGULAR";
  const statusConfig = STATUS_CONFIG[currentStatus] || STATUS_CONFIG.REGULAR;

  return (
    <Card className="rounded-2xl shadow-lg border-border/40 overflow-hidden">
      <div
        className="h-1.5 w-full"
        style={{ background: `linear-gradient(90deg, ${BRAND_TEAL}, ${BRAND_PURPLE})` }}
      />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/40 bg-muted/10 px-6 sm:px-8 py-5">
        <div>
          <h3 className="flex items-center gap-2 text-lg font-bold text-foreground">
            <BookOpen className="h-5 w-5 text-muted-foreground" />
            Academic Information
          </h3>
          <p className="text-sm text-muted-foreground">
            {isEditing
              ? academicInfo
                ? "Update your academic details below"
                : "Please provide your academic details to continue"
              : "Your current academic details"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {academicInfo && (
            <Badge
              className="font-bold text-xs px-3 py-1"
              style={{
                backgroundColor: statusConfig.bg,
                color: statusConfig.color,
                border: `1px solid ${statusConfig.border}`,
              }}
            >
              {statusConfig.label}
            </Badge>
          )}

          {!isEditing && academicInfo && (
            <Button
              onClick={handleEditClick}
              variant="outline"
              className="h-9 rounded-xl font-bold shadow-sm"
            >
              <Edit3 className="h-4 w-4 mr-2" /> Edit
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 sm:p-8">
        <AnimatePresence mode="wait">
          {!isEditing && academicInfo ? (
            <motion.div
              key="view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <InfoCard icon={Hash} label="Student ID" value={academicInfo.studentIdNo} />
              <InfoCard
                icon={BookOpen}
                label="Department"
                value={academicInfo.department?.name || "—"}
              />
              <InfoCard
                icon={GraduationCap}
                label="Level"
                value={academicInfo.level?.name || "—"}
              />
              <InfoCard
                icon={Calendar}
                label="Term"
                value={academicInfo.term?.name || "—"}
              />
              <InfoCard icon={Activity} label="GPA" value={academicInfo.gpa} />
              <InfoCard icon={Activity} label="CGPA" value={academicInfo.cgpa} />
              <InfoCard
                icon={GraduationCap}
                label="Credits Completed"
                value={academicInfo.creditHoursCompleted}
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
                  <form.Field
                    name="studentIdNo"
                    validators={{
                      onChange: ({ value }) => {
                        if (!value.trim()) return "Student ID is required";
                        if (value.trim().length > 100) return "Max 100 characters";
                        return undefined;
                      },
                    }}
                  >
                    {(field) => (
                      <AppField
                        field={field}
                        label="Student ID"
                        placeholder="e.g. CSE-2024-001"
                      />
                    )}
                  </form.Field>

                  <div className="space-y-2">
                    <Label className="font-bold text-foreground">Department</Label>
                    <form.Field name="departmentId">
                      {(field) => (
                        <Select
                          value={field.state.value}
                          onValueChange={(val) => field.handleChange(val)}
                          disabled={isPending}
                        >
                          <SelectTrigger className="h-11 rounded-xl bg-muted/30">
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                          <SelectContent>
                            {departments.map((dept) => (
                              <SelectItem key={dept.id} value={dept.id}>
                                {dept.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </form.Field>
                  </div>

                  <div className="space-y-2">
                    <Label className="font-bold text-foreground">Level</Label>
                    <form.Field name="levelId">
                      {(field) => (
                        <Select
                          value={field.state.value}
                          onValueChange={(val) => field.handleChange(val)}
                          disabled={isPending}
                        >
                          <SelectTrigger className="h-11 rounded-xl bg-muted/30">
                            <SelectValue placeholder="Select level" />
                          </SelectTrigger>
                          <SelectContent>
                            {levels.map((lvl) => (
                              <SelectItem key={lvl.id} value={lvl.id}>
                                {lvl.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </form.Field>
                  </div>

                  <div className="space-y-2">
                    <Label className="font-bold text-foreground">Term</Label>
                    <form.Field name="termId">
                      {(field) => (
                        <Select
                          value={field.state.value}
                          onValueChange={(val) => field.handleChange(val)}
                          disabled={isPending}
                        >
                          <SelectTrigger className="h-11 rounded-xl bg-muted/30">
                            <SelectValue placeholder="Select term" />
                          </SelectTrigger>
                          <SelectContent>
                            {terms.map((t) => (
                              <SelectItem key={t.id} value={t.id}>
                                {t.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </form.Field>
                  </div>

                  <form.Field
                    name="gpa"
                    validators={{
                      onChange: ({ value }) => {
                        const num = Number(value);
                        if (value.trim() && (isNaN(num) || num < 0 || num > 4))
                          return "GPA must be between 0 and 4";
                        return undefined;
                      },
                    }}
                  >
                    {(field) => (
                      <AppField field={field} label="GPA" placeholder="e.g. 3.50" />
                    )}
                  </form.Field>

                  <form.Field
                    name="cgpa"
                    validators={{
                      onChange: ({ value }) => {
                        const num = Number(value);
                        if (value.trim() && (isNaN(num) || num < 0 || num > 4))
                          return "CGPA must be between 0 and 4";
                        return undefined;
                      },
                    }}
                  >
                    {(field) => (
                      <AppField field={field} label="CGPA" placeholder="e.g. 3.65" />
                    )}
                  </form.Field>

                  <form.Field
                    name="creditHoursCompleted"
                    validators={{
                      onChange: ({ value }) => {
                        const num = Number(value);
                        if (value.trim() && (isNaN(num) || num < 0))
                          return "Must be a positive number";
                        return undefined;
                      },
                    }}
                  >
                    {(field) => (
                      <AppField
                        field={field}
                        label="Credits Completed"
                        placeholder="e.g. 120"
                      />
                    )}
                  </form.Field>
                </div>

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

                <div className="flex justify-end gap-3">
                  {academicInfo && (
                    <Button
                      type="button"
                      onClick={handleCancel}
                      variant="ghost"
                      className="h-11 rounded-xl font-bold"
                      disabled={isPending}
                    >
                      <X className="h-4 w-4 mr-2" /> Cancel
                    </Button>
                  )}

                  <form.Subscribe
                    selector={(s) => [s.canSubmit, s.isSubmitting] as const}
                  >
                    {([canSubmit, isSubmitting]) => (
                      <AppSubmitButton
                        isPending={isSubmitting || isPending}
                        pendingLabel="Saving..."
                        disabled={!canSubmit}
                      >
                        {academicInfo ? "Save Changes" : "Submit Academic Info"}
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
  );
}

function InfoCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value?: string | number | null;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border/40 bg-muted/10 p-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-background border border-border/50">
        <Icon className="h-5 w-5 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          {label}
        </p>
        <p className="text-base font-bold text-foreground truncate">
          {value !== null && value !== undefined && value !== "" ? String(value) : "—"}
        </p>
      </div>
    </div>
  );
}
