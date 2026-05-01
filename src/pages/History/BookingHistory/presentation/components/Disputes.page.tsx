"use client";

import { useState, useEffect } from "react";

import { CommonCard } from "@/components/common/CommonCard";
import { CommonTable, type TableColumn } from "@/components/common/CommonTable";
import { Button } from "@/components/ui/button";
import { CommonModal } from "@/components/common/CommonModal";
import { useLanguage } from "@/context/LanguageContext";

import type { Dispute } from "../../domain/entities/disputes";
import { useGetDisputes } from "../hooks/useGetDispute";
import { useRespondDisputes } from "../hooks/useRespondDispute";
import { getDisputeStatusStyle } from "../utils/disputescolors";

export default function Disputespage() {
  const { language, t } = useLanguage();
  const isRTL = language === "AR";

  const { data = [] } = useGetDisputes();
  const respondMutation = useRespondDisputes();

  // ✅ modal state
  const [selected, setSelected] = useState<Dispute | null>(null);
  const [response, setResponse] = useState("");

  // ✅ mobile detection
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // ✅ open modal
  const openModal = (row: Dispute) => {
    setSelected(row);
    setResponse("");
  };

  // ✅ submit
  const handleSubmit = () => {
    if (!selected) return;

    respondMutation.mutate({
      disputeId: selected._id,
      response,
    });

    // reset
    setSelected(null);
    setResponse("");
  };

  const columns: TableColumn<Dispute>[] = [
    {
      key: "bookingId",
      header: t("disputepage.bookingId"),
    },
    {
      key: "raisedBy",
      header: t("disputepage.user"),
    },
    {
      key: "reason",
      header: t("disputepage.reason"),
    },
    {
      key: "status",
      header: t("disputepage.status"),
      render: (row) => (
                <span
          className={`px-2 py-1 rounded text-xs font-medium ${getDisputeStatusStyle(
            row.status
          )}`}
        >
          {row.status}
        </span>
      ),
    },
    {
      key: "action",
      header: t("disputepage.action"),
      render: (row) => (
        <Button
          size="sm"
          onClick={() => openModal(row)}
          // disabled={row.status == "OPEN"}\
          disabled={row.status=="IN_REVIEW"}
        >
          Respond
        </Button>
      ),
    },
  ];

  return (
    <div className="p-4">
      <CommonCard
        title={t("disputepage.title")}
        description={t("disputepage.description")}
        isRTL={isRTL}
      >
        {/* ✅ Responsive Rendering */}
        {isMobile ? (
          <div className="space-y-3">
            {data.map((row:any) => (
              <CommonCard
                key={row._id}
                title={`#${row.bookingId}`}
                description={
                  <div className="text-sm space-y-1">
                    <p>
                      <strong>{t("disputepage.user")}:</strong>{" "}
                      {row.raisedBy}
                    </p>
                    <p>
                      <strong>{t("disputepage.reason")}:</strong>{" "}
                      {row.reason}
                    </p>

                    {/* Status */}
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        row.status === "OPEN"
                          ? "bg-yellow-100 text-yellow-700"
                          : row.status === "RESOLVED"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {row.status}
                    </span>
                  </div>
                }
                footer={
                  <Button
                    size="sm"
                    onClick={() => openModal(row)}
                    disabled={row.status !== "OPEN"}
                  >
                    {t("disputepage.action")}
                  </Button>
                }
                isRTL={isRTL}
              />
            ))}
          </div>
        ) : (
          <CommonTable
            columns={columns}
            data={data}
            keyExtractor={(row) => row._id}
            isRTL={isRTL}
          />
        )}
      </CommonCard>

      {/* ✅ MODAL */}
      <CommonModal
        open={!!selected}
        onOpenChange={(open) => {
          if (!open) {
            setSelected(null);
            setResponse("");
          }
        }}
      >
        <CommonModal.Content>
          {/* HEADER */}
          <CommonModal.Header>
            <h2 className="text-lg font-semibold">
              Respond to Dispute
            </h2>
          </CommonModal.Header>

          {/* BODY */}
          <CommonModal.Body>
            <textarea
              className="w-full border rounded p-2 text-sm"
              rows={4}
              placeholder="Enter your response..."
              value={response}
              onChange={(e) => setResponse(e.target.value)}
            />
          </CommonModal.Body>

          {/* FOOTER */}
          <CommonModal.Footer>
            <Button
              variant="outline"
              onClick={() => {
                setSelected(null);
                setResponse("");
              }}
            >
              Cancel
            </Button>

            <Button
              onClick={handleSubmit}
              disabled={respondMutation.isPending}
            >
              {respondMutation.isPending
                ? "Submitting..."
                : "Submit"}
            </Button>
          </CommonModal.Footer>
        </CommonModal.Content>
      </CommonModal>
    </div>
  );
}
