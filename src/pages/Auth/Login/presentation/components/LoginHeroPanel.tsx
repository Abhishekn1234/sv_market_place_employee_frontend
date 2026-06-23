import { Shield, Users, Sparkles } from "lucide-react";

const HERO_IMAGE_URL =
  "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1600&q=80";

interface LoginHeroPanelProps {
  variant: "mobile" | "desktop";
}

export default function LoginHeroPanel({ variant }: LoginHeroPanelProps) {
  if (variant === "mobile") {
    return (
      <div className="relative h-40 rounded-xl overflow-hidden mb-6">
        <img
          src={HERO_IMAGE_URL}
          className="h-full w-full object-cover"
          alt="Team"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/40 to-indigo-600/40" />
      </div>
    );
  }

  return (
    <div className="relative flex-1 min-h-screen">
      <img
        src={HERO_IMAGE_URL}
        className="absolute inset-0 h-full w-full object-cover"
        alt="Team"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/70 to-transparent" />

      <div className="relative z-10 h-full flex items-end p-16 text-white">
        <div>
          <h3 className="text-4xl font-bold mb-4">Work Better, Together</h3>
          <p className="text-lg text-blue-100 mb-8">
            Secure access • Team collaboration • All-in-one tools
          </p>

          <div className="flex gap-6">
            <FeatureBadge icon={<Shield />} text="Secure" />
            <FeatureBadge icon={<Users />} text="Team" />
            <FeatureBadge icon={<Sparkles />} text="All-in-One" />
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureBadge({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg">
      {icon}
      <span>{text}</span>
    </div>
  );
}