import api from "@/api/api";
import type { Login } from "../../domain/entities/login";
import type { LoginRepo } from "../../domain/repositories/Loginrepo";

export class LoginImplementation implements LoginRepo {
    async login(email: string, password: string): Promise<Login> {
        const response = await api.post("/auth/login", { email, password });

        const loginData = {
            accessToken: response.data.accessToken,
            refreshToken: response.data.refreshToken,
            user: response.data.user,
        };

        localStorage.setItem("employeeData", JSON.stringify(loginData));

        return response.data;
    }
}
