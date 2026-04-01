// app/(dashboardLayout)/(adminRoutes)/admin/my-profile/page.tsx

import { redirect } from "next/navigation";
import { getUserInfo } from "@/services/auth.services";
import AdminProfile from "@/components/modules/Admin/AdminProfile/AdminProfile";

export default async function AdminProfilePage() {
  const currentUser = await getUserInfo();

  if (!currentUser) {
    redirect("/login");
  }

  const currentAdminId = currentUser.admin?.id;

  if (!currentAdminId) {
    redirect("/login");
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <AdminProfile adminId={currentAdminId} />
    </div>
  );
}