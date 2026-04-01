/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { User, Mail, Phone, Calendar, MapPin, GraduationCap, BookOpen, Hash, Activity, Droplets, FileText } from "lucide-react";
import type { IStudent, StudentAcademicStatus } from "@/types/student";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Props { open: boolean; onClose: () => void; student: IStudent | null; }

const STATUS_CONFIG: Record<StudentAcademicStatus, { label: string; color: string; bg: string; border: string }> = {
  REGULAR: { label: "Regular", color: "#16a34a", bg: "#16a34a15", border: "#16a34a40" },
  PROBATION: { label: "Probation", color: "#d97706", bg: "#d9770615", border: "#d9770640" },
  SUSPENDED: { label: "Suspended", color: "#dc2626", bg: "#dc262615", border: "#dc262640" },
  DROPPED_OUT: { label: "Dropped Out", color: "#6b7280", bg: "#6b728015", border: "#6b728040" },
};

export default function StudentDetailDialog({ open, onClose, student }: Props) {
  if (!student) return null;
  const studentWithApps = student as any;
  const status = student.academicInfo?.academicStatus || "REGULAR";
  const config = STATUS_CONFIG[status as StudentAcademicStatus] || STATUS_CONFIG.REGULAR;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-black"><User className="h-5 w-5" style={{ color: "#4b2875" }} /> Student Details</DialogTitle>
        </DialogHeader>
        <div className="flex items-center gap-4 rounded-xl border border-border/40 bg-muted/10 p-4 mt-2">
          <div className="h-16 w-16 rounded-full flex items-center justify-center bg-primary/10 text-xl font-black text-primary border border-primary/20">
            {student.user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-extrabold text-foreground truncate">{student.user?.name}</h3>
            <p className="text-sm text-muted-foreground truncate">{student.user?.email}</p>
            <Badge className="mt-2 font-bold text-xs" style={{ backgroundColor: config.bg, color: config.color, borderColor: config.border }}>{config.label}</Badge>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 mt-4">
          <InfoRow icon={User} label="Gender" value={student.gender} />
          <InfoRow icon={Phone} label="Phone" value={student.phone} />
          <InfoRow icon={MapPin} label="Address" value={student.address} />
          <InfoRow icon={Droplets} label="Blood Group" value={student.bloodGroup} />
        </div>
        <Separator className="my-2" />
        <div className="grid grid-cols-2 gap-3">
          <InfoRow icon={Hash} label="ID No" value={student.academicInfo?.studentIdNo} />
          <InfoRow icon={BookOpen} label="Department" value={student.academicInfo?.department?.name} />
          <InfoRow icon={Activity} label="CGPA" value={student.academicInfo?.cgpa} />
          <InfoRow icon={GraduationCap} label="Status" value={config.label} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: any; label: string; value: any }) {
  return (
    <div className="flex items-center gap-2.5 rounded-lg border border-border/30 bg-background p-2.5">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted/50"><Icon className="h-3.5 w-3.5 text-muted-foreground" /></div>
      <div className="flex-1 min-w-0">
        <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">{label}</p>
        <p className="text-sm font-semibold text-foreground truncate">{value || "—"}</p>
      </div>
    </div>
  );
}