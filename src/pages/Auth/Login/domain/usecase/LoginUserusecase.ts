import type { Login } from "../entities/login";
import type { LoginRepo } from "../repositories/Loginrepo";

export class LoginUserusecase{
    private loginRepo:LoginRepo
     constructor(loginRepo:LoginRepo){
        this.loginRepo=loginRepo;
     }
     execute(email:string,password:string):Promise<Login>{
        return this.loginRepo.login(email,password);
     }

    
}