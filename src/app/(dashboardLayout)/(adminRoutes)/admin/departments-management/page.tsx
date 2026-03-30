
import DepartmentTable from "@/components/modules/Dashboard/Department/DepartmentTable";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Department Management | Scholar Track",
  description: "Manage departments for your university",
};

export default function DepartmentManagementPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[]>>;
}) {
  return <DepartmentTable searchParamsPromise={searchParams} />;
}