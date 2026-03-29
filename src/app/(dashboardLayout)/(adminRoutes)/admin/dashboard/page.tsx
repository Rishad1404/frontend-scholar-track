import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import AdminDashboardContent from "@/components/modules/Dashboard/AdminDashboardContent";
import { getAdminDashboardData } from "@/services/dashboard.services";

// This is a SERVER COMPONENT — no "use client"
export default async function AdminDashboardPage() {
  const queryClient = new QueryClient();

  // Prefetch data on server
  await queryClient.prefetchQuery({
    queryKey: ["admin-dashboard-data"],
    queryFn: getAdminDashboardData,
    staleTime: 30 * 1000,     
    gcTime: 5 * 60 * 1000,    
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AdminDashboardContent />
    </HydrationBoundary>
  );
}