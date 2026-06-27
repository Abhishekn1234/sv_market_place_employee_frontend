


import api from "@/api/api";
import type { WalletTransactionsParams, WalletTransactionsResponse } from "@/pages/Wallet/domain/entities/wallet";
import type { TransactionRepository } from "../../domain/repositories/TransactionRepo";

export class TransactionHistoryRepositoryImpl
  implements TransactionRepository
{
  async getWalletTransactions(
    params?: WalletTransactionsParams
  ): Promise<WalletTransactionsResponse> {
    const response = await api.get(
      "/wallet/me/transactions",
      {
        params,
      }
    );

    return response.data;
  }
}