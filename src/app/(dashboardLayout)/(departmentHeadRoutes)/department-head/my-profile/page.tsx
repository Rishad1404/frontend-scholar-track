
import { redirect } from "next/navigation";
import { getUserInfo } from "@/services/auth.services";
import DepartmentHeadProfile from "@/components/modules/DepartmentHead/DepartmentHeadProfile";

export default async function DepartmentHeadMyProfilePage() {
  const currentUser = await getUserInfo();

  if (!currentUser) redirect("/login");

  // adjust key if your getUserInfo() uses a different shape
  const deptHeadId = currentUser.departmentHead?.id;

  if (!deptHeadId) redirect("/login");

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <DepartmentHeadProfile deptHeadId={deptHeadId} />
    </div>
  );
}