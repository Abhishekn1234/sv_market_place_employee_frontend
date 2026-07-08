import { CommonModal } from "@/components/common/CommonModal";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/context/presentation/components/LanguageContext";
import { useState, useEffect } from "react";
import type { DisplayWork } from "../../types/workPresentation.types";
import { useBookingConfirmCashPayment } from "../../hooks/useBookingConfirmCashPayment";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  work: DisplayWork | null;
}

export default function BookingConfirmCashPayment({
  open,
  onOpenChange,
  work,
}: Props) {
  const [notes, setNotes] = useState("");

  const { t } = useLanguage();

  const confirmCashPaymentMutation = useBookingConfirmCashPayment();

  useEffect(() => {
    if (!open) {
      setNotes("");
    }
  }, [open]);

  const handleConfirm = () => {
    if (!work) return;

    confirmCashPaymentMutation.mutate(
      {
        bookingId: work.booking?._id ?? work.bookingId ?? work._id,
        note:notes,
      },
      {
        onSuccess: () => {
          setNotes("");
          onOpenChange(false);
        },
      }
    );
  };

  return (
    <CommonModal open={open} onOpenChange={onOpenChange}>
      <CommonModal.Content className="max-w-lg">
        <CommonModal.Header>
          <CommonModal.Title>
            {t("availableWork.bookingConfirmCashPayment.title")}
          </CommonModal.Title>

          <CommonModal.Description>
            {t("availableWork.bookingConfirmCashPayment.description")}
          </CommonModal.Description>
        </CommonModal.Header>

        <CommonModal.Body>
          <div className="space-y-2">
            <Label htmlFor="cash-payment-notes">
              {t("availableWork.bookingConfirmCashPayment.notes")}
            </Label>

            <Textarea
              id="cash-payment-notes"
              value={notes}
              rows={5}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t(
                "availableWork.bookingConfirmCashPayment.placeholder"
              )}
            />
          </div>
        </CommonModal.Body>

        <CommonModal.Footer>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={confirmCashPaymentMutation.isPending}
          >
            {t("availableWork.bookingConfirmCashPayment.cancel")}
          </Button>

          <Button
            onClick={handleConfirm}
            disabled={
              !notes.trim() || confirmCashPaymentMutation.isPending
            }
          >
            {confirmCashPaymentMutation.isPending
              ? t("common.loading")
              : t(
                  "availableWork.bookingConfirmCashPayment.confirmCashPayment"
                )}
          </Button>
        </CommonModal.Footer>
      </CommonModal.Content>
    </CommonModal>
  );
}