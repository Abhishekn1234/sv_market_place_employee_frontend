
type SpinnerColor =
  | "blue"
  | "red"
  | "green"
  | "yellow"
  | "purple"
  | "pink"
  | "indigo"
  | "gray"
  | "white"
  | "black";

type CommonSpinnerProps = {
  size?: "sm" | "md" | "lg";
  color?: SpinnerColor;
  fullScreen?: boolean;
  className?: string;
};

export default function CommonSpinner({
  size = "md",
  color = "blue",
  fullScreen = false,
  className = "",
}: CommonSpinnerProps) {
  const sizeMap = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-[3px]",
    lg: "w-12 h-12 border-4",
  };

  const colorMap = {
    blue: "border-blue-600",
    red: "border-red-600",
    green: "border-green-600",
    yellow: "border-yellow-500",
    purple: "border-purple-600",
    pink: "border-pink-600",
    indigo: "border-indigo-600",
    gray: "border-gray-500",
    white: "border-white",
    black: "border-black",
  };

  return (
    <div
      className={`flex items-center justify-center ${
        fullScreen ? "h-screen w-full" : ""
      }`}
    >
      <div
        className={`
          rounded-full
          border-solid
          border-t-transparent
          animate-spin
          ${sizeMap[size]}
          ${colorMap[color]}
          ${className}
        `}
      />
    </div>
  );
}