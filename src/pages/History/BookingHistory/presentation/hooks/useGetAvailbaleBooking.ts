import { useQuery } from "@tanstack/react-query";
import { BookingHistoryRepoImpl } from "../../data/repositories/AvailableBookingHistoryImpl";
import { GetBookingHistoryUsecase } from "../../domain/usecase/GetAvailableBookingUsecase";
import type { BookingResponse } from "../../domain/entities/booking";

export function useGetBookingAvailable(page: number) {
  const repo = new BookingHistoryRepoImpl();
  const usecase = new GetBookingHistoryUsecase(repo);

  return useQuery<BookingResponse, Error>({
    queryKey: ["booking-history", page],
    queryFn: () => usecase.execute(page),
    placeholderData: (previousData) => previousData, 
  });
}


