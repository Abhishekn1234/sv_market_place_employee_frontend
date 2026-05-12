export interface verifyotp{
  bookingId: string,
  id?:string;
  workId?:string;
  otp:string;
  purpose?: string;
}