import type { ProfileRepo } from "../../domain/repositories/profilerepo";
import type { Profile, ProfileUpdate } from "../../domain/entities/profile";
import api from "@/api/api";

export class ProfileRepoImplementation implements ProfileRepo {
  
  async list(): Promise<Profile> {
    const response = await api.get("/user/me");
    return response.data;
  }

  // Accept FormData now
  async update(data: FormData): Promise<ProfileUpdate> {
    const response = await api.put("/user/update-profile", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  }

  async updatePassword(
    oldPassword: string,
    newPassword: string
  ): Promise<Profile> {
    const response = await api.patch("/user/update-password", {
      oldPassword,
      newPassword,
    });
    return response.data;
  }
}
