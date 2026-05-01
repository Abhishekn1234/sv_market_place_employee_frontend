import type { INotificationRepository } from "../repositories/NotificationRepo";

export class MarkAllNotificationsReadUseCase {
  private repo: INotificationRepository;

  constructor(repo: INotificationRepository) {
    this.repo = repo;
  }

  execute() {
    return this.repo.markAllAsRead();
  }
}