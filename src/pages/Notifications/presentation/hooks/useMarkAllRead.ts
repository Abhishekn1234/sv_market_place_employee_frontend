import { useMutation, useQueryClient } from "@tanstack/react-query";
import { NotificationRepositoryImpl } from "../../data/repositories/NotificationRepoImpl";
import { MarkAllNotificationsReadUseCase } from "../../domain/usecase/MarkAllReadUsecase";
import { toast } from "react-toastify";

const repo = new NotificationRepositoryImpl();
const useCase = new MarkAllNotificationsReadUseCase(repo);

export const useMarkAllRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => useCase.execute(),

    onSuccess: () => {
      toast.success("All notifications marked as read");

      queryClient.invalidateQueries({ queryKey: ["notifications"] });
     queryClient.setQueryData(["unread-count"], 0);
    },

    onError: (error: any) => {
      // 🔥 extract backend message safely
      const message =
        error?.response?.data?.message ||   // axios style
        error?.message ||                   // generic JS error
        "Something went wrong";

      toast.error(message);
    },
  });
};