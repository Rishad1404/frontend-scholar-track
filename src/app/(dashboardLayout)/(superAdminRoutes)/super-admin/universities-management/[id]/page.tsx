// src/app/(dashboardLayout)/(superAdminRoutes)/super-admin/universities-management/[id]/page.tsx

import UniversityDetail from "@/components/modules/Dashboard/SuperAdmin/University/UniversityDetail";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "University Details | Super Admin",
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function UniversityDetailPage({ params }: Props) {
  const { id } = await params;
  return <UniversityDetail universityId={id} />;
}