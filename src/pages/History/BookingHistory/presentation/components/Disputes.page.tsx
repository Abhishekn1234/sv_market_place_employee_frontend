"use client";

import { useState, useEffect } from "react";

import CommonSpinner from "@/components/common/CommonSpinner";
import { CommonCard } from "@/components/common/CommonCard";
import {
  CommonTable,
  type TableColumn,
} from "@/components/common/CommonTable";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/presentation/components/LanguageContext";

import type { Dispute } from "../../domain/entities/disputes";
import { useGetDisputes } from "../hooks/useGetDispute";
import { useRespondDisputes } from "../hooks/useRespondDispute";
import { getDisputeStatusStyle } from "../utils/disputescolors";
import { toast } from "react-toastify";

import DisputesMobileCards from "./DisputesMobileCards";
import BookingDisputeRespondModal from "./BookingDisputeRespondModal";

export default function Disputespage() {
  const { language, t } = useLanguage();
  const isRTL = language === "AR";

  const { data = [], isLoading } = useGetDisputes();
  const respondMutation = useRespondDisputes();

  const [selected, setSelected] = useState<Dispute | null>(null);
  const [response, setResponse] = useState("");
  const [responseOpen, setResponseOpen] = useState(false);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);

    check();
    window.addEventListener("resize", check);

    return () => window.removeEventListener("resize", check);
  }, []);

  const openModal = (row: Dispute) => {
    setSelected(row);
    setResponse("");
    setResponseOpen(true);
  };

  const handleSubmit = () => {
    if (!selected) return;

    respondMutation.mutate(
      {
        disputeId: selected._id,
        response,
      },
      {
        onSuccess: () => {
          toast.success("Response submitted successfully");

          setSelected(null);
          setResponse("");
          setResponseOpen(false);
        },
        onError: (err: any) => {
          toast.error(
            err?.response?.data?.message ||
              "Failed to submit response"
          );
        },
      }
    );
  };

  const columns: TableColumn<Dispute>[] = [
    {
      key: "bookingCode",
      header: t("disputepage.bookingId"),
      render: (row: any) =>
        row.booking?.bookingCode || row.bookingId,
    },
    {
      key: "raisedBy",
      header: t("disputepage.user"),
    },
    {
      key: "reason",
      header: t("disputepage.Reason Type"),
      render:(row:any)=>row.reasonType
    },
    {
  key: "status",
  header: t("disputepage.status"),
  render: (row) => {
    const statusInfo = getDisputeStatusStyle(row.status);

    return (
      <span
        className={`px-2 py-1 rounded text-xs font-medium ${statusInfo.style}`}
      >
        {statusInfo.label}
      </span>
    );
  },
},
    {
      key: "action",
      header: t("disputepage.actions"),
      render: (row) => (
        <Button
          size="sm"
          onClick={() => openModal(row)}
          disabled={row.status === "IN_REVIEW"}
        >
          {t("disputepage.respond")}
        </Button>
      ),
    },
  ];

  return (
    <>
      <div className="p-4">
        <CommonCard
          title={t("disputepage.title")}
          description={t("disputepage.description")}
          isRTL={isRTL}
        >
          {isMobile ? (
            isLoading ? (
              <div className="flex justify-center py-12">
                <CommonSpinner />
              </div>
            ) : data.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                {t("disputepage.noData")}
              </div>
            ) : (
              <DisputesMobileCards
                disputes={data}
                isLoading={isLoading}
                t={t}
                setSelected={(d) => {
                  setSelected(d);
                  setResponse("");
                }}
                setResponseOpen={setResponseOpen}
              />
            )
          ) : isLoading ? (
            <div className="flex justify-center py-12">
              <CommonSpinner />
            </div>
          ) : (
            <CommonTable
              currentPage={1}
              columns={columns}
              data={data}
              keyExtractor={(row) => row._id}
              isRTL={isRTL}
              
            />
          )}
        </CommonCard>
      </div>

      <BookingDisputeRespondModal
        open={responseOpen}
        setOpen={(open) => {
          setResponseOpen(open);

          if (!open) {
            setSelected(null);
            setResponse("");
          }
        }}
        selected={selected}
        response={response}
        setResponse={setResponse}
        handleSubmit={handleSubmit}
        isPending={respondMutation.isPending}
        t={t}
      />
    </>
  );
} 