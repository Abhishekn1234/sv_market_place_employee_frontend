"use client";

import { useState, useEffect } from "react";
import { useGetDisputes } from "@/pages/History/BookingHistory/presentation/hooks/useGetDispute";
import { useRespondDisputes } from "@/pages/History/BookingHistory/presentation/hooks/useRespondDispute";

import type { Dispute } from "../../domain/entities/disputes";

import { CommonTable } from "@/components/common/CommonTable";
import { CommonModal } from "@/components/common/CommonModal";
import { getDisputeColumns } from "../hooks/useDisputeColumns";
import { formatDate } from "@/pages/Activity/RecentActivity/presentation/helpers/formatdate";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/context/LanguageContext";
import CommonSpinner from "@/components/common/CommonSpinner";
// import { toast } from "react-toastify";

type Props = {
  bookingId: string | null;
  open: boolean;
  onClose: () => void;
};

export default function DisputeModal({
//   bookingId,
  open,
  onClose,
}: Props) {
  // ✅ Fetch disputes (recommended: pass bookingId to API)
  const { data: disputes = [], isLoading } = useGetDisputes();
  const {t}=useLanguage();
  const respondMutation = useRespondDisputes();

  const [selected, setSelected] = useState<Dispute | null>(null);
  const [response, setResponse] = useState("");

  // ✅ Reset state when modal closes
  useEffect(() => {
    if (!open) {
      setSelected(null);
      setResponse("");
    }
  }, [open]);

  // ✅ Columns
  const columns = getDisputeColumns({
    onSelect: setSelected,
    formatDate,
    t:t
  });

  // ✅ Submit response
  const handleSubmit = () => {
    if (!selected || !response.trim()) return;

    respondMutation.mutate(
      {
        disputeId: selected._id,
        response,
      },
      {
        onSuccess: () => {
          // toast.success("Response submitted successfully");
          setSelected(null);
          setResponse("");
        },
        // onError: (err: any) => {
        //     toast.error(err?.response?.data?.message || "Failed to submit response");
        // },
      }
    );
  };

  return (
    <CommonModal open={open} onOpenChange={onClose}>
      <CommonModal.Content>
        
        {/* HEADER */}
        <CommonModal.Header>
          <h2 className="text-lg font-semibold"> {t('disputepage.title')}</h2>
        </CommonModal.Header>

        {/* BODY */}
        <CommonModal.Body>
          {isLoading && <CommonSpinner/>}

          {!isLoading && disputes.length === 0 && (
            <p className="text-gray-500 text-sm">
             {t('disputepage.noData')}
            </p>
          )}

          {!isLoading && disputes.length > 0 && (
            <CommonTable<Dispute>
             
              columns={columns}
              data={disputes}
              keyExtractor={(d) => d._id}
            />
          )}

          {/* RESPONSE SECTION */}
          {selected && (
            <div className="mt-6 border-t pt-5 space-y-4">
              <Label className="text-sm font-semibold text-slate-700">
                {t('disputepage.response')}: {selected.reason}
              </Label>

              <Textarea
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                className="w-full border-slate-200 shadow-sm rounded-lg p-3 text-sm focus:ring-blue-500/20"
                rows={4}
                placeholder={t('common.inputPlaceholder')}
              />

              <Button
                onClick={handleSubmit}
                disabled={
                  respondMutation.isPending || !response.trim() || !selected
                }
                variant="default"
                className="w-full sm:w-auto"
              >
                {respondMutation.isPending
                  ?<CommonSpinner size="sm" />
                  : t("disputepage.respond")}
              </Button>
            </div>
          )}
        </CommonModal.Body>

        {/* FOOTER */}
        <CommonModal.Footer>
          <Button
            variant="outline"
            size="default"
            onClick={onClose}
            className="text-sm "
          >
            {t('common.cancel')}
          </Button>
        </CommonModal.Footer>

      </CommonModal.Content>
    </CommonModal>
  );
}