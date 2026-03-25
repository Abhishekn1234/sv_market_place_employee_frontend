"use client";


import type { Work } from "../../../domain/entities/work";
import { Button } from "@/components/ui/button";

type Props = {
  work: Work;
  open: boolean;
  onClose: () => void;
};

export default function PaymentModal({ work, open, onClose }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <h2 className="text-xl font-semibold mb-4">Payment for Work</h2>
        <p className="mb-4">
          Service: <strong>{work.service?.name || "-"}</strong>
        </p>
        <p className="mb-4">
          Customer: <strong>{work.customer?.fullName || "-"}</strong>
        </p>
        <p className="mb-6">
          Duration: <strong>{work.booking?.duration || "-"}</strong>
        </p>

        {/* Example: Payment action */}
        <Button
          className="w-full mb-2"
          onClick={() => {
            console.log("Processing payment for work", work._id);
            onClose();
          }}
        >
          Pay Now
        </Button>

        <Button
          className="w-full"
          variant="outline"
          onClick={onClose}
        >
          Close
        </Button>
      </div>
    </div>
  );
}
