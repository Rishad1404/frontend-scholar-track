// src/app/(dashboardLayout)/(superAdminRoutes)/super-admin/subscriptions-overview/page.tsx

import SubscriptionsTable from "@/components/modules/Dashboard/SuperAdmin/Subscription/SubscriptionsTable";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Subscriptions Overview | Super Admin",
};

interface Props {
  searchParams: Promise<Record<string, string | string[]>>;
}

export default function SubscriptionsOverviewPage({ searchParams }: Props) {
  return (
    <div className="space-y-0">
      <SubscriptionsTable searchParamsPromise={searchParams} />
    </div>
  );
}