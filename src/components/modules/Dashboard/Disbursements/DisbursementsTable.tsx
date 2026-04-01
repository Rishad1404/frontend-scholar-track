// src/components/modules/Dashboard/Disbursements/DisbursementsTable.tsx

"use client";

import { use } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Wallet, Filter, X } from "lucide-react";

import { httpClient } from "@/lib/axios/httpClient";
import { useRowActionModalState } from "@/hooks/useRowActionModalState";
import { useServerManagedDataTableSearch } from "@/hooks/useServerManagedDataTableSearch";
import { useServerManagedDataTable } from "@/hooks/useServerManagedDataTable";
import { IDisbursement, DISBURSEMENT_STATUS_LABELS } from "@/types/disbursement";
import { PaginationMeta } from "@/types/api.types";
import DataTable from "@/components/shared/table/DataTable";

import { disbursementColumns } from "./disbursementColumns";
import ProcessDisbursementModal from "./ProcessDisbursementModal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface IDisbursementsResponse {
  data: IDisbursement[];
  meta: PaginationMeta;
}

export default function DisbursementsTable({
  searchParamsPromise,
}: {
  searchParamsPromise: Promise<Record<string, string | string[]>>;
}) {
  const resolvedSearchParams = use(searchParamsPromise);
  const initialQueryString = new URLSearchParams(
    resolvedSearchParams as Record<string, string>,
  ).toString();

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const { viewingItem, isViewDialogOpen, onViewOpenChange, tableActions } =
    useRowActionModalState<IDisbursement>();

  const currentStatusFilter = searchParams.get("status") || "all";

  const handleFilterChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value !== "all") params.set("status", value);
    else params.delete("status");
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  const {
    queryStringFromUrl,
    optimisticSortingState,
    optimisticPaginationState,
    updateParams,
    handleSortingChange,
    handlePaginationChange,
  } = useServerManagedDataTable({ searchParams, defaultPage: 1, defaultLimit: 10 });
  const { searchTermFromUrl, handleDebouncedSearchChange } =
    useServerManagedDataTableSearch({ searchParams, updateParams });

  const queryString = queryStringFromUrl || initialQueryString || "limit=10";

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["disbursements", queryString],
    queryFn: async () => {
      const res = await httpClient.get<IDisbursementsResponse>(
        `/disbursements?${queryString}`,
      );
      return res.data;
    },
  });

  return (
    <>
      <div className="mb-6">
        <h1 className="flex items-center gap-3 text-3xl font-black tracking-tight text-foreground">
          <Wallet className="h-8 w-8 text-emerald-500" /> Disbursements
        </h1>
        <p className="mt-1 text-sm font-medium text-muted-foreground">
          Manage and track student payouts.
        </p>
      </div>

      <div className="rounded-[2rem] border border-border/40 bg-card shadow-xl overflow-hidden">
        <div className="border-b border-border/40 bg-muted/10 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/10">
              <Filter className="h-4 w-4 text-emerald-600" />
            </div>
            <span className="text-sm font-bold uppercase tracking-widest text-foreground">
              Filter Records
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Select value={currentStatusFilter} onValueChange={handleFilterChange}>
              <SelectTrigger className="w-45 h-10 rounded-xl font-semibold">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="all" className="font-bold">
                  All Statuses
                </SelectItem>
                {Object.entries(DISBURSEMENT_STATUS_LABELS).map(([k, v]) => (
                  <SelectItem key={k} value={k} className="font-semibold">
                    {v}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {currentStatusFilter !== "all" && (
              <Button
                variant="ghost"
                onClick={() => handleFilterChange("all")}
                className="text-rose-500 font-bold"
              >
                <X className="h-4 w-4 mr-2" /> Clear
              </Button>
            )}
          </div>
        </div>

        <div className="p-4 sm:p-6 pt-2">
          <DataTable
            data={data?.data || []}
            columns={disbursementColumns}
            isLoading={isLoading}
            emptyMessage="No disbursements found."
            sorting={{
              state: optimisticSortingState,
              onSortingChange: handleSortingChange,
            }}
            pagination={{
              state: optimisticPaginationState,
              onPaginationChange: handlePaginationChange,
            }}
            search={{
              initialValue: searchTermFromUrl,
              placeholder: "Search...",
              onDebouncedChange: handleDebouncedSearchChange,
            }}
            meta={data?.meta}
            actions={{
              ...tableActions,
              onEdit: (item) => {
                onViewOpenChange(false);
                // 🚨 FIX 3: Add optional chaining (?.) so it doesn't crash if onView is undefined
                setTimeout(() => tableActions.onView?.(item), 150);
              },
            }}
          />
        </div>
      </div>

      <ProcessDisbursementModal
        open={isViewDialogOpen}
        onOpenChange={onViewOpenChange}
        disbursement={viewingItem}
        onSuccess={refetch}
      />
    </>
  );
}
