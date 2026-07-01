export const normalizeType = (type: string) =>
  (type || "").toLowerCase();

export const hasAnyRequiredDocument = (documents: any[] = []) => {
  console.log("documents received", documents);

  if (!Array.isArray(documents)) return false;

  const requiredDocs = new Set([
    "idproof",
    "addressproof",
    "photoproof",
  ]);

  return documents.some((doc) => {
    console.log(doc.documentType, normalizeType(doc.documentType), doc.filePath);

    return (
      requiredDocs.has(normalizeType(doc.documentType)) &&
      Boolean(doc.filePath)
    );
  });
};