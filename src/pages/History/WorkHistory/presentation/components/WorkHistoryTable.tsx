"use client";
import { CommonTable, type TableColumn } from "@/components/common/CommonTable";
import { getStatusColor,getStatusIcon } from "../utils/workhistory";
import type { Work } from "../../domain/entities/workhistory";

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
  const columns: TableColumn<Work>[] = [
    { key: "title", header: "Title" },
    { key: "description", header: "Description" },
    { key: "location", header: "Location" },
    {
      key: "assignedDate",
      header: "Assigned",
      render: (w) => new Date(w.assignedDate).toLocaleDateString(),
    },
    {
      key: "status",
      header: "Status",
      render: (w) => (
        <span
          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full border ${getStatusColor(w.status)}`}
        >
          {getStatusIcon(w.status)}
          {w.status}
        </span>
      ),
    },
    {
      key: "duration",
      header: "Duration",
      render: (w) => `${w.duration} hrs`,
    },
  ];

  return (
    <CommonTable
      columns={columns}
      data={data}
      keyExtractor={(row) => row.id}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={onPageChange}
      dir={isRTL ? "rtl" : "ltr"}
      emptyMessage="No work history found"
    />
  );
}
