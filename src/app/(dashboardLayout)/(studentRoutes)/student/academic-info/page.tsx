// app/(dashboardLayout)/(studentRoutes)/student/academic-info/page.tsx

import { redirect } from "next/navigation";
import { getUserInfo } from "@/services/auth.services";
import AcademicInfoWrapper from "@/components/modules/Dashboard/Students/MyProfile/AcademicInfoWrapper";

export default async function StudentAcademicInfoPage() {
  const currentUser = await getUserInfo();
  if (!currentUser) redirect("/login");

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <AcademicInfoWrapper />
    </div>
  );
}