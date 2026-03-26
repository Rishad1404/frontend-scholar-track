import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { getPublicScholarships } from "./_actions";
import PublicScholarshipsList from "@/components/modules/PublicScholarship/PublicScholarshipsList";

const ScholarshipPage =async () => {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ['publicScholarships'],
    queryFn: getPublicScholarships,
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PublicScholarshipsList />
    </HydrationBoundary>
  );
};

export default ScholarshipPage;