/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createInvite } from "@/services/invite.services";
import { IDepartment, InviteRole } from "@/types/invites.types";
import {
  createInviteSchema,
  CreateInviteFormData,
} from "@/zod/invite.validation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface CreateInviteDialogProps {
  departments: IDepartment[];
}

const CreateInviteDialog = ({ departments }: CreateInviteDialogProps) => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  // ── Form state ──
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<InviteRole | undefined>(undefined);
  const [departmentId, setDepartmentId] = useState<string | undefined>(
    undefined
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  // ── Create invite mutation ──
  const { mutate: sendInvite, isPending } = useMutation({
    mutationFn: createInvite,
    onSuccess: (response: any) => {
      toast.success(
        response?.message ||
          response?.data?.message ||
          "Invite sent successfully!"
      );
      queryClient.invalidateQueries({ queryKey: ["invites"] });
      handleReset();
      setOpen(false);
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to send invite"
      );
    },
  });

  // ── Reset ──
  const handleReset = () => {
    setEmail("");
    setRole(undefined);
    setDepartmentId(undefined);
    setErrors({});
  };

  // ── Submit ──
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData: CreateInviteFormData = {
      email,
      role: role as InviteRole,
      departmentId: departmentId || undefined,
    };

    const result = createInviteSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0] as string] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    sendInvite(result.data);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) handleReset();
      }}
    >
      <DialogTrigger asChild>
        <Button className="bg-[#0097b2] hover:bg-[#0097b2]/90">
          <Plus className="mr-2 h-4 w-4" />
          Send Invite
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-120">
        <DialogHeader>
          <DialogTitle>Invite Team Member</DialogTitle>
          <DialogDescription>
            Send an invitation to a Department Head or Committee Reviewer to
            join your university.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 py-4">
          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">
              Email Address <span className="text-destructive">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="colleague@university.edu"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors((prev) => ({ ...prev, email: "" }));
              }}
              disabled={isPending}
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email}</p>
            )}
          </div>

          {/* Role */}
          <div className="space-y-2">
            <Label>
              Role <span className="text-destructive">*</span>
            </Label>
            <Select
              value={role ?? ""}
              onValueChange={(val: string) => {
                const selectedRole = val as InviteRole;
                setRole(selectedRole);
                if (selectedRole !== "DEPARTMENT_HEAD") {
                  setDepartmentId(undefined);
                }
                setErrors((prev) => ({
                  ...prev,
                  role: "",
                  departmentId: "",
                }));
              }}
              disabled={isPending}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DEPARTMENT_HEAD">
                  Department Head
                </SelectItem>
                <SelectItem value="COMMITTEE_REVIEWER">
                  Committee Reviewer
                </SelectItem>
              </SelectContent>
            </Select>
            {errors.role && (
              <p className="text-xs text-destructive">{errors.role}</p>
            )}
          </div>

          {/* Department — only for DEPARTMENT_HEAD */}
          {role === "DEPARTMENT_HEAD" && (
            <div className="space-y-2">
              <Label>
                Department <span className="text-destructive">*</span>
              </Label>
              <Select
                value={departmentId ?? ""}
                onValueChange={(val: string) => {
                  setDepartmentId(val);
                  setErrors((prev) => ({ ...prev, departmentId: "" }));
                }}
                disabled={isPending}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.length === 0 ? (
                    <div className="px-3 py-2 text-sm text-muted-foreground">
                      No departments found. Create a department first.
                    </div>
                  ) : (
                    departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id}>
                        {dept.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {errors.departmentId && (
                <p className="text-xs text-destructive">
                  {errors.departmentId}
                </p>
              )}
            </div>
          )}

          {/* Info Box */}
          <div className="rounded-lg border border-border/60 bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground">
              An email will be sent with a secure invitation link. The invite
              expires in{" "}
              <span className="font-semibold text-foreground">7 days</span>.
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-[#0097b2] hover:bg-[#0097b2]/90"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Send Invite
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateInviteDialog;