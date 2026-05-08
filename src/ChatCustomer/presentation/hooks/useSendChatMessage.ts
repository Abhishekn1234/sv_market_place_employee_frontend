// presentation/hooks/useSendChatMessage.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { ChatRepositoryImpl } from "../../data/repositories/ChatRepositoryImpl";
import { SendChatMessageUseCase } from "../../domain/usecase/SendChatMessageUseCase";

import type {
  ChatMessage,
  GetChatMessagesResponse,
  SendChatMessagePayload,
} from "../../domain/entities/chat";

import { CHAT_MESSAGES_KEY } from "./useChatMessages";

const repo = new ChatRepositoryImpl();
const useCase = new SendChatMessageUseCase(repo);

export function useSendChatMessage(
  bookingId: string
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SendChatMessagePayload) =>
      useCase.execute(bookingId, payload),

    onSuccess: (newMessage: ChatMessage) => {
      queryClient.setQueryData(
        [CHAT_MESSAGES_KEY, bookingId, 1, 30],
        (oldData: GetChatMessagesResponse | undefined) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            messages: [...oldData.data, newMessage],
          };
        }
      );
    },
  });
}