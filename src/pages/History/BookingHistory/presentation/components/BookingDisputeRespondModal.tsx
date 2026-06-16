
"use client";

import { CommonModal } from "@/components/common/CommonModal";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import CommonSpinner from "@/components/common/CommonSpinner";
import type { Dispute } from "../../domain/entities/disputes";

type Props = {
  open: boolean;
  setOpen: (v: boolean) => void;
  selected: Dispute | null;
  response: string;
  setResponse: (v: string) => void;
  handleSubmit: () => void;
  isPending: boolean;
  t: (key: string) => string;
};

export default function BookingDisputeRespondModal({
  open,
  setOpen,
  selected,
  response,
  setResponse,
  handleSubmit,
  isPending,
  t,
}: Props) {
  return (
    <CommonModal open={open} onOpenChange={setOpen}>
      <CommonModal.Content>
        <CommonModal.Header>
          <h2 className="text-lg font-semibold">
            {t("disputepage.response")}
          </h2>
        </CommonModal.Header>

        <CommonModal.Body>
          <Label className="text-sm font-semibold text-slate-700">
            {selected?.reasonType}
          </Label>

          <Textarea
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            rows={4}
            className="mt-2"
            placeholder={t("common.inputPlaceholder")}
          />

          <Button
            onClick={handleSubmit}
            disabled={isPending || !response.trim()}
            className="w-full mt-3"
          >
            {isPending ? (
              <CommonSpinner size="sm" />
            ) : (
              t("disputepage.respond")
            )}
          </Button>
        </CommonModal.Body>

        <CommonModal.Footer>
          <Button variant="outline" onClick={() => setOpen(false)}>
            {t("common.cancel")}
          </Button>
        </CommonModal.Footer>
      </CommonModal.Content>
    </CommonModal>
  );
}
