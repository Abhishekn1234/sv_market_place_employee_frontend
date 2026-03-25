import { useTheme } from "@/context/ThemeContext";
import { useAssign } from "../../hooks/useAssign";
import { useCancel } from "../../hooks/useCancel";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import type { Work } from "../../../domain/entities/work";
import { AlertCircle,X,Loader2,Package } from "lucide-react";
import { CommonModal } from "@/components/common/CommonModal";
import { Button } from "@/components/ui/button";
import { WorkCard } from "./assignedworkpagecard";
import StartWork from "../StartWork/StartWork";

type Props = {
  open: boolean;
  onClose: () => void;
  onCancelSuccess?: () => void;
};

export default function AssignedWorkModal({ open, onClose, onCancelSuccess }: Props) {
  const { assignedWorks, isLoading, isError, error } = useAssign(open);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const { mutate: cancelWork, isPending: isCancelling } = useCancel();
  
  const { theme } = useTheme();
  const dark = theme === "dark";
  const navigate = useNavigate();

  const [startWorkModalOpen, setStartWorkModalOpen] = useState(false);
  const [selectedWork, setSelectedWork] = useState<Work | null>(null);

  const works = Array.isArray(assignedWorks) ? assignedWorks : assignedWorks ? [assignedWorks] : [];

  const handleCancel = (bookingId?: string) => {
    if (!bookingId) return toast.error("Booking ID not found");
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;

    setCancellingId(bookingId);
    cancelWork(bookingId, {
      onSuccess: () => onCancelSuccess?.(),
      onSettled: () => setCancellingId(null),
    });
  };

  const handleStartWork = (work: Work) => {
    setSelectedWork(work);
    setStartWorkModalOpen(true);
  };

  return (
    <>
      <CommonModal open={open} onOpenChange={(v) => !v && onClose()}>
        <CommonModal.Content
          className={`max-w-3xl max-h-[90vh] flex flex-col overflow-hidden rounded-2xl
          ${dark ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"}`}
        >
          <CommonModal.Header
            className={`sticky top-0 backdrop-blur-sm border-b px-6 py-4 flex justify-between items-center
            ${dark ? "bg-gray-900/90 border-gray-700" : "bg-white/90 border-gray-200"}`}
          >
            <div>
              <h2 className="text-2xl font-bold">Assigned Works</h2>
              <p className="text-sm text-gray-500">Your accepted service bookings</p>
            </div>

            <Button
              onClick={onClose}
              className={`p-2 rounded-xl ${dark ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-500"}`}
            >
              <X className="h-6 w-6" />
            </Button>
          </CommonModal.Header>

          <CommonModal.Body className="p-6 space-y-6 overflow-y-auto">
            {isLoading && (
              <div className="flex flex-col items-center py-20">
                <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
                <p className="mt-3 text-gray-500">Loading assigned works...</p>
              </div>
            )}

            {isError && (
              <div className="flex flex-col items-center py-20 text-center">
                <AlertCircle className="h-10 w-10 text-red-500" />
                <p className="mt-3 font-semibold">Failed to load work</p>
                <p className="text-sm text-red-500">{error instanceof Error ? error.message : "Unknown error"}</p>
              </div>
            )}

            {!isLoading && !isError && works.length === 0 && (
              <div className="flex flex-col items-center py-20">
                <Package className="h-10 w-10 text-gray-400" />
                <p className="mt-3 font-semibold text-gray-500">No assigned work</p>
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
                  handleStartWork={handleStartWork}
                  dark={dark}
                  navigate={navigate}
                  onClose={onClose}
                />
              ))}
          </CommonModal.Body>

          <CommonModal.Footer
            className={`sticky bottom-0 border-t px-6 py-4 flex justify-end ${
              dark ? "bg-gray-900 border-gray-600" : "bg-white border-gray-200"
            }`}
          >
            <Button
              onClick={onClose}
              className={`px-6 py-2 rounded-xl font-medium cursor-pointer ${
                dark ? "bg-gray-600 text-gray-200" : "bg-gray-600"
              }`}
            >
              Close
            </Button>
          </CommonModal.Footer>
        </CommonModal.Content>
      </CommonModal>

      {/* Start Work Modal */}
      {selectedWork && (
        <StartWork
          open={startWorkModalOpen}
          work={selectedWork}
          onClose={() => setStartWorkModalOpen(false)}
        />
      )}
    </>
  );
}