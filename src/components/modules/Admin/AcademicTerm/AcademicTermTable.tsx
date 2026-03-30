"use client";

import DataTable from "@/components/shared/table/DataTable";
import { useRowActionModalState } from "@/hooks/useRowActionModalState";
import { useServerManagedDataTableSearch } from "@/hooks/useServerManagedDataTableSearch";
import { useServerManagedDataTable } from "@/hooks/useServerManagedDataTable";
import { getAllAcademicTerms } from "@/services/academicTerm.services";
import { IAcademicTerm } from "@/types/academicTerm";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { CalendarRange } from "lucide-react";
import CreateAcademicTermModal from "./CreateAcademicTermModal";
import DeleteAcademicTermModal from "./DeleteAcademicTermModal";
import { academicTermColumns } from "./academicTermColumns";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

export default function AcademicTermTable({
  initialQueryString = "",
}: {
  initialQueryString?: string;
}) {
  const searchParams = useSearchParams();

  const {
    deletingItem,
    isDeleteDialogOpen,
    onDeleteOpenChange,
    tableActions,
  } = useRowActionModalState<IAcademicTerm>({
    enableView: false,
    enableEdit: false,
    enableDelete: true,
  });

  const {
    queryStringFromUrl,
    optimisticSortingState, // 🚨 Extracted sorting state
    handleSortingChange,    // 🚨 Extracted sorting handler
    isRouteRefreshPending,
    updateParams,
  } = useServerManagedDataTable({
    searchParams,
    defaultPage: DEFAULT_PAGE,
    defaultLimit: DEFAULT_LIMIT,
  });

  const queryString = queryStringFromUrl || initialQueryString;

  const { searchTermFromUrl, handleDebouncedSearchChange } =
    useServerManagedDataTableSearch({
      searchParams,
      updateParams,
      queryKey: "searchTerm",
    });

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["academic-term", queryString],
    queryFn: () => getAllAcademicTerms(queryString), 
  });

  const allTerms: IAcademicTerm[] = data?.data ?? [];

  // Client-side filter fallback (if backend doesn't support searchTerm yet)
  const filteredTerms = useMemo<IAcademicTerm[]>(() => {
    const term = searchTermFromUrl.toLowerCase().trim();
    if (!term) return allTerms;
    return allTerms.filter((t) => t.name.toLowerCase().includes(term));
  }, [allTerms, searchTermFromUrl]);

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <CalendarRange className="h-7 w-7 text-primary" style={{ color: "#0097b2" }} />
            Academic Terms
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Create and manage the academic terms offered by your university.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-border/50 bg-card p-4 shadow-sm">
        <DataTable
          data={filteredTerms}
          columns={academicTermColumns}
          isLoading={isLoading || isFetching || isRouteRefreshPending}
          emptyMessage="No academic terms found."
          
          // 🚨 Wired up sorting to the DataTable
          sorting={{
            state: optimisticSortingState,
            onSortingChange: handleSortingChange,
          }}

          search={{
            initialValue: searchTermFromUrl,
            placeholder: "Filter by name...",
            debounceMs: 400,
            onDebouncedChange: handleDebouncedSearchChange,
          }}
          toolbarAction={
            <CreateAcademicTermModal onSuccess={() => refetch()} />
          }
          actions={tableActions}
        />
      </div>

      <DeleteAcademicTermModal
        open={isDeleteDialogOpen}
        onOpenChange={onDeleteOpenChange}
        term={deletingItem}
        onSuccess={() => refetch()}
      />
    </>
  );
}