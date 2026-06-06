import type { ChatRepository } from "../repositories/ChatRepository";

type GetChatMessagesInput = {
  bookingId: string;
  page: number;
  limit: number;
  pageParam?: number;
};

export class GetChatMessagesUseCase {
 private repo: ChatRepository; 
 constructor(repo: ChatRepository) { this.repo = repo; }

  execute({ bookingId, page, limit }: GetChatMessagesInput) {
    return this.repo.getMessages(bookingId, page, limit);
  }
}