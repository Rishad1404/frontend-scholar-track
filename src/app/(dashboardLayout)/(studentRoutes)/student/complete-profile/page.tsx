
import { redirect } from "next/navigation";
import { getUserInfo } from "@/services/auth.services";
import CompleteProfileForm from "@/components/modules/Dashboard/Students/MyProfile/CompleteProfileForm";

export default async function CompleteProfilePage() {
  const currentUser = await getUserInfo();
  if (!currentUser) redirect("/login");

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <CompleteProfileForm />
    </div>
  );
}