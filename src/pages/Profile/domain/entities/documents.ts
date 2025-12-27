// src/pages/Profile/domain/entities/documents.ts
export type ApiDocument = {
  _id: string;
  documentType: "profileImage" | "idProof" | "addressProof" | "photoProof";
  fileName: string;
  filePath: string;
  filePublicId: string;
  fileType: string;
  createdAt: string;
  updatedAt: string;
};
