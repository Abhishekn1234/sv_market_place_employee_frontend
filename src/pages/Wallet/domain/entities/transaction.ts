export type Transaction = {
  id: string;
  type: "CREDIT" | "DEBIT";
  source?: string;
  amount: number;
  balanceAfter?: number;
  dueToAppBalanceAfter?: number;
  bookingId?: string;
  paymentId?: string;
  note?: string;
  createdAt?: string;
};