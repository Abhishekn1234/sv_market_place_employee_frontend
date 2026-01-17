export type Notification = {
  id: string;
  title: string;
  description: string;
  date: string;
  read: boolean;
  type: "success" | "error" | "warning" | "info";
  category: "booking" | "payment" | "system" | "alert";
  priority: "low" | "medium" | "high";
};
