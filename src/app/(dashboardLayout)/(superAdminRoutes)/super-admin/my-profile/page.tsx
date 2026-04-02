import SuperAdminProfile from "@/components/modules/Dashboard/SuperAdmin/SuperAdminProfile";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Super Admin Profile | Scholar Track",
  description: "Manage your super administrator identity and security settings.",
};

export default function SuperAdminProfilePage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <SuperAdminProfile />
    </div>
  );
}