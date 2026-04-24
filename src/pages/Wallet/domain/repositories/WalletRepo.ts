import type { WalletSummary, WalletTransactionsResponse, WalletTransactionsParams } from "../entities/wallet";

export interface WalletRepo {
  getWalletSummary(): Promise<WalletSummary>;
  getWalletTransactions(params?: WalletTransactionsParams): Promise<WalletTransactionsResponse>;
}
