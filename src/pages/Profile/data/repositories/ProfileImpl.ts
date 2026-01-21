import type { ProfileRepo } from "../../domain/repositories/profilerepo";
import type { Profile } from "../../domain/entities/profile";
import type { ProfileUpdate } from "../../domain/entities/profileupdate";
import api from "@/api/api";
import type { UpdatePassword } from "../../domain/entities/updatepassword";

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
    request:UpdatePassword
  ): Promise<Profile> {
    const response = await api.patch("/user/update-password",request);
    return response.data;
  }
}
