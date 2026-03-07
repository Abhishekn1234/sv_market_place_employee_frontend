export interface PricingTier {
  tierId: string;
  HOURLY: {
    ratePerHour: number;
    ratePerDay: number;
  };
  PER_DAY: {
    ratePerHour: number;
    ratePerDay: number;
  };
  commissionType: string;
  commissionValue: number;
}