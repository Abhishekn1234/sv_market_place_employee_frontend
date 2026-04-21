import { useQuery, useQueryClient } from "@tanstack/react-query";
import { BookingRepositoryImpl } from "../../data/repositories/GetRepoImpl";
import { GetAvailableBookingsUseCase } from "../../domain/usecase/GetWorkUsecase";

export function useAvailableBookings() {
  const queryClient = useQueryClient();

  const repo = new BookingRepositoryImpl();
  const usecase = new GetAvailableBookingsUseCase(repo);

  // ✅ FETCH BOOKINGS
  const { data = [], isLoading, refetch } = useQuery({
    queryKey: ["availableBookings"],
    queryFn: async () => {
      const res = await usecase.execute();
      return res.data;
    },
  });

  // ✅ REMOVE
  const removeBooking = (id: string) => {
    queryClient.setQueryData(["availableBookings"], (old: any = []) =>
      old.filter((b: any) => b._id !== id)
    );
  };

  // ✅ ADD / UPDATE (used by socket)
  const addBooking = (booking: any) => {
    queryClient.setQueryData(["availableBookings"], (old: any = []) => {
      if (!Array.isArray(old)) return [booking];

      const exists = old.find((b: any) => b._id === booking._id);

      if (exists) {
        return old.map((b: any) =>
          b._id === booking._id ? { ...b, ...booking } : b
        );
      }

      return [booking, ...old];
    });
  };

  return {
    bookings: data,
    isLoading,
    refetch,
    removeBooking,
    addBooking,
  };
}