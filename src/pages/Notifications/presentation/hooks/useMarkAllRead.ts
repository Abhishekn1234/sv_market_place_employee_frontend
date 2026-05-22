import { useMutation } from "@tanstack/react-query";
import { NotificationRepositoryImpl } from "../../data/repositories/NotificationRepoImpl";
import { MarkAllNotificationsReadUseCase } from "../../domain/usecase/MarkAllReadUsecase";
import { toast } from "react-toastify";
import { useAuthStore } from "@/core/store/auth";


const repo = new NotificationRepositoryImpl();
const useCase = new MarkAllNotificationsReadUseCase(repo);

export const useMarkAllRead = () => {
  const markAllAsRead = useAuthStore((s) => s.markAllAsRead);

  return useMutation({
    mutationFn: () => useCase.execute(),

    onSuccess: () => {
      toast.success("All notifications marked as read");

       markAllAsRead();
    },

    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong";

      toast.error(message);
    },
  });
};