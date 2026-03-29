import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { InviteManagementContent } from "@/components/modules/Admin/InviteManagement";
import { getInvites } from "@/services/invite.services";
import { fetchDepartments, fetchUniversityId } from "./_actions";

export default async function InviteManagementPage() {
  const queryClient = new QueryClient();

  const universityId = await fetchUniversityId();
  const departments = await fetchDepartments(universityId);

  await queryClient.prefetchQuery({
    queryKey: ["invites"],
    queryFn: () => getInvites(),
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <InviteManagementContent
        universityId={universityId}
        departments={departments}
      />
    </HydrationBoundary>
  );
}