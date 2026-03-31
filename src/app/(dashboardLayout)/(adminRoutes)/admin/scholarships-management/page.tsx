import ScholarshipsTable from "@/components/modules/Admin/Scholarship/ScholarshipsTable";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Scholarships Management | Scholar Track",
  description: "Create and manage scholarships for your university",
};

export default function ScholarshipsManagementPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[]>>;
}) {
  return <ScholarshipsTable searchParamsPromise={searchParams} />;
}