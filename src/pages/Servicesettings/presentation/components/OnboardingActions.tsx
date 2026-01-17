import { Button } from "@/components/ui/button";

type Props = {
  onSubmit: () => void;
  loading: boolean;
};

export function OnboardingActions({ onSubmit, loading }: Props) {
  return (
    <div className="flex gap-4 justify-end">
      <Button disabled variant="secondary">
        Skip
      </Button>

      <Button onClick={onSubmit} disabled={loading}>
        Submit
      </Button>
    </div>
  );
}
