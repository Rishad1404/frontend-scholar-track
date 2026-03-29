// src/components/modules/Dashboard/AcademicLevel/AcademicLevelTable.tsx

"use client";

import DataTable from "@/components/shared/table/DataTable";
import { useRowActionModalState } from "@/hooks/useRowActionModalState";
import { useServerManagedDataTableSearch } from "@/hooks/useServerManagedDataTableSearch";
import { useServerManagedDataTable } from "@/hooks/useServerManagedDataTable";
import { getAllAcademicLevels } from "@/services/academicLevel.services";
import { IAcademicLevel } from "@/types/academicLevel";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { GraduationCap } from "lucide-react";
import { academicLevelColumns } from "./academicLevelColumns";
import CreateAcademicLevelModal from "./CreateAcademicLevelModal";
import DeleteAcademicLevelModal from "./DeleteAcademicLevel";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

export default function AcademicLevelTable({
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
  } = useRowActionModalState<IAcademicLevel>({
    enableView: false,
    enableEdit: false,
    enableDelete: true,
  });

  const {
    queryStringFromUrl,
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
    queryKey: ["academic-levels", queryString],
    queryFn: () => getAllAcademicLevels(),
  });

  const allLevels: IAcademicLevel[] = data?.data ?? [];

  // Client-side filter (backend returns flat array, no searchTerm support)
  const filteredLevels = useMemo<IAcademicLevel[]>(() => {
    const term = searchTermFromUrl.toLowerCase().trim();
    if (!term) return allLevels;
    return allLevels.filter((level) =>
      level.name.toLowerCase().includes(term)
    );
  }, [allLevels, searchTermFromUrl]);

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <GraduationCap className="h-7 w-7 text-primary" />
            Academic Levels
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Create and manage the academic levels offered by your university.
          </p>
        </div>
      </div>

      <DataTable
        data={filteredLevels}
        columns={academicLevelColumns}
        isLoading={isLoading || isFetching || isRouteRefreshPending}
        emptyMessage="No academic levels found."
        search={{
          initialValue: searchTermFromUrl,
          placeholder: "Filter by name...",
          debounceMs: 400,
          onDebouncedChange: handleDebouncedSearchChange,
        }}
        toolbarAction={
          <CreateAcademicLevelModal onSuccess={() => refetch()} />
        }
        actions={tableActions}
      />

      <DeleteAcademicLevelModal
        open={isDeleteDialogOpen}
        onOpenChange={onDeleteOpenChange}
        level={deletingItem}
        onSuccess={() => refetch()}
      />
    </>
  );
}