import type { Register } from "../../entities/register";
import type { RegisterRepo } from "../../repositories/registerrepo";
import { validateEmail, validateFullName, validatePassword, validatePhone } from "../../validations/registervalidation";

export class RegisterUsecase{
    private registerRepo:RegisterRepo
    constructor(registerRepo:RegisterRepo){
        this.registerRepo=registerRepo;
    }
    async execute(registerData:Register){
        validateEmail(registerData.email);
        validateFullName(registerData.fullName);
        validatePassword(registerData.password);
        validatePhone(registerData.phone);
        return this.registerRepo.registerUser(registerData);
    }
}