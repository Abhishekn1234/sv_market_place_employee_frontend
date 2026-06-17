import {
  useQuery,
  useInfiniteQuery,
} from "@tanstack/react-query";

import { BookingHistoryImpl } from "../../data/repositories/BookingHistoryImpl";
import { GetBookingHistoryUsecase } from "../../domain/usecase/GetBookingHistoryUsecase";

import type {
  BookingHistoryQueryParams,
  BookingHistoryResponse,
} from "../../domain/entities/bookinghistory";

const repo = new BookingHistoryImpl();
const usecase = new GetBookingHistoryUsecase(repo);

/* ================= DESKTOP ================= */

export const useGetBookingHistory = (
  params?: BookingHistoryQueryParams
) => {
  return useQuery<BookingHistoryResponse, Error>({
    queryKey: ["bookinghistory", params],
    queryFn: () => usecase.execute(params),
  });
};

/* ================= MOBILE INFINITE ================= */

export const useGetBookingHistoryInfinite = (
  params?: BookingHistoryQueryParams
) => {
  const pageSize = params?.limit ?? 10;

  return useInfiniteQuery<
    BookingHistoryResponse,
    Error
  >({
    queryKey: ["bookinghistory-infinite", params],

    initialPageParam: 1,

    queryFn: ({ pageParam }) =>
      usecase.execute({
        ...params,
        page: Number(pageParam),
        limit: pageSize,
      }),

    getNextPageParam: (lastPage) => {
      return lastPage.pagination?.hasNextPage
        ? lastPage.pagination.currentPage + 1
        : undefined;
    },
  });
};