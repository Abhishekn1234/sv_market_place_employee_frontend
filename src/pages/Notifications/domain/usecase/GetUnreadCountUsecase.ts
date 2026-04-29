import type { INotificationRepository } from "../repositories/NotificationRepo";

export class GetUnreadCountUseCase {
  private repo: INotificationRepository;

  constructor(repo: INotificationRepository) {
    this.repo = repo;
  }

  execute() {
    return this.repo.getUnreadCount();
  }
}