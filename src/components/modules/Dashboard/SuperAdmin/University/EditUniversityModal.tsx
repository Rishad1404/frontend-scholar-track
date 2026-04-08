// src/app/(dashboardLayout)/(superAdminRoutes)/super-admin/universities-management/_components/EditUniversityModal.tsx

"use client";

import { useState} from "react";
import { useMutation } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { Pencil, Building2, Globe, Upload, X } from "lucide-react";
import Image from "next/image";

import type { IUniversity } from "@/types/university";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { updateUniversityAction } from "@/app/(dashboardLayout)/(adminRoutes)/admin/university-settings/_actions";

const BRAND_TEAL = "#0097b2";
const BRAND_PURPLE = "#4b2875";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  university: IUniversity | null;
  onSuccess: () => void;
}

interface FormState {
  name: string;
  website: string;
}

interface FormErrors {
  name?: string;
  website?: string;
  logo?: string;
}

export default function EditUniversityModal({
  open,
  onOpenChange,
  university,
  onSuccess,
}: Props) {
  // 1. Initialize state directly with props if available
  const [formState, setFormState] = useState<FormState>({
    name: university?.name ?? "",
    website: university?.website ?? "",
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(
    university?.logoUrl ?? null,
  );
  const [removeLogo, setRemoveLogo] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);

  // 2. Track previous props to detect when the modal opens or university changes
  const [prevUniversityId, setPrevUniversityId] = useState<string | undefined>(
    university?.id,
  );
  const [prevOpen, setPrevOpen] = useState(open);

  // 3. Reset state DIRECTLY during render (React's recommended pattern)
  if (university?.id !== prevUniversityId || open !== prevOpen) {
    setPrevUniversityId(university?.id);
    setPrevOpen(open);

    if (open && university) {
      setFormState({
        name: university.name,
        website: university.website ?? "",
      });
      setLogoFile(null);
      setLogoPreview(university.logoUrl);
      setRemoveLogo(false);
      setErrors({});
      setServerError(null);
    }
  }
  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formState.name.trim()) {
      newErrors.name = "University name is required.";
    } else if (formState.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters.";
    } else if (formState.name.trim().length > 200) {
      newErrors.name = "Name must be 200 characters or fewer.";
    }

    if (formState.website.trim()) {
      try {
        new URL(formState.website.trim());
      } catch {
        newErrors.website = "Please enter a valid URL (e.g. https://example.com).";
      }
    }

    if (logoFile && logoFile.size > 2 * 1024 * 1024) {
      newErrors.logo = "Logo must be smaller than 2MB.";
    }

    if (
      logoFile &&
      !["image/png", "image/jpeg", "image/webp", "image/svg+xml"].includes(logoFile.type)
    ) {
      newErrors.logo = "Logo must be PNG, JPEG, WebP, or SVG.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (formData: FormData) => updateUniversityAction(university!.id, formData),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!university) return;
    if (!validate()) return;

    setServerError(null);
    const toastId = toast.loading("Updating university...");

    try {
      const formData = new FormData();
      formData.append("name", formState.name.trim());

      if (formState.website.trim()) {
        formData.append("website", formState.website.trim());
      }

      if (logoFile) {
        formData.append("logo", logoFile);
      }

      if (removeLogo && !logoFile) {
        formData.append("removeLogo", "true");
      }

      const result = await mutateAsync(formData);

      if (result.success) {
        toast.success(result.message ?? "University updated successfully.", {
          id: toastId,
        });
        onOpenChange(false);
        onSuccess();
      } else {
        setServerError(result.message);
        toast.error(result.message, { id: toastId });
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Something went wrong.";
      setServerError(message);
      toast.error(message, { id: toastId });
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      setRemoveLogo(false);
      setLogoPreview(URL.createObjectURL(file));
      setErrors((prev) => ({ ...prev, logo: undefined }));
    }
  };

  const handleRemoveLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
    setRemoveLogo(true);
  };

  if (!university) return null;

  const hasChanges =
    formState.name.trim() !== university.name ||
    formState.website.trim() !== (university.website ?? "") ||
    logoFile !== null ||
    removeLogo;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-125 p-0 overflow-hidden rounded-[2rem] border-border/40 bg-background/95 backdrop-blur-xl shadow-2xl">
        <VisuallyHidden>
          <DialogTitle>Edit {university.name}</DialogTitle>
        </VisuallyHidden>

        {/* Header */}
        <div className="px-6 pt-8 pb-4 sm:px-8 border-b border-border/40 bg-muted/10">
          <div className="flex items-start gap-4">
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border"
              style={{
                backgroundColor: `${BRAND_TEAL}10`,
                borderColor: `${BRAND_TEAL}30`,
              }}
            >
              <Pencil className="h-6 w-6" style={{ color: BRAND_TEAL }} />
            </div>
            <div>
              <h2 className="text-xl font-extrabold tracking-tight text-foreground">
                Edit University
              </h2>
              <p className="mt-1 text-sm font-medium text-muted-foreground">
                Update university details below.
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit}>
          <div className="px-6 py-6 sm:px-8 space-y-5 max-h-[60vh] overflow-y-auto custom-scrollbar">
            {/* Logo */}
            <div className="space-y-2">
              <Label className="text-sm font-bold">Logo</Label>
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-border/50 bg-muted/20 overflow-hidden">
                  {logoPreview ? (
                    <Image
                      src={logoPreview}
                      alt="Logo preview"
                      width={64}
                      height={64}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Building2 className="h-7 w-7 text-muted-foreground" />
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="rounded-xl font-semibold text-xs"
                      onClick={() => document.getElementById("logo-upload")?.click()}
                    >
                      <Upload className="mr-1.5 h-3.5 w-3.5" />
                      {logoPreview ? "Change" : "Upload"}
                    </Button>
                    {logoPreview && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="rounded-xl font-semibold text-xs text-destructive hover:text-destructive"
                        onClick={handleRemoveLogo}
                      >
                        <X className="mr-1 h-3.5 w-3.5" />
                        Remove
                      </Button>
                    )}
                  </div>
                  <p className="text-[10px] text-muted-foreground">
                    PNG, JPEG, WebP, or SVG. Max 2MB.
                  </p>
                </div>
                <input
                  id="logo-upload"
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/svg+xml"
                  className="hidden"
                  onChange={handleLogoChange}
                />
              </div>
              {errors.logo && (
                <p className="text-xs font-semibold text-destructive">{errors.logo}</p>
              )}
            </div>

            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="edit-name" className="text-sm font-bold">
                University Name <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="edit-name"
                  value={formState.name}
                  onChange={(e) => {
                    setFormState((prev) => ({ ...prev, name: e.target.value }));
                    setErrors((prev) => ({ ...prev, name: undefined }));
                  }}
                  placeholder="Enter university name"
                  className={`pl-10 rounded-xl ${errors.name ? "border-destructive" : ""}`}
                />
              </div>
              {errors.name && (
                <p className="text-xs font-semibold text-destructive">{errors.name}</p>
              )}
            </div>

            {/* Website */}
            <div className="space-y-2">
              <Label htmlFor="edit-website" className="text-sm font-bold">
                Website
              </Label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="edit-website"
                  value={formState.website}
                  onChange={(e) => {
                    setFormState((prev) => ({
                      ...prev,
                      website: e.target.value,
                    }));
                    setErrors((prev) => ({ ...prev, website: undefined }));
                  }}
                  placeholder="https://example.com"
                  className={`pl-10 rounded-xl ${errors.website ? "border-destructive" : ""}`}
                />
              </div>
              {errors.website && (
                <p className="text-xs font-semibold text-destructive">{errors.website}</p>
              )}
            </div>

            {/* Server Error */}
            <AnimatePresence mode="wait">
              {serverError && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <Alert
                    variant="destructive"
                    className="border-rose-500/30 bg-rose-500/10 text-rose-600 rounded-xl"
                  >
                    <AlertDescription className="font-semibold">
                      {serverError}
                    </AlertDescription>
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="border-t border-border/40 bg-muted/10 px-6 py-5 sm:px-8 flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="rounded-xl font-bold"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending || !hasChanges}
              className="rounded-xl font-bold text-white shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${BRAND_PURPLE}, ${BRAND_TEAL})`,
              }}
            >
              {isPending ? (
                <>
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Saving...
                </>
              ) : (
                <>
                  <Pencil className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
