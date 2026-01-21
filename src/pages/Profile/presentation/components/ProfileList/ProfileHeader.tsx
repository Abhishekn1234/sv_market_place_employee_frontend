import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  return (
    <div className="flex items-center justify-between">

      <div className="flex items-center gap-4">

        <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 overflow-hidden">
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
                  className="absolute bottom-1 right-1 p-0"
                  onClick={() => document.getElementById("profileImage")?.click()}
                  variant="ghost"
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

    
        <div>
          <h2 className="text-lg font-semibold">{profile.fullName}</h2>
          <span className="px-3 py-1 text-sm rounded-full">
            {profile.kycStatus}
          </span>
        </div>
      </div>

      {isEditing ? (
        <div className="flex gap-2">
          <Button onClick={onSave} disabled={isPending}>
            {isPending ? "Saving..." : "Save"}
          </Button>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      ) : (
        <Button
          onClick={onEdit}
          disabled={!canEdit}
          title={
            !canEdit
              ? "Upload ID Proof, Address Proof and Photo Proof to enable editing"
              : "Edit profile"
          }
        >
          <Edit3 className="h-4 w-4 mr-1" />
          Edit
        </Button>
      )}
    </div>
  );
}
