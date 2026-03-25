
import { getStatusColor, getStatusIcon } from "@/pages/History/WorkHistory/presentation/utils/workhistory";
import { formatDateTime } from "../../helpers/formatdatetime";
import {
 
  Calendar,
  User,
  Phone,
  DollarSign,
 
  Wrench,
  BadgeCheck,
  Mail,
} from "lucide-react";

import type { Work } from "../../../domain/entities/work";
import { ActionButtons } from "./actionbuttonspageassignedwork";
type WorkCardProps = {
  work: Work;
  cancellingId: string | null;
  isCancelling: boolean;
  handleCancel: (id?: string) => void;
  handleStartWork: (work: Work) => void;
  dark: boolean;
  navigate: (path: string) => void;
  onClose: () => void;
};

export const WorkCard = ({
  work,
  cancellingId,
  isCancelling,
  handleCancel,
  handleStartWork,
  dark,
  navigate,
  onClose,
}: WorkCardProps) => {
  return (
    <div
      key={work._id}
      className={`border rounded-2xl p-6 space-y-5 shadow-sm ${
        dark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"
      }`}
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <p className={`text-sm ${dark ? "text-gray-100" : "text-gray-800"}`}>Assignment ID</p>
          <p className="font-mono">{work._id}</p>
        </div>

        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border ${getStatusColor(work.status)}`}>
          {getStatusIcon(work.status)}
          {work.status}
        </div>
      </div>

      {/* Service Details */}
      <div className={`border rounded-xl p-4 ${dark ? "bg-gray-900 border-gray-600" : "bg-blue-50"}`}>
        <p className="font-semibold mb-2 flex gap-2">
          <Wrench className="h-4 w-4" /> Service Details
        </p>
        <p className="flex gap-2">
          <Wrench className="h-4 w-4" /> {work.service?.name}
        </p>
        <p className="flex gap-2">
          <BadgeCheck className="h-4 w-4" /> {work.serviceTier?.displayName}
        </p>
      </div>

      {/* Assigned At */}
      <div>
        <label className={`text-sm ${dark ? "text-gray-100" : "text-gray-600"} flex gap-2`}>
          <Calendar className="h-4 w-4" /> Assigned At
        </label>
        <div className={`mt-1 p-3 rounded-xl border ${dark ? "bg-gray-900 border-gray-600" : "bg-gray-50"}`}>
          {formatDateTime(work.assignedAt)}
        </div>
      </div>

      {/* Customer Info */}
      <div className={`border rounded-xl p-4 ${dark ? "bg-gray-900 border-gray-600" : "bg-purple-50"}`}>
        <p className="font-semibold mb-2 flex gap-2">
          <User className="h-4 w-4" /> Customer
        </p>
        <p className="flex gap-2">
          <Mail className="h-4 w-4" /> {work.customer?.fullName}
        </p>
        <p className="flex gap-2">
          <Phone className="h-4 w-4" /> {work.customer?.phone}
        </p>
      </div>

      {/* Payment */}
      <div className={`border rounded-xl p-4 ${dark ? "bg-gray-900 border-gray-600" : "bg-green-50"}`}>
        <p className="font-semibold mb-1 flex gap-2">
          <DollarSign className="h-4 w-4" /> Payment
        </p>
        <p className="text-xl font-bold text-green-600">SAR {work.booking?.amount}</p>
      </div>

      {/* Action Buttons */}
      <ActionButtons
        work={work}
        cancellingId={cancellingId}
        isCancelling={isCancelling}
        handleCancel={handleCancel}
        handleStartWork={handleStartWork}
        dark={dark}
        navigate={navigate}
        onClose={onClose}
      />
    </div>
  );
};