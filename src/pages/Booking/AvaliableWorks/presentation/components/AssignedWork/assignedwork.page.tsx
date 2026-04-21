"use client";

import { useTheme } from "@/context/ThemeContext";
import { useAssign } from "../../hooks/useAssign";
import { useCancel } from "../../hooks/useCancel";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {  X, Loader2,  } from "lucide-react";
import { CommonModal } from "@/components/common/CommonModal";
import { Button } from "@/components/ui/button";
import { WorkCard } from "./assignedworkpagecard";

type Props = {
  open: boolean;
  onClose: () => void;
  onCancelSuccess?: () => void;
};

export default function AssignedWorkModal({
  open,
  onClose,
  onCancelSuccess,
}: Props) {
  const { assignedWorks, isLoading, isError, error } = useAssign(open);
  const { mutate: cancelWork, isPending: isCancelling } = useCancel();

  const { theme } = useTheme();
  const dark = theme === "dark";
  const navigate = useNavigate();

  const [cancelingWorkId, setCancelingWorkId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  const [showCancelModal, setShowCancelModal] = useState(false);

  const works = Array.isArray(assignedWorks)
    ? assignedWorks
    : assignedWorks
    ? [assignedWorks]
    : [];

  /* ---------------- OPEN CANCEL MODAL ---------------- */
  const handleCancel = (bookingId?: string) => {
    if (!bookingId) {
      toast.error("Booking ID not found");
      return;
    }

    setCancelingWorkId(bookingId);
    setCancelReason("");
    setShowCancelModal(true);
  };

  /* ---------------- CONFIRM CANCEL ---------------- */
  const confirmCancel = () => {
    if (!cancelingWorkId) return;

    if (!cancelReason.trim()) {
      toast.error("Please enter cancel reason");
      return;
    }

    cancelWork(
      {
        bookingId: cancelingWorkId,
        cancelReason,
      },
      {
        onSuccess: () => {
          toast.success("Booking cancelled successfully");
          onCancelSuccess?.();
          setShowCancelModal(false);
          setCancelReason("");
          setCancelingWorkId(null);
        },
        onError: (err: any) => {
          toast.error(err?.message || "Failed to cancel booking");
        },
        onSettled: () => {
          setCancelingWorkId(null);
        },
      }
    );
  };

  return (
    <CommonModal open={open} onOpenChange={(v) => !v && onClose()}>
      <CommonModal.Content
        className={`w-full h-[100dvh] sm:h-auto sm:max-w-3xl max-h-[100dvh] sm:max-h-[90vh] flex flex-col overflow-hidden rounded-none sm:rounded-2xl
        ${dark ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"}`}
      >
        {/* HEADER */}
        <CommonModal.Header className="sticky top-0 z-10 border-b px-4 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-lg sm:text-2xl font-bold">
              Assigned Works
            </h2>
            <p className="text-xs sm:text-sm text-gray-500">
              Your accepted service bookings
            </p>
          </div>

          <Button onClick={onClose}>
            <X />
          </Button>
        </CommonModal.Header>

        {/* BODY */}
        <CommonModal.Body className="flex-1 overflow-y-auto px-4 py-4 space-y-4">

          {/* LOADING */}
          {isLoading && (
            <div className="flex flex-col items-center">
              <Loader2 className="animate-spin" />
              Loading...
            </div>
          )}

          {/* ERROR */}
          {isError && (
            <div className="text-red-500 text-center">
              {error instanceof Error ? error.message : "Error"}
            </div>
          )}

          {/* EMPTY */}
          {!isLoading && !isError && works.length === 0 && (
            <div className="text-center text-gray-500">
              No assigned work
            </div>
          )}

          {/* LIST */}
          {works.map((work) => (
            <WorkCard
              key={work._id}
              work={work}
              dark={dark}
              navigate={navigate}
           
              onCancel={handleCancel}
              isCancelling={isCancelling}
              cancelingWorkId={cancelingWorkId}
            />
          ))}
        </CommonModal.Body>

        {/* FOOTER */}
        <CommonModal.Footer className="flex justify-between border-t px-4 py-3">
          <Button
            onClick={() => {
              onClose();
              navigate("/availableWork");
            }}
          >
            Open Work
          </Button>

          <Button onClick={onClose}>Close</Button>
        </CommonModal.Footer>

        {/* CANCEL MODAL */}
        {showCancelModal && (
          <CommonModal open={showCancelModal} onOpenChange={setShowCancelModal}>
            <CommonModal.Content className="p-6 max-w-md">
              <h2 className="text-lg font-bold mb-3">
                Cancel Booking
              </h2>

              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Enter cancel reason..."
                className="w-full border rounded-lg p-3 min-h-[120px]"
              />

              <div className="flex justify-end gap-3 mt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowCancelModal(false)}
                >
                  Close
                </Button>

                <Button
                  onClick={confirmCancel}
                  className="bg-red-600 text-white"
                >
                  Confirm Cancel
                </Button>
              </div>
            </CommonModal.Content>
          </CommonModal>
        )}
      </CommonModal.Content>
    </CommonModal>
  );
}