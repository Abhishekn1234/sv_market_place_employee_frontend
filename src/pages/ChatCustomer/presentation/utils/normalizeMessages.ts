export function normalizeMessage(msg: any, myUserId?: string) {
  return {
    id: msg.id || msg._id,
    text: msg.text || msg.message || "",
    senderId: msg.senderId,
    senderName: msg.senderName || msg.senderType || "User",
    createdAt: msg.createdAt,
    self: msg.senderId === myUserId,
    status: msg.status || "sent",
  };
}