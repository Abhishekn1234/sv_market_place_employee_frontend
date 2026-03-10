export function formatDate(dateInput: string | Date): string {
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;

  const now = new Date();

  const time = date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  if (target.getTime() === today.getTime()) {
    return `Today ${time}`;
  }

  if (target.getTime() === yesterday.getTime()) {
    return `Yesterday ${time}`;
  }

  if (target.getTime() === tomorrow.getTime()) {
    return `Tomorrow ${time}`;
  }

  return (
    date.toLocaleDateString([], {
      month: "short",
      day: "numeric",
    }) + ` ${time}`
  );
}