import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";

import { useProfile } from "../../hooks/useProfile";
import { useUpdateProfile } from "../../hooks/useUpdateProfile";

import { ProfileDocuments } from "./ProfileDocuments";
import { ProfileHeader } from "./ProfileHeader";
import { ProfileInfo } from "./ProfileInfo";

import CommonSpinner from "@/components/common/CommonSpinner";
import { useLanguage } from "@/context/presentation/components/LanguageContext";

export default function ProfileList() {
  const { data: profile, isLoading } = useProfile();

  const { mutateAsync, isPending } = useUpdateProfile();

  const queryClient = useQueryClient();

  const { translations } = useLanguage();

  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
  });

  const [files, setFiles] = useState<
    Record<string, File | undefined>
  >({});

  const [fileUrls, setFileUrls] = useState<
    Record<string, string | undefined>
  >({});

  const fileFields = [
    {
      label: translations.profile.idProof,
      key: "idProof",
    },
    {
      label: translations.profile.addressProof,
      key: "addressProof",
    },
    {
      label: translations.profile.photo,
      key: "photoProof",
    },
  ] as const;

  useEffect(() => {
    if (!profile) return;

    setFormData({
      fullName: profile.fullName || "",
      address: profile.address || "",
    });

    const docs: Record<string, string> = {};

    profile.documents?.forEach((doc: any) => {
      if (doc.documentType && doc.filePath) {
        docs[doc.documentType] = doc.filePath;
      }
    });

    setFileUrls({
      profileImage: profile.profilePictureUrl,
      ...docs,
    });
  }, [profile]);

  if (isLoading) {
    return <CommonSpinner />;
  }

  if (!profile) {
    return (
      <div className="text-center py-10 text-gray-500">
        {translations.profile.noProfileData ??
          "No profile data found"}
      </div>
    );
  }

  const REQUIRED_DOCS = [
    "idproof",
    "addressproof",
    "photoproof",
  ];

  const canEdit =
    profile.kycStatus === "pending" &&
    profile.documents?.some((doc: any) => {
      const type = doc.documentType?.toLowerCase();

      return (
        REQUIRED_DOCS.includes(type) &&
        !!doc.filePath
      );
    });

  const handleSave = async () => {
    try {
      const data = new FormData();

      data.append("fullName", formData.fullName);
      data.append("address", formData.address);

      Object.entries(files).forEach(([key, file]) => {
        if (file) {
          data.append(key, file);
        }
      });

      await mutateAsync(data);

      /**
       * Clear old cache
       */
      await queryClient.invalidateQueries({
        queryKey: ["profile"],
      });

      /**
       * Force API call immediately
       */
      await queryClient.refetchQueries({
        queryKey: ["profile"],
      });

      toast.success(
        translations.profile.profileUpdated ??
          "Profile updated successfully"
      );

      setIsEditing(false);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to update profile"
      );
    }
  };

  return (
    <div
      className="
      w-full
      max-w-7xl
      mx-auto
      px-3 sm:px-4 md:px-6 lg:px-8
      space-y-4 sm:space-y-6 md:space-y-8
    "
    >
      <ProfileHeader
        profile={profile}
        isEditing={isEditing}
        isPending={isPending}
        fileUrl={fileUrls.profileImage}
        canEdit={canEdit}
        onEdit={() => {
          if (!canEdit) {
            toast.error(
              translations.profile.uploadRequiredDocs ??
                "Please upload ID Proof, Address Proof and Photo Proof before editing profile"
            );
            return;
          }

          setIsEditing(true);
        }}
        onCancel={() => setIsEditing(false)}
        onSave={handleSave}
        onImageChange={(file) => {
          setFiles((prev) => ({
            ...prev,
            profileImage: file,
          }));

          setFileUrls((prev) => ({
            ...prev,
            profileImage: URL.createObjectURL(file),
          }));
        }}
      />

      <ProfileInfo
        profile={profile}
        isEditing={isEditing}
        formData={formData}
        onChange={(e) =>
          setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
          }))
        }
      />

      <ProfileDocuments
        isEditing={isEditing}
        fileFields={fileFields}
        files={files}
        fileUrls={fileUrls}
        onFileChange={(file, key) =>
          setFiles((prev) => ({
            ...prev,
            [key]: file,
          }))
        }
      />
    </div>
  );
}