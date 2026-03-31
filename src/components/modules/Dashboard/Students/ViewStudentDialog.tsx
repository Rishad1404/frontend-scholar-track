// src/components/modules/Dashboard/Students/ViewStudentDialog.tsx

"use client";

import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  GraduationCap,
  BookOpen,
  Calendar,
  Phone,
  MapPin,
  Droplets,
  User,
  Mail,
  ShieldCheck,
  CreditCard,
  Hash
} from "lucide-react";
import type { IStudent } from "@/types/student";
import {
  ACADEMIC_STATUS_LABELS,
  ACADEMIC_STATUS_VARIANT,
  BLOOD_GROUP_LABELS,
  GENDER_LABELS,
  USER_STATUS_VARIANT,
} from "@/types/student";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: IStudent | null;
}

const BRAND_TEAL = "#0097b2";
const BRAND_PURPLE = "#4b2875";

export default function ViewStudentDialog({ open, onOpenChange, student }: Props) {
  if (!student) return null;

  const ai = student.academicInfo;
  const appCount = student._count?.applications ?? 0;
  const disbursementCount = student._count?.disbursements ?? 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-212.5 p-0 overflow-hidden border-border/40 bg-background/95 backdrop-blur-xl shadow-2xl rounded-[2rem]">
        {/* Visually hidden title for accessibility screen readers */}
        <VisuallyHidden>
          <DialogTitle>Student Profile: {student.name}</DialogTitle>
        </VisuallyHidden>

        {/* ─── Scrollable Body ─── */}
        <div className="max-h-[85vh] overflow-y-auto overflow-x-hidden custom-scrollbar">
          
          {/* ─── Clean Premium Header ─── */}
          <div className="border-b border-border/40 bg-muted/10 px-6 py-8 sm:px-10 sm:py-10">
            <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:items-start sm:text-left">
              
              <Avatar className="h-24 w-24 shrink-0 border-4 border-background bg-card shadow-lg sm:h-28 sm:w-28">
                <AvatarImage
                  src={student.profilePhoto || student.user?.image || ""}
                  alt={student.name}
                  className="object-cover"
                />
                <AvatarFallback className="text-3xl font-bold bg-muted text-muted-foreground">
                  {student.name
                    .split(" ")
                    .map((p) => p.charAt(0).toUpperCase())
                    .join("")
                    .slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex flex-1 flex-col sm:pt-2">
                <h2 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                  {student.name}
                </h2>
                
                <div className="mt-3 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                  <span className="flex items-center gap-1.5 rounded-lg border border-border/50 bg-background px-3 py-1 text-sm font-medium text-muted-foreground shadow-sm">
                    <Mail className="h-3.5 w-3.5" />
                    {student.email}
                  </span>
                  
                  <Badge variant={USER_STATUS_VARIANT[student.user.status]} className="px-3 py-1 shadow-sm text-sm">
                    <ShieldCheck className="mr-1.5 h-3.5 w-3.5" />
                    {student.user.status}
                  </Badge>
                  
                  {ai?.academicStatus && (
                    <Badge variant={ACADEMIC_STATUS_VARIANT[ai.academicStatus]} className="px-3 py-1 shadow-sm text-sm">
                      {ACADEMIC_STATUS_LABELS[ai.academicStatus]}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 py-8 sm:px-10">
            {/* ─── Fast Stats Row ─── */}
            <div className="mb-8 grid grid-cols-3 gap-3 sm:gap-5">
              <div className="flex flex-col items-center justify-center rounded-2xl border border-border/50 bg-card p-4 shadow-sm transition-colors hover:bg-muted/20 sm:p-5">
                <GraduationCap className="mb-2 h-6 w-6 text-primary" style={{ color: BRAND_PURPLE }} />
                <span className="text-2xl font-black text-foreground sm:text-3xl">{appCount}</span>
                <span className="mt-1 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-muted-foreground">Applications</span>
              </div>
              <div className="flex flex-col items-center justify-center rounded-2xl border border-border/50 bg-card p-4 shadow-sm transition-colors hover:bg-muted/20 sm:p-5">
                <CreditCard className="mb-2 h-6 w-6 text-primary" style={{ color: BRAND_TEAL }} />
                <span className="text-2xl font-black text-foreground sm:text-3xl">{disbursementCount}</span>
                <span className="mt-1 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-muted-foreground">Disbursements</span>
              </div>
              <div className="flex flex-col items-center justify-center rounded-2xl border border-border/50 bg-card p-4 shadow-sm transition-colors hover:bg-muted/20 sm:p-5">
                <Calendar className="mb-2 h-6 w-6 text-muted-foreground" />
                <span className="text-sm sm:text-base font-bold text-foreground">
                  {format(new Date(student.createdAt), "MMM yyyy")}
                </span>
                <span className="mt-1 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-muted-foreground">Joined</span>
              </div>
            </div>

            {/* ─── Main Details: Two Column Grid ─── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              
              {/* Left Column: Personal Info */}
              <div className="space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted/50 border border-border/50">
                    <User className="h-4 w-4 text-foreground" />
                  </div>
                  <h4 className="text-lg font-bold text-foreground">Personal Details</h4>
                </div>
                
                <div className="flex flex-col gap-2.5">
                  <InfoRow 
                    icon={User} 
                    label="Gender" 
                    value={student.gender ? GENDER_LABELS[student.gender as keyof typeof GENDER_LABELS] || student.gender : "—"} 
                  />
                  <InfoRow 
                    icon={Calendar} 
                    label="Date of Birth" 
                    value={student.dateOfBirth ? format(new Date(student.dateOfBirth), "MMMM dd, yyyy") : "—"} 
                  />
                  <InfoRow 
                    icon={Droplets} 
                    label="Blood Group" 
                    value={student.bloodGroup ? BLOOD_GROUP_LABELS[student.bloodGroup as keyof typeof BLOOD_GROUP_LABELS] || student.bloodGroup : "—"} 
                    iconColor="text-rose-500"
                  />
                  <InfoRow 
                    icon={Phone} 
                    label="Phone" 
                    value={student.phone || "—"} 
                  />
                  <InfoRow 
                    icon={MapPin} 
                    label="Address" 
                    value={student.address || "—"} 
                    isBlock
                  />
                </div>
              </div>

              {/* Right Column: Academic Info */}
              <div className="space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted/50 border border-border/50">
                    <BookOpen className="h-4 w-4 text-foreground" />
                  </div>
                  <h4 className="text-lg font-bold text-foreground">Academic Profile</h4>
                </div>

                {ai ? (
                  <div className="flex flex-col gap-2.5">
                    <InfoRow 
                      icon={Hash} 
                      label="Student ID" 
                      value={ai.studentIdNo || "—"} 
                      valueClass="font-mono text-primary font-bold"
                    />
                    <InfoRow 
                      icon={GraduationCap} 
                      label="Department" 
                      value={ai.department?.name || "—"} 
                    />
                    <InfoRow 
                      icon={BookOpen} 
                      label="Level / Term" 
                      value={`${ai.level?.name || "—"} / ${ai.term?.name || "—"}`} 
                    />
                    <div className="flex items-center justify-between rounded-xl border border-primary/20 bg-primary/5 p-4 shadow-sm">
                      <span className="text-sm font-medium text-muted-foreground flex items-center gap-2.5">
                        <BookOpen className="h-4 w-4 text-primary" style={{ color: BRAND_TEAL }} /> 
                        GPA / CGPA
                      </span>
                      <span className="text-base font-bold text-foreground">
                        {ai.gpa?.toFixed(2) || "0.00"} <span className="text-muted-foreground font-medium">/ {ai.cgpa?.toFixed(2) || "0.00"}</span>
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex h-40 items-center justify-center rounded-2xl border-2 border-dashed border-border/60 bg-muted/10">
                    <p className="text-sm font-medium text-muted-foreground">No academic profile found.</p>
                  </div>
                )}
              </div>
              
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Reusable Helper Component for Info Rows ───
function InfoRow({ 
  icon: Icon, 
  label, 
  value, 
  iconColor,
  valueClass = "",
  isBlock = false
}: { 
  icon: React.ElementType, 
  label: string, 
  value: string,
  iconColor?: string,
  valueClass?: string,
  isBlock?: boolean
}) {
  if (isBlock) {
    return (
      <div className="flex flex-col gap-2 rounded-xl border border-border/50 bg-card p-4 shadow-sm transition-colors hover:bg-muted/10">
        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <Icon className={`h-4 w-4 ${iconColor || 'text-muted-foreground'}`} /> {label}
        </span>
        <span className={`text-sm font-medium text-foreground leading-relaxed ${valueClass}`}>{value}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between rounded-xl border border-border/50 bg-card p-4 shadow-sm transition-colors hover:bg-muted/10">
      <span className="text-sm font-medium text-muted-foreground flex items-center gap-2.5">
        <Icon className={`h-4.5 w-4.5 ${iconColor || 'opacity-70'}`} /> {label}
      </span>
      <span className={`text-sm font-semibold text-foreground text-right truncate max-w-[55%] ${valueClass}`}>
        {value}
      </span>
    </div>
  );
}