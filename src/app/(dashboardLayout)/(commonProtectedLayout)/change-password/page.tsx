// src/app/(commonProtectedLayout)/change-password/page.tsx

import ChangePasswordForm from "@/components/modules/Dashboard/ChangePassword/ChangePasswordForm";

export const metadata = {
  title: "Change Password | Scholar Track",
  description: "Securely update your account password.",
};

export default function ChangePasswordPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">

      <ChangePasswordForm />
    </div>
  );
}