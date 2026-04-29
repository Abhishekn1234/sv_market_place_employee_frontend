import type { RegisterDeviceTokenPayload } from "../entities/notification";
import type { INotificationRepository } from "../repositories/NotificationRepo";

export class RegisterDeviceTokenUseCase {
  private repo: INotificationRepository;

  constructor(repo: INotificationRepository) {
    this.repo = repo;
  }

  execute(payload: RegisterDeviceTokenPayload) {
    return this.repo.registerDeviceToken(payload);
  }
}