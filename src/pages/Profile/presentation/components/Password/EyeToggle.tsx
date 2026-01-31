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
     className="
  absolute right-3 top-1/2 -translate-y-1/2
  bg-transparent border-none
  text-blue-800

  outline-none ring-0
  hover:opacity-100
  focus-visible:ring-0
"
    >
      {show ? <Eye size={18} /> : <EyeOff size={18} />}
    </Button>
  );
}