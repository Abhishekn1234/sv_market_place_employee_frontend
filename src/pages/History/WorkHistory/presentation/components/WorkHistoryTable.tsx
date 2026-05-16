"use client";

import { useState, useEffect } from "react";
import { CommonTable } from "@/components/common/CommonTable";
import type { Work } from "@/pages/Booking/AvaliableWorks/domain/entities/work";
import { useWorkColumns } from "../hooks/useColumns";
import StartWork from "../../../../Booking/AvaliableWorks/presentation/components/StartWork/StartWork";
import CompleteWork from "../../../../Booking/AvaliableWorks/presentation/components/CompleteWork/CompleteWork";
import PaymentModal from "../../../../Booking/AvaliableWorks/presentation/components/PaymentModal/PaymentModal";
import InvoiceModal from "../../../../Booking/AvaliableWorks/presentation/components/InvoiceModal/InvoiceModal";
import VerifyOtpModal from "../../../../Booking/AvaliableWorks/presentation/components/VerifyOtpModal/VerifyOtpModal";
import { useLanguage } from "@/context/LanguageContext";

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
  const [localData, setLocalData] = useState<Work[]>(data);

  useEffect(() => {
    setLocalData(data);
  }, [data]);

  const [selectedWork, setSelectedWork] = useState<Work | null>(null);
  const [completeWork, setCompleteWork] = useState<Work | null>(null);
  const [verifyWork, setVerifyWork] = useState<Work | null>(null);
  const [paymentWork, setPaymentWork] = useState<Work | null>(null);
  const [invoiceWork, setInvoiceWork] = useState<Work | null>(null);

  const handleWorkUpdated = (updatedWork: Work) => {
    setLocalData((prev) =>
      prev.map((w) => (w._id === updatedWork._id ? updatedWork : w))
    );
  };

  const columns = useWorkColumns({
    onStartWork: setSelectedWork,
    onCompleteWork: setCompleteWork,
    onVerifyOtp: setVerifyWork,
    onGenerateInvoice: setInvoiceWork,
  });
  const { translations } = useLanguage();
  const workHistoryT = translations.common.noData;

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
        emptyMessage={workHistoryT}
      />

      {selectedWork && (
        <StartWork work={selectedWork} open onClose={() => setSelectedWork(null)} />
      )}

      {completeWork && (
        <CompleteWork
          work={completeWork}
          open
          onClose={() => setCompleteWork(null)}
          onSuccess={handleWorkUpdated}
        />
      )}

      {verifyWork && (
        <VerifyOtpModal
          work={verifyWork}
          open
          onClose={() => setVerifyWork(null)}
          onSuccess={handleWorkUpdated}
        />
      )}

      {paymentWork && (
        <PaymentModal
          work={paymentWork}
          open
          onClose={() => setPaymentWork(null)}
        />
      )}

      {invoiceWork && (
        <InvoiceModal
          work={invoiceWork}
          open
          onClose={() => setInvoiceWork(null)}
        />
      )}
    </>
  );
}