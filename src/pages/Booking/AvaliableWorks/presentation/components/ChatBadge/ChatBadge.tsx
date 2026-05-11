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
        <span className="absolute -top-2 -right-2 z-10 min-w-[20px] h-[20px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow">
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