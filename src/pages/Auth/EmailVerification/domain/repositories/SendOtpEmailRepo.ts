import type {SendOtpEmail } from "../entities/sendotp";

export interface SendOtpEmailRepo{
    sendOtp:(data:SendOtpEmail)=>any;
}