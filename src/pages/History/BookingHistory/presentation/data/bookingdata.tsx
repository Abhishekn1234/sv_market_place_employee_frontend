import { CommonModal } from "@/components/common/CommonModal";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { Dispute } from "../../domain/entities/disputes";

interface RespondModalProps {
  selected: Dispute | null;
  response: string;
  setResponse: (value: string) => void;
  setSelected: (value: Dispute | null) => void;
  handleSubmit: () => void;
  isPending: boolean;
  t: (key: string) => string;
}

export default function RespondModal({
  selected,
  response,
  setResponse,
  setSelected,
  handleSubmit,
  isPending,
  t,
}: RespondModalProps) {
  return (
    <CommonModal
      open={!!selected}
      onOpenChange={(open) => {
        if (!open) {
          setSelected(null);
          setResponse("");
        }
      }}
    >
      <CommonModal.Content>
        <CommonModal.Header>
          <h2 className="text-lg font-semibold">
            {t("disputepage.respondTitle")}
          </h2>
        </CommonModal.Header>

        <CommonModal.Body>
          <Textarea
            className="w-full border rounded p-2 text-sm"
            rows={4}
            placeholder={t("disputepage.responsePlaceholder")}
            value={response}
            onChange={(e) => setResponse(e.target.value)}
          />
        </CommonModal.Body>

        <CommonModal.Footer>
          <Button
            variant="outline"
            onClick={() => {
              setSelected(null);
              setResponse("");
            }}
          >
            {t("common.cancel")}
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={isPending}
          >
            {isPending
              ? t("common.submitting")
              : t("common.submit")}
          </Button>
        </CommonModal.Footer>
      </CommonModal.Content>
    </CommonModal>
  );
}