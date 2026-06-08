import { useMutation, useQueryClient } from "@tanstack/react-query";
import { NotificationRepositoryImpl } from "../../data/repositories/NotificationRepoImpl";
import { MarkAllNotificationsReadUseCase } from "../../domain/usecase/MarkAllReadUsecase";
import { toast } from "react-toastify";

const repo = new NotificationRepositoryImpl();
const useCase = new MarkAllNotificationsReadUseCase(repo);

export const useMarkAllRead = () => {
  const queryClient = useQueryClient();

  const markAllOptimistically = () => {
    queryClient.setQueriesData(
      { queryKey: ["notifications"] },
      (old: any) => {
        if (!old) return old;

        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            data: page.data.map((n: any) => ({
              ...n,
              isRead: true,
            })),
          })),
        };
      }
    );
  };

  return useMutation({
    mutationFn: () => useCase.execute(),

    onSuccess: () => {
      toast.success("All notifications marked as read");

      markAllOptimistically();
    },
  });
};