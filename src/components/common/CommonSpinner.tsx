
type CommonSpinnerProps = {
  size?: "sm" | "md" | "lg";
  color?: string;
  fullScreen?: boolean;
  className?: string;
};

export default function CommonSpinner({
  size = "md",
  color = "border-blue-600",
  fullScreen = false,
  className = "",
}: CommonSpinnerProps) {
  const sizeMap = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-3",
    lg: "w-12 h-12 border-4",
  };

  return (
    <div
      className={`flex items-center justify-center ${
        fullScreen ? "h-screen w-full" : ""
      }`}
    >
      <div
        className={`rounded-full border-t-transparent animate-spin ${sizeMap[size]} ${color} ${className}`}
      />
    </div>
  );
}