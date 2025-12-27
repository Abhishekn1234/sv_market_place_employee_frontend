import type { Profile, ProfileUpdate } from "../entities/profile";

export interface ProfileRepo {
  list(): Promise<Profile>;

  update(data: FormData): Promise<ProfileUpdate>;

  updatePassword(
    oldPassword: string,
    newPassword: string
  ): Promise<Profile>;
}
