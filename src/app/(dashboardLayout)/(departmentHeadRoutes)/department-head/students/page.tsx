import DeptHeadStudentsTable from "@/components/modules/DepartmentHead/Students/DeptHeadStudentsTable";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Department Students | Scholar Track",
  description: "Manage academic standings for students in your department",
};

export default function DepartmentStudentsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[]>>;
}) {
  return (
    <div className="p-4 md:p-8">
      <DeptHeadStudentsTable searchParamsPromise={searchParams} />
    </div>
  );
}