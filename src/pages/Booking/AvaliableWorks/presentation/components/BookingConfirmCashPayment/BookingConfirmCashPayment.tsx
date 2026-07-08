import { CommonModal } from "@/components/common/CommonModal";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/context/presentation/components/LanguageContext";
import { useState } from "react";

export default function BookingConfirmCashPayment() {
  const [open, setOpen] = useState(false);
  const [notes, setNotes] = useState("");

  const { t } = useLanguage();

  return (
    <CommonModal open={open} onOpenChange={setOpen}>
      <div className="w-full max-w-lg space-y-6 p-6">
        {/* Header */}
        <div className="space-y-1">
          <h2 className="text-xl font-semibold text-foreground">
            {t("availableWork.bookingConfirmCashPayment.title")}
          </h2>

          <p className="text-sm leading-6 text-muted-foreground">
            {t("availableWork.bookingConfirmCashPayment.description")}
          </p>
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <Label
            htmlFor="cash-payment-notes"
            className="text-sm font-medium"
          >
            {t("availableWork.bookingConfirmCashPayment.notes")}
          </Label>

          <Textarea
            id="cash-payment-notes"
            rows={5}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={t(
              "availableWork.bookingConfirmCashPayment.placeholder"
            )}
            className="min-h-[130px] resize-none rounded-xl border-border bg-background text-sm shadow-sm focus-visible:ring-2"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 border-t pt-5">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="min-w-[110px]"
          >
            {t("availableWork.bookingConfirmPayment.cancel")}
          </Button>

          <Button
            className="min-w-[180px]"
            disabled={!notes.trim()}
          >
            {t("availableWork.bookingConfirmPayment.confirmCashPayment")}
          </Button>
        </div>
      </div>
    </CommonModal>
  );
}