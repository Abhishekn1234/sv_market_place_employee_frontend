"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import EyeToggle from "./EyeToggle";
import { Loader2 } from "lucide-react";
import { usePassword } from "@/pages/Profile/presentation/hooks/usePassword";
import { toast } from "react-toastify";
import { validatePassword } from "@/pages/Profile/domain/validations/passwordinputvalidation";
import { ValidatematchPassword } from "@/pages/Profile/domain/validations/passwordmatchvalidation";
import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";

interface Props {
  onSuccess: () => void;
}

export default function PasswordChanging({ onSuccess }: Props) {
  const { mutate, isPending } = usePassword();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { translations } = useLanguage();
  const password = translations.profile;

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { theme } = useTheme();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePassword(newPassword)) return;
    if (!ValidatematchPassword(newPassword, confirmPassword)) return;

    mutate(
      { oldPassword, newPassword },
      {
        onSuccess: () => {
          toast.success("Password updated successfully");
          setOldPassword("");
          setNewPassword("");
          setConfirmPassword("");
          onSuccess();
        },
        onError: (err: any) => {
          toast.error(
            err?.response?.data?.message || "Failed to update password"
          );
        },
      }
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="
        w-full
        max-w-sm sm:max-w-md md:max-w-lg
        mx-auto
        mt-6 sm:mt-8 md:mt-10
        space-y-4 sm:space-y-5 md:space-y-6
        px-3 sm:px-4
      "
    >
      {/* Current Password */}
      <div className="space-y-1">
        <Label className="text-sm sm:text-base">
          {password.currentPassword ?? "Current Password"}
        </Label>
        <div className="relative">
          <Input
            type={showOld ? "text" : "password"}
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
            className={`pr-10 text-sm sm:text-base ${
              theme === "dark"
                ? "bg-gray-100 text-gray-100 placeholder-gray-500"
                : "bg-gray-100 text-gray-900 placeholder-gray-400"
            }`}
          />
          <EyeToggle show={showOld} setShow={setShowOld} />
        </div>
      </div>

      
      <div className="space-y-1">
        <Label className="text-sm sm:text-base">
          {password.newPassword ?? "New Password"}
        </Label>
        <div className="relative">
          <Input
            type={showNew ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className={`pr-10 text-sm sm:text-base ${
              theme === "dark"
                ? "bg-gray-100 text-gray-100 placeholder-gray-500"
                : "bg-gray-100 text-gray-900 placeholder-gray-400"
            }`}
          />
          <EyeToggle show={showNew} setShow={setShowNew} />
        </div>
      </div>

      {/* Confirm Password */}
      <div className="space-y-1">
        <Label className="text-sm sm:text-base">
          {password.confirmPassword ?? "Confirm Password"}
        </Label>
        <div className="relative">
          <Input
            type={showConfirm ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className={`pr-10 text-sm sm:text-base ${
              theme === "dark"
                ? "bg-gray-100 text-gray-100 placeholder-gray-500"
                : "bg-gray-100 text-gray-900 placeholder-gray-400"
            }`}
          />
          <EyeToggle show={showConfirm} setShow={setShowConfirm} />
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          className="w-full sm:w-auto"
          onClick={() => {
            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");
          }}
        >
          {password.clear}
        </Button>

        <Button
          type="submit"
          disabled={isPending}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
        >
          {isPending && (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          )}
          {password.updatePassword}
        </Button>
      </div>
    </form>
  );
}



