import type { ApiDocument } from "./documents";
import type { GeoPoint } from "./location";
import type { Role } from "./roles";
import type { Worker } from "./workertype";

export interface Profile {
  _id: string; // ✅ missing

  fullName: string;
  email?: string;
  phone?: string;

  address: string;

  profilePictureUrl?: string;
  profilePicturePublicId?: string;

  // legacy / UI fields (if still needed)
  profileImage?: string;
  idProof?: string;
  addressProof?: string;
  photoProof?: string;

  isVerified?: boolean;

  // ✅ KYC fields (missing)
  kycStatus?: string;
  kycRejectedReason?: string;
  kycReviewedAt?: string;
  kycReviewedBy?: string;

  // ✅ documents
  documents: ApiDocument[];

  // ✅ role (missing)
  role?: Role;

  // ✅ worker (already there but enriched below)
  worker?: Worker;

  // optional root-level location (if used separately)
  location?: GeoPoint;
}