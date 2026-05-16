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
          setSelected(null);
          setResponse("");
        },
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
            <div className="mt-4 border-t pt-3 space-y-2">
              <Label className="text-sm font-medium">
                Respond to: {selected.reason}
              </Label>

              <Textarea
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                className="w-full border rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                rows={3}
                placeholder={t('common.inputPlaceholder')}
              />

              <Button
                onClick={handleSubmit}
                disabled={
                  respondMutation.isPending || !response.trim()
                }
                className=" text-white px-4 py-2 rounded-md text-sm  disabled:opacity-50"
              >
                {respondMutation.isPending
                  ? "Sending..."
                  : "Respond"}
              </Button>
            </div>
          )}
        </CommonModal.Body>

        {/* FOOTER */}
        <CommonModal.Footer>
          <Button
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