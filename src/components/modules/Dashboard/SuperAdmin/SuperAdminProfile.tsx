/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "@tanstack/react-form";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Crown,
  Mail,
  User as UserIcon,
  Phone,
  Camera,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import { Badge } from "@/components/ui/badge";
import { getMyProfile, updateMyProfile } from "@/services/superAdmin.services";
import Image from "next/image";

const BRAND_TEAL = "#0097b2";
const BRAND_PURPLE = "#4b2875";

export default function SuperAdminProfile() {
  // ── Fetch Profile ──
  const {
    data: response,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["my-profile"],
    queryFn: () => getMyProfile(),
  });

  const user = response?.data;

  // ── Profile Update Mutation ──
  const { mutateAsync: updateProfileMutate, isPending: isUpdatingProfile } = useMutation({
    mutationFn: updateMyProfile,
    onSuccess: () => {
      toast.success("Profile updated successfully!");
      refetch();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update profile");
    },
  });

  // ── Profile Form ──
  const profileForm = useForm({
    defaultValues: {
      name: user?.name || "",
      phone: user?.phone || "",
    },
    onSubmit: async ({ value }) => {
      await updateProfileMutate(value);
    },
  });

  if (isLoading) return <ProfileSkeleton />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="max-w-6xl mx-auto space-y-8 pb-16"
    >
      {/* ─── Premium Header / Banner ─── */}
      <div className="relative rounded-[2.5rem] bg-card border border-border/40 shadow-sm overflow-hidden mt-12">
        {/* Sweeping Gradient Banner */}
        <div
          className="absolute top-0 left-0 right-0 h-40 w-full"
          style={{
            background: `linear-gradient(135deg, ${BRAND_PURPLE}, ${BRAND_TEAL})`,
          }}
        >
          {/* Subtle overlay pattern */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-white to-transparent" />
        </div>

        <div className="relative pt-24 px-8 pb-8 flex flex-col md:flex-row items-center md:items-end gap-6 text-center md:text-left">
          {/* Glowing Avatar */}
          <div className="relative group">
            <div className="h-32 w-32 rounded-3xl bg-background p-1.5 shadow-2xl relative z-10">
              <div className="h-full w-full rounded-2xl bg-muted/30 flex items-center justify-center overflow-hidden relative">
                {user?.image ? (
                  <div className="relative h-full w-full">
                    <Image
                      src={user.image}
                      alt="Profile"
                      fill
                      sizes="(max-width: 768px) 100vw, 200px"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <Crown className="h-12 w-12 text-muted-foreground opacity-50" />
                )}
                {/* Image Upload Overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer backdrop-blur-sm">
                  <Camera className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>
            {/* Super Admin Badge Overlapping Avatar */}
            <div className="absolute -bottom-3 -right-3 z-20">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-background shadow-lg p-1">
                <div
                  className="h-full w-full rounded-full flex items-center justify-center"
                  style={{ background: `linear-gradient(135deg, #f59e0b, #fbbf24)` }}
                >
                  <ShieldCheck className="h-4 w-4 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* User Identity */}
          <div className="flex-1 pb-2">
            <div className="flex flex-col md:flex-row md:items-center gap-3">
              <h1 className="text-3xl font-black text-foreground tracking-tight">
                {user?.name || "Super Admin"}
              </h1>
              <Badge className="w-fit mx-auto md:mx-0 px-3 py-1 font-black uppercase tracking-widest text-[10px] bg-amber-500/10 text-amber-600 border-amber-500/20 shadow-sm">
                System Administrator
              </Badge>
            </div>
            <p className="mt-1 flex items-center justify-center md:justify-start gap-2 text-sm font-medium text-muted-foreground">
              <Mail className="h-4 w-4" /> {user?.email}
            </p>
          </div>
        </div>
      </div>

      {/* ─── Identity Details Centered ─── */}
      <div className="max-w-3xl mx-auto">
        <Card className="rounded-[2rem] border-border/40 bg-card p-8 shadow-sm h-full">
          <div className="flex items-center gap-3 mb-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
              <UserIcon className="h-6 w-6 text-primary" style={{ color: BRAND_TEAL }} />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-foreground">Identity Details</h2>
              <p className="text-sm font-medium text-muted-foreground">
                Manage your personal information.
              </p>
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              profileForm.handleSubmit();
            }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <profileForm.Field name="name">
                {(field) => (
                  <div className="space-y-2">
                    <Label className="font-bold text-foreground">Full Name</Label>
                    <Input
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="h-12 rounded-xl bg-muted/20 border-border/50 focus-visible:ring-primary/50 font-medium"
                      placeholder="Enter Your Name"
                    />
                  </div>
                )}
              </profileForm.Field>

              <div className="space-y-2 opacity-70">
                <Label className="font-bold text-foreground flex items-center justify-between">
                  Email Address{" "}
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground bg-muted px-2 py-0.5 rounded-md">
                    Locked
                  </span>
                </Label>
                <Input
                  value={user?.email || ""}
                  disabled
                  className="h-12 rounded-xl bg-muted/40 border-border/30 font-medium cursor-not-allowed"
                />
              </div>

              <profileForm.Field name="phone">
                {(field) => (
                  <div className="space-y-2">
                    <Label className="font-bold text-foreground">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className="h-12 pl-11 rounded-xl bg-muted/20 border-border/50 focus-visible:ring-primary/50 font-medium"
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                  </div>
                )}
              </profileForm.Field>
            </div>

            <div className="pt-4 flex justify-end">
              <profileForm.Subscribe selector={(s) => [s.canSubmit] as const}>
                {([canSubmit]) => (
                  <AppSubmitButton
                    isPending={isUpdatingProfile}
                    pendingLabel="Saving..."
                    disabled={!canSubmit}
                    className="h-12 px-8 rounded-xl font-bold text-white shadow-lg transition-all hover:-translate-y-0.5"
                    style={{
                      background: `linear-gradient(135deg, ${BRAND_PURPLE}, ${BRAND_TEAL})`,
                    }}
                  >
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Save Changes
                  </AppSubmitButton>
                )}
              </profileForm.Subscribe>
            </div>
          </form>
        </Card>
      </div>
    </motion.div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="max-w-6xl mx-auto space-y-8 mt-12">
      <Skeleton className="h-64 w-full rounded-[2.5rem]" />
      <div className="max-w-3xl mx-auto">
        <Skeleton className="h-96 w-full rounded-[2rem]" />
      </div>
    </div>
  );
}
