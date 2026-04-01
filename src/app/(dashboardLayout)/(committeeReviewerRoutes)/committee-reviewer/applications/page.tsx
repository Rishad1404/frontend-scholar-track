import ReviewerApplicationsTable from "@/components/modules/Dashboard/Reviewer/ReviewerApplicationsTable";

export const metadata = {
  title: "Review Queue | Scholar Track",
};

export default async function ReviewerApplicationsPage(props: {
  searchParams: Promise<Record<string, string | string[]>>;
}) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <ReviewerApplicationsTable searchParamsPromise={props.searchParams} />
    </div>
  );
}