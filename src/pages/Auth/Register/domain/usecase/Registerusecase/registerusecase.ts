import type { Register } from "../../entities/register";
import type { RegisterRepo } from "../../repositories/registerrepo";

export class RegisterUsecase{
    private registerRepo:RegisterRepo
    constructor(registerRepo:RegisterRepo){
        this.registerRepo=registerRepo;
    }
    async execute(registerData:Register){
        return this.registerRepo.registerUser(registerData);
    }
}