// src/components/modules/Dashboard/Scholarships/EditScholarshipModal.tsx

"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { 
  FileUp, X, GraduationCap, 
  Wallet, Target, FileCheck2, Info, Pencil
} from "lucide-react";
import { toast } from "sonner";

import { updateScholarshipAction } from "@/app/(dashboardLayout)/(adminRoutes)/admin/scholarships-management/_actions";
import { createScholarshipSchema } from "@/zod/scholarship.validation";
import type { IScholarship, DocumentType } from "@/types/scholarship";
import {
  ALL_DOCUMENT_TYPES,
  DOCUMENT_TYPE_LABELS,
} from "@/types/scholarship";
import { getAllDepartments } from "@/services/department.services";
import { getAllAcademicLevels } from "@/services/academicLevel.services";

import AppField from "@/components/shared/form/AppField";
import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  scholarship: IScholarship | null;
  onSuccess: () => void;
}

const BRAND_TEAL = "#0097b2";
const BRAND_PURPLE = "#4b2875";

export default function EditScholarshipModal({
  open,
  onOpenChange,
  scholarship,
  onSuccess,
}: Props) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: deptRes } = useQuery({
    queryKey: ["departments-dropdown"],
    queryFn: () => getAllDepartments("limit=100"),
    enabled: open,
  });

  const { data: levelRes } = useQuery({
    queryKey: ["academic-levels-dropdown"],
    queryFn: () => getAllAcademicLevels("limit=100"),
    enabled: open,
  });

  const departments = deptRes?.data ?? [];
  const levels = levelRes?.data ?? [];

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (formData: FormData) =>
      updateScholarshipAction(scholarship!.id, formData),
  });

  const form = useForm({
    defaultValues: {
      title: scholarship?.title ?? "",
      description: scholarship?.description ?? "",
      departmentId: scholarship?.departmentId ?? "",
      levelId: scholarship?.levelId ?? "",
      totalAmount: scholarship?.totalAmount ?? 0,
      amountPerStudent: scholarship?.amountPerStudent ?? 0,
      quota: scholarship?.quota ?? 1,
      deadline: scholarship?.deadline
        ? new Date(scholarship.deadline).toISOString().slice(0, 16)
        : "",
      minGpa: scholarship?.minGpa ?? 0,
      minCgpa: scholarship?.minCgpa ?? 0,
      financialNeedRequired: scholarship?.financialNeedRequired ?? false,
      requiredDocTypes: (scholarship?.requiredDocTypes ?? []) as DocumentType[],
    },
    onSubmit: async ({ value }) => {
      if (!scholarship) return;
      setServerError(null);

      // Cross-field validation
      if (value.amountPerStudent * value.quota > value.totalAmount) {
        setServerError("Amount per student × quota cannot exceed total budget");
        return;
      }

      const toastId = toast.loading("Updating scholarship...");

      try {
        const formData = new FormData();
        const payload: Record<string, unknown> = {};

        if (value.title.trim() && value.title.trim() !== scholarship.title)
          payload.title = value.title.trim();
        if (value.description?.trim() !== (scholarship.description ?? ""))
          payload.description = value.description?.trim();
        if (value.departmentId !== (scholarship.departmentId ?? ""))
          payload.departmentId = value.departmentId || null;
        if (value.levelId !== (scholarship.levelId ?? ""))
          payload.levelId = value.levelId || null;
        if (value.totalAmount !== scholarship.totalAmount)
          payload.totalAmount = value.totalAmount;
        if (value.amountPerStudent !== scholarship.amountPerStudent)
          payload.amountPerStudent = value.amountPerStudent;
        if (value.quota !== scholarship.quota) payload.quota = value.quota;
        if (value.deadline) payload.deadline = value.deadline;
        if (value.minGpa !== (scholarship.minGpa ?? 0))
          payload.minGpa = value.minGpa || null;
        if (value.minCgpa !== (scholarship.minCgpa ?? 0))
          payload.minCgpa = value.minCgpa || null;
        if (value.financialNeedRequired !== scholarship.financialNeedRequired)
          payload.financialNeedRequired = value.financialNeedRequired;
        if (
          JSON.stringify(value.requiredDocTypes) !==
          JSON.stringify(scholarship.requiredDocTypes)
        ) {
          payload.requiredDocTypes = value.requiredDocTypes;
        }

        if (Object.keys(payload).length === 0 && !documentFile) {
          setServerError("No changes to save");
          toast.dismiss(toastId);
          return;
        }

        if (Object.keys(payload).length > 0)
          formData.append("data", JSON.stringify(payload));
        if (documentFile) formData.append("document", documentFile);

        const result = await mutateAsync(formData);

        if (result.success) {
          toast.success(result.message || "Scholarship updated successfully", { id: toastId });
          onOpenChange(false);
          onSuccess();
        } else {
          setServerError(result.message || "Something went wrong");
          toast.error(result.message || "Something went wrong", { id: toastId });
        }
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Something went wrong";
        setServerError(message);
        toast.error(message, { id: toastId });
      }
    },
  });

  // Sync form when scholarship changes
  useEffect(() => {
    if (scholarship) {
      form.reset();
      form.setFieldValue("title", scholarship.title);
      form.setFieldValue("description", scholarship.description ?? "");
      form.setFieldValue("departmentId", scholarship.departmentId ?? "");
      form.setFieldValue("levelId", scholarship.levelId ?? "");
      form.setFieldValue("totalAmount", scholarship.totalAmount);
      form.setFieldValue("amountPerStudent", scholarship.amountPerStudent);
      form.setFieldValue("quota", scholarship.quota);
      form.setFieldValue(
        "deadline",
        scholarship.deadline
          ? new Date(scholarship.deadline).toISOString().slice(0, 16)
          : ""
      );
      form.setFieldValue("minGpa", scholarship.minGpa ?? 0);
      form.setFieldValue("minCgpa", scholarship.minCgpa ?? 0);
      form.setFieldValue("financialNeedRequired", scholarship.financialNeedRequired);
      form.setFieldValue("requiredDocTypes", (scholarship.requiredDocTypes ?? []) as DocumentType[]);
    }
    setServerError(null);
    setDocumentFile(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scholarship]);

  if (!scholarship) return null;

  const canEdit = scholarship.status === "DRAFT" || scholarship.status === "PAUSED";

  const handleOpenChange = (nextOpen: boolean) => {
    onOpenChange(nextOpen);
    if (!nextOpen) {
      form.reset();
      setServerError(null);
      setDocumentFile(null);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File must be smaller than 5MB");
      return;
    }
    setDocumentFile(file);
  };

  const clearFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDocumentFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-187.5 max-h-[90vh] overflow-hidden border-border/40 bg-background/95 p-0 shadow-2xl backdrop-blur-xl rounded-[2rem]">
        <VisuallyHidden>
          <DialogTitle>Edit Scholarship: {scholarship.title}</DialogTitle>
        </VisuallyHidden>

        {/* ─── Premium Header ─── */}
        <div className="border-b border-border/40 bg-muted/10 px-6 pt-8 pb-6 sm:px-10">
          <div className="flex items-center gap-5">
            <div 
              className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl shadow-inner border border-primary/20 bg-card"
              style={{ background: `linear-gradient(135deg, ${BRAND_PURPLE}15, ${BRAND_TEAL}15)` }}
            >
              <Pencil className="h-8 w-8 text-primary" style={{ color: BRAND_TEAL }} />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                Edit Scholarship
              </h2>
              <p className="mt-1 text-sm font-medium text-muted-foreground truncate max-w-full">
                Updating <span className="font-bold text-foreground">{scholarship.title}</span>
              </p>
            </div>
          </div>
        </div>

        {!canEdit ? (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center sm:px-10">
            <div className="h-16 w-16 rounded-full bg-rose-500/10 flex items-center justify-center mb-4">
              <Info className="h-8 w-8 text-rose-500" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">Editing Locked</h3>
            <p className="text-base font-medium text-muted-foreground max-w-md">
              Only <strong className="text-foreground">Draft</strong> or <strong className="text-foreground">Paused</strong> scholarships can be edited. This program is currently <strong className="text-foreground">{scholarship.status}</strong>.
            </p>
          </div>
        ) : (
          <form
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="flex flex-col"
          >
            {/* ─── Scrollable Body ─── */}
            <div className="max-h-[65vh] space-y-10 overflow-y-auto custom-scrollbar px-6 py-8 sm:px-10">
              
              {/* ── Basic Info ── */}
              <div className="space-y-5">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted/50 border border-border/50">
                    <GraduationCap className="h-4 w-4 text-foreground" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">Program Details</h3>
                </div>

                <form.Field name="title" validators={{ onChange: createScholarshipSchema.shape.title }}>
                  {(field) => (
                    <AppField
                      field={field}
                      label="Scholarship Title"
                      placeholder="e.g. Merit-Based Full Scholarship 2025"
                    />
                  )}
                </form.Field>

                <form.Field name="description">
                  {(field) => (
                    <div className="space-y-2">
                      <Label className="font-semibold text-foreground">Description</Label>
                      <Textarea
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        placeholder="Describe the scholarship, eligibility, and goals..."
                        rows={4}
                        className="rounded-xl resize-none bg-background"
                      />
                      {field.state.meta.errors?.length > 0 && (
                        <p className="text-sm font-medium text-destructive mt-1.5">{field.state.meta.errors.join(", ")}</p>
                      )}
                    </div>
                  )}
                </form.Field>
              </div>

              {/* ── Financial Details ── */}
              <div className="space-y-5">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted/50 border border-border/50">
                    <Wallet className="h-4 w-4 text-foreground" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">Financial Allocation</h3>
                </div>

                <div className="grid gap-5 sm:grid-cols-3">
                  <form.Field name="totalAmount">
                    {(field) => (
                      <div className="space-y-2">
                        <Label className="font-semibold text-foreground">Total Budget (৳)</Label>
                        <Input
                          type="number" min={0} step={0.01}
                          value={field.state.value || ""}
                          onChange={(e) => field.handleChange(parseFloat(e.target.value) || 0)}
                          onBlur={field.handleBlur}
                          className="rounded-xl h-11 bg-background"
                        />
                        {field.state.meta.errors?.length > 0 && (
                          <p className="text-sm font-medium text-destructive mt-1.5">{field.state.meta.errors.join(", ")}</p>
                        )}
                      </div>
                    )}
                  </form.Field>

                  <form.Field name="amountPerStudent">
                    {(field) => (
                      <div className="space-y-2">
                        <Label className="font-semibold text-foreground">Per Student (৳)</Label>
                        <Input
                          type="number" min={0} step={0.01}
                          value={field.state.value || ""}
                          onChange={(e) => field.handleChange(parseFloat(e.target.value) || 0)}
                          onBlur={field.handleBlur}
                          className="rounded-xl h-11 bg-background"
                        />
                        {field.state.meta.errors?.length > 0 && (
                          <p className="text-sm font-medium text-destructive mt-1.5">{field.state.meta.errors.join(", ")}</p>
                        )}
                      </div>
                    )}
                  </form.Field>

                  <form.Field name="quota">
                    {(field) => (
                      <div className="space-y-2">
                        <Label className="font-semibold text-foreground">Quota (Seats)</Label>
                        <Input
                          type="number" min={1} step={1}
                          value={field.state.value || ""}
                          onChange={(e) => field.handleChange(parseInt(e.target.value) || 1)}
                          onBlur={field.handleBlur}
                          className="rounded-xl h-11 bg-background"
                        />
                        {field.state.meta.errors?.length > 0 && (
                          <p className="text-sm font-medium text-destructive mt-1.5">{field.state.meta.errors.join(", ")}</p>
                        )}
                      </div>
                    )}
                  </form.Field>
                </div>
              </div>

              {/* ── Eligibility Criteria ── */}
              <div className="space-y-5">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted/50 border border-border/50">
                    <Target className="h-4 w-4 text-foreground" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">Eligibility Criteria</h3>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <form.Field name="departmentId">
                    {(field) => (
                      <div className="space-y-2">
                        <Label className="font-semibold text-foreground">Department (Optional)</Label>
                        <Select value={field.state.value || "all"} onValueChange={(v) => field.handleChange(v === "all" ? "" : v)}>
                          <SelectTrigger className="rounded-xl h-11 bg-background">
                            <SelectValue placeholder="All departments" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl">
                            <SelectItem value="all">All Departments</SelectItem>
                            {departments.map((d: { id: string; name: string }) => (
                              <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </form.Field>

                  <form.Field name="levelId">
                    {(field) => (
                      <div className="space-y-2">
                        <Label className="font-semibold text-foreground">Academic Level (Optional)</Label>
                        <Select value={field.state.value || "all"} onValueChange={(v) => field.handleChange(v === "all" ? "" : v)}>
                          <SelectTrigger className="rounded-xl h-11 bg-background">
                            <SelectValue placeholder="All levels" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl">
                            <SelectItem value="all">All Levels</SelectItem>
                            {levels.map((l: { id: string; name: string }) => (
                              <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </form.Field>

                  <form.Field name="minGpa">
                    {(field) => (
                      <div className="space-y-2">
                        <Label className="font-semibold text-foreground">Minimum GPA (Optional)</Label>
                        <Input
                          type="number" min={0} max={4} step={0.01}
                          value={field.state.value || ""}
                          onChange={(e) => field.handleChange(parseFloat(e.target.value) || 0)}
                          onBlur={field.handleBlur}
                          className="rounded-xl h-11 bg-background"
                        />
                      </div>
                    )}
                  </form.Field>

                  <form.Field name="minCgpa">
                    {(field) => (
                      <div className="space-y-2">
                        <Label className="font-semibold text-foreground">Minimum CGPA (Optional)</Label>
                        <Input
                          type="number" min={0} max={4} step={0.01}
                          value={field.state.value || ""}
                          onChange={(e) => field.handleChange(parseFloat(e.target.value) || 0)}
                          onBlur={field.handleBlur}
                          className="rounded-xl h-11 bg-background"
                        />
                      </div>
                    )}
                  </form.Field>
                </div>

                <form.Field name="financialNeedRequired">
                  {(field) => (
                    <div className="flex items-center gap-4 rounded-2xl border border-primary/20 bg-primary/5 p-5 mt-2 transition-colors hover:bg-primary/10">
                      <Switch checked={field.state.value} onCheckedChange={(v) => field.handleChange(v)} />
                      <div>
                        <Label className="cursor-pointer font-bold text-foreground text-base">
                          Financial Need Verification Required
                        </Label>
                        <p className="text-sm font-medium text-muted-foreground mt-0.5">
                          Students must upload official proof of income to apply.
                        </p>
                      </div>
                    </div>
                  )}
                </form.Field>
              </div>

              {/* ── Deadline & Documents ── */}
              <div className="space-y-5">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted/50 border border-border/50">
                    <FileCheck2 className="h-4 w-4 text-foreground" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">Deadline & Documents</h3>
                </div>

                <form.Field name="deadline" validators={{ onChange: createScholarshipSchema.shape.deadline }}>
                  {(field) => (
                    <div className="space-y-2">
                      <Label className="font-semibold text-foreground">Application Deadline</Label>
                      <Input
                        type="datetime-local"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        className="rounded-xl h-11 bg-background"
                      />
                      {field.state.meta.errors?.length > 0 && (
                        <p className="text-sm font-medium text-destructive mt-1.5">{field.state.meta.errors.join(", ")}</p>
                      )}
                    </div>
                  )}
                </form.Field>

                <form.Field name="requiredDocTypes">
                  {(field) => (
                    <div className="space-y-3">
                      <Label className="font-semibold text-foreground">Required Application Documents</Label>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {ALL_DOCUMENT_TYPES.map((dt) => {
                          const checked = field.state.value.includes(dt);
                          return (
                            <label
                              key={dt}
                              className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 shadow-sm transition-all ${
                                checked ? 'border-primary/50 bg-primary/5' : 'border-border/60 bg-card hover:bg-muted/30'
                              }`}
                            >
                              <Checkbox
                                checked={checked}
                                onCheckedChange={(v) => {
                                  const current = [...field.state.value];
                                  if (v) current.push(dt);
                                  else {
                                    const idx = current.indexOf(dt);
                                    if (idx > -1) current.splice(idx, 1);
                                  }
                                  field.handleChange(current);
                                }}
                              />
                              <span className="text-sm font-bold text-foreground">
                                {DOCUMENT_TYPE_LABELS[dt]}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                      {field.state.meta.errors?.length > 0 && (
                        <p className="text-sm font-medium text-destructive mt-1.5">{field.state.meta.errors.join(", ")}</p>
                      )}
                    </div>
                  )}
                </form.Field>

                {/* Custom Dropzone UI for Existing & New File */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <Label className="font-semibold text-foreground">Official Guidelines Document</Label>
                    {scholarship.document && !documentFile && (
                      <a
                        href={scholarship.document}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-bold text-primary hover:underline"
                      >
                        View Current File
                      </a>
                    )}
                  </div>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                    onChange={handleFileSelect}
                    className="hidden"
                  />

                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className={`group relative flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-8 transition-all cursor-pointer ${
                      documentFile || scholarship.document
                        ? 'border-primary/50 bg-primary/5' 
                        : 'border-border/60 bg-muted/10 hover:bg-muted/20 hover:border-primary/30'
                    }`}
                  >
                    {documentFile ? (
                      <>
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                          <FileUp className="h-6 w-6 text-primary" style={{ color: BRAND_TEAL }} />
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-bold text-foreground">{documentFile.name}</p>
                          <p className="text-xs font-medium text-muted-foreground mt-1">
                            {(documentFile.size / 1024 / 1024).toFixed(2)} MB - <span className="text-primary">Ready to upload</span>
                          </p>
                        </div>
                        <Button
                          type="button"
                          size="sm"
                          variant="destructive"
                          className="absolute right-4 top-4 h-8 w-8 rounded-full p-0 shadow-md"
                          onClick={clearFile}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    ) : scholarship.document ? (
                       <>
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-background shadow-sm border border-border/50 group-hover:scale-110 transition-transform">
                          <FileUp className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-bold text-foreground">File Already Attached</p>
                          <p className="text-xs font-medium text-muted-foreground mt-1">Click here to upload a replacement file.</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-background shadow-sm border border-border/50 group-hover:scale-110 transition-transform">
                          <FileUp className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-bold text-foreground">Click to upload document</p>
                          <p className="text-xs font-medium text-muted-foreground mt-1">PDF, DOC, or Image (Max 5MB)</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* ── Server Error ── */}
              <AnimatePresence mode="wait">
                {serverError && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, y: -10 }}
                    animate={{ opacity: 1, height: "auto", y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Alert variant="destructive" className="border-rose-500/30 bg-rose-500/10 text-rose-600 rounded-xl">
                      <Info className="h-4 w-4" />
                      <AlertDescription className="font-semibold ml-2">
                        {serverError}
                      </AlertDescription>
                    </Alert>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ─── Footer ─── */}
            <div className="border-t border-border/40 bg-muted/10 px-6 py-5 sm:px-10 flex items-center justify-end">
              <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting] as const}>
                {([canSubmit, isSubmitting]) => (
                  <AppSubmitButton
                    isPending={isSubmitting || isPending}
                    pendingLabel="Saving..."
                    disabled={!canSubmit}
                    className="h-12 rounded-xl px-8 font-black text-white shadow-lg transition-all hover:opacity-90 active:scale-95"
                    style={{ background: `linear-gradient(135deg, ${BRAND_PURPLE}, ${BRAND_TEAL})` }}
                  >
                    Save Changes
                  </AppSubmitButton>
                )}
              </form.Subscribe>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}