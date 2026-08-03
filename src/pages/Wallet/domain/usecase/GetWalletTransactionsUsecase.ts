import type { WalletSummary } from "../entities/wallet";

export interface WalletRepo {
  getWalletSummary(): Promise<WalletSummary>;
  
}
