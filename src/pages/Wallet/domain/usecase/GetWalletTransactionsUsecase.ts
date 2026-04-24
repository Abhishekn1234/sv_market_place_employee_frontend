import type { WalletRepo } from "../repositories/WalletRepo";
import type { WalletTransactionsResponse, WalletTransactionsParams } from "../entities/wallet";

export class GetWalletTransactionsUsecase {
  private walletRepo: WalletRepo;

  constructor(walletRepo: WalletRepo) {
    this.walletRepo = walletRepo;
  }

  async execute(params?: WalletTransactionsParams): Promise<WalletTransactionsResponse> {
    return this.walletRepo.getWalletTransactions(params);
  }
}