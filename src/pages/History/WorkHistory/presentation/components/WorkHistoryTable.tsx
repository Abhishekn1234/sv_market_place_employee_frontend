"use client";

import { useState } from "react";
import { CommonTable } from "@/components/common/CommonTable";
import type { Work } from "../../domain/entities/workhistory";
import { useWorkColumns } from "../hooks/useColumns";
import StartWork from "../components/StartWork";


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
  const [selectedWork, setSelectedWork] = useState<Work | null>(null);

  const columns = useWorkColumns({
    onStartWork: (work) => setSelectedWork(work),
  });


  return (
    <>
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

      {/* Render Start Work Modal */}
      {selectedWork && (
        <StartWork
          work={selectedWork}
          open={!!selectedWork}
          onClose={() => setSelectedWork(null)}
         
        />
      )}
    </>
  );
}
