
import { 
  CreditCard, 
  Hash, 
  Tag, 
  Users, 
  DollarSign, 
  Receipt, 
  Percent 
} from "lucide-react";
import { DetailRow } from "./DetailRows";

type PaymentDetailsProps = {
  bookingData: any;
  status: string;
  currency: string;
  amount: number;
  serviceFee: number;
  discountAmount: number;
  vatRate: number;
  totalCost: number;
  finalAmount: number;
  finalWorkerPoolAmount: number;
  estimatedTaxableAmount: number;
  actualTaxableAmount: number;
  estimatedVatAmount: number;
  actualVatAmount: number;
  title: string;
  labels: {
    bookingStatus: string;
    pricingMode: string;
    numberOfWorkers: string;
    amount: string;
    serviceFee: string;
    discount: string;
    taxableAmount: string;
    vatRate: string;
    vatAmount: string;
    estimatedTotal: string;
    finalAmount: string;
    workerPoolAmount: string;
  };
};

export function BookingExpandedColumnsPaymentDetails({ 
  bookingData,
  status,
  currency,
  amount,
  serviceFee,
  discountAmount,
  vatRate,
  totalCost,
  finalAmount,
  finalWorkerPoolAmount,
  estimatedTaxableAmount,
  actualTaxableAmount,
  estimatedVatAmount,
  actualVatAmount,
  title,
  labels
}: PaymentDetailsProps) {
  const getStatusColor = (status: string) => {
    const statusMap: Record<string, string> = {
      'COMPLETED': 'bg-green-100 text-green-700',
      'IN_PROGRESS': 'bg-yellow-100 text-yellow-700',
      'WORKER_CANCELLED': 'bg-red-100 text-red-700',
      'CUSTOMER_CANCELLED': 'bg-red-100 text-red-700',
    };
    return statusMap[status] || 'bg-blue-100 text-blue-700';
  };

  return (
    <div className="lg:col-span-2 xl:col-span-3 space-y-4 min-w-0 bg-white/50 p-4 rounded-lg border border-slate-100">
      <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
        <CreditCard className="h-4 w-4" />
        {title}
      </h4>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="space-y-1">
          <DetailRow
            label={labels.bookingStatus}
            value={
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                {status}
              </span>
            }
            icon={<Hash className="h-4 w-4 text-slate-400" />}
          />
          <DetailRow
            label={labels.pricingMode}
            value={bookingData?.pricingMode ?? "—"}
            icon={<Tag className="h-4 w-4 text-slate-400" />}
          />
          <DetailRow
            label={labels.numberOfWorkers}
            value={bookingData?.numberOfWorkers ?? "—"}
            icon={<Users className="h-4 w-4 text-slate-400" />}
          />
        </div>

        <div className="space-y-1">
          <DetailRow
            label={labels.amount}
            value={
              <span className="font-semibold text-slate-900">
                {currency} {amount}
              </span>
            }
            icon={<DollarSign className="h-4 w-4 text-slate-400" />}
          />
          <DetailRow
            label={labels.serviceFee}
            value={`${currency} ${serviceFee}`}
            icon={<Receipt className="h-4 w-4 text-slate-400" />}
          />
          <DetailRow
            label={labels.discount}
            value={`${currency} ${discountAmount}`}
            icon={<Percent className="h-4 w-4 text-slate-400" />}
          />
        </div>

        <div className="space-y-1">
          <DetailRow
            label={labels.taxableAmount}
            value={
              <div className="space-y-0.5">
                <div className="text-xs text-slate-500">Est: {currency} {estimatedTaxableAmount}</div>
                <div className="text-xs text-slate-500">Actual: {currency} {actualTaxableAmount}</div>
              </div>
            }
            icon={<Receipt className="h-4 w-4 text-slate-400" />}
          />
          <DetailRow
            label={labels.vatRate}
            value={`${vatRate}%`}
            icon={<Percent className="h-4 w-4 text-slate-400" />}
          />
          <DetailRow
            label={labels.vatAmount}
            value={
              <div className="space-y-0.5">
                <div className="text-xs text-slate-500">Est: {currency} {estimatedVatAmount}</div>
                <div className="text-xs text-slate-500">Actual: {currency} {actualVatAmount}</div>
              </div>
            }
            icon={<DollarSign className="h-4 w-4 text-slate-400" />}
          />
        </div>

        <div className="sm:col-span-2 lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-200">
          <DetailRow
            label={labels.estimatedTotal}
            value={
              <span className="font-semibold text-slate-900">
                {currency} {totalCost}
              </span>
            }
            icon={<CreditCard className="h-4 w-4 text-slate-400" />}
          />
          <DetailRow
            label={labels.finalAmount}
            value={
              <span className="font-bold text-emerald-600">
                {currency} {finalAmount}
              </span>
            }
            icon={<DollarSign className="h-4 w-4 text-emerald-500" />}
          />
          <DetailRow
            label={labels.workerPoolAmount}
            value={`${currency} ${finalWorkerPoolAmount}`}
            icon={<Users className="h-4 w-4 text-slate-400" />}
          />
        </div>
      </div>
    </div>
  );
}