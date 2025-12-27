import type { Register } from "../entities/register";

export interface RegisterRepo{
  registerUser(registerData:Register):Promise<void>;
}