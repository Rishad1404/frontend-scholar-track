// src/app/(dashboardLayout)/(adminRoutes)/admin/academic-level-management/page.tsx

import AcademicLevelTable from "@/components/modules/Admin/AcademicLevel/AcademicLevelTable";
import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Academic Level Management | Scholar Track",
  description: "Manage academic levels for your university",
};

export default function AcademicLevelManagementPage() {
  // backend returns flat array, no initial query needed
  return <AcademicLevelTable initialQueryString="" />;
}