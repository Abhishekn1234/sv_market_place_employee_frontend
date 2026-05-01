export const getDisputeStatusStyle = (status?: string) => {
  switch (status) {
    case "OPEN":
      return "bg-yellow-100 text-yellow-700";

    case "IN_REVIEW":
      return "bg-blue-100 text-blue-700";

    case "RESOLVED":
      return "bg-green-100 text-green-700";

    case "REJECTED":
      return "bg-red-100 text-red-700";

    default:
      return "bg-gray-100 text-gray-600";
  }
};