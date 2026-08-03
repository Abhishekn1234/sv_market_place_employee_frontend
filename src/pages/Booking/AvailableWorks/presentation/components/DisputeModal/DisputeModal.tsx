// DisputeModal.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function DisputeModal({
  open,
  work,
  onClose,
  onSubmit,
}: any) {
  const [reason, setReason] = useState("");

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-5 rounded-xl w-96 space-y-3">
        <h2 className="text-lg font-semibold">Create Dispute</h2>

        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="w-full border p-2 rounded"
          placeholder="Write dispute reason..."
        />

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>

          <Button
            onClick={() =>
              onSubmit({
                bookingId: work._id,
                reason,
              })
            }
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
}