import { useQuery } from "@tanstack/react-query";
import { NotificationRepositoryImpl } from "../../data/repositories/NotificationRepoImpl";
import { GetUnreadCountUseCase } from "../../domain/usecase/GetUnreadCountUsecase";

const repo = new NotificationRepositoryImpl();
const useCase = new GetUnreadCountUseCase(repo);

export const useUnreadCount = () => {
  return useQuery({
    queryKey: ["unread-count"],
    queryFn: async () => {
      // console.log("🔥 unread-count API called");
      return useCase.execute();
    },

    
    refetchInterval: 10000,

  
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};