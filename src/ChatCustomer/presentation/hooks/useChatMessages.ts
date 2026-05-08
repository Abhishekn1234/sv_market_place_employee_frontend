// presentation/hooks/useChatMessages.ts

import { useQuery } from "@tanstack/react-query";

import { ChatRepositoryImpl } from "../../data/repositories/ChatRepositoryImpl";
import { GetChatMessagesUseCase } from "../../domain/usecase/GetChatMessagesUseCase";

const repo = new ChatRepositoryImpl();
const useCase = new GetChatMessagesUseCase(repo);

export const CHAT_MESSAGES_KEY = "chat-messages";

export function useChatMessages(
  bookingId: string,
  page = 1,
  limit = 30
) {
  return useQuery({
    queryKey: [CHAT_MESSAGES_KEY, bookingId, page, limit],
    queryFn: () =>
      useCase.execute(bookingId, page, limit),
    enabled: !!bookingId,
  });
}