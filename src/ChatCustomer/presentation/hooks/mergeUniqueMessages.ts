import type { Message } from "@/ChatCustomer/domain/entities/chat";

export const mergeUniqueMessages = (
  prev: Message[],
  incoming: Message[]
) => {
  const merged = [...prev];

  incoming.forEach((newMsg) => {
    const existsIndex =
      merged.findIndex((oldMsg) => {
        // SAME REAL DATABASE ID

        if (
          newMsg.id &&
          oldMsg.id &&
          newMsg.id === oldMsg.id
        ) {
          return true;
        }

        // TEMP -> REAL MESSAGE REPLACEMENT

        const oldIsTemp =
          !String(oldMsg.id).includes("-");

        const newIsReal =
          String(newMsg.id).length > 20;

        if (
          oldIsTemp &&
          newIsReal &&
          oldMsg.text.trim() ===
            newMsg.text.trim() &&
          oldMsg.senderId ===
            newMsg.senderId
        ) {
          return true;
        }

        // SAME CONTENT + SAME USER + CLOSE TIME

        return (
          oldMsg.text.trim() ===
            newMsg.text.trim() &&
          oldMsg.senderId ===
            newMsg.senderId &&
          Math.abs(
            new Date(
              oldMsg.createdAt || 0
            ).getTime() -
              new Date(
                newMsg.createdAt || 0
              ).getTime()
          ) < 10000
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

  return merged.sort(
    (a, b) =>
      new Date(
        a.createdAt || 0
      ).getTime() -
      new Date(
        b.createdAt || 0
      ).getTime()
  );
};