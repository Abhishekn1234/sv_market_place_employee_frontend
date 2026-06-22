import { useInfiniteQuery } from "@tanstack/react-query";
import { ChatRepositoryImpl } from "../../data/repositories/ChatRepositoryImpl";
import { GetChatMessagesUseCase } from "../../domain/usecase/GetChatMessagesUseCase";

const repo = new ChatRepositoryImpl();
const useCase = new GetChatMessagesUseCase(repo);

export const CHAT_MESSAGES_KEY = "chat-messages";

export function useGetChatMessages(bookingId: string, limit = 30) {
  return useInfiniteQuery({
    queryKey: [CHAT_MESSAGES_KEY, bookingId],
    queryFn: ({ pageParam = 1 }) =>
      useCase.execute({bookingId, page:pageParam, limit}),

    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.totalPages) {
        return lastPage.page + 1;
      }
      return undefined;
    },

    initialPageParam: 1,
    enabled: !!bookingId,
  });
}