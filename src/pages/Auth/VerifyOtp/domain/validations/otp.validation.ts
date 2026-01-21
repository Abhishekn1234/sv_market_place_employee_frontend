import type { VerifyOtpPayload } from "../entites/verify";

export function validateVerifyOTP(request: VerifyOtpPayload): VerifyOtpPayload {
  if (!request.otp) {
    throw new Error("OTP is required");
  }

  const otp = request.otp.trim();

  if (!/^\d{6}$/.test(otp)) {
    throw new Error("OTP must be a valid 6-digit number");
  }

  return {
    ...request,
    otp,
  };
}