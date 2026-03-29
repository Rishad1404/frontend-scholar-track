import AcademicTermTable from "@/components/modules/Admin/AcademicTerm/AcademicTermTable";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Academic Term Management | Scholar Track",
  description: "Manage academic terms for your university",
};

export default function AcademicTermManagementPage() {
  return <AcademicTermTable />;
}