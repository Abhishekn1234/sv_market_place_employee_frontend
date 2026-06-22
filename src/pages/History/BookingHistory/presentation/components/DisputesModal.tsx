// // DisputePage.tsx
// "use client";

// import { useState } from "react";
// import { toast } from "react-toastify";
// import { useQueryClient } from "@tanstack/react-query";

// import { useGetDisputes } from "@/pages/History/BookingHistory/presentation/hooks/useGetDispute";
// import { useRespondDisputes } from "@/pages/History/BookingHistory/presentation/hooks/useRespondDispute";

// import type { Dispute } from "../../domain/entities/disputes";

// import { CommonTable } from "@/components/common/CommonTable";
// import { getDisputeColumns } from "../hooks/useDisputeColumns";
// import { formatDate } from "@/pages/Activity/RecentActivity/presentation/helpers/formatdate";
// import { useLanguage } from "@/context/LanguageContext";
// import CommonSpinner from "@/components/common/CommonSpinner";
// import DisputesMobileCards from "./DisputesMobileCards";
// import BookingDisputeRespondModal from "./BookingDisputeRespondModal";

// export default function DisputePage() {
//   const { data: disputes = [], isLoading } = useGetDisputes();
//   const { t } = useLanguage();

//   const queryClient = useQueryClient();
//   const respondMutation = useRespondDisputes();

//   const [selected, setSelected] = useState<Dispute | null>(null);
//   const [response, setResponse] = useState("");
//   const [responseOpen, setResponseOpen] = useState(false);

//   const columns = getDisputeColumns({
//     onSelect: (d) => {
//       setSelected(d);
//       setResponseOpen(true);
//     },
//     formatDate,
//     t,
//   });

//   const handleSubmit = () => {
//     if (!selected || !response.trim()) {
//       toast.error(t("disputepage.enterResponse"));
//       return;
//     }

//     respondMutation.mutate(
//       {
//         disputeId: selected._id,
//         response,
//       },
//       {
//         onSuccess: () => {
//           queryClient.setQueryData(
//             ["disputes"],
//             (old: Dispute[] = []) => {
//               if (!Array.isArray(old)) return old;

//               return old.map((d) =>
//                 d._id === selected._id
//                   ? {
//                       ...d,
//                       workerResponse: response,
//                       status: "RESOLVED",
//                     }
//                   : d
//               );
//             }
//           );

//           setSelected(null);
//           setResponse("");
//           setResponseOpen(false);
//         },
//         onError: (err: any) => {
//           toast.error(
//             err?.response?.data?.message ||
//               t("disputepage.responseFailed") ||
//               "Failed to submit response"
//           );
//         },
//       }
//     );
//   };

//   return (
//     <>
//       <div className="p-4 md:p-6">
//         <div className="mb-6">
//           <h1 className="text-2xl font-semibold">
//             {t("disputepage.title")}
//           </h1>
//         </div>

//         {isLoading && <CommonSpinner />}

//         {!isLoading && disputes.length === 0 && (
//           <p className="text-gray-500 text-sm">
//             {t("disputepage.noData")}
//           </p>
//         )}

//         {!isLoading && disputes.length > 0 && (
//           <>
//             {/* Desktop Table */}
//             <div className="hidden md:block">
//               <CommonTable<Dispute>
//                 columns={columns}
//                 data={disputes}
//                 keyExtractor={(d) => d._id}
//               />
//             </div>

//             {/* Mobile Cards */}
//                       <DisputesMobileCards
//             disputes={disputes}
//             isLoading={isLoading}
//             t={t}
//           />
//           </>
//         )}
//       </div>

//       {/* Response Popup */}
//       <BookingDisputeRespondModal
//         open={responseOpen}
//         setOpen={setResponseOpen}
//         selected={selected}
//         response={response}
//         setResponse={setResponse}
//         handleSubmit={handleSubmit}
//         isPending={respondMutation.isPending}
//         t={t}
//       />
//     </>
//   );
// }