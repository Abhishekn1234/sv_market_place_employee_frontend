import type { Profile } from "../entities/profile";
import type { ProfileRepo } from "../repositories/profilerepo";

export class ListProfileUsecase{
    private listProfileRepo:ProfileRepo;
    constructor(listProfileRepo:ProfileRepo){
        this.listProfileRepo=listProfileRepo
    }

    async execute():Promise<Profile>{
     return await this.listProfileRepo.list();
     
    }

}