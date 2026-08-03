import { useQuery } from "@tanstack/react-query";
import { AvailableBookingImpl} from "../../data/repositories/AvailableBookingImpl";
import { GetBookingAvailableUsecase} from "../../domain/usecases/GetAvailableBookingUsecase";
import type { BookingResponse } from "../../domain/entities/booking";
import { usePreferredLanguage } from "@/core/store/auth";

export function useGetBookingAvailable(page: number) {
  const language = usePreferredLanguage();
  const repo = new AvailableBookingImpl();
  const usecase = new GetBookingAvailableUsecase(repo);

  return useQuery<BookingResponse, Error>({
    queryKey: ["booking-history", page, language],
    queryFn: () => usecase.execute(page),
    placeholderData: (previousData) => previousData, 
  });
}


