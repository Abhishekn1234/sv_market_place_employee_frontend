// domain/entities/chat.ts

export interface ChatMessage {
  _id: string;
  bookingId: string;
  senderId: string;
  message: string;
  createdAt: string;
  updatedAt?: string;
}
export type Message = {
  id?: string;
  text: string;
  status?: "sent" | "delivered" | "read";
  senderId: string;
  senderName?: string;
  self?: boolean;
  createdAt?: string;
};

export interface GetChatMessagesResponse {
  data: ChatMessage[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface SendChatMessagePayload {
  message: string;
}