import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/context/LanguageContext";
import { User, Edit3 } from "lucide-react";

type Props = {
  profile: any;
  isEditing: boolean;
  isPending: boolean;
  fileUrl?: string;

  canEdit: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: () => void;
  onImageChange: (file: File) => void;
};

export function ProfileHeader({
  profile,
  isEditing,
  isPending,
  fileUrl,
  canEdit,
  onEdit,
  onCancel,
  onSave,
  onImageChange,
}: Props) {
  const { translations } = useLanguage();
  const profiles = translations.profile;

  return (
    <div className="flex flex-col gap-4 sm:gap-6 md:flex-row md:items-center md:justify-between">

      {/* Left section */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">

        {/* Avatar */}
        <div className="relative flex items-center justify-center 
          h-16 w-16 
          sm:h-18 sm:w-18 
          md:h-20 md:w-20 
          rounded-full bg-blue-100 overflow-hidden"
        >
          {fileUrl || profile.profilePictureUrl ? (
            <img
              src={fileUrl || profile.profilePictureUrl}
              className="h-full w-full object-cover"
            />
          ) : (
            <User className="h-8 w-8 text-blue-600" />
          )}

          {isEditing && (
            <>
              <Button
                type="button"
                variant="ghost"
                className="absolute bottom-0 right-0 h-8 w-8 p-0 rounded-full bg-white shadow"
                onClick={() =>
                  document.getElementById("profileImage")?.click()
                }
              >
                <Edit3 className="h-4 w-4 text-black" />
              </Button>

              <Input
                id="profileImage"
                type="file"
                accept=".jpg,.jpeg,.png"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    onImageChange(e.target.files[0]);
                  }
                }}
              />
            </>
          )}
        </div>

        {/* Name + Status */}
        <div className="flex flex-col items-center sm:items-start gap-1">
          <h2 className="text-base sm:text-lg md:text-xl font-semibold">
            {profile.fullName}
          </h2>
          <span className="px-3 py-1 text-xs sm:text-sm rounded-full">
            {profile.kycStatus}
          </span>
        </div>
      </div>

     
      {isEditing ? (
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button
            onClick={onSave}
            disabled={isPending}
            className="w-full sm:w-auto"
          >
            {isPending ? "Saving..." :profiles.save}
          </Button>
          <Button
            variant="outline"
            onClick={onCancel}
            className="w-full sm:w-auto"
          >
            {profiles.cancel}
          </Button>
        </div>
      ) : (
        <Button
          onClick={onEdit}
          disabled={!canEdit}
          className="w-full sm:w-auto"
          title={
            !canEdit
              ? "Upload ID Proof, Address Proof and Photo Proof to enable editing"
              : "Edit profile"
          }
        >
          <Edit3 className="h-4 w-4 mr-1" />
          {profiles.edit}
        </Button>
      )}
    </div>
  );
}

