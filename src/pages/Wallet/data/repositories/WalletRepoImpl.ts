import api from "@/api/api";
import type { WalletSummary, WalletTransactionsResponse, WalletTransactionsParams } from "../../domain/entities/wallet";
import type { WalletRepo } from "../../domain/repositories/WalletRepo";

export class WalletRepoImpl implements WalletRepo {
  async getWalletSummary(): Promise<WalletSummary> {
    const response = await api.get("/wallet/me");
    return response.data;
  }

  async getWalletTransactions(params?: WalletTransactionsParams): Promise<WalletTransactionsResponse> {
    const response = await api.get("/wallet/me/transactions", { params });
    return response.data;
  }
}
