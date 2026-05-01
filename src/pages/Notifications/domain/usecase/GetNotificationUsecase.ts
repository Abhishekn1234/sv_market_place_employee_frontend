import type { GetNotificationsParams } from "../entities/notification";
import type { INotificationRepository } from "../repositories/NotificationRepo";

export class GetNotificationsUseCase {
   private repo: INotificationRepository;

  constructor(repo: INotificationRepository) {
    this.repo = repo;
  }

  execute(params?: GetNotificationsParams) {
    return this.repo.getNotifications(params);
  }
}