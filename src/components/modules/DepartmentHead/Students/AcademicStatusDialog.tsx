/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { User, Loader2, AlertTriangle, Activity, CheckCircle2, ShieldAlert, LucideIcon } from "lucide-react";
import { toast } from "sonner";
import type { IStudent, StudentAcademicStatus } from "@/types/student";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { changeAcademicStatusAction } from "@/app/(dashboardLayout)/(departmentHeadRoutes)/department-head/students/_actions";

interface Props { open: boolean; onClose: () => void; student: IStudent | null; onSuccess: () => void; }

const ALLOWED_STATUSES: { value: StudentAcademicStatus; label: string; description: string; color: string; icon: LucideIcon }[] = [
  { value: "REGULAR", label: "Regular", description: "Good academic standing", color: "#16a34a", icon: CheckCircle2 },
  { value: "PROBATION", label: "Probation", description: "Improvement needed", color: "#d97706", icon: ShieldAlert },
];

export default function AcademicStatusDialog({ open, onClose, student, onSuccess }: Props) {
  const [selected, setSelected] = useState<StudentAcademicStatus | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (status: StudentAcademicStatus) => changeAcademicStatusAction(student!.id, status),
  });

  const handleSubmit = async () => {
    if (!selected) return setServerError("Please select a status");
    try {
      const res = await mutateAsync(selected);
      if (res.success) { toast.success(res.message); onSuccess(); }
      else setServerError(res.message);
    } catch (err: any) { setServerError(err.message); }
  };

  if (!student) return null;
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-black text-foreground">
            <Activity className="h-5 w-5" color="#4b2875" /> Manage Status
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          {ALLOWED_STATUSES.map((opt) => (
            <button key={opt.value} onClick={() => setSelected(opt.value)} className={`w-full flex items-center gap-3 rounded-xl border-2 p-4 text-left transition-all ${selected === opt.value ? 'bg-muted/30 border-primary' : 'border-border/40 hover:bg-muted/10'}`}>
              <opt.icon color={opt.color} className="h-6 w-6" />
              <div><p className="text-sm font-bold text-foreground">{opt.label}</p><p className="text-xs text-muted-foreground">{opt.description}</p></div>
            </button>
          ))}
          {serverError && <Alert variant="destructive" className="rounded-xl"><AlertDescription>{serverError}</AlertDescription></Alert>}
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={onClose} disabled={isPending} className="rounded-xl">Cancel</Button>
            <Button onClick={handleSubmit} disabled={isPending || !selected} className="rounded-xl px-6 bg-primary text-white">
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirm"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}