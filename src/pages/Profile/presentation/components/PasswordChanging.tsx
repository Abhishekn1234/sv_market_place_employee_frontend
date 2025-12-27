"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { usePassword } from "@/pages/Profile/presentation/hooks/usePassword";
import { toast } from "react-toastify";

interface Props {
  onSuccess: () => void;
}

export default function PasswordChanging({ onSuccess }: Props) {
  const { mutate, isPending } = usePassword();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const validatePassword = (password: string) => {
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return false;
    }
    if (!/[A-Z]/.test(password) || !/[a-z]/.test(password)) {
      toast.error("Password must contain uppercase and lowercase letters");
      return false;
    }
    if (!/\d/.test(password)) {
      toast.error("Password must contain a number");
      return false;
    }
    if (!/[!@#$%^&*]/.test(password)) {
      toast.error("Password must contain a special character");
      return false;
    }
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePassword(newPassword)) return;

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

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
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto mt-10">
      {/* Current Password */}
      <div>
        <Label>Current Password</Label>
        <div className="relative">
          <Input
  type={showOld ? "text" : "password"}
  value={oldPassword}
  onChange={(e) => setOldPassword(e.target.value)}
  required
  className="pr-10 bg-gray-100 text-gray-900 placeholder-gray-500"
/>
          <EyeToggle show={showOld} setShow={setShowOld} />
        </div>
      </div>

      {/* New Password */}
      <div>
        <Label>New Password</Label>
        <div className="relative">
          <Input
  type={showNew ? "text" : "password"}
  value={newPassword}
  onChange={(e) => setNewPassword(e.target.value)}
  required
  className="pr-10 bg-gray-100 text-gray-900 placeholder-gray-500"
/>
          <EyeToggle show={showNew} setShow={setShowNew} />
        </div>
      </div>

      {/* Confirm Password */}
      <div>
        <Label>Confirm Password</Label>
        <div className="relative">
         <Input
  type={showConfirm ? "text" : "password"}
  value={confirmPassword}
  onChange={(e) => setConfirmPassword(e.target.value)}
  required
  className="pr-10 bg-gray-100 text-gray-900 placeholder-gray-500"
/>
          <EyeToggle show={showConfirm} setShow={setShowConfirm} />
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");
          }}
        >
          Clear
        </Button>

        <Button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700"
          disabled={isPending}
        >
          {isPending && (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          )}
          Update Password
        </Button>
      </div>
    </form>
  );
}

function EyeToggle({
  show,
  setShow,
}: {
  show: boolean;
  setShow: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      tabIndex={-1}
      onMouseDown={(e) => e.preventDefault()}
      onClick={() => setShow(!show)}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
    >
      {show ? <Eye size={18} /> : <EyeOff size={18} />}
    </button>
  );
}
