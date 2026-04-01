import ApplicationsTable from "@/components/modules/Dashboard/Application/ApplicationTable";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Applications Management | Scholar Track",
  description: "Manage scholarship applications in your university",
};

export default function ApplicationsManagementPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[]>>;
}) {
  return <ApplicationsTable searchParamsPromise={searchParams} />;
}