"use client";

import { useTheme } from "@/context/ThemeContext";
import { useAssign } from "../../hooks/useAssign";
import { useCancel } from "../../hooks/useCancel";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AlertCircle, X, Loader2, Package } from "lucide-react";
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
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const { mutate: cancelWork, isPending: isCancelling } = useCancel();

  const { theme } = useTheme();
  const dark = theme === "dark";
  const navigate = useNavigate();

  const works = Array.isArray(assignedWorks)
    ? assignedWorks
    : assignedWorks
    ? [assignedWorks]
    : [];

  /* ---------------- CANCEL ---------------- */
  const handleCancel = (bookingId?: string) => {
    if (!bookingId) return toast.error("Booking ID not found");
    if (!window.confirm("Are you sure you want to cancel this booking?"))
      return;

    setCancellingId(bookingId);
    cancelWork(bookingId, {
      onSuccess: () => onCancelSuccess?.(),
      onSettled: () => setCancellingId(null),
    });
  };

  return (
    <>
      <CommonModal open={open} onOpenChange={(v) => !v && onClose()}>
        <CommonModal.Content
          className={`w-full h-[100dvh] sm:h-auto sm:max-w-3xl max-h-[100dvh] sm:max-h-[90vh] flex flex-col overflow-hidden rounded-none sm:rounded-2xl
          ${dark ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"}`}
        >
          {/* HEADER */}
          <CommonModal.Header
            className={`sticky top-0 z-10 backdrop-blur-sm border-b px-4 sm:px-6 py-4 flex justify-between items-center
            ${
              dark
                ? "bg-gray-900/90 border-gray-700"
                : "bg-white/90 border-gray-200"
            }`}
          >
            <div className="min-w-0">
              <h2 className="text-lg sm:text-2xl font-bold">
                Assigned Works
              </h2>
              <p className="text-xs sm:text-sm text-gray-500">
                Your accepted service bookings
              </p>
            </div>

            <Button
              onClick={onClose}
              className={`p-2 rounded-lg sm:rounded-xl ${
                dark
                  ? "bg-gray-800 text-gray-300"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              <X className="h-5 w-5 sm:h-6 sm:w-6" />
            </Button>
          </CommonModal.Header>

          {/* BODY */}
          <CommonModal.Body className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-4 sm:space-y-6">
            {isLoading && (
              <div className="flex flex-col items-center justify-center h-full">
                <Loader2 className="h-8 w-8 sm:h-10 sm:w-10 animate-spin text-blue-600" />
                <p className="mt-3 text-sm text-gray-500">
                  Loading assigned works...
                </p>
              </div>
            )}

            {isError && (
              <div className="flex flex-col items-center justify-center h-full text-center px-4">
                <AlertCircle className="h-8 w-8 sm:h-10 sm:w-10 text-red-500" />
                <p className="mt-3 font-semibold">
                  Failed to load work
                </p>
                <p className="text-xs sm:text-sm text-red-500 break-words">
                  {error instanceof Error
                    ? error.message
                    : "Unknown error"}
                </p>
              </div>
            )}

            {!isLoading && !isError && works.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full">
                <Package className="h-8 w-8 sm:h-10 sm:w-10 text-gray-400" />
                <p className="mt-3 text-sm font-semibold text-gray-500">
                  No assigned work
                </p>
              </div>
            )}

            {!isLoading &&
              !isError &&
              works.map((work) => (
                <WorkCard
                  key={work._id}
                  work={work}
                  cancellingId={cancellingId}
                  isCancelling={isCancelling}
                  handleCancel={handleCancel}
                  dark={dark}
                  navigate={navigate}
                  onClose={onClose}
                />
              ))}
          </CommonModal.Body>

          {/* FOOTER */}
          <CommonModal.Footer
            className={`sticky bottom-0 border-t px-4 sm:px-6 py-3 flex justify-between
            ${
              dark
                ? "bg-gray-900 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            {/* ✅ Open Work Button */}
            <Button
              onClick={() => {
                onClose();
                navigate("/availableWork");
              }}
              className="px-6 py-2 rounded-lg sm:rounded-xl font-medium bg-blue-600 text-white hover:bg-blue-700"
            >
              Open Work
            </Button>

            {/* Close Button */}
            <Button
              onClick={onClose}
              className="px-6 py-2 rounded-lg sm:rounded-xl font-medium"
            >
              Close
            </Button>
          </CommonModal.Footer>
        </CommonModal.Content>
      </CommonModal>
    </>
  );
}