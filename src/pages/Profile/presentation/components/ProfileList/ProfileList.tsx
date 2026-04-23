import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useProfile } from "../../hooks/useProfile";
import { useUpdateProfile } from "../../hooks/useUpdateProfile";
import { ProfileDocuments } from "./ProfileDocuments";
import { ProfileHeader } from "./ProfileHeader";
import { ProfileInfo } from "./ProfileInfo";
import { useQueryClient } from "@tanstack/react-query";

export default function ProfileList() {
  const { data: profile } = useProfile();
  const { mutateAsync, isPending } = useUpdateProfile();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ fullName: "", address: "" });
  const [files, setFiles] = useState<Record<string, File | undefined>>({});
  const [fileUrls, setFileUrls] = useState<Record<string, string | undefined>>(
    {}
  );

  const fileFields = [
    { label: "ID Proof", key: "idProof" },
    { label: "Address Proof", key: "addressProof" },
    { label: "Photo Proof", key: "photoProof" },
  ] as const;

  useEffect(() => {
    if (!profile) return;

    setFormData({
      fullName: profile.fullName,
      address: profile.address,
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

  if (!profile) return null;

const REQUIRED_DOCS = ["idproof", "addressproof", "photoproof"];

const canEdit =
  profile.kycStatus === "pending" &&
  profile.documents &&
  profile.documents.some((doc: any) => {
    const docType = doc.documentType?.toLowerCase();

    return REQUIRED_DOCS.includes(docType) && doc.filePath;
  });
 const handleSave = async () => {
  const data = new FormData();
  data.append("fullName", formData.fullName);
  data.append("address", formData.address);

  Object.entries(files).forEach(([k, v]) => {
    if (v) data.append(k, v);
  });

  const res = await mutateAsync(data);

  // ✅ 1. INSTANT UI UPDATE (no reload)
  queryClient.setQueryData(["profile"], (old: any) => {
    if (!old) return old;

    return {
      ...old,

      // ✅ update fields you edited
      fullName: formData.fullName,
      address: formData.address,

      // ✅ IMPORTANT: update documents + image if backend returns
      documents: res?.user.documents ?? old.documents,
      profilePictureUrl: res?.user.profilePictureUrl ?? old.profilePictureUrl,
    };
  });

  // ✅ 2. SAFE REFETCH (ensures backend truth)
  queryClient.invalidateQueries({ queryKey: ["profile"] });

  toast.success("Profile updated");
  setIsEditing(false);
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
              "Please upload ID Proof, Address Proof and Photo Proof before editing profile"
            );
            return;
          }
          setIsEditing(true);
        }}
        onCancel={() => setIsEditing(false)}
        onSave={handleSave}
        onImageChange={(file) => {
          setFiles((p) => ({ ...p, profileImage: file }));
          setFileUrls((p) => ({
            ...p,
            profileImage: URL.createObjectURL(file),
          }));
        }}
      />

      <ProfileInfo
        profile={profile}
        isEditing={isEditing}
        formData={formData}
        onChange={(e) =>
          setFormData((p) => ({ ...p, [e.target.name]: e.target.value }))
        }
      />

      <ProfileDocuments
        isEditing={isEditing}
        fileFields={fileFields}
        files={files}
        fileUrls={fileUrls}
        onFileChange={(file, key) =>
          setFiles((p) => ({ ...p, [key]: file }))
        }
      />
    </div>
  );
}
