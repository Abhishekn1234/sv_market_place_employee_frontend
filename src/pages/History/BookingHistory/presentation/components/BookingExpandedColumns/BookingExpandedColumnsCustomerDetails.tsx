
import { User, Phone, Mail } from "lucide-react";
import type { Customer } from "../../../domain/entities/customer.types";

type CustomerDetailsProps = {
  customer: Customer
  title: string;
};

export function BookingExpandedColumnsCustomerDetails({ customer, title }: CustomerDetailsProps) {
  return (
    <div className="space-y-4 min-w-0 bg-white/50 p-4 rounded-lg border border-slate-100">
      <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
        <User className="h-4 w-4" />
        {title}
      </h4>
      <div className="space-y-3">
        <div className="flex items-center gap-3 text-slate-700">
          <User className="h-4 w-4 text-slate-400 shrink-0" />
          <span className="text-sm font-medium break-words">
            {customer.fullName}
          </span>
        </div>
        <div className="flex items-center gap-3 text-slate-600">
          <Phone className="h-4 w-4 text-slate-400 shrink-0" />
          <span className="text-sm break-words">{customer.phone}</span>
        </div>
        <div className="flex items-center gap-3 text-slate-600">
          <Mail className="h-4 w-4 text-slate-400 shrink-0" />
          <span className="text-sm break-all">{customer.email}</span>
        </div>
      </div>
    </div>
  );
}