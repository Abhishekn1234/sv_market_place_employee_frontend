import type { ProfileRepo } from "../../domain/repositories/profilerepo";
import type { UpdatePassword } from "../entities/updatepassword";
import { ValidatePasswordupdate } from "../validations/updatepasswordvalidation";

export class UpdatePasswordUsecase {
  private profileRepo:ProfileRepo;
  constructor(profileRepo:ProfileRepo){
    this.profileRepo=profileRepo
  }

  async execute(
    request:UpdatePassword
  ) {
    
    ValidatePasswordupdate(request);

    return await this.profileRepo.updatePassword(
     request
    );
  }
}
