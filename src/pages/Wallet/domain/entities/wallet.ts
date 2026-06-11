export interface WalletSummary {
  workerId: string;
  balance: number;
  currency: string;
  updatedAt: string;
}

export type  WalletTransactionType=
   "CREDIT"|
  "DEBIT"


export type WalletTransactionSource =
  "BOOKING_PAYMENT"|
  "ADMIN_ADJUSTMENT"

export interface WalletTransaction {
  id: string;
  _id?: number;
  type: WalletTransactionType;   
  source: WalletTransactionSource; 
  amount: number;
  bookingId?: string;
  paymentId?: string;
  note?: string;
  createdAt: string;
}

export interface WalletTransactionsResponse {
  data: WalletTransaction[];
  pagination: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface WalletTransactionsParams {
  page?: number;
  limit?: number;
  sort?: string;
  search?: string;
  status?: "completed" | "pending" | "failed" | "all";
}
