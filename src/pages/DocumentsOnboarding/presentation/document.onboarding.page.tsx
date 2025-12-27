"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { 
  FileText, 
  Image as ImageIcon, 
  ArrowRight,
  Loader2,
  X,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useDocumentsOnBoarding } from "./hooks/useDocumentsOnBoarding";
import type { ApiDocument } from "@/pages/Profile/domain/entities/documents";
import type { DocumentsOnboarding } from "../domain/entities/documentsonboarding";
import { useNavigate } from "react-router-dom";
type UploadDocument = ApiDocument & {
  file: File;
};

export default function DocumentOnboarding() {
  const [files, setFiles] = useState<Partial<Record<ApiDocument["documentType"], File>>>({});
  const mutation = useDocumentsOnBoarding();
  const navigate = useNavigate();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>, type: ApiDocument["documentType"]) => {
    if (e.target.files && e.target.files[0]) {
      setFiles((prev) => ({ ...prev, [type]: e.target.files![0] }));
    }
  };

  const removeFile = (type: ApiDocument["documentType"]) => {
    setFiles((prev) => {
      const newFiles = { ...prev };
      delete newFiles[type];
      return newFiles;
    });
  };

 const handleSubmit = (e: FormEvent) => {
  e.preventDefault();
  if (Object.keys(files).length === 0) return;

  const documentsData: DocumentsOnboarding = {
    documents: Object.entries(files)
      .filter(([_, file]) => file)
      .map(([type, file]) => ({
        _id: "",
        documentType: type as ApiDocument["documentType"],
        fileName: file!.name,
        filePath: "",
        filePublicId: "",
        fileType: file!.type,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        file: file!, // ✅ THIS WAS MISSING
      })) as UploadDocument[],
  };

  mutation.mutate(documentsData);
};


  const docTypes: { id: ApiDocument["documentType"]; label: string; icon: any; accept: string }[] = [
    { id: "idProof", label: "National ID Proof", icon: FileText, accept: ".pdf,image/*" },
    { id: "addressProof", label: "Address Proof", icon: FileText, accept: ".pdf,image/*" },
    { id: "photoProof", label: "Passport Size Photo", icon: ImageIcon, accept: "image/*" },
  ];

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 p-4">
      <Card className="w-full max-w-2xl shadow-lg border-t-4 border-blue-600">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-blue-600">Document Onboarding</CardTitle>
          <CardDescription className="text-gray-600 mt-1">
            Upload the required documents to complete your profile verification.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4">
              {docTypes.map((doc) => (
                <div 
                  key={doc.id}
                  className={`relative group border-2 border-dashed rounded-xl p-4 transition-all duration-200 ${
                    files[doc.id] 
                      ? "border-blue-500 bg-blue-50/30" 
                      : "border-gray-200 hover:border-blue-400 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${files[doc.id] ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-500"}`}>
                      <doc.icon className="h-6 w-6" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900">{doc.label}</p>
                      {files[doc.id] ? (
                        <p className="text-xs text-blue-600 truncate flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" /> {files[doc.id]?.name}
                        </p>
                      ) : (
                        <p className="text-xs text-gray-500">Supports PDF, PNG, JPG</p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {files[doc.id] ? (
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-gray-400 hover:text-red-500"
                          onClick={() => removeFile(doc.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      ) : (
                        <div className="relative">
                          <Button type="button" variant="outline" size="sm" className="pointer-events-none">
                            Select File
                          </Button>
                          <Input
                            type="file"
                            accept={doc.accept}
                            onChange={(e) => handleFileChange(e, doc.id)}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t">
              <Button 
                type="button" 
                variant="ghost" 
                onClick={() => navigate("/")}
                className="text-gray-500 hover:text-gray-700 order-2 sm:order-1"
              >
                Skip for now
              </Button>
              
              <div className="flex gap-3 w-full sm:w-auto order-1 sm:order-2">
                <Button 
                  type="submit" 
                  disabled={mutation.isPending || Object.keys(files).length === 0}
                  className="w-full sm:w-auto px-8"
                >
                  {mutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      Complete Setup
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      <p className="text-center text-xs text-gray-400 mt-6">
        Your documents are encrypted and stored securely.
      </p>
    </div>
  );
}
