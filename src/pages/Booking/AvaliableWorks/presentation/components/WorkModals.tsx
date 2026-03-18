import StartWork from "@/pages/Booking/AvaliableWorks/presentation/components/StartWork";
import CompleteWork from "@/pages/Booking/AvaliableWorks/presentation/components/CompleteWork";
import VerifyOtpModal from "@/pages/Booking/AvaliableWorks/presentation/components/VerifyOtpModal";
import { CommonModal } from "@/components/common/CommonModal";
import { Button } from "@/components/ui/button";

export default function WorkModals({
  selectedWork,
  modalType,
  closeModal,
  updateWork,
  cancelConfirmWork,
  setCancelConfirmWork,
  cancelMutation,
}: any) {
  const handleCancelYes = () => {
    cancelMutation.mutate(cancelConfirmWork.bookingId, {
      onSuccess: updateWork,
      onSettled: () => setCancelConfirmWork(null),
    });
  };

  return (
    <>
      {modalType === "start" && selectedWork && (
        <StartWork open work={selectedWork} onClose={closeModal} />
      )}

      {modalType === "complete" && selectedWork && (
        <CompleteWork open work={selectedWork} onClose={closeModal} onSuccess={updateWork} />
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