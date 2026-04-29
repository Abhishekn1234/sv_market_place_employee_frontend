import { useMutation, useQueryClient } from "@tanstack/react-query";
import { NotificationRepositoryImpl } from "../../data/repositories/NotificationRepoImpl";
import { MarkAllNotificationsReadUseCase } from "../../domain/usecase/MarkAllReadUsecase";

const repo = new NotificationRepositoryImpl();
const useCase = new MarkAllNotificationsReadUseCase(repo);

export const useMarkAllRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => useCase.execute(),
    onSuccess: () => {
     queryClient.invalidateQueries({ queryKey: ["notifications"] });
     queryClient.invalidateQueries({ queryKey: ["unread-count"] });
    },
  });
};