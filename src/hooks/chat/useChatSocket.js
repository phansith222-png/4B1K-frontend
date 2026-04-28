import { useEffect } from "react";
import mainapi from "../../api/auth";

export function useChatSocket({
  socket,
  handleReceive,
  handleRead,
  setConnected,
  setActiveChat,
  setContacts,
  showToast,
  setTypingText,
}) {
  useEffect(() => {
    if (!socket) return;

    const onTyping = (d) =>
      setActiveChat((p) => {
        if (String(d.roomId) === String(p)) setTypingText(`${d.user} is typing...`);
        return p;
      });

    const onGroupDeleted = (data) => {
      showToast("This group has been deleted by the creator.", "error");
      setActiveChat((prev) => {
        if (String(data.roomId) === String(prev)) return null;
        return prev;
      });
      mainapi.get("/chats/rooms").then((r) => setContacts(r.data)).catch(console.error);
    };

    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));
    socket.on("receive_message", handleReceive);
    socket.on("message_read", handleRead);
    socket.on("display_typing", onTyping);
    socket.on("hide_typing", () => setTypingText(""));
    socket.on("group_deleted", onGroupDeleted);

    setConnected(socket.connected);

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("receive_message", handleReceive);
      socket.off("message_read", handleRead);
      socket.off("display_typing", onTyping);
      socket.off("hide_typing");
      socket.off("group_deleted", onGroupDeleted);
    };
  }, [socket, handleReceive, handleRead]);
}
