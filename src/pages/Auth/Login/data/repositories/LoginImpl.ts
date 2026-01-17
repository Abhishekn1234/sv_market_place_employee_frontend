import api from "@/api/api";
import type { Login } from "../../domain/entities/login";
import type { LoginRepo } from "../../domain/repositories/Loginrepo";
import { useAuthStore } from "@/core/store/auth";

export class LoginImplementation implements LoginRepo {
   async login(email: string, password: string): Promise<Login> {
  const response = await api.post("/auth/login", { email, password });

  const loginData = {
    accessToken: response.data.accessToken,
    refreshToken: response.data.refreshToken,
    user: {
      ...response.data.user,
      status: "OFFLINE", // initial worker status
    },
  };
  console.log(loginData);

  // ✅ Update Zustand store (this will also persist to localStorage automatically)
  useAuthStore.getState().login(loginData);

  return response.data;
   }
}
