import api from "@/api/api";
import type { RegisterRepo } from "../../domain/repositories/registerrepo";
import type { Register } from "../../domain/entities/register";

export class RegisterImpl implements RegisterRepo{
    async registerUser(registerData:Register){
      const response =await api.post('/auth/register',registerData);
      return response.data;
    }
    
}