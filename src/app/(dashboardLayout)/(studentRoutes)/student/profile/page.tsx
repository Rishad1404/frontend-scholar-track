
import { redirect } from "next/navigation";
import { getUserInfo } from "@/services/auth.services";
import StudentProfile from "@/components/modules/Dashboard/Students/MyProfile/StudentProfile";

export default async function StudentMyProfilePage() {
  const currentUser = await getUserInfo();
  if (!currentUser) redirect("/login");

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <StudentProfile />
    </div>
  );
}