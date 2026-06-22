import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

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

export function useSendChatMessage(bookingId: string) {
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

      // toast.success("Message sent");
    },

    onError: (error: any) => {
      toast.error(
        error?.message || "Failed to send message"
      );
    },
  });
}