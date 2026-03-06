import { useQuery } from "@tanstack/react-query";
import { AvailableBookingImpl} from "../../data/repositories/AvailableBookingImpl";
import { GetBookingAvailableUsecase} from "../../domain/usecase/GetAvailableBookingUsecase";
import type { BookingResponse } from "../../domain/entities/booking";

export function useGetBookingAvailable(page: number) {
  const repo = new AvailableBookingImpl();
  const usecase = new GetBookingAvailableUsecase(repo);

  return useQuery<BookingResponse, Error>({
    queryKey: ["booking-history", page],
    queryFn: () => usecase.execute(page),
    placeholderData: (previousData) => previousData, 
  });
}


