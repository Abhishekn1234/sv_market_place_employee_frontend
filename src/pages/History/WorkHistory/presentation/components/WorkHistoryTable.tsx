"use client";

import { useState, useEffect } from "react";
import { CommonTable } from "@/components/common/CommonTable";
import type { Work } from "../../domain/entities/workhistory";
import { useWorkColumns } from "../hooks/useColumns";
import StartWork from "../components/StartWork";
import CompleteWork from "./CompleteWork";
import PaymentModal from "../components/PaymentModal";
import InvoiceModal from "../components/InvoiceModal";

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
  // Local state to allow table updates after work completion
  const [localData, setLocalData] = useState<Work[]>(data);

  useEffect(() => {
    // Keep local data in sync if parent data changes
    setLocalData(data);
  }, [data]);

  const [selectedWork, setSelectedWork] = useState<Work | null>(null);
  const [completeWork, setCompleteWork] = useState<Work | null>(null);
  const [paymentWork, setPaymentWork] = useState<Work | null>(null);
  const [invoiceWork, setInvoiceWork] = useState<Work | null>(null);

  // Callback to update table row after work is completed
  const handleWorkCompleted = (updatedWork: Work) => {
    setLocalData((prev) =>
      prev.map((w) => (w._id === updatedWork._id ? { ...w, ...updatedWork } : w))
    );
  };

  const handleCompleteClick = (work: Work) => setCompleteWork(work);
 
  const handleStartClick = (work: Work) => setSelectedWork(work);

  // Memoize columns to ensure they see latest data and rerender on updates
 const columns = useWorkColumns({
  onStartWork: handleStartClick,
  onCompleteWork: handleCompleteClick,

 
});

  return (
    <>
      <CommonTable
        columns={columns}
        data={localData}
        keyExtractor={(row) => row._id}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        isRTL={isRTL}
        emptyMessage="No work history found"
      />

      {/* Start Work Modal */}
      {selectedWork && (
        <StartWork
          work={selectedWork}
          open={!!selectedWork}
          onClose={() => setSelectedWork(null)}
        />
      )}

      {/* Complete Work Modal */}
      {completeWork && (
        <CompleteWork
          work={completeWork}
          open={!!completeWork}
          onClose={() => setCompleteWork(null)}
          onSuccess={handleWorkCompleted} // update table after completion
        />
      )}

      {/* Payment Modal */}
      {paymentWork && (
        <PaymentModal
          work={paymentWork}
          open={!!paymentWork}
          onClose={() => setPaymentWork(null)}
        />
      )}

      {/* Invoice Modal */}
      {invoiceWork && (
        <InvoiceModal
          work={invoiceWork}
          open={!!invoiceWork}
          onClose={() => setInvoiceWork(null)}
        />
      )}
    </>
  );
}