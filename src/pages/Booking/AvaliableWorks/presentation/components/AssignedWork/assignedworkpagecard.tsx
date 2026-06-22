
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
import { useLanguage } from "@/context/presentation/components/LanguageContext";
import { getStatusColor, getStatusIcon } from "../../helpers/getstatuscolorandicon";

type WorkCardProps = {
  work: Work;
  dark: boolean;
  navigate: (path: string) => void;
  onCancel: (bookingId?: string) => void;
  isCancelling?: boolean;
  cancelingWorkId?: string | null;
};

export const WorkCard = ({
  work,
  dark,
  navigate,
  onCancel,
  isCancelling,
  cancelingWorkId,
}: WorkCardProps) => {
  const { t } = useLanguage();

  return (
    <div
      className={`border rounded-2xl p-4 sm:p-6 space-y-4 sm:space-y-5 shadow-sm ${
        dark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"
      }`}
    >
      {/* HEADER */}
      <div className="flex justify-between items-start gap-2">
        <div className="min-w-0">
          <p className="text-xs text-gray-500">{t("bookingHistory.tableHeaders.id")}</p>
          <p className="font-mono text-xs sm:text-sm break-words">
            {work._id}
          </p>
        </div>

        <div
          className={`inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1 sm:py-2 rounded-lg border text-xs sm:text-sm ${getStatusColor(
            work.status
          )}`}
        >
          {getStatusIcon(work.status)}
          <span className="truncate max-w-[90px] sm:max-w-none">
            {work.status}
          </span>
        </div>
      </div>

      {/* 📱 MOBILE VIEW */}
      <div className="sm:hidden space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <Wrench className="h-4 w-4" />
          <span className="truncate">{work.service?.name}</span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <User className="h-4 w-4" />
          <span className="truncate">{work.customer?.fullName}</span>
        </div>

        <div className="flex items-center gap-2 text-sm font-semibold text-green-600">
          <DollarSign className="h-4 w-4" />
          SAR {work.booking?.amount}
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Calendar className="h-4 w-4" />
          {formatDateTime(work.assignedAt)}
        </div>
      </div>

      {/* 💻 DESKTOP VIEW */}
      <div className="hidden sm:block space-y-5">
        <div
          className={`border rounded-xl p-4 ${
            dark ? "bg-gray-900 border-gray-600" : "bg-blue-50"
          }`}
        >
          <p className="font-semibold mb-2 flex gap-2">
            <Wrench className="h-4 w-4" /> {t("bookingHistory.expandedRow.serviceDetails")}
          </p>
          <p className="flex gap-2">
            <Wrench className="h-4 w-4" /> {work.service?.name}
          </p>
          <p className="flex gap-2">
            <BadgeCheck className="h-4 w-4" />{" "}
            {work.serviceTier?.displayName}
          </p>
        </div>

        <div>
          <label className="text-sm flex gap-2 text-gray-500">
            <Calendar className="h-4 w-4" /> {t("bookingHistory.expandedRow.assignedAt")}
          </label>
          <div
            className={`mt-1 p-3 rounded-xl border ${
              dark ? "bg-gray-900 border-gray-600" : "bg-gray-50"
            }`}
          >
            {formatDateTime(work.assignedAt)}
          </div>
        </div>

        <div
          className={`border rounded-xl p-4 ${
            dark ? "bg-gray-900 border-gray-600" : "bg-purple-50"
          }`}
        >
          <p className="font-semibold mb-2 flex gap-2">
            <User className="h-4 w-4" /> {t("completeWork.customer")}
          </p>
          <p className="flex gap-2">
            <Mail className="h-4 w-4" /> {work.customer?.fullName}
          </p>
          <p className="flex gap-2">
            <Phone className="h-4 w-4" /> {work.customer?.phone}
          </p>
        </div>

        <div
          className={`border rounded-xl p-4 ${
            dark ? "bg-gray-900 border-gray-600" : "bg-green-50"
          }`}
        >
          <p className="font-semibold mb-1 flex gap-2">
            <DollarSign className="h-4 w-4" /> {t("bookingHistory.tableHeaders.payment")}
          </p>
          <p className="text-xl font-bold text-green-600">
            {work.booking?.currency} {work.booking?.amount}
          </p>
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="pt-2">
        <ActionButtons
          work={work}
          dark={dark}
          navigate={navigate}
          onCancel={onCancel}
          isCancelling={isCancelling}
          cancelingWorkId={cancelingWorkId}
        />
      </div>
    </div>
  );
};