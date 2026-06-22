export const getDisputeStatusStyle = (status?: string) => {
  switch (status) {
    case "OPEN":
      return { style: "bg-yellow-100 text-yellow-700", label: "Open" };
    case "IN_REVIEW":
      return { style: "bg-blue-100 text-blue-700", label: "In Review" };
    case "RESOLVED":
      return { style: "bg-green-100 text-green-700", label: "Resolved" };
    case "REJECTED":
      return { style: "bg-red-100 text-red-700", label: "Rejected" };
    default:
      return { style: "bg-gray-100 text-gray-600", label: status ?? "Unknown" };
  }
};