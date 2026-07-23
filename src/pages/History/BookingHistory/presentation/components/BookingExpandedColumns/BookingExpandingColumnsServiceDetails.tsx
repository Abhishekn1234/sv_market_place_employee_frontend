
import { Briefcase, Tag, Wrench, Layers } from "lucide-react";
import type { ServiceCategory } from "@/pages/Servicesettings/domain/entities/servicecategory";

type ServiceDetailsProps = {
  service: any;
  serviceTier: any;
  category?: ServiceCategory;
  title: string;
  labels: {
    serviceCategory: string;
    serviceItem: string;
    serviceTier: string;
  };
};

export function BookingExpandedColumnsServiceDetails({ 
  service, 
  serviceTier, 
  category, 
  title, 
  labels 
}: ServiceDetailsProps) {
  const serviceName = typeof service === "string" ? service : service?.name ?? "—";
  const serviceTierName = typeof serviceTier === "string" 
    ? serviceTier 
    : serviceTier?.displayName ?? "—";

  return (
    <div className="space-y-4 min-w-0 bg-white/50 p-4 rounded-lg border border-slate-100">
      <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
        <Briefcase className="h-4 w-4" />
        {title}
      </h4>
      <div className="space-y-3">
        <div className="flex items-start gap-3 text-slate-600 text-sm">
          <Tag className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
          <div className="min-w-0">
            <span className="text-slate-400 block text-xs">
              {labels.serviceCategory}
            </span>
            <span className="font-medium text-slate-800 break-words">
              {category?.name ?? "—"}
            </span>
          </div>
        </div>
        
        <div className="flex items-start gap-3 text-slate-600 text-sm">
          <Wrench className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
          <div className="min-w-0">
            <span className="text-slate-400 block text-xs">
              {labels.serviceItem}
            </span>
            <span className="font-medium text-slate-800 break-words">
              {serviceName}
            </span>
          </div>
        </div>
        
        <div className="flex items-start gap-3 text-slate-600 text-sm">
          <Layers className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
          <div className="min-w-0">
            <span className="text-slate-400 block text-xs">
              {labels.serviceTier}
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
              {serviceTierName}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}