
import DepartmentHeadTable from "@/components/modules/Dashboard/DepartmentHead/DepartmentHeadTable";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Department Head Management | Scholar Track",
  description: "Manage department heads for your university",
};

export default function DepartmentHeadManagementPage() {
  return <DepartmentHeadTable />;
}