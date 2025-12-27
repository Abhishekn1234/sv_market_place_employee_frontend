import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-toastify";

import { useUpdateProfile } from "../hooks/useUpdateProfile";
import { useProfile } from "../hooks/useProfile";

type TabType = "profile" | "update" | "password";

type ProfileUpdateProps = {
  switchTab: (tab: TabType) => void;
};

export default function ProfileUpdate({ switchTab }: ProfileUpdateProps) {
  const { data: profile } = useProfile();
  const { mutateAsync, isPending } = useUpdateProfile();

  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
  });

  const [files, setFiles] = useState({
    profileImage: null as File | null,
    idProof: null as File | null,
    addressProof: null as File | null,
    photoProof: null as File | null,
  });

  const [fileUrls, setFileUrls] = useState<Record<string, string>>({});

  // Populate form and previews on edit
  useEffect(() => {
    if (!profile) return;

    setFormData({
      fullName: profile.fullName ?? "",
      address: profile.address ?? "",
    });

    const urls: Record<string, string> = {};

    // Map existing documents
    profile.documents?.forEach((doc: any) => {
      urls[doc.documentType] = doc.filePath;
    });

    // Map profile picture
    if (profile.profilePictureUrl) {
      urls.profileImage = profile.profilePictureUrl;
    }

    setFileUrls(urls);
  }, [profile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, key: keyof typeof files) => {
    if (!e.target.files?.[0]) return;

    const file = e.target.files[0];
    setFiles(prev => ({ ...prev, [key]: file }));

    // Create a local preview
    const reader = new FileReader();
    reader.onload = () => {
      setFileUrls(prev => ({
        ...prev,
        [key]: reader.result as string,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = new FormData();

      // Append text fields
      Object.entries(formData).forEach(([k, v]) => data.append(k, v));

      // Append new files only
      Object.entries(files).forEach(([k, f]) => {
        if (f) data.append(k, f);
      });

      // Append URLs of existing files if user didn't replace
      Object.entries(fileUrls).forEach(([k, url]) => {
        if (!files[k as keyof typeof files]) {
          data.append(`${k}Url`, url);
        }
      });

      await mutateAsync(data);

      toast.success("Profile updated successfully!");
      switchTab("profile");
    } catch {
      toast.error("Failed to update profile");
    }
  };

  const fileFields = [
    { label: "Profile Image", key: "profileImage" },
    { label: "ID Proof", key: "idProof" },
    { label: "Address Proof", key: "addressProof" },
    { label: "Photo Proof", key: "photoProof" },
  ] as const;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Personal Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Full Name</Label>
          <Input name="fullName" value={formData.fullName} onChange={handleInputChange} />
        </div>

        <div>
          <Label>Address</Label>
          <Textarea
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            className="resize-none h-20"
          />
        </div>
      </div>

      {/* Documents */}
      <div className="border rounded-lg p-4">
        <h3 className="font-semibold mb-3">Documents</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {fileFields.map((field) => {
            const imageSrc =
              files[field.key] ? fileUrls[field.key] : // newly selected file
              profile?.documents?.find(d => d.documentType === field.key)?.filePath || // existing doc
              (field.key === "profileImage" ? profile?.profilePictureUrl : undefined); // profile picture fallback

            return (
              <div key={field.key} className="border-2 border-dashed rounded-lg p-4 text-center">
                <p className="text-sm">{field.label}</p>

                {imageSrc ? (
                  <img
                    src={imageSrc}
                    alt={field.label}
                    className="h-24 w-24 object-cover rounded-md mx-auto mt-2"
                  />
                ) : (
                  <p className="text-sm text-gray-400 mt-2">No file selected</p>
                )}

                {/* Hidden input */}
                <Input
                  type="file"
                  id={field.key}
                  className="hidden"
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={(e) => handleFileChange(e, field.key)}
                />

                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="mt-2"
                  onClick={() => document.getElementById(field.key)?.click()}
                >
                  Browse
                </Button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Submit */}
      <div className="flex justify-end">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
