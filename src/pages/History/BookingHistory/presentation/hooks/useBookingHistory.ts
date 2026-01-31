import { useQuery } from "@tanstack/react-query";
import { BookingHistoryRepoImpl } from "../../data/repositories/BookingHistoryImpl";
import { GetBookingHistoryUsecase } from "../../domain/usecase/GetBookingHistoryUsecase";
import type { BookingResponse } from "../../domain/entities/booking";

export function useBookingHistory(page: number) {
  const repo = new BookingHistoryRepoImpl();
  const usecase = new GetBookingHistoryUsecase(repo);

  return useQuery<BookingResponse, Error>({
    queryKey: ["booking-history", page],
    queryFn: () => usecase.execute(page),
    placeholderData: (previousData) => previousData, 
  });
}


