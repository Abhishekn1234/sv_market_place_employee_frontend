import { validateEmail, validatePassword } from "@/pages/Auth/Register/domain/validations/registervalidation";

import type { LoginRepo } from "../repositories/Loginrepo";
import type { LoginResponse } from "../entities/loginresponse";

export class LoginUserusecase{
    private loginRepo:LoginRepo
     constructor(loginRepo:LoginRepo){
        this.loginRepo=loginRepo;
     }
     execute(email:string,password:string):Promise<LoginResponse>{
      validateEmail(email);
      validatePassword(password);
        return this.loginRepo.login(email,password);
     }

    
}