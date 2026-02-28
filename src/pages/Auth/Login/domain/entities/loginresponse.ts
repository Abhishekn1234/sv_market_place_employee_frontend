// entities/loginResponse.ts
import type { EmployeeUser } from "@/core/store/auth";

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: EmployeeUser;
}
