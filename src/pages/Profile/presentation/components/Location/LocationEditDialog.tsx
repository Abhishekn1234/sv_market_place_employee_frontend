"use client";

import { CommonModal } from "@/components/common/CommonModal";
import LocationEditContent from "./LocationSaveContent";

type Props = {
  open: boolean;
  onClose: () => void;
} & Omit<
  React.ComponentProps<typeof LocationEditContent>,
  "onClose"
>;

export default function LocationEditDialog({
  open,
  onClose,
  ...contentProps
}: Props) {
  return (
    <CommonModal open={open} onOpenChange={(v) => !v && onClose()}>
      <CommonModal.Content>
        <CommonModal.Header className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">Edit Location</h2>
        </CommonModal.Header>

        <CommonModal.Body className="px-6 py-4">
          <LocationEditContent
            {...contentProps}
            onClose={onClose}
          />
        </CommonModal.Body>
      </CommonModal.Content>
    </CommonModal>
  );
}
