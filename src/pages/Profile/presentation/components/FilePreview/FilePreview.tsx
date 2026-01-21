
import {
  FileText,
  
  Download,
} from "lucide-react";

interface FilePreviewProps {
  file?: File;
  url?: string;
  label?: string;
}

export function FilePreview({ file, url, label }: FilePreviewProps) {
  if (!file && !url) return null;

  const src = file ? URL.createObjectURL(file) : url!;
  const type = file?.type || "";


  if (type.startsWith("image/") || /\.(png|jpe?g|gif|webp)$/i.test(src)) {
    return (
      <img
        src={src}
        alt={label}
        className="h-32 w-full rounded-md object-cover border"
      />
    );
  }

  if (type === "application/pdf" || /\.pdf$/i.test(src)) {
    return (
      <iframe
        src={src}
        className="h-40 w-full rounded-md border"
        title={label}
      />
    );
  }


  return (
    <a
      href={src}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 rounded-md border p-3 text-sm hover:bg-muted"
    >
      <FileText className="h-5 w-5" />
      <span className="flex-1 truncate">{label || "View document"}</span>
      <Download className="h-4 w-4" />
    </a>
  );
}
