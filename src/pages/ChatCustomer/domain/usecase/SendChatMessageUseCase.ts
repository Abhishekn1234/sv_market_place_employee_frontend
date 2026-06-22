

import type { ChatRepository } from "../repositories/ChatRepository";
import type { SendChatMessagePayload } from "../entities/chat";

export class SendChatMessageUseCase {
  private repo: ChatRepository;

  constructor(repo: ChatRepository) {
    this.repo = repo;
  }

  execute(
    bookingId: string,
    payload: SendChatMessagePayload
  ) {
    return this.repo.sendMessage(
      bookingId,
      payload
    );
  }
}