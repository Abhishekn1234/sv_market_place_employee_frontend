import api from "@/api/api";
import type { SendOtpEmail } from "../../domain/entities/sendotp";
import type { SendOtpEmailRepo } from "../../domain/repositroies/SendOtpEmailRepo";

export class SendOtpEmailImpl implements SendOtpEmailRepo {
  async sendOtp(data: SendOtpEmail): Promise<any> {
    const response = await api.post("/auth/send-otp-email", data);
    return response.data;
  }
}