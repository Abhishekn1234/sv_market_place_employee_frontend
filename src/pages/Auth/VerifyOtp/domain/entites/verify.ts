export interface VerifyOtp{
    email?:string;
    hash?:string;
    otp:string;
    accessToken:string 
}
export interface VerifyOtpPayload {
  hash: string;
  otp: string;
}