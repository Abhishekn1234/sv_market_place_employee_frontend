export interface WalletSummary {
  workerId?: string;
  balance: number;
  currency: string;
  updatedAt: string;
  dueToAppBalance?:number;
}

export type WalletTransactionType =
  | "CREDIT"
  | "DEBIT";

export type WalletTransactionSource =
  | "BOOKING_PAYMENT"
  | "CASH_COLLECTION_DUE"
  | "ADMIN_ADJUSTMENT";

export interface WalletTransaction {
  id: string;
  type: WalletTransactionType;
  source: WalletTransactionSource;

  amount: number;

  balanceAfter?: number;
  dueToAppBalanceAfter?: number;

  bookingId?: string;
  paymentId?: string;

  note?: string;
  createdAt?: string;
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
}