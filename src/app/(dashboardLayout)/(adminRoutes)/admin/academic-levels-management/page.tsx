
import AcademicLevelTable from "@/components/modules/Admin/AcademicLevel/AcademicLevelTable";
import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Academic Level Management | Scholar Track",
  description: "Manage academic levels for your university",
};

export default function AcademicLevelManagementPage() {

  return <AcademicLevelTable initialQueryString="" />;
}