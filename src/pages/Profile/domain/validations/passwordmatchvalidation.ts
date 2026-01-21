import { toast } from "react-toastify";

export  const  ValidatematchPassword=(newPassword:string,confirmPassword:string)=>{
     if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match");
            return false;
          }
          return true;
}