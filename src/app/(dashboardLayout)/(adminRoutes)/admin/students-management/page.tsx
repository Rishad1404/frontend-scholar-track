import StudentsTable from "@/components/modules/Dashboard/Students/StudentsTable";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Students Management | Scholar Track",
  description: "View and manage all students in your university",
};

export default function StudentsManagementPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[]>>;
}) {
  return <StudentsTable searchParamsPromise={searchParams} />;
}