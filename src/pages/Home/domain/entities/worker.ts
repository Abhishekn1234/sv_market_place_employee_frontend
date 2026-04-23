import type { Profile } from "@/pages/Profile/domain/entities/profile";
import type { Worker } from "@/pages/Profile/domain/entities/workertype";

export interface ProfileUpdate {
  user: Partial<Profile> & { status?: "online" | "offline" };
  worker?: Worker;
}