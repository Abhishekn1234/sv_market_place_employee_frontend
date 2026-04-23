export interface Invoice {
  invoiceId: string;
  invoiceNumber: string;
  finalAmount: number;
  currency: string;

  // optional future-proof fields
  createdAt?: string;
  updatedAt?: string;
  status?: "PENDING" | "PAID" | "CANCELLED";
}