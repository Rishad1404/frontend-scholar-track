export const dynamic = "force-dynamic";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import StudentDashboardContent from "@/components/modules/Dashboard/StudentDashboardContent";
import { getDashboardData } from "@/services/dashboard.services";

export default async function StudentDashboardPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["student-dashboard-data"],
    queryFn: getDashboardData,
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <StudentDashboardContent />
    </HydrationBoundary>
  );
}