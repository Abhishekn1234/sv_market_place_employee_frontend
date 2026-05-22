import { useMutation } from "@tanstack/react-query";
import { NotificationRepositoryImpl } from "../../data/repositories/NotificationRepoImpl";
import { MarkNotificationReadUseCase } from "../../domain/usecase/GetReasdCountUsecase";
import { toast } from "react-toastify";
import { useAuthStore } from "@/core/store/auth";


const repo = new NotificationRepositoryImpl();
const useCase = new MarkNotificationReadUseCase(repo);

export const useMarkAsRead = () => {
  const markAsRead = useAuthStore((s) => s.markAsRead);

  return useMutation({
    mutationFn: (id: string) => useCase.execute(id),

    onSuccess: (_, id) => {
      toast.success("Notification marked as read ✅");

      // ✅ instant UI update
      markAsRead(id);
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