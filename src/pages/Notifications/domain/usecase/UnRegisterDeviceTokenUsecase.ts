import type { INotificationRepository } from "../repositories/NotificationRepo";

export class UnregisterDeviceTokenUseCase {
   private repo: INotificationRepository;

  constructor(repo: INotificationRepository) {
    this.repo = repo;
  }

  execute(token: string) {
    return this.repo.unregisterDeviceToken(token);
  }
}