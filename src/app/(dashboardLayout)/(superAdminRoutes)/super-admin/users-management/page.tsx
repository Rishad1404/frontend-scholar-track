// src/app/(dashboardLayout)/(superAdminRoutes)/super-admin/users-management/page.tsx

import UsersTable from "@/components/modules/Dashboard/SuperAdmin/Users/UsersTable";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Users Management | Super Admin",
};

interface Props {
  searchParams: Promise<Record<string, string | string[]>>;
}

export default function UsersManagementPage({ searchParams }: Props) {
  return (
    <div className="space-y-0">
      <UsersTable searchParamsPromise={searchParams} />
    </div>
  );
}