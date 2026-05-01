export type Dispute = {
  _id: string;
  bookingId: string;
  raisedBy: "CUSTOMER" | "WORKER";
  reason: string;
  description: string;
  status: "IN_REVIEW" | "RESOLVED" | "REJECTED" |"OPEN";
  workerResponse?: string;
  createdAt: string;
  updatedAt: string;
};