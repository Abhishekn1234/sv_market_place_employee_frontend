import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CommonCard } from "@/components/common/CommonCard";
import { useRef } from "react";

import { FilePreviewWithName } from "../../../presentation/components/FilePreview/FilePreviewwithName";

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

  return (
    <CommonCard
      title="Documents"
      contentClassName="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {fileFields.map(({ label, key }) => {
        const fileUrl = fileUrls[key];
        const file = files[key];

        return (
          <div
            key={key}
            className="border rounded-lg p-4 flex flex-col items-center justify-center min-h-[300px] bg-white shadow-sm relative"
          >
            <p className="text-sm font-medium mb-2">{label}</p>

            {/* File Preview */}
            {(file || fileUrl) && (
              <div className="flex-1 w-full flex items-center justify-center">
                <FilePreviewWithName file={file} url={fileUrl} />
              </div>
            )}

            {/* Upload Button */}
            {isEditing && (
              <>
                <Input
                  ref={(el) => {
                    inputRefs.current[key] = el;
                  }}
                  type="file"
                  className="absolute opacity-0 w-0 h-0 pointer-events-none"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) onFileChange(f, key);
                  }}
                />

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-4 w-full"
                  onClick={() => inputRefs.current[key]?.click()}
                >
                  Upload
                </Button>
              </>
            )}
          </div>
        );
      })}
    </CommonCard>
  );
}
