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

  // ✅ Step 1: Check basic setup
  if (!worker.categoryIds?.length || !worker.serviceTierIds?.length) {
    return "IN_PROGRESS";
  }

  // ✅ Step 2: No documents uploaded
  if (!documents.length) {
    return "IN_PROGRESS";
  }

  // ✅ Normalize status (kycStatus OR status)
  const getStatus = (doc: any) =>
    (doc.kycStatus || doc.status || "").toUpperCase();

  // ❌ If any rejected
  const hasRejected = documents.some(
    (d: any) => getStatus(d) === "REJECTED"
  );
  if (hasRejected) return "REJECTED";

  // ✅ If all approved
  const allApproved = documents.every(
    (d: any) => getStatus(d) === "APPROVED"
  );
  if (allApproved) return "COMPLETED";

  // ⏳ Otherwise pending
  return "PENDING";
};