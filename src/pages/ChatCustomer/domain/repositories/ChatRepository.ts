// domain/repositories/ChatRepository.ts

import type {
  GetChatMessagesResponse,
  SendChatMessagePayload,
  ChatMessage,
} from "../entities/chat";

export interface ChatRepository {
  getMessages(
    bookingId: string,
    page?: number,
    limit?: number
  ): Promise<GetChatMessagesResponse>;

  sendMessage(
    bookingId: string,
    payload: SendChatMessagePayload
  ): Promise<ChatMessage>;
}