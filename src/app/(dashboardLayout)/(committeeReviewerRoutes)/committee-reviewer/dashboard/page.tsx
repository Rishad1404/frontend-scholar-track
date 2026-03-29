import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import ReviewerDashboardContent from "@/components/modules/Dashboard/ReviewerDashboardContent";
import { getDashboardData } from "@/services/dashboard.services";

export default async function ReviewerDashboardPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["reviewer-dashboard-data"],
    queryFn: getDashboardData,
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ReviewerDashboardContent />
    </HydrationBoundary>
  );
}