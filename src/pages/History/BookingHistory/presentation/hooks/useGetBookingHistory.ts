import { useQuery } from "@tanstack/react-query";
import { BookingHistoryImpl } from "../../data/repositories/BookingHistoryImpl";
import { GetBookingHistoryUsecase } from "../../domain/usecase/GetBookingHistoryUsecase";
import type { BookingHistoryQueryParams, BookingHistoryResponse } from "../../domain/entities/bookinghistory";

export function useGetBookingHistory(params?: BookingHistoryQueryParams) {
  const repo = new BookingHistoryImpl();
  const usecase = new GetBookingHistoryUsecase(repo);

  return useQuery<BookingHistoryResponse, Error>({
    queryKey: ["bookinghistory", params], 
    queryFn: () => usecase.execute(params),
  });
}