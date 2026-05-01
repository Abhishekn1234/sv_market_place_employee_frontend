import { useMutation, useQueryClient } from "@tanstack/react-query";
import { NotificationRepositoryImpl } from "../../data/repositories/NotificationRepoImpl";
import { MarkNotificationReadUseCase } from "../../domain/usecase/GetReasdCountUsecase";

const repo = new NotificationRepositoryImpl();
const useCase = new MarkNotificationReadUseCase(repo);

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => useCase.execute(id),
    onSuccess: () => {
     queryClient.invalidateQueries({ queryKey: ["notifications"] });
     queryClient.invalidateQueries({ queryKey: ["unread-count"] });
    },
  });
};