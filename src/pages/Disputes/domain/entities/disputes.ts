export type Dispute = {
  _id: string;
  bookingId: string;
  raisedBy: "CUSTOMER" | "WORKER";
  reason: string;
  description: string;
  status: "OPEN" | "RESOLVED" | "REJECTED";
  createdAt: string;
  updatedAt: string;
};