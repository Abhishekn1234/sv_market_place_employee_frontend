"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-toastify";

import { useUpdateProfile } from "../../hooks/useUpdateProfile";
import { useProfile } from "../../hooks/useProfile";
import type { TabType } from "@/pages/Profile/domain/entities/tabtype";
import { useLanguage } from "@/context/LanguageContext";
import { useAuthStore } from "@/core/store/auth";

type ProfileUpdateProps = {
  switchTab: (tab: TabType) => void;
};

export default function ProfileUpdate({ switchTab }: ProfileUpdateProps) {
  const { data: profile } = useProfile();
  const {  setAuth } = useAuthStore.getState();
  const { mutateAsync, isPending } = useUpdateProfile();
  const { translations } = useLanguage();
  const update = translations.profile;

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

  useEffect(() => {
    if (!profile) return;

    setFormData({
      fullName: profile.fullName ?? "",
      address: profile.address ?? "",
    });

    const urls: Record<string, string> = {};

    profile.documents?.forEach((doc: any) => {
      urls[doc.documentType] = doc.filePath;
    });

    if (profile.profilePictureUrl) {
      urls.profileImage = profile.profilePictureUrl;
    }

    setFileUrls(urls);
  }, [profile]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: keyof typeof files
  ) => {
    if (!e.target.files?.[0]) return;

    const file = e.target.files[0];
    setFiles((prev) => ({ ...prev, [key]: file }));

    const reader = new FileReader();
    reader.onload = () => {
      setFileUrls((prev) => ({
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

    Object.entries(formData).forEach(([k, v]) => data.append(k, v));

    Object.entries(files).forEach(([k, f]) => {
      if (f) data.append(k, f);
    });

    Object.entries(fileUrls).forEach(([k, url]) => {
      if (!files[k as keyof typeof files]) {
        data.append(`${k}Url`, url);
      }
    });

    // ✅ CALL API
    const res = await mutateAsync(data);

    // ✅ IMPORTANT: sync Zustand
    const updatedUser = res?.user || res?.user || res;

    if (updatedUser) {
      // Option 1 (recommended): full replace with merge logic
      setAuth(updatedUser);

      // Option 2 (partial update)
      // updateUserProfile(updatedUser);
    }

    toast.success("Profile updated successfully!");
    switchTab("profile");

  } catch (err: any) {
    const message =
      err?.response?.data?.message ||
      err?.message ||
      "Failed to update profile";

    toast.error(message);
  }
};

  const fileFields = [
    { label: "Profile Image", key: "profileImage" },
    { label: "ID Proof", key: "idProof" },
    { label: "Address Proof", key: "addressProof" },
    { label: "Photo Proof", key: "photoProof" },
  ] as const;

  return (
    <form
      onSubmit={handleSubmit}
      className="
        w-full
        max-w-7xl
        mx-auto
        px-3 sm:px-4 md:px-6 lg:px-8
        space-y-5 sm:space-y-6 md:space-y-8
      "
    >
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
        <div className="space-y-1">
          <Label className="text-sm sm:text-base">
            {update.fullName ?? "Full Name"}
          </Label>
          <Input
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            className="text-sm sm:text-base"
          />
        </div>

        <div className="space-y-1">
          <Label className="text-sm sm:text-base">
            {update.address ?? "Address"}
          </Label>
          <Textarea
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            className="resize-none h-20 sm:h-24 md:h-28 text-sm sm:text-base"
          />
        </div>
      </div>

    
      <div className="border rounded-lg p-3 sm:p-4 md:p-5">
        <h3 className="font-semibold mb-3 text-sm sm:text-base">
          {update.documents ?? "Documents"}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
          {fileFields.map((field) => {
            const imageSrc =
              files[field.key]
                ? fileUrls[field.key]
                : profile?.documents?.find(
                    (d) => d.documentType === field.key
                  )?.filePath ||
                  (field.key === "profileImage"
                    ? profile?.profilePictureUrl
                    : undefined);

            return (
              <div
                key={field.key}
                className="
                  border-2 border-dashed rounded-lg
                  p-4
                  text-center
                  flex flex-col items-center
                  min-h-[200px]
                "
              >
                <p className="text-sm sm:text-base">{field.label}</p>

                {imageSrc ? (
                  <img
                    src={imageSrc}
                    alt={field.label}
                    className="h-20 w-20 sm:h-24 sm:w-24 object-cover rounded-md mt-3"
                  />
                ) : (
                  <p className="text-xs sm:text-sm text-gray-400 mt-3">
                    No file selected
                  </p>
                )}

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
                  className="mt-3 w-full sm:w-auto"
                  onClick={() =>
                    document.getElementById(field.key)?.click()
                  }
                >
                  {update.browse ?? "Browse"}
                </Button>
              </div>
            );
          })}
        </div>
      </div>

      
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isPending}
          className="w-full sm:w-auto"
        >
          {isPending ? "Saving..." : update.save}
        </Button>
      </div>
    </form>
  );
}

