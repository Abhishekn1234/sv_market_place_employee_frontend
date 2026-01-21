import type { ApiDocument } from "./documents";
import type { GeoPoint } from "./location";
import type { Worker } from "./workertype";
export interface Profile {
    fullName: string;
    email?: string;
    address: string;
    profileImage: string;
    idProof: string;
    addressProof: string;
    photoProof: string;
    phone?: string;
     profilePictureUrl?: string;
  profilePicturePublicId?: string;

    isVerified?: boolean;
    kycStatus?: string;
    documents: ApiDocument[];
    worker?: Worker; 
    location?:GeoPoint;
}


