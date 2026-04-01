import DisbursementsTable from "@/components/modules/Dashboard/Disbursements/DisbursementsTable";

export const metadata = {
  title: "Disbursements Management | Scholar Track",
  description: "Manage and track student scholarship payouts and transactions.",
};

export default async function DisbursementsManagementPage(props: {
  searchParams: Promise<Record<string, string | string[]>>;
}) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <DisbursementsTable searchParamsPromise={props.searchParams} />
    </div>
  );
}