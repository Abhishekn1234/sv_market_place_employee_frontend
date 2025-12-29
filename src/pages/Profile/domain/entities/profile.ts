import type { ApiDocument } from "./documents";

export interface Worker {
    categoryIds: string[];
    serviceTierIds: string[];
    status: "active" | "inactive" | "online" | "offline" | string;
}
export interface GeoPoint {
  type: "Point";
  coordinates: [number, number]; // [lng, lat]
  accuracy?: number; // meters
}

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
    worker?: Worker; // added worker type here
    location?:GeoPoint;
}

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

