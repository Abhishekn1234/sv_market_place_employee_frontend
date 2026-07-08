export interface BookingConfirmCashPaymentResponse {
  success: boolean;
  message: string;
  payment: {
    paymentId: string;
    status: string;
    amount: number;
    currency: string;
    paymentMethod: string;
    transactionId: string;
    completedAt: string;
  };
}