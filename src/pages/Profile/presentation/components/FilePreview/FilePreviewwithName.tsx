import { FileText, Download } from "lucide-react";

interface FilePreviewWithNameProps {
  file?: File;
  url?: string;
}

export function FilePreviewWithName({ file, url }: FilePreviewWithNameProps) {
  if (!file && !url) return null;

  const src = file ? URL.createObjectURL(file) : url!;
  const type = file?.type || "";


  if (type.startsWith("image/") || /\.(png|jpe?g|gif|webp)$/i.test(src)) {
    return (
      <img
        src={src}
        className="h-52 w-full rounded-md border object-cover"
        alt="preview"
      />
    );
  }

  if (type === "application/pdf" || /\.pdf$/i.test(src)) {
    return (
      <iframe
        src={src}
        className="h-53 w-full rounded-md border"
        title="document preview"
      />
    );
  }

  
  return (
    <a
      href={src}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 rounded-md border p-3 hover:bg-muted w-full justify-center"
    >
      <FileText className="h-5 w-5" />
      <span className="truncate">View document</span>
      <Download className="h-4 w-4" />
    </a>
  );
}
