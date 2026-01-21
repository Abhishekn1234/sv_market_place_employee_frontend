"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import EyeToggle from "./EyeToggle";
import { Loader2,  } from "lucide-react";
import { usePassword } from "@/pages/Profile/presentation/hooks/usePassword";
import { toast } from "react-toastify";
import { validatePassword } from "@/pages/Profile/domain/validations/passwordinputvalidation";
import  {ValidatematchPassword}  from "@/pages/Profile/domain/validations/passwordmatchvalidation";
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


    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();

      if (!validatePassword(newPassword)) return;
       if(!ValidatematchPassword(newPassword,confirmPassword)) return;
 

      const data = { oldPassword, newPassword };

      mutate(data, {
        onSuccess: () => {
          toast.success("Password updated successfully");
          setOldPassword("");
          setNewPassword("");
          setConfirmPassword("");
          onSuccess();
        },
        onError: (err: any) => {
          toast.error(err?.response?.data?.message || "Failed to update password");
        },
      });
    };


  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto mt-10">
      
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


