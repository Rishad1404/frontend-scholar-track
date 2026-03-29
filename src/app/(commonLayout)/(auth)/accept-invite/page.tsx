/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { acceptInvite } from "@/services/invite.services";
import { acceptInviteSchema, AcceptInviteFormData } from "@/zod/invite.validation";
import { useMutation } from "@tanstack/react-query";
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Shield,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

// ═══════════════════════════════════════════
// NO TOKEN STATE
// ═══════════════════════════════════════════
const NoTokenState = () => (
  <div className="flex min-h-screen items-center justify-center px-4">
    <Card className="w-full max-w-md text-center">
      <CardHeader>
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
          <AlertCircle className="h-7 w-7 text-destructive" />
        </div>
        <CardTitle className="mt-4">Invalid Invitation</CardTitle>
        <CardDescription>
          No invitation token was provided. Please use the link from your
          invitation email.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button asChild variant="outline" className="w-full">
          <a href="/login">Go to Login</a>
        </Button>
      </CardContent>
    </Card>
  </div>
);

// ═══════════════════════════════════════════
// SUCCESS STATE
// ═══════════════════════════════════════════
const SuccessState = () => (
  <div className="flex min-h-screen items-center justify-center px-4">
    <Card className="w-full max-w-md text-center">
      <CardHeader>
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10">
          <CheckCircle2 className="h-7 w-7 text-emerald-600" />
        </div>
        <CardTitle className="mt-4">Account Created!</CardTitle>
        <CardDescription>
          Your account has been set up successfully. You can now log in with
          your credentials.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button asChild className="w-full bg-[#0097b2] hover:bg-[#0097b2]/90">
          <a href="/login">Go to Login</a>
        </Button>
      </CardContent>
    </Card>
  </div>
);

// ═══════════════════════════════════════════
// ERROR STATE (after failed accept)
// ═══════════════════════════════════════════
const ErrorState = ({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) => (
  <div className="flex min-h-screen items-center justify-center px-4">
    <Card className="w-full max-w-md text-center">
      <CardHeader>
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
          <AlertCircle className="h-7 w-7 text-destructive" />
        </div>
        <CardTitle className="mt-4">Invitation Error</CardTitle>
        <CardDescription>{message}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <Button onClick={onRetry} variant="outline" className="w-full">
          Try Again
        </Button>
        <Button asChild variant="ghost" className="w-full">
          <a href="/login">Go to Login</a>
        </Button>
      </CardContent>
    </Card>
  </div>
);

// ═══════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════
export default function AcceptInvitePage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  // ── Form state ──
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // ── UI state ──
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // ── Accept invite mutation ──
  const { mutate: handleAccept, isPending } = useMutation({
    mutationFn: acceptInvite,
    onSuccess: () => {
      setSuccess(true);
      setServerError(null);
      toast.success("Account created successfully!");
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        "Failed to accept invitation. The invite may be invalid or expired.";

      // If it's a token-level error, show the error state
      const status = error?.response?.status;
      if (status === 400 || status === 404 || status === 410) {
        setServerError(message);
      } else {
        toast.error(message);
      }
    },
  });

  // ── Submit ──
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData: AcceptInviteFormData = {
      name,
      password,
      confirmPassword,
      phone: phone || undefined,
    };

    const result = acceptInviteSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    handleAccept({
      token: token!,
      name: result.data.name,
      password: result.data.password,
      phone: result.data.phone,
    });
  };

  // ── Guards ──
  if (!token) return <NoTokenState />;
  if (success) return <SuccessState />;
  if (serverError)
    return (
      <ErrorState
        message={serverError}
        onRetry={() => setServerError(null)}
      />
    );

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md border-border/40 shadow-lg">
        {/* Top gradient */}
        <div className="h-0.75 w-full rounded-t-lg bg-linear-to-r from-[#4b2875] to-[#0097b2]" />

        <CardHeader className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#0097b2]/10">
            <Shield className="h-7 w-7 text-[#0097b2]" />
          </div>
          <CardTitle className="mt-4 text-xl">Accept Invitation</CardTitle>
          <CardDescription>
            Complete your account setup to join the university team.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">
                Full Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                placeholder="Dr. Jane Smith"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setErrors((p) => ({ ...p, name: "" }));
                }}
                disabled={isPending}
              />
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">
                Password <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Min 8 chars, uppercase, number"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors((p) => ({ ...p, password: "" }));
                  }}
                  disabled={isPending}
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full w-10 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
              {errors.password && (
                <p className="text-xs text-destructive">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">
                Confirm Password <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setErrors((p) => ({ ...p, confirmPassword: "" }));
                  }}
                  disabled={isPending}
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full w-10 hover:bg-transparent"
                  onClick={() => setShowConfirm(!showConfirm)}
                  tabIndex={-1}
                >
                  {showConfirm ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-destructive">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone">Phone (optional)</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+880 1XXXXXXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={isPending}
              />
              {errors.phone && (
                <p className="text-xs text-destructive">{errors.phone}</p>
              )}
            </div>

            {/* Info Box */}
            <div className="rounded-lg border border-border/60 bg-muted/50 p-3">
              <p className="text-xs text-muted-foreground">
                By creating your account, you&apos;ll be assigned your role and
                gain access to the university dashboard.
              </p>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={isPending}
              className="w-full bg-[#0097b2] hover:bg-[#0097b2]/90"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Create Account & Join"
              )}
            </Button>
          </form>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            Already have an account?{" "}
            <a
              href="/login"
              className="font-medium text-[#0097b2] hover:underline"
            >
              Log in instead
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}