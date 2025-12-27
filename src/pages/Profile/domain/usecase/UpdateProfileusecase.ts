import type {  ProfileUpdate } from "../entities/profile";
import type { ProfileRepo } from "../repositories/profilerepo";
export class UpdateProfileUsecase{
 private updateprofileRepo:ProfileRepo;
    constructor (updateprofile:ProfileRepo){
        this.updateprofileRepo=updateprofile
    }
    async execute(data:FormData):Promise<ProfileUpdate>{
        return this.updateprofileRepo.update(data)
    }
}