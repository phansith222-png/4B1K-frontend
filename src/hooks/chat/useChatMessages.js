import { useState, useEffect, useRef, useMemo } from "react";
import mainapi from "../../api/auth";

export function useChatMessages({
  socket,
  connected,
  activeChat,
  myUserId,
  user,
  showToast,
  setContacts,
  setUnreadCounts,
}) {
  const [messages, setMessages] = useState([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [inputText, setInputText] = useState("");
  const [pendingImage, setPendingImage] = useState(null);
  const [typingText, setTypingText] = useState("");

  const scrollRef = useRef(null);
  const chatContainerRef = useRef(null);
  const inputRef = useRef(null);
  const messageImageInputRef = useRef(null);
  const typingTimer = useRef(null);

  useEffect(() => {
    if (!activeChat) {
      setMessages([]);
      setIsLoadingMessages(false);
      return;
    }

    let isCurrent = true;
    setTypingText("");
    setUnreadCounts((u) => ({ ...u, [activeChat]: 0 }));
    setMessages([]);
    setIsLoadingMessages(true);

    mainapi
      .get(`/chats/${activeChat}/messages`)
      .then((r) => {
        if (!isCurrent) return;
        setMessages(r.data.map((m) => ({ ...m, isSent: true })));
        if (r.data.length > 0 && socket) {
          const lastMsg = r.data[r.data.length - 1];
          socket.emit("mark_read", {
            chatRoomId: activeChat,
            userId: myUserId,
            lastMessageId: lastMsg.id,
          });
        }
      })
      .catch((err) => {
        if (!isCurrent) return;
        console.error("Failed to load messages:", err);
        showToast("Connection to frequency lost. Retrying...", "error");
      })
      .finally(() => {
        if (isCurrent) setIsLoadingMessages(false);
      });

    if (socket) socket.emit("join_room", String(activeChat));

    return () => { isCurrent = false; };
  }, [socket, activeChat, myUserId]);

  const send = async (e) => {
    e?.preventDefault();
    const text = inputText.trim();
    if ((!text && !pendingImage) || !connected || !activeChat) return;

    let imageUrl = null;
    const currentPendingImage = pendingImage;
    const currentText = text;

    setInputText("");
    setPendingImage(null);
    clearTimeout(typingTimer.current);
    socket.emit("stop_typing", { chatRoomId: activeChat });

    try {
      if (currentPendingImage) {
        const res = await mainapi.post(`/chats/rooms/${activeChat}/messages/image`, {
          image: currentPendingImage,
        });
        imageUrl = res.data.imageUrl;
      }

      const finalContent = imageUrl
        ? `[IMAGE]:${imageUrl}${currentText ? "\n" + currentText : ""}`
        : currentText;

      const payload = {
        id: `tmp-${Date.now()}`,
        chatRoomId: activeChat,
        senderId: myUserId,
        content: finalContent,
        createdAt: new Date().toISOString(),
        isOptimistic: true,
        isSent: false,
        isRead: false,
        sender: {
          username: user?.username,
          firstName: user?.firstName,
          lastName: user?.lastName,
          profileImage: user?.profileImage,
        },
      };

      setMessages((ms) => [...ms, payload]);
      setContacts((prev) =>
        prev.map((c) =>
          String(c.id) === String(activeChat) ? { ...c, lastMessageAt: payload.createdAt } : c
        )
      );
      socket.emit("send_message", payload);
    } catch (err) {
      console.error("Failed to send message:", err);
      showToast("Failed to send message. Please try again.", "error");
    }
  };

  const onInput = (e) => {
    setInputText(e.target.value);
    if (!socket || !activeChat || !connected) return;
    socket.emit("typing", { chatRoomId: String(activeChat), userName: user?.username || "User" });
    clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(
      () => socket.emit("stop_typing", { chatRoomId: activeChat }),
      1500
    );
  };

  const handleMessageImageChange = (e) => {
    const file = e.target.files[0];
    if (!file || !activeChat || !connected) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setPendingImage(reader.result);
      if (inputRef.current) inputRef.current.focus();
    };
    reader.readAsDataURL(file);
    if (messageImageInputRef.current) messageImageInputRef.current.value = "";
  };

  const grouped = useMemo(
    () =>
      messages.map((m, i) => {
        const isMe = Number(m.senderId) === Number(myUserId);
        const prev = messages[i - 1];
        const isNewDay =
          !prev ||
          new Date(m.createdAt).toDateString() !== new Date(prev.createdAt).toDateString();
        const prevSame = prev && Number(prev.senderId) === Number(m.senderId);
        return { ...m, isMe, isGrouped: false, showAvatar: !prevSame, showDateDivider: isNewDay };
      }),
    [messages, myUserId]
  );

  return {
    messages,
    setMessages, // exposed for handleReceive in ChatPage
    isLoadingMessages,
    inputText,
    setInputText,
    pendingImage,
    setPendingImage,
    typingText,
    setTypingText,
    send,
    onInput,
    handleMessageImageChange,
    grouped,
    scrollRef,
    chatContainerRef,
    inputRef,
    messageImageInputRef,
  };
}
