import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import SuperAdminDashboardContent from "@/components/modules/Dashboard/SuperAdminDashboardContent";
import { getSuperAdminDashboardData } from "@/services/dashboard.services";

export default async function SuperAdminDashboardPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["super-admin-dashboard-data"],
    queryFn: getSuperAdminDashboardData,
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SuperAdminDashboardContent />
    </HydrationBoundary>
  );
}