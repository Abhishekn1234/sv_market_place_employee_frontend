import type { INotificationRepository } from "../repositories/NotificationRepo";

export class MarkNotificationReadUseCase {
   private repo: INotificationRepository;

  constructor(repo: INotificationRepository) {
    this.repo = repo;
  }

  execute(notificationId: string) {
    return this.repo.markAsRead(notificationId);
  }
}