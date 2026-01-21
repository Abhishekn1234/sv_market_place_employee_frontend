import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

export default function EyeToggle({
  show,
  setShow,
}: {
  show: boolean;
  setShow: (v: boolean) => void;
}) {
  return (
    <Button
      type="button"
      tabIndex={-1}
      onMouseDown={(e) => e.preventDefault()}
      onClick={() => setShow(!show)}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-700 hover:text-gray-100 bg-gray-100"
    >
      {show ? <Eye size={18} /> : <EyeOff size={18} />}
    </Button>
  );
}