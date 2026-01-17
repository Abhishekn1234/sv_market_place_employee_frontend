import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function ServiceSelector({ label, items, selected, setSelected, activeClass = "bg-blue-600 text-white", displayKey = "name" }: any) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="flex flex-wrap gap-2 mt-2">
        {items?.map((item: any) => {
          const active = selected.includes(item._id);
          return (
            <Button
              key={item._id}
              type="button"
              onClick={() =>
                setSelected((prev: string[]) =>
                  active ? prev.filter((id) => id !== item._id) : [...prev, item._id]
                )
              }
              className={`px-3 py-1 rounded border text-sm transition ${active ? activeClass : "bg-white text-gray-700"}`}
            >
              {item[displayKey]}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
