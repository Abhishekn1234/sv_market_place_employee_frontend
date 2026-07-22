export interface Transaction {
  id: string;
  date: string;
  amount: number;
  type: string;
  dueToAppBalance?:string;
  netBalance?:string;
  balanceAfter?:string;
  dueToAppBalanceAfter?:string;
  status: 'completed' | 'pending' | 'failed';
  paymentMethod: string;
  description: string;
}
