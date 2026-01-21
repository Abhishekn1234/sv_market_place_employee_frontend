import { toast } from "react-toastify";

 export const validatePassword = (password: string) => {
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return false;
    }
    if (!/[A-Z]/.test(password) || !/[a-z]/.test(password)) {
      toast.error("Password must contain uppercase and lowercase letters");
      return false;
    }
    if (!/\d/.test(password)) {
      toast.error("Password must contain a number");
      return false;
    }
    if (!/[!@#$%^&*]/.test(password)) {
      toast.error("Password must contain a special character");
      return false;
    }
    return true;
  };