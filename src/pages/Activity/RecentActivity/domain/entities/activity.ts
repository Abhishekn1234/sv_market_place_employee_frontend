export type ActivityType = "booking" | "transaction" | "payment";
export type ActivityStatus = "completed" | "pending" | "cancelled" | "confirmed";

export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: Date;
  status: ActivityStatus;
  amount?: number;
  client?: string;
  location?: string;
}
