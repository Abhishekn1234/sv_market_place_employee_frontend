import StartWork from "@/pages/Booking/AvaliableWorks/presentation/components/StartWork/StartWork";
import CompleteWork from "@/pages/Booking/AvaliableWorks/presentation/components/CompleteWork/CompleteWork";
import VerifyOtpModal from "@/pages/Booking/AvaliableWorks/presentation/components/VerifyOtpModal/VerifyOtpModal";
import { CommonModal } from "@/components/common/CommonModal";
import { Button } from "@/components/ui/button";
import type { GetBooking } from "@/core/Websocket/domain/entities/getrepo";

export default function WorkModals({
  selectedWork,
  modalType,
  closeModal,
  updateWork,
  upsertBooking,
  cancelConfirmWork,
  setCancelConfirmWork,
  cancelMutation,
  onCompleteSuccess,
}: any) {
  const handleCancelYes = () => {
  if (!cancelConfirmWork?.bookingId) return;

  cancelMutation.mutate(
    {
      bookingId: cancelConfirmWork.bookingId,
      cancelReason: cancelConfirmWork.cancelledReason,
    },
    {
      onSuccess: (data: GetBooking) => {
  upsertBooking({
    ...data,
    status: "WORKER_CANCELLED",
  });
},
      onSettled: () => setCancelConfirmWork(null),
    }
  );
};

  return (
    <>
      {modalType === "start" && selectedWork && (
              <StartWork
                open
                work={selectedWork}
                onClose={closeModal}
                onWorkStarted={(updatedWork) => upsertBooking(updatedWork)} // ✅ FIX
              />
            )}

      {modalType === "complete" && selectedWork && (
       <CompleteWork
  work={selectedWork}
  open={modalType === "complete"}
  onClose={closeModal}
  onSuccess={onCompleteSuccess}   // 🔥 IMPORTANT FIX
/>
      )}

      {modalType === "verify" && selectedWork && (
        <VerifyOtpModal open work={selectedWork} onClose={closeModal} onSuccess={updateWork} />
      )}

      {cancelConfirmWork && (
        <CommonModal open onOpenChange={() => setCancelConfirmWork(null)}>
          <CommonModal.Content>
            <CommonModal.Header>
              <h3 className="text-lg font-semibold">Cancel Work</h3>
            </CommonModal.Header>

            <CommonModal.Body>
              Cancel work for {cancelConfirmWork.customer?.fullName}?

              <div className="mt-4">
                <label htmlFor="reason" className="block text-sm font-medium mb-1">
                  Reason for cancellation
                </label>
               <textarea
  id="reason"
  rows={3}
  value={cancelConfirmWork?.cancelledReason || ""}
  onChange={(e) =>
    setCancelConfirmWork((prev: any) => ({
      ...prev,
      cancelledReason: e.target.value,
    }))
  }
  placeholder="Enter reason for cancellation..."
  className="w-full p-3 text-sm border border-gray-300 rounded-lg shadow-sm resize-none
             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
             transition"
/>
              </div>
            </CommonModal.Body>

            <CommonModal.Footer>
              <Button onClick={() => setCancelConfirmWork(null)}>No</Button>
              <Button
                variant="destructive"
                onClick={handleCancelYes}
                disabled={cancelMutation.isPending}
              >
                {cancelMutation.isPending ? "Cancelling..." : "Yes"}
              </Button>
            </CommonModal.Footer>
          </CommonModal.Content>
        </CommonModal>
      )}
    </>
  );
}