export interface Transaction {
  id: string;
  date: string;
  amount: number;
  type: string;
  status: 'completed' | 'pending' | 'failed';
  paymentMethod: string;
  description: string;
}
