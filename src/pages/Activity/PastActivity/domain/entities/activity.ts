import type { ActivityStatus } from "./activitystatus";
import type { ActivityType } from "./activitytype";

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