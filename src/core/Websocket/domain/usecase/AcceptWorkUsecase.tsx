
import type { AcceptWork } from "../entities/acceptwork";
import type { AcceptRepository } from "../repositories/AcceptRepo";

export class AcceptUsecase{
    private acceptrepo:AcceptRepository;
     constructor(acceptsrepo:AcceptRepository){
        this.acceptrepo=acceptsrepo;
     }
   async execute(data:AcceptWork):Promise<AcceptWork>{
     return await this.acceptrepo.acceptStatus(data);
   }
}