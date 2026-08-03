import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CancelImpl } from "../../data/repositories/CancelImpl";
import { CancelWorkUsecase } from "../../domain/usecase/CancelWorkUsecase";
import type { GetBooking } from "@/core/Websocket/domain/entities/getrepo";
import { toast } from "react-toastify";
import type { CancelWork } from "../../domain/entities/cancelwork";
import { useBookingSocketStore } from "@/core/store/useBookingSocketStore";
import { initializeSocket } from "@/core/Websocket/presentation/components/socket";
import { BookingEvents } from "@/components/common/BookingEvents";
export function useCancel(_addBooking?: (booking: GetBooking) => void) {
  const queryClient = useQueryClient();

  const repo = new CancelImpl();
  const usecase = new CancelWorkUsecase(repo);
  const removeAssigned=useBookingSocketStore((state) => state.removeAssigned);
return useMutation({
  mutationFn: (data: CancelWork) => usecase.execute(data),

  onMutate: async (data) => {
    const bookingId = data.bookingId;

    await queryClient.cancelQueries({
      queryKey: ["assigned-works"],
    });

    const previous = queryClient.getQueryData(["assigned-works"]);

    queryClient.setQueryData(["assigned-works"], (old: any[] = []) =>
      old.filter((b) => (b.booking?._id || b._id) !== bookingId)
    );

    return { previous };
  },

  onError: (_err, _vars, context) => {
    queryClient.setQueryData(
      ["assigned-works"],
      context?.previous
    );
  },

  onSuccess: (cancelledBooking: any) => {
    const bookingId =
      cancelledBooking?.booking?._id ||
      cancelledBooking?._id;

    removeAssigned(bookingId);

    const socket = initializeSocket(
      "/workers/assigned-updates"
    );

    socket.emit(
      BookingEvents.CANCELLED_BY_WORKER,
      bookingId
    );

    toast.success("Booking cancelled successfully");
  },
});
}