import type { Profile } from "@/pages/Profile/domain/entities/profile";

export interface ProfileUpdate {
  user: Partial<Profile> & { status?: "online" | "offline" };
  worker?: Worker;
}