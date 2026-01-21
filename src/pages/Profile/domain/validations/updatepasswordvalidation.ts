import type { UpdatePassword } from "../entities/updatepassword";

export function ValidatePasswordupdate(request:UpdatePassword){
     if (!request.oldPassword || !request.newPassword) {
      throw new Error("Passwords are required");
    }

    if (request.oldPassword=== request.newPassword) {
      throw new Error("New password must be different from current password");
    }

}