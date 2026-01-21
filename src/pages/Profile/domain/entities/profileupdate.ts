import type { ApiDocument } from "./documents";
import type { GeoPoint } from "./location";

export interface ProfileUpdate {
  user: {
    fullName: string;
    email?: string;
    address: string;
    profileImage?: string;
    idProof?: string;
    addressProof?: string;
    photoProof?: string;
    phone?: string;
    profilePictureUrl?: string;
    profilePicturePublicId?: string;
    isVerified?: boolean;
    kycStatus?: string;
    documents: ApiDocument[];
     location?: GeoPoint;
     status?:"online"|"offline" 
  };
  worker?: Worker;
}
