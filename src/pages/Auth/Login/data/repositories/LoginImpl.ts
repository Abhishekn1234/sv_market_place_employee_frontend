import api from "@/api/api";

import type { LoginResponse } from "../../domain/entities/loginresponse";
import type { LoginRepo } from "../../domain/repositories/Loginrepo";

export class LoginImplementation implements LoginRepo {
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await api.post("/auth/login", { email, password });

    const { accessToken, refreshToken, user, worker } = response.data;

    return {
      accessToken,
      refreshToken,
      user: {
        ...user,
        worker,
      },
    };
  }
}