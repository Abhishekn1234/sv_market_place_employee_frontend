import type { Startworkrequest } from "../entities/startwork";
import type { CompleteWorkRepo } from "../repositories/CompleteWorkRepo";
export class CompleteWorkUsecase{
   private completeworkrepo:CompleteWorkRepo;
   constructor(completeworkrepo:CompleteWorkRepo){
    this.completeworkrepo=completeworkrepo
   }
   async execute(data:Startworkrequest){
      return this.completeworkrepo.completeworkotp(data);
   }
}