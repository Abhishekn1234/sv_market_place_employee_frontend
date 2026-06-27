import type { WalletTransactionsParams, WalletTransactionsResponse } from "@/pages/Wallet/domain/entities/wallet";

export interface TransactionRepository {
  getWalletTransactions(
    params?: WalletTransactionsParams
  ): Promise<WalletTransactionsResponse>;
}