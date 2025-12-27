import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-toastify";
import { useProfile } from "../hooks/useProfile";
import { useUpdateProfile } from "../hooks/useUpdateProfile";

import { User, Edit3 } from "lucide-react";

function getDocumentCat(key: string) {
  return {
    idProof: "ID Proof",
    addressProof: "Address Proof",
    photoProof: "Photo",
  }[key];
}

export default function ProfileList() {
  const { data: profile } = useProfile();
  const { mutateAsync, isPending } = useUpdateProfile();
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({ fullName: "", address: "" });
  const [files, setFiles] = useState<{
    profileImage: File | null;
    idProof: File | null;
    addressProof: File | null;
    photoProof: File | null;
  }>({
    profileImage: null,
    idProof: null,
    addressProof: null,
    photoProof: null,
  });

  const [fileUrls, setFileUrls] = useState<{
    profileImage?: string;
    idProof?: string;
    addressProof?: string;
    photoProof?: string;
  }>({});

  const fileFields = [
    { label: "ID Proof", key: "idProof" },
    { label: "Address Proof", key: "addressProof" },
    { label: "Photo Proof", key: "photoProof" },
  ] as const;

  useEffect(() => {
    if (profile) {
      setFormData({ fullName: profile.fullName, address: profile.address });

      const urls: typeof fileUrls = {};
      profile.documents?.forEach((doc) => {
        urls[doc.documentType as keyof typeof fileUrls] = doc.filePath;
      });

      if (profile.profilePictureUrl) {
        urls.profileImage = profile.profilePictureUrl;
      }

      setFileUrls(urls);
    }
  }, [profile]);

  if (!profile) return <div>Loading...</div>;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, key: keyof typeof files) => {
    if (e.target.files && e.target.files[0]) {
      setFiles((prev) => ({ ...prev, [key]: e.target.files![0] }));
      setFileUrls((prev) => ({ ...prev, [key]: undefined })); // remove old preview
    }
  };

  const handleSave = async () => {
    try {
      const data = new FormData();
      data.append("fullName", formData.fullName);
      data.append("address", formData.address);

      if (files.profileImage) data.append("profileImage", files.profileImage);
      if (files.idProof) data.append("idProof", files.idProof);
      if (files.addressProof) data.append("addressProof", files.addressProof);
      if (files.photoProof) data.append("photoProof", files.photoProof);

      await mutateAsync(data);

      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Section: profile picture & name */}
      <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
  {/* Profile Image */}
 <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 overflow-hidden">
  {fileUrls.profileImage || profile.profilePictureUrl ? (
    <img
      src={fileUrls.profileImage || profile.profilePictureUrl}
      alt="Profile"
      className="h-full w-full object-cover"
    />
  ) : (
    <User className="h-8 w-8 text-blue-600" />
  )}

  {/* Edit Icon */}
  {isEditing && (
    <button
      type="button"
      className="absolute bottom-0 right-0 bg-white border border-gray-300 rounded-full p-1 hover:bg-gray-100"
      onClick={() => document.getElementById("profileImage")?.click()}
    >
      <Edit3 className="h-4 w-4 text-gray-700" />
    </button>
  )}

  {/* Hidden File Input */}
  {isEditing && (
    <Input
      type="file"
      id="profileImage"
      accept=".jpg,.jpeg,.png"
      className="hidden"
      onChange={(e) => {
        handleFileChange(e, "profileImage");

        if (e.target.files && e.target.files[0]) {
          const reader = new FileReader();
          reader.onload = (ev) => {
            setFileUrls((prev) => ({
              ...prev,
              profileImage: ev.target?.result as string,
            }));
          };
          reader.readAsDataURL(e.target.files[0]);
        }
      }}
    />
  )}
</div>


  {/* Profile Info */}
  <div className="flex flex-col">
    <h2 className="text-lg font-semibold">{profile.fullName}</h2>
   <span
      className={`px-3 py-1 text-sm font-medium rounded-full 
        ${
          profile.kycStatus === "Verified"
            ? "bg-green-100 text-green-800"
            : profile.kycStatus === "Pending"
            ? "bg-yellow-100 text-yellow-800"
            : profile.kycStatus === "Rejected"
            ? "bg-red-100 text-red-800"
            : "bg-gray-100 text-gray-800"
        }`}
    >
      {profile.kycStatus}
    </span>
  </div>

  {/* KYC Status Badge */}
  
</div>



        <div>
          {isEditing ? (
            <div className="flex gap-2">
              <Button onClick={handleSave} disabled={isPending}>
                {isPending ? "Saving..." : "Save"}
              </Button>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </div>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <Edit3 className="h-4 w-4 mr-1" /> Edit
            </Button>
          )}
        </div>
      </div>

      {/* Personal & Contact Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border rounded-lg p-4 space-y-3">
          <h3 className="font-semibold">Personal Information</h3>

          <div>
            <Label>Full Name</Label>
            {isEditing ? (
              <Input name="fullName" value={formData.fullName} onChange={handleInputChange} />
            ) : (
              <div className="mt-1 text-sm">{profile.fullName}</div>
            )}
          </div>

          <div>
            <Label>Email</Label>
            <div className="mt-1 text-sm">{profile.email}</div>
          </div>
        </div>

        <div className="border rounded-lg p-4 space-y-3">
          <h3 className="font-semibold">Contact Information</h3>
          <div>
            <Label>Phone</Label>
            <div className="mt-1 text-sm">{profile.phone}</div>
          </div>
          <div>
            <Label>Location</Label>
            {isEditing ? (
              <Textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="resize-none h-20"
              />
            ) : (
              <div className="mt-1 text-sm">{profile.address}</div>
            )}
          </div>
        </div>
      </div>

      {/* Document Upload (other documents only) */}
      {isEditing && (
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-3">Document Upload</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {fileFields.map((field) => (
              <div key={field.key} className="border-2 border-dashed rounded-lg p-4 text-center">
                <p className="text-sm">Drag & drop or click to upload {field.label}</p>
                <p className="text-xs text-gray-500">PDF, JPG, PNG (max 5MB)</p>

                {!files[field.key] && fileUrls[field.key] && (
                  <div className="mt-2">
                    {fileUrls[field.key]?.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                      <img
                        src={fileUrls[field.key]}
                        alt={field.label}
                        className="h-24 w-24 object-cover rounded-md mx-auto"
                      />
                    ) : (
                      <a
                        href={fileUrls[field.key]}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                      >
                        View {fileUrls[field.key]?.split("/").pop()}
                      </a>
                    )}
                  </div>
                )}

                {files[field.key] && (
                  <p className="mt-2 text-sm text-green-600">Selected: {files[field.key]?.name}</p>
                )}

                <Input
                  type="file"
                  id={field.key}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  className="hidden"
                  onChange={(e) => handleFileChange(e, field.key)}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => document.getElementById(field.key)?.click()}
                >
                  Browse {field.label}
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Non-editing view of other documents */}
      {!isEditing && (
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-3">Documents</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {fileFields.map((field) => {
              const key = field.key;
              return (
                <div key={key} className="border p-2 rounded text-center">
                  <h4 className="font-medium">{getDocumentCat(key)}</h4>
                  {fileUrls[key as keyof typeof fileUrls] ? (
                    fileUrls[key as keyof typeof fileUrls]?.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                      <img
                        src={fileUrls[key as keyof typeof fileUrls]}
                        alt={key}
                        className="h-24 w-24 object-cover rounded-md mx-auto mt-2"
                      />
                    ) : (
                      <a
                        href={fileUrls[key as keyof typeof fileUrls]}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                      >
                        View {fileUrls[key as keyof typeof fileUrls]?.split("/").pop()}
                      </a>
                    )
                  ) : (
                    <p className="mt-2 text-sm text-gray-500">No file uploaded</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
