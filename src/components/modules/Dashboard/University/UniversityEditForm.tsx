// src/components/modules/Dashboard/University/UniversityEditForm.tsx

"use client";

import { useRef, useState } from "react";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { ImagePlus, X } from "lucide-react";
import { toast } from "sonner";

import { updateUniversityAction } from "@/app/(dashboardLayout)/(adminRoutes)/admin/university-settings/_actions";
import type { IUniversity } from "@/types/university";

import AppField from "@/components/shared/form/AppField";
import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Image from "next/image";

interface Props {
  university: IUniversity;
  onSuccess: () => void;
}

export default function UniversityEditForm({ university, onSuccess }: Props) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (formData: FormData) => updateUniversityAction(university.id, formData),
  });

  const form = useForm({
    defaultValues: {
      name: university.name,
      website: university.website ?? "",
    },
    onSubmit: async ({ value }) => {
      setServerError(null);

      // Build FormData — backend expects multipart
      const formData = new FormData();

      // Backend expects university data as JSON string field
      const universityPayload: Record<string, string> = {};
      if (value.name.trim()) universityPayload.name = value.name.trim();
      if (value.website.trim()) universityPayload.website = value.website.trim();

      if (Object.keys(universityPayload).length > 0) {
        formData.append("university", JSON.stringify(universityPayload));
      }

      if (logoFile) {
        formData.append("logo", logoFile);
      }

      // Nothing to update?
      if (!Object.keys(universityPayload).length && !logoFile) {
        setServerError("No changes to save");
        return;
      }

      try {
        const result = await mutateAsync(formData);

        if (result.success) {
          toast.success(result.message || "University updated successfully");
          setLogoFile(null);
          setLogoPreview(null);
          onSuccess();
        } else {
          setServerError(result.message || "Something went wrong");
        }
      } catch (error: unknown) {
        setServerError(error instanceof Error ? error.message : "Something went wrong");
      }
    },
  });

  const handleLogoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be smaller than 2MB");
      return;
    }

    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const clearLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Card className="p-6">
      <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Edit University
      </h3>

      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-5"
      >
        {/* Name */}
        <form.Field name="name">
          {(field) => (
            <AppField
              field={field}
              label="University Name"
              placeholder="Enter university name"
            />
          )}
        </form.Field>

        {/* Website */}
        <form.Field name="website">
          {(field) => (
            <AppField
              field={field}
              label="Website"
              placeholder="https://university.edu"
            />
          )}
        </form.Field>

        {/* Logo Upload */}
        <div className="space-y-2">
          <Label>Logo</Label>

          <div className="flex items-center gap-4">
            {/* Preview */}
            {(logoPreview || university.logoUrl) && (
              <div className="relative">
                <Image
                  src={logoPreview || university.logoUrl!}
                  alt="Logo preview"
                  className="rounded-lg border object-contain"
                  width={64}
                  height={64}
                />
                {logoPreview && (
                  <button
                    type="button"
                    onClick={clearLogo}
                    className="absolute -right-1.5 -top-1.5 rounded-full bg-destructive p-0.5 text-white shadow-sm hover:bg-destructive/90"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
            )}

            {/* Upload button */}
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoSelect}
                className="hidden"
                id="logo-upload"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={isPending}
                className="gap-2"
              >
                <ImagePlus className="h-4 w-4" />
                {logoPreview
                  ? "Change"
                  : university.logoUrl
                    ? "Replace Logo"
                    : "Upload Logo"}
              </Button>
              <p className="mt-1 text-xs text-muted-foreground">
                PNG, JPG or SVG. Max 2MB.
              </p>
            </div>
          </div>
        </div>

        {/* Server error */}
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

        {/* Submit */}
        <div className="flex justify-end pt-1">
          <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting] as const}>
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
    </Card>
  );
}
