import type { WalletRepo } from "../repositories/WalletRepo";
import type { WalletSummary } from "../entities/wallet";

export class GetWalletUsecase {
  private walletRepo: WalletRepo;

  constructor(walletRepo: WalletRepo) {
    this.walletRepo = walletRepo;
  }

  async execute(): Promise<WalletSummary> {
    return this.walletRepo.getWalletSummary();
  }
}
