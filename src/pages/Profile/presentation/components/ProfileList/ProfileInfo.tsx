import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CommonCard } from "@/components/common/CommonCard";

type Props = {
  profile: any;
  isEditing: boolean;
  formData: { fullName: string; address: string };
  onChange: (e: React.ChangeEvent<any>) => void;
};

export function ProfileInfo({
  profile,
  isEditing,
  formData,
  onChange,
}: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    
      <CommonCard title="Personal Information" contentClassName="space-y-3">
        <div>
          <Label>Full Name</Label>
          {isEditing ? (
            <Input
              name="fullName"
              value={formData.fullName}
              onChange={onChange}
            />
          ) : (
            <div className="text-sm">{profile.fullName}</div>
          )}
        </div>

        <div>
          <Label>Email</Label>
          <div className="text-sm">{profile.email}</div>
        </div>
      </CommonCard>

    
      <CommonCard title="Contact Information" contentClassName="space-y-3">
        <div>
          <Label>Phone</Label>
          <div className="text-sm">{profile.phone}</div>
        </div>

        <div>
          <Label>Address</Label>
          {isEditing ? (
            <Textarea
              name="address"
              value={formData.address}
              onChange={onChange}
              className="resize-none h-20"
            />
          ) : (
            <div className="text-sm">{profile.address}</div>
          )}
        </div>
      </CommonCard>
    </div>
  );
}
