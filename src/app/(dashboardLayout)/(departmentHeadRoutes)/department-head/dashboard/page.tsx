import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import DepartmentHeadDashboardContent from "@/components/modules/Dashboard/DepartmentHeadDashboardContent";
import { getDashboardData } from "@/services/dashboard.services";

export default async function DepartmentHeadDashboardPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["department-head-dashboard-data"],
    queryFn: getDashboardData,
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DepartmentHeadDashboardContent />
    </HydrationBoundary>
  );
}