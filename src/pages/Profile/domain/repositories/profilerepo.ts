import type { Profile } from "../entities/profile";
import type { ProfileUpdate } from "../entities/profileupdate";
import type { UpdatePassword } from "../entities/updatepassword";

export interface ProfileRepo {
  list(): Promise<Profile>;

  update(data: FormData): Promise<ProfileUpdate>;

  updatePassword(
   data:UpdatePassword
  ): Promise<Profile>;
}
