import { QueryClient } from "@tanstack/react-query";

export const upsertDisputeInCache = (
  queryClient: QueryClient,
  incoming: any
) => {
  const dispute = incoming?.dispute ?? incoming;

  // 🚨 Guard: must be a valid dispute
  if (!dispute?._id) {
    console.warn("Invalid dispute payload, skipping cache update:", incoming);
    return;
  }

  queryClient.setQueryData(["disputes"], (old: any[] = []) => {
    const exists = old.find((d) => d._id === dispute._id);

    if (exists) {
      return old.map((d) =>
        d._id === dispute._id ? { ...d, ...dispute } : d
      );
    }

    return [dispute, ...old];
  });
};