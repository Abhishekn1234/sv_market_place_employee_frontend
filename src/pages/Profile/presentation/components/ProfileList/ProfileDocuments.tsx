import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CommonCard } from "@/components/common/CommonCard";
import { useRef } from "react";
import { FileUp, FileCheck, FileWarning } from "lucide-react";
import { FilePreviewWithName } from "../../../presentation/components/FilePreview/FilePreviewwithName";
import { useTheme } from "@/context/presentation/components/ThemeContext";
import { useLanguage } from "@/context/presentation/components/LanguageContext";

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
  const { translations, t } = useLanguage();
  const { theme } = useTheme();

  return (
    <CommonCard title={translations.profile.documents ?? "Documents"}>
      {/* ✅ Explicit grid wrapper inside the card content area */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {fileFields.map(({ label, key }) => {
        const fileUrl = fileUrls[key];
        const file = files[key];
        const hasFile = !!(file || fileUrl);

        return (
          <div
            key={key}
            className={`
              relative group
              border rounded-2xl
              p-5
              flex flex-col items-center
              transition-all duration-200
              hover:border-blue-300 hover:shadow-md
              min-h-[280px] sm:min-h-[320px]
              ${
                theme === "dark"
                  ? "bg-slate-950/40 border-slate-800"
                  : "bg-slate-50/50 border-slate-200"
              }
            `}
          >
            {/* Title - Premium Style */}
            <p
              className={`text-[10px] font-bold uppercase tracking-widest mb-6 ${
                theme === "dark" ? "text-slate-400" : "text-slate-500"
              }`}
            >
              {label}
            </p>

            {/* Preview Area */}
            <div className="flex-1 w-full flex items-center justify-center rounded-xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 mb-4 shadow-inner">
              {hasFile ? (
                <FilePreviewWithName file={file} url={fileUrl} />
              ) : (
                <div className="flex flex-col items-center gap-2 text-slate-400">
                  <FileWarning className="h-8 w-8 opacity-20" />
                  <span className="text-[10px] font-medium italic">{translations.profile.noDocUploaded ?? "No document uploaded"}</span>
                </div>
              )}
            </div>

            {/* Actions */}
            {isEditing && (
              <div className="w-full">
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
                  variant={hasFile ? "secondary" : "outline"}
                  size="default"
                  className={`w-full gap-2 font-semibold cursor-pointer ${
                    !hasFile ? "border-slate-300 text-slate-600 hover:bg-white" : ""
                  }`}
                  onClick={() => inputRefs.current[key]?.click()}
                >
                  {hasFile ? (
                    <>
                      <FileCheck className="h-4 w-4" />
                      {translations.profile.changeDoc ?? "Change Document"}
                    </>
                  ) : (
                    <>
                      <FileUp className="h-4 w-4" />
                      {t('profile.uploadDoc', { label }) ?? `Upload ${label}`}
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        );
      })}
      </div>
    </CommonCard>
  );
}