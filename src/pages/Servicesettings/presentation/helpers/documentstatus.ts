export type OnboardingStatus =
  | "NOT_STARTED"
  | "IN_PROGRESS"
  | "PENDING"
  | "REJECTED"
  | "COMPLETED";

export const getOnboardingStatus = (user: any): OnboardingStatus => {
  if (!user) return "NOT_STARTED";

  const worker = user.worker;
  const documents = user.documents || [];

  if (!worker) return "NOT_STARTED";

  if (!worker.categoryIds?.length || !worker.serviceTierIds?.length) {
    return "IN_PROGRESS";
  }

  if (!documents.length) {
    return "IN_PROGRESS";
  }

  const hasRejected = documents.some((d: any) => d.status === "REJECTED");
  if (hasRejected) return "REJECTED";

  const allApproved = documents.every((d: any) => d.status === "APPROVED");
  if (allApproved) return "COMPLETED";

  return "PENDING";
};