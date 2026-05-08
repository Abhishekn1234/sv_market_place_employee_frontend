import type { ChatRepository } from "../repositories/ChatRepository";

export class GetChatMessagesUseCase {
  private repo: ChatRepository;

  constructor(repo: ChatRepository) {
    this.repo = repo;
  }

  execute(
    bookingId: string,
    page = 1,
    limit = 30
  ) {
    return this.repo.getMessages(
      bookingId,
      page,
      limit
    );
  }
}