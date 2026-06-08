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

    onSuccess: (_, id) => {
      toast.success("Notification marked as read ✅");

      queryClient.setQueriesData(
        { queryKey: ["notifications"] },
        (old: any) => {
          if (!old) return old;

          return {
            ...old,
            pages: old.pages.map((page: any) => ({
              ...page,
              data: page.data.map((n: any) =>
                n._id === id ? { ...n, isRead: true } : n
              ),
            })),
          };
        }
      );
    },
  });
};