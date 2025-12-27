import type { ProfileRepo } from "../../domain/repositories/profilerepo";

export class UpdatePasswordUsecase {
  private profileRepo:ProfileRepo;
  constructor(profileRepo:ProfileRepo){
    this.profileRepo=profileRepo
  }

  async execute(
    oldPassword: string,
    newPassword: string
  ) {
    if (!oldPassword || !newPassword) {
      throw new Error("Passwords are required");
    }

    if (oldPassword=== newPassword) {
      throw new Error("New password must be different from current password");
    }

    return await this.profileRepo.updatePassword(
      oldPassword,
      newPassword
    );
  }
}
