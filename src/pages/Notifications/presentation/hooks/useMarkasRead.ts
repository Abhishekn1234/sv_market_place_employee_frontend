import { useMutation, useQueryClient } from "@tanstack/react-query";
import { NotificationRepositoryImpl } from "../../data/repositories/NotificationRepoImpl";
import { MarkNotificationReadUseCase } from "../../domain/usecase/GetReasdCountUsecase";
import { toast } from "react-toastify";

const repo = new NotificationRepositoryImpl();
const useCase = new MarkNotificationReadUseCase(repo);

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => useCase.execute(id),

    onSuccess: () => {
      toast.success("Notification marked as read ✅");

      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.setQueryData(["unread-count"], (old: number = 0) =>
    Math.max(0, old - 1)
  );
    },

    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to mark notification as read";

      toast.error(message);
    },
  });
};