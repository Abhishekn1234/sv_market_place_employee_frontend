"use client";

import { useState, useEffect } from "react";
import { useGetDisputes } from "@/pages/History/BookingHistory/presentation/hooks/useGetDispute";
import { useRespondDisputes } from "@/pages/History/BookingHistory/presentation/hooks/useRespondDispute";
import { toast } from "react-toastify";

import type { Dispute } from "../../domain/entities/disputes";

import { CommonTable } from "@/components/common/CommonTable";
import { CommonModal } from "@/components/common/CommonModal";
import { getDisputeColumns } from "../hooks/useDisputeColumns";
import { formatDate } from "@/pages/Activity/RecentActivity/presentation/helpers/formatdate";
import { Button } from "@/components/ui/button";

import { useLanguage } from "@/context/LanguageContext";
import CommonSpinner from "@/components/common/CommonSpinner";
import { useQueryClient } from "@tanstack/react-query";
import DisputesMobileCards from "./DisputesMobileCards";
import BookingDisputeRespondModal from "./BookingDisputeRespondModal";

type Props = {
  bookingId: string | null;
  open: boolean;
  onClose: () => void;
};

export default function DisputeModal({
  open,
  onClose,
}: Props) {
  const { data: disputes = [], isLoading } = useGetDisputes();
  const { t } = useLanguage();
  const respondMutation = useRespondDisputes();

  const [selected, setSelected] = useState<Dispute | null>(null);
  const [response, setResponse] = useState("");
  const [responseOpen, setResponseOpen] = useState(false);
  const queryClient=useQueryClient();
  useEffect(() => {
    if (!open) {
      setSelected(null);
      setResponse("");
      setResponseOpen(false);
    }
  }, [open]);

  const columns = getDisputeColumns({
    onSelect: (d) => {
      setSelected(d);
      setResponseOpen(true);
    },
    formatDate,
    t,
  });

  const handleSubmit = () => {
    if (!selected || !response.trim()) {
      toast.error(t("disputepage.enterResponse"));
      return;
    }

    respondMutation.mutate(
      {
        disputeId: selected._id,
        response,
      },
      {
       onSuccess: () => {
        queryClient.setQueryData(["disputes"], (old: Dispute[] = []) => {
    if (!Array.isArray(old)) return old;

    return old.map((d) =>
      d._id === selected?._id
        ? {
            ...d,
            workerResponse: response, // ✅ instant UI update
            status: "RESOLVED", // optional but recommended
          }
        : d
    );
      });

      setSelected(null);
      setResponse("");
      setResponseOpen(false);
       },
        onError: (err: any) => {
          toast.error(
            err?.response?.data?.message ||
              t("disputepage.responseFailed") ||
              "Failed to submit response"
          );
        },
      }
    );
  };

  return (
    <>
      {/* =========================
          MAIN DISPUTE LIST MODAL
      ========================= */}
      <CommonModal open={open} onOpenChange={onClose}>
        <CommonModal.Content>
          <CommonModal.Header>
            <h2 className="text-lg font-semibold">
              {t("disputepage.title")}
            </h2>
          </CommonModal.Header>

        <CommonModal.Body className="max-h-[70vh] overflow-y-auto">
  {isLoading && <CommonSpinner />}

  {!isLoading && disputes.length === 0 && (
    <p className="text-gray-500 text-sm">
      {t("disputepage.noData")}
    </p>
  )}

  {/* Desktop Table */}
  <div className="hidden md:block">
    {!isLoading && disputes.length > 0 && (
      <CommonTable<Dispute>
        columns={columns}
        data={disputes}
        keyExtractor={(d) => d._id}
      />
    )}
  </div>

  {/* Mobile Cards */}
  {!isLoading && disputes.length > 0 && (
    <DisputesMobileCards
      disputes={disputes}
      isLoading={isLoading}
      t={t}
      setSelected={setSelected}
      setResponseOpen={setResponseOpen}
    />
  )}
</CommonModal.Body>

          <CommonModal.Footer>
            <Button variant="outline" onClick={onClose}>
              {t("common.cancel")}
            </Button>
          </CommonModal.Footer>
        </CommonModal.Content>
      </CommonModal>

      {/* =========================
          RESPONSE MODAL
      ========================= */}
      <BookingDisputeRespondModal
  open={responseOpen}
  setOpen={setResponseOpen}
  selected={selected}
  response={response}
  setResponse={setResponse}
  handleSubmit={handleSubmit}
  isPending={respondMutation.isPending}
  t={t}
   />
    </>
  );
}