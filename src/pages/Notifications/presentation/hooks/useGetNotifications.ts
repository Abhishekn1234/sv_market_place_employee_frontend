import { useInfiniteQuery } from "@tanstack/react-query";
import type { NotificationResponse } from "../../domain/entities/notification";
import { NotificationRepositoryImpl } from "../../data/repositories/NotificationRepoImpl";
import { GetNotificationsUseCase } from "../../domain/usecase/GetNotificationUsecase";

const repo = new NotificationRepositoryImpl();
const useCase = new GetNotificationsUseCase(repo);

export const useGetNotifications = (params?: any) => {
  return useInfiniteQuery<NotificationResponse, Error>({
    queryKey: [
      "notifications",
      params?.type,
      params?.unreadOnly,
    ],

    queryFn: ({ pageParam = 1 }) =>
      useCase.execute({
        ...params,
        page: pageParam,
      }),

    getNextPageParam: (lastPage) => {
      return lastPage?.pagination?.hasNextPage
        ? lastPage.pagination.currentPage + 1
        : undefined;
    },

    initialPageParam: 1,

    refetchOnWindowFocus: false,
  });
};