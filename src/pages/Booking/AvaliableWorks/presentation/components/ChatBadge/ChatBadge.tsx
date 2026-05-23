import { useChatMessages } from "@/ChatCustomer/presentation/hooks/useChatMessages";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

export function ChatBadge({ bookingId, navigate,t }: any) {
  const { data: messages } = useChatMessages(bookingId, 1, 100);

  const bookingMessages =
    messages?.data?.filter(
      (msg: any) =>
        String(msg.bookingId) === String(bookingId) && !msg?.isRead
    ) || [];

  return (
    <div className="relative">
      {bookingMessages.length > 0 && (
        <span className="absolute -top-2 -right-2 z-10 w-5 h-5 px-0.5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow">
          {bookingMessages.length}
        </span>
      )}

      <Button onClick={() => navigate(`/chat/${bookingId}`)}>
        <MessageCircle size={16} />
         {t("common.chat")}
      </Button>
    </div>
  );
}