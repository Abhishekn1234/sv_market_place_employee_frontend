const HERO_IMAGE_URL =
  "https://images.unsplash.com/photo-1521737604893-d14cc237f11d";

interface RegisterHeroPanelProps {
  /** Renders the compact card variant used at the top of the mobile layout */
  variant: "mobile" | "desktop";
}

export default function RegisterHeroPanel({ variant }: RegisterHeroPanelProps) {
  if (variant === "mobile") {
    return (
      <div className="mb-8 rounded-xl overflow-hidden shadow-lg">
        <div className="relative h-48">
          <img
            src={HERO_IMAGE_URL}
            alt="Employee Signup"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-blue-900/70 via-blue-900/40 to-transparent flex items-end p-5">
            <div className="text-white">
              <h3 className="text-lg font-bold mb-1">Welcome to the Team</h3>
              <p className="text-sm text-blue-100">
                Join our professional workforce
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-gray-900">
      <img
        src={HERO_IMAGE_URL}
        alt="Employee Signup"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-blue-900/70 via-blue-900/40 to-transparent flex items-end p-8 xl:p-12">
        <div className="text-white max-w-lg xl:max-w-xl">
          <h3 className="text-2xl xl:text-3xl 2xl:text-4xl font-bold mb-3 xl:mb-4">
            Welcome to the Team
          </h3>
          <p className="text-base xl:text-lg 2xl:text-xl text-blue-100">
            Join our professional workforce and manage your tasks efficiently
            with our comprehensive employee portal.
          </p>
        </div>
      </div>
    </div>
  );
}