"use client";

import { CommonTable } from "@/components/common/CommonTable";
import type { Work } from "../../domain/entities/workhistory";
import { useWorkColumns } from "../hooks/useColumns";

export function WorkHistoryTable({
  data,
  currentPage,
  totalPages,
  onPageChange,
  isRTL,
}: {
  data: Work[];
  currentPage: number;
  totalPages: number;
  onPageChange: (p: number) => void;
  isRTL: boolean;
}) {
  const columns = useWorkColumns();

  return (
    <CommonTable
      columns={columns}
      data={data}
      keyExtractor={(row) => row.id}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={onPageChange}
      isRTL={isRTL}
      emptyMessage="No work history found"
    />
  );
}

