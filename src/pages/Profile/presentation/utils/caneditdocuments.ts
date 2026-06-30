export const normalizeType = (type: string) =>
  (type || "").toLowerCase();

export const hasAnyRequiredDocument = (documents: any[] = []) => {
  if (!Array.isArray(documents)) return false;

  const requiredDocs = new Set([
    "idproof",
    "addressproof",
    "photoproof",
  ]);

  return documents.some((doc: any) => {
    const type = normalizeType(doc.documentType);
    return requiredDocs.has(type) && !!doc.filePath;
  });
};