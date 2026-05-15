import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CancelImpl } from "../../data/repositories/CancelImpl";
import { CancelWorkUsecase } from "../../domain/usecase/CancelWorkUsecase";
import type { GetBooking } from "@/core/Websocket/domain/entities/getrepo";
import { toast } from "react-toastify";
import type { CancelWork } from "../../domain/entities/cancelwork";
import { useBookingSocketStore } from "@/core/store/useBookingSocketStore";

export function useCancel(_addBooking?: (booking: GetBooking) => void) {
  const queryClient = useQueryClient();

  const repo = new CancelImpl();
  const usecase = new CancelWorkUsecase(repo);
  const removeAssigned=useBookingSocketStore((state) => state.removeAssigned);
  return useMutation({
    mutationFn: (data:CancelWork) => usecase.execute(data),

  onSuccess: (cancelledBooking: any) => {
  const status = cancelledBooking?.status?.toUpperCase();

  const isCancelled =
    status === "WORKER_CANCELLED" ||
    status === "CUSTOMER_CANCELLED";

  if (!isCancelled) return;

  const bookingId =
    cancelledBooking?.booking?._id ||
    cancelledBooking?._id;

  // =========================
  // 1. React Query cache update
  // =========================
  queryClient.setQueryData<GetBooking[]>(
    ["assigned-works"],
    (old) => {
      const safeOld = Array.isArray(old) ? old : [];

      return safeOld.filter((b: any) => {
        const id = b.booking?._id || b._id;

        // remove if same booking OR cancelled status
        const bStatus = b.status?.toUpperCase();

        return !(
          id === bookingId ||
          bStatus === "WORKER_CANCELLED" ||
          bStatus === "CUSTOMER_CANCELLED"
        );
      });
    }
  );

  // =========================
  // 2. Zustand store update
  // =========================
  removeAssigned(bookingId);

  toast.success("Booking cancelled successfully");
},
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to cancel booking";

      toast.error(message);
    },
  });
}