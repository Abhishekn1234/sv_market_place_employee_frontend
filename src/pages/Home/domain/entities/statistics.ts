export type WalletStatisticsPeriod =
  | "today"
  | "7_days"
  | "30_days"
  | "3_months"
  | "all";

export interface WalletStatistics {
  workerId: string;
  period: WalletStatisticsPeriod;

  totalEarned: number;
  transactionCount: number;
  currentBalance: number;

  currency: string;

  periodStart: string;
  periodEnd: string;
}