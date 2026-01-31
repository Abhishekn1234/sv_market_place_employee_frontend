import { useState } from "react";
import { getStatusColor, getStatusIcon } from "@/pages/History/WorkHistory/presentation/utils/workhistory";
import { formatDateTime } from "./helpers/formatdatetime";
import {
  X,
  Loader2,
  AlertCircle,
  Calendar,
  User,
  Phone,
  DollarSign,
  Package,
  Wrench,
  BadgeCheck,
  Mail,
} from "lucide-react";
import { useAssign } from "./hooks/useAssign";
import { CommonModal } from "@/components/common/CommonModal";
import { useCancel } from "./hooks/useCancel";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/context/ThemeContext";

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

  const works = Array.isArray(assignedWorks)
    ? assignedWorks
    : assignedWorks
    ? [assignedWorks]
    : [];

  const handleCancel = (bookingId?: string) => {
    if (!bookingId) {
      toast.error("Booking ID not found");
      return;
    }

    if (!window.confirm("Are you sure you want to cancel this booking?")) return;

    setCancellingId(bookingId);

    cancelWork(bookingId, {
      onSuccess: () => onCancelSuccess?.(),
      onSettled: () => setCancellingId(null),
    });
  };

  return (
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
            <h2 className="text-2xl font-bold">
              Assigned Works
            </h2>
            <p className="text-sm text-gray-500">
              Your accepted service bookings
            </p>
          </div>

          <Button
            onClick={onClose}
            className={`p-2 rounded-xl
            ${dark ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-500"}`}
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
              <p className="text-sm text-red-500">
                {error instanceof Error ? error.message : "Unknown error"}
              </p>
            </div>
          )}

          {!isLoading && !isError && works.length === 0 && (
            <div className="flex flex-col items-center py-20">
              <Package className="h-10 w-10 text-gray-400" />
              <p className="mt-3 font-semibold text-gray-500">
                No assigned work
              </p>
            </div>
          )}

          {!isLoading &&
            !isError &&
            works.map((work) => {
              const bookingId = work.booking?._id;

              return (
                <div
                  key={work._id}
                  className={`border rounded-2xl p-6 space-y-5 shadow-sm
                  ${
                    dark
                      ? "bg-gray-900 border-gray-700"
                      : "bg-white border-gray-200"
                  }`}
                >
                 
                  <div className="flex justify-between items-center">
                    <div>
                      <p className={`text-sm ${ theme==="dark"?"text-gray-100":"text-gray-800"}`}>Assignment ID</p>
                      <p className="font-mono">{work._id}</p>
                    </div>

                    <div
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border ${getStatusColor(
                        work.status
                      )}`}
                    >
                      {getStatusIcon(work.status)}
                      {work.status}
                    </div>
                  </div>

                
                  <div
                    className={`border rounded-xl p-4
                    ${dark ? "bg-gray-900 border-gray-600" : "bg-blue-50"}`}
                  >
                    <p className="font-semibold mb-2 flex gap-2">
                      <Wrench className="h-4 w-4" /> Service Details
                    </p>
                    <p className="flex gap-2">
                      <Wrench className="h-4 w-4" /> {work.service?.name}
                    </p>
                    <p className="flex gap-2">
                      <BadgeCheck className="h-4 w-4" />{" "}
                      {work.serviceTier?.displayName}
                    </p>
                  </div>

               
                  <div>
                    <label className={`text-sm ${theme==="dark"?"text-gray-100":"text-gray-600"} flex gap-2`}>
                      <Calendar className="h-4 w-4" /> Assigned At
                    </label>
                    <div
                      className={`mt-1 p-3 rounded-xl border
                      ${dark ? "bg-gray-900 border-gray-600" : "bg-gray-50"}`}
                    >
                      {formatDateTime(work.assignedAt)}
                    </div>
                  </div>

                  
                  <div
                    className={`border rounded-xl p-4
                    ${dark ? "bg-gray-900 border-gray-600" : "bg-purple-50"}`}
                  >
                    <p className="font-semibold mb-2 flex gap-2">
                      <User className="h-4 w-4" /> Customer
                    </p>
                    <p className="flex gap-2">
                      <Mail className="h-4 w-4" /> {work.customer?.fullName}
                    </p>
                    <p className="flex gap-2">
                      <Phone className="h-4 w-4" /> {work.customer?.phone}
                    </p>
                  </div>

                 
                  <div
                    className={`border rounded-xl p-4
                    ${dark ? "bg-gray-900 border-gray-600" : "bg-green-50"}`}
                  >
                    <p className="font-semibold mb-1 flex gap-2">
                      <DollarSign className="h-4 w-4" /> Payment
                    </p>
                    <p className="text-xl font-bold text-green-600">
                      SAR {work.booking?.amount}
                    </p>
                  </div>

                
                  {work.status?.toLowerCase() !== "completed" && (
                    <div className="flex justify-end">
                      <Button
                        onClick={() => handleCancel(bookingId)}
                        disabled={isCancelling && cancellingId === bookingId}
                        className={`${theme==="dark"?"px-5 py-2 bg-red-200 rounded-xl font-medium disabled:opacity-60 flex items-center gap-2":"px-5 py-2 bg-red-900 rounded-xl font-medium disabled:opacity-60 flex items-center gap-2"}`}
                      >
                        {isCancelling && cancellingId === bookingId && (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        )}
                        Cancel Booking
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
        </CommonModal.Body>

      
        <CommonModal.Footer
          className={`sticky bottom-0 border-t px-6 py-4 flex justify-end
          ${dark ? "bg-gray-900 border-gray-600" : "bg-white border-gray-200"}`}
        >
          <Button
            onClick={onClose}
            className={`px-6 py-2 rounded-xl font-medium cursor-pointer
            ${dark ? "bg-gray-600 text-gray-200" : "bg-gray-600"}`}
          >
            Close
          </Button>
        </CommonModal.Footer>
      </CommonModal.Content>
    </CommonModal>
  );
}
