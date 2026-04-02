/* eslint-disable @typescript-eslint/no-explicit-any */
// components/modules/Student/Scholarships/Steps/StepDocuments.tsx

"use client";

import { useRef, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import {
  Upload,
  FileText,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IScholarship } from "@/types/scholarshipForStudents";
import { getApplicationById } from "@/services/application.services";
import {
  removeDocumentAction,
  uploadDocumentAction,
} from "@/app/(dashboardLayout)/(studentRoutes)/student/available-scholarships/[scholarshipId]/apply/_actions";

// ─── Must match your Prisma DocumentType enum EXACTLY ───
// These are the ONLY valid values your backend accepts.
// Your old code had FINANCIAL_STATEMENT and ID_DOCUMENT which don't exist.
const VALID_DOCUMENT_TYPES = [
  { value: "TRANSCRIPT",            label: "Academic Transcript" },
  { value: "INCOME_CERTIFICATE",    label: "Income Certificate" },
  { value: "NATIONAL_ID",           label: "National ID" },
  { value: "PERSONAL_ESSAY",        label: "Personal Essay" },
  { value: "RECOMMENDATION_LETTER", label: "Recommendation Letter" },
  { value: "OTHER",                 label: "Other Supporting Document" },
] as const;

const DOC_TYPE_LABELS: Record<string, string> = Object.fromEntries(
  VALID_DOCUMENT_TYPES.map((d) => [d.value, d.label])
);

const ALL_VALID_TYPE_VALUES = VALID_DOCUMENT_TYPES.map((d) => d.value);

interface Props {
  scholarship: IScholarship;
  applicationId: string;
  onNext: () => void;
  onBack: () => void;
}

interface UploadedDoc {
  id: string;
  type: string;
  fileUrl: string;
  fileName: string;
  fileSize?: number;
}

export default function StepDocuments({
  scholarship,
  applicationId,
  onNext,
  onBack,
}: Props) {
  const [selectedType, setSelectedType] = useState("");
  const [serverError, setServerError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Fetch current documents ──
  const { data: appResponse, refetch } = useQuery({
    queryKey: ["application-docs", applicationId],
    queryFn: () => getApplicationById(applicationId),
    enabled: !!applicationId,
  });

  const uploadedDocs: UploadedDoc[] = appResponse?.data?.documents || [];
  const requiredTypes: string[] = scholarship.requiredDocTypes || [];
  const uploadedTypes = uploadedDocs.map((d) => d.type);
  const missingTypes = requiredTypes.filter((t) => !uploadedTypes.includes(t));
  const allRequiredUploaded =
    requiredTypes.length === 0 || missingTypes.length === 0;

  // ── Upload mutation ──
  const { mutateAsync: uploadMutate, isPending: isUploading } = useMutation({
    mutationFn: (formData: FormData) =>
      uploadDocumentAction(applicationId, formData),
  });

  // ── Remove mutation ──
  const { mutateAsync: removeMutate, isPending: isRemoving } = useMutation({
    mutationFn: (documentId: string) =>
      removeDocumentAction(applicationId, documentId),
  });

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!selectedType) {
      toast.error("Please select a document type first");
      return;
    }

    // Guard: prevent sending invalid types to backend
    if (!ALL_VALID_TYPE_VALUES.includes(selectedType as any)) {
      toast.error(
        `"${selectedType}" is not a valid document type. ` +
          `Allowed: ${ALL_VALID_TYPE_VALUES.join(", ")}`
      );
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File must be smaller than 5MB");
      return;
    }

    const allowedMimes = [
      "application/pdf",
      "image/jpeg",
      "image/jpg",
      "image/png",
    ];
    if (!allowedMimes.includes(file.type)) {
      toast.error("Only PDF, JPG, and PNG files are allowed");
      return;
    }

    setServerError(null);

    const formData = new FormData();
    formData.append("type", selectedType); // must match Prisma DocumentType
    formData.append("file", file);         // must match multer field name

    try {
      const result = await uploadMutate(formData);

      if (result.success) {
        toast.success("Document uploaded!");
        setSelectedType("");
        refetch();
      } else {
        const msg = result.message || "Failed to upload document";
        toast.error(msg);
        setServerError(msg);
      }
    } catch {
      setServerError("Failed to upload document");
    }

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemove = async (doc: UploadedDoc) => {
    try {
      const result = await removeMutate(doc.id);

      if (result.success) {
        toast.success("Document removed");
        refetch();
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("Failed to remove document");
    }
  };

  // ── Available types: use required types if defined, otherwise all valid types ──
  // OLD (BROKEN):  Object.values({ FINANCIAL_STATEMENT: "...", ID_DOCUMENT: "..." })
  // NEW (FIXED):   ALL_VALID_TYPE_VALUES from the Prisma enum
  const availableTypes =
    requiredTypes.length > 0 ? requiredTypes : [...ALL_VALID_TYPE_VALUES];

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="flex items-center gap-2 text-lg font-bold text-foreground">
          <Upload className="h-5 w-5 text-muted-foreground" />
          Upload Documents
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Upload the required documents for your application.
        </p>
      </div>

      <Separator />

      {/* Required docs status */}
      {requiredTypes.length > 0 && (
        <div className="rounded-xl border border-border/40 bg-muted/10 p-4">
          <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
            Required Documents
          </h4>
          <div className="flex flex-wrap gap-2">
            {requiredTypes.map((type) => {
              const isUploaded = uploadedTypes.includes(type);
              return (
                <Badge
                  key={type}
                  className="text-xs font-semibold gap-1"
                  style={{
                    backgroundColor: isUploaded ? "#16a34a15" : "#dc262615",
                    color: isUploaded ? "#16a34a" : "#dc2626",
                    border: `1px solid ${
                      isUploaded ? "#16a34a40" : "#dc262640"
                    }`,
                  }}
                >
                  {isUploaded ? (
                    <CheckCircle2 className="h-3 w-3" />
                  ) : (
                    <AlertCircle className="h-3 w-3" />
                  )}
                  {DOC_TYPE_LABELS[type] || type.replace(/_/g, " ")}
                </Badge>
              );
            })}
          </div>
        </div>
      )}

      {/* Upload area */}
      <div className="space-y-3">
        <div className="flex items-end gap-3">
          <div className="flex-1 space-y-2">
            <Label className="font-bold">Document Type</Label>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="h-11 rounded-xl bg-muted/30">
                <SelectValue placeholder="Select document type" />
              </SelectTrigger>
              <SelectContent>
                {availableTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {DOC_TYPE_LABELS[type] || type.replace(/_/g, " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileSelect}
              className="hidden"
            />
            <Button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={!selectedType || isUploading}
              variant="outline"
              className="h-11 rounded-xl font-bold gap-2"
            >
              {isUploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
              Upload
            </Button>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          Accepted: PDF, JPG, PNG — Max 5 MB
        </p>
      </div>

      {/* Uploaded documents */}
      {uploadedDocs.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Uploaded Documents ({uploadedDocs.length})
          </h4>
          {uploadedDocs.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between rounded-xl border border-border/40 bg-muted/10 p-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">
                    {doc.fileName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {DOC_TYPE_LABELS[doc.type] || doc.type.replace(/_/g, " ")}
                    {doc.fileSize ? ` · ${formatFileSize(doc.fileSize)}` : ""}
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleRemove(doc)}
                disabled={isRemoving}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Server Error */}
      <AnimatePresence mode="wait">
        {serverError && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{serverError}</AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      <Separator />

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          type="button"
          onClick={onBack}
          variant="ghost"
          className="rounded-xl font-bold"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <Button
          onClick={onNext}
          disabled={requiredTypes.length > 0 && !allRequiredUploaded}
          className="rounded-xl px-6 font-black text-white shadow-lg"
          style={{
            background: "linear-gradient(135deg, #4b2875, #0097b2)",
          }}
        >
          Review & Submit
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}