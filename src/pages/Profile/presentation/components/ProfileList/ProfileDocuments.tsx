import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CommonCard } from "@/components/common/CommonCard";
import { useRef } from "react";
import { FilePreviewWithName } from "../../../presentation/components/FilePreview/FilePreviewwithName";
import { useTheme } from "@/context/ThemeContext";

type Props = {
  isEditing: boolean;
  fileFields: readonly { label: string; key: string }[];
  files: Record<string, File | undefined>;
  fileUrls: Record<string, string | undefined>;
  onFileChange: (file: File, key: string) => void;
};

export function ProfileDocuments({
  isEditing,
  fileFields,
  files,
  fileUrls,
  onFileChange,
}: Props) {
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const { theme } = useTheme();

  return (
    <CommonCard
      title="Documents"
      contentClassName="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 lg:gap-8"
    >
      {fileFields.map(({ label, key }) => {
        const fileUrl = fileUrls[key];
        const file = files[key];

        return (
          <div
            key={key}
            className={`
              relative
              border rounded-lg
              p-3 sm:p-4 md:p-5
              flex flex-col items-center justify-between
              shadow-sm
              min-h-[220px] sm:min-h-[260px] md:min-h-[300px]
              ${
                theme === "dark"
                  ? "bg-gray-900 border-gray-700"
                  : "bg-white border-gray-200"
              }
            `}
          >
            {/* Title */}
            <p
              className={`text-sm sm:text-base font-medium mb-2 text-center ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              {label}
            </p>

            {/* Preview */}
            {file || fileUrl ? (
              <div className="flex-1 w-full flex items-center justify-center overflow-hidden">
                <FilePreviewWithName file={file} url={fileUrl} />
              </div>
            ) : (
              <div
                className={`flex-1 flex items-center justify-center text-xs sm:text-sm ${
                  theme === "dark" ? "text-gray-300" : "text-gray-400"
                }`}
              >
                No file uploaded
              </div>
            )}

            {/* Upload */}
            {isEditing && (
              <>
                <Input
                  ref={(el) => {
                    inputRefs.current[key] = el;
                  }}
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) onFileChange(f, key);
                  }}
                />

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-3 w-full"
                  onClick={() => inputRefs.current[key]?.click()}
                >
                  {file || fileUrl ? "Change File" : "Upload"}
                </Button>
              </>
            )}
          </div>
        );
      })}
    </CommonCard>
  );
}