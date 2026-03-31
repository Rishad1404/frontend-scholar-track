
"use client";

import { Card } from "@/components/ui/card";
import {
  Users,
  Building2,
  GraduationCap,
  BookOpen,
  UserCog,
  Users2,
} from "lucide-react";
import type { IUniversityCounts } from "@/types/university";

interface Props {
  counts: IUniversityCounts;
}

const statItems = [
  { key: "admins", label: "Admins", icon: Users },
  { key: "departments", label: "Departments", icon: Building2 },
  { key: "scholarships", label: "Scholarships", icon: GraduationCap },
  { key: "students", label: "Students", icon: BookOpen },
  { key: "departmentHeads", label: "Dept. Heads", icon: UserCog },
  { key: "reviewers", label: "Reviewers", icon: Users2 },
] as const;

export default function UniversityStatsCard({ counts }: Props) {
  return (
    <Card className="p-6">
      <h3 className="mb-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
        University Overview
      </h3>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {statItems.map(({ key, label, icon: Icon }) => (
          <div
            key={key}
            className="flex flex-col items-center rounded-lg border p-3 text-center"
          >
            <Icon className="mb-1 h-5 w-5 text-muted-foreground" />
            <span className="text-lg font-bold">{counts[key]}</span>
            <span className="text-xs text-muted-foreground">{label}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}