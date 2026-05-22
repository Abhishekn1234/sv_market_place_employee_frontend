import { useQuery } from "@tanstack/react-query";
import { NotificationRepositoryImpl } from "../../data/repositories/NotificationRepoImpl";
import { GetNotificationsUseCase } from "../../domain/usecase/GetNotificationUsecase";

const repo = new NotificationRepositoryImpl();
const useCase = new GetNotificationsUseCase(repo);

export const useGetNotifications = (params?: any) => {
  return useQuery({
    queryKey: ["notifications", params],
    queryFn: () => useCase.execute(params),
    refetchOnWindowFocus: false,
  });
};