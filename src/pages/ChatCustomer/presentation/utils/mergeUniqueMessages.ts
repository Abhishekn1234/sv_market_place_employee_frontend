import type { Message } from "@/pages/ChatCustomer/domain/entities/chat";

export const mergeUniqueMessages = (
  prev: Message[],
  incoming: Message[]
): Message[] => {
  const map = new Map<string, Message>();

  [...prev, ...incoming].forEach((msg) => {
    if (!msg.id) return;

    map.set(String(msg.id), msg);
  });

  return Array.from(map.values()).sort(
    (a, b) =>
      new Date(a.createdAt ?? 0).getTime() -
      new Date(b.createdAt ?? 0).getTime()
  );
};