import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CommonCard } from "@/components/common/CommonCard";
import { useLanguage } from "@/context/presentation/components/LanguageContext";

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
  const {translations} = useLanguage();
  return (
    <div className="
      grid grid-cols-1 
      md:grid-cols-2 
      gap-4 sm:gap-5 md:gap-6 lg:gap-8
    ">
      
      {/* Personal Information */}
      <CommonCard
        title={translations.profile.personalInformation ?? "Personal Information"}
        contentClassName="space-y-3 sm:space-y-4"
      >
        <div className="space-y-1">
          <Label className="text-sm sm:text-base">
            {translations.profile.fullName ?? "Full Name"}
          </Label>
          {isEditing ? (
            <Input
              name="fullName"
              value={formData.fullName}
              onChange={onChange}
              className="text-sm sm:text-base"
            />
          ) : (
            <div className="text-sm sm:text-base break-words">
              {profile.fullName}
            </div>
          )}
        </div>

        <div className="space-y-1">
          <Label className="text-sm sm:text-base">
            {translations.profile.email ?? "Email"}
          </Label>
          <div className="text-sm sm:text-base break-all">
            {profile.email}
          </div>
        </div>
      </CommonCard>

      {/* Contact Information */}
      <CommonCard
        title={translations.profile.contactInformation ?? "Contact Information"}
        contentClassName="space-y-3 sm:space-y-4"
      >
        <div className="space-y-1">
          <Label className="text-sm sm:text-base">
            {translations.profile.phone ?? "Phone"}
          </Label>
          <div className="text-sm sm:text-base break-words">
            {profile.phone}
          </div>
        </div>

        <div className="space-y-1">
          <Label className="text-sm sm:text-base">
            {translations.profile.address ?? "Address"}
          </Label>
          {isEditing ? (
          <Textarea
            name="address"
            value={formData.address}
            onChange={onChange}
          
            className="
              resize-none 
              min-h-20 sm:min-h-24 md:min-h-28
              text-sm sm:text-base
              shadow-sm
            "
          />
          ) : (
            <div className="text-sm sm:text-base break-words">
              {profile.address}
            </div>
          )}
        </div>
      </CommonCard>
    </div>
  );
}
