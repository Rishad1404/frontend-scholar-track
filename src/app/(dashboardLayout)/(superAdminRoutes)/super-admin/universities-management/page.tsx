// src/app/(dashboardLayout)/(superAdminRoutes)/super-admin/universities-management/page.tsx

import UniversitiesTable from "@/components/modules/Dashboard/SuperAdmin/University/UniversityTable";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Universities Management | Super Admin",
};

interface Props {
  searchParams: Promise<Record<string, string | string[]>>;
}

export default function UniversitiesManagementPage({ searchParams }: Props) {
  return (
    <div className="space-y-0">
      <UniversitiesTable searchParamsPromise={searchParams} />
    </div>
  );
}