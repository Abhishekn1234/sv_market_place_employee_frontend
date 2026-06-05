import type { Message } from "@/ChatCustomer/domain/entities/chat";

export const mergeUniqueMessages = (
  prev: Message[],
  incoming: Message[]
): Message[] => {
  const merged = [...prev];

  incoming.forEach((newMsg) => {
    const existsIndex = merged.findIndex((oldMsg) => {
      const oldMessage = String(
        oldMsg.message ?? ""
      ).trim();

      const newMessage = String(
        newMsg.message ?? ""
      ).trim();

      // Same DB message
      if (
        oldMsg.id &&
        newMsg.id &&
        String(oldMsg.id) === String(newMsg.id)
      ) {
        return true;
      }

      // Temp -> Real replacement
      const oldIsTemp = String(
        oldMsg.id ?? ""
      ).startsWith("temp-");

      const newIsReal =
        !!newMsg.id &&
        !String(newMsg.id).startsWith("temp-");

      if (
        oldIsTemp &&
        newIsReal &&
        oldMessage === newMessage &&
        oldMsg.senderId === newMsg.senderId
      ) {
        return true;
      }

      // Same content + sender + timestamp
      const oldTime = new Date(
        oldMsg.createdAt ?? 0
      ).getTime();

      const newTime = new Date(
        newMsg.createdAt ?? 0
      ).getTime();

      return (
        oldMessage === newMessage &&
        oldMsg.senderId === newMsg.senderId &&
        Math.abs(oldTime - newTime) < 10000
      );
    });

    if (existsIndex !== -1) {
      merged[existsIndex] = {
        ...merged[existsIndex],
        ...newMsg,
      };
    } else {
      merged.push(newMsg);
    }
  });

  return merged.sort((a, b) => {
    const aTime = new Date(
      a.createdAt ?? 0
    ).getTime();

    const bTime = new Date(
      b.createdAt ?? 0
    ).getTime();

    return aTime - bTime;
  });
};