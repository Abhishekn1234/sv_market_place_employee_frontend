import type { UseQueryResult } from "@tanstack/react-query";
import type { NotificationResponse } from "../../domain/entities/notification";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { NotificationRepositoryImpl } from "../../data/repositories/NotificationRepoImpl";
import { GetNotificationsUseCase } from "../../domain/usecase/GetNotificationUsecase";

const repo = new NotificationRepositoryImpl();
const useCase = new GetNotificationsUseCase(repo);

export const useGetNotifications = (params?: any): UseQueryResult<NotificationResponse, Error> => {
  return useQuery<NotificationResponse, Error>(
    {
      queryKey: ["notifications", params],
      queryFn: () => useCase.execute(params),
      refetchOnWindowFocus: false,
      placeholderData: keepPreviousData,
    },
  );
};