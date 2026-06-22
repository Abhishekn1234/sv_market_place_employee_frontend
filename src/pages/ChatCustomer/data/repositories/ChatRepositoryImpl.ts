import api from "@/api/api";
import type {
  ChatMessage,
  GetChatMessagesResponse,
  SendChatMessagePayload,
} from "../../domain/entities/chat";

import type { ChatRepository } from "../../domain/repositories/ChatRepository";

export class ChatRepositoryImpl implements ChatRepository {
  async getMessages(
    bookingId: string,
    page = 1,
    limit = 30
  ): Promise<GetChatMessagesResponse> {
    const response = await api.get(
      `/booking/chat/${bookingId}/messages`,
      {
        params: {
          page,
          limit,
        },
      }
    );

    return response.data;
  }

  async sendMessage(
    bookingId: string,
    payload: SendChatMessagePayload
  ): Promise<ChatMessage> {
    const response = await api.post(
      `/booking/chat/${bookingId}/messages`,
      payload
    );

    return response.data;
  }
}