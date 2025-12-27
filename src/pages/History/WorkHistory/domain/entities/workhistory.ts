import type { WorkStatus } from "./workstatus";

export interface Work {
  id: string;
  title: string;
  description: string;
  assignedDate: string;
  dueDate: string;
  status: WorkStatus;
  duration: number; // in hours
  priority: 'low' | 'medium' | 'high';
  location?: string;
}
