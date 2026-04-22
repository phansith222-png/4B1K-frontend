import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import mainapi from "../api/auth";
import { useSocket } from "../contexts/SocketContext";
import useUserStore from "../stores/userStore";
import { formatRelative } from "date-fns";
import { th } from "date-fns/locale/th";

// Component แสดงสถานะการส่งข้อความ
const MessageStatus = ({ isMe, isSent, isRead }) => {
  if (!isMe) return null;
  return (
    <div className="text-[10px] font-bold mt-1 tracking-tighter transition-all duration-300">
      {!isSent && (
        <span className="text-zinc-500 animate-pulse">กำลังส่ง...</span>
      )}
      {isSent && !isRead && <span className="text-blue-400/80">ส่งแล้ว</span>}
      {isSent && isRead && <span className="text-cyan-400">อ่านแล้ว</span>}
    </div>
  );
};

export default function ChatPage() {
  const socket = useSocket();
  const user = useUserStore((state) => state.user);
  const myUserId = user?.id;

  const [activeChat, setActiveChat] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [inputText, setInputText] = useState("");
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [typingText, setTypingText] = useState("");

  const scrollRef = useRef(null);
  const prevMessagesLengthRef = useRef(0);
  const typingTimeoutRef = useRef(null);

  // 1. ระบบ Scroll ไปล่างสุด
  const scrollToBottom = useCallback((behavior = "auto") => {
    setTimeout(() => {
      scrollRef.current?.scrollIntoView({ behavior, block: "end" });
    }, 100);
  }, []);

  // 2. Logic เมื่อได้รับข้อความใหม่ (Handle Receive)
  const handleReceive = useCallback((newMessage) => {
    const msgRoomId = String(newMessage.chatRoomId);
    
    setActiveChat((prevActive) => {
      if (msgRoomId === String(prevActive)) {
        setMessages((prevMsgs) => {
          if (prevMsgs.some((m) => m.id === newMessage.id)) return prevMsgs;
          const filtered = prevMsgs.filter(
            (m) => !(m.isOptimistic && m.content === newMessage.content)
          );
          return [...filtered, { ...newMessage, isSent: true, isOptimistic: false }];
        });
        // ถ้าเปิดห้องอยู่ ให้ส่งบอก Server ว่าอ่านแล้วทันที
        socket.emit("mark_read", { chatRoomId: msgRoomId, userId: myUserId });
      } else {
        // ถ้าอยู่ห้องอื่น ให้เพิ่ม Unread Count
        setUnreadCounts((prev) => ({
          ...prev,
          [msgRoomId]: (prev[msgRoomId] || 0) + 1,
        }));
      }
      return prevActive;
    });
  }, [socket, myUserId]);

  // 3. Logic เมื่อเพื่อนอ่านข้อความของเราแล้ว
  const handleMessageRead = useCallback(({ chatRoomId, readByUserId }) => {
    if (String(chatRoomId) === String(activeChat) && readByUserId !== myUserId) {
      setMessages((prev) => prev.map((msg) => ({ ...msg, isRead: true })));
    }
  }, [activeChat, myUserId]);

  // 4. ตั้งค่า Socket Listeners (Global)
  useEffect(() => {
    if (!socket) return;

    const handleDisplayTyping = (data) => {
      setActiveChat((prevActive) => {
        if (String(data.roomId) === String(prevActive)) {
          setTypingText(`${data.user} กำลังพิมพ์...`);
        }
        return prevActive;
      });
    };

    const handleHideTyping = () => setTypingText("");

    socket.on("connect", () => setIsSocketConnected(true));
    socket.on("disconnect", () => setIsSocketConnected(false));
    socket.on("receive_message", handleReceive);
    socket.on("message_read", handleMessageRead);
    socket.on("display_typing", handleDisplayTyping);
    socket.on("hide_typing", handleHideTyping);

    setIsSocketConnected(socket.connected);

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("receive_message", handleReceive);
      socket.off("message_read", handleMessageRead);
      socket.off("display_typing", handleDisplayTyping);
      socket.off("hide_typing", handleHideTyping);
    };
  }, [socket, handleReceive, handleMessageRead]);

  // 5. โหลดรายชื่อห้อง (Initial Load)
  useEffect(() => {
    mainapi.get("/chats/rooms")
      .then((res) => setContacts(res.data))
      .catch((err) => console.error("Error loading rooms:", err));
  }, []);

  // 6. เมื่อเปลี่ยนห้อง (Room Change & Mark Read)
  useEffect(() => {
    if (!socket || !activeChat) return;

    prevMessagesLengthRef.current = 0;
    setUnreadCounts((prev) => ({ ...prev, [activeChat]: 0 }));

    mainapi.get(`/chats/${activeChat}/messages`)
      .then((res) => {
        setMessages(res.data.map((msg) => ({ ...msg, isSent: true })));
        scrollToBottom("auto"); // เข้าห้องปุ๊บ เลื่อนลงล่างทันที
      })
      .catch((err) => console.error("Error loading messages:", err));

    socket.emit("join_room", String(activeChat));
    socket.emit("mark_read", { chatRoomId: activeChat, userId: myUserId });
  }, [socket, activeChat, myUserId, scrollToBottom]);

  // 7. เลื่อนลงล่างเมื่อมีข้อความใหม่พิมพ์เข้ามา
  useEffect(() => {
    if (messages.length > prevMessagesLengthRef.current && prevMessagesLengthRef.current !== 0) {
      scrollToBottom("smooth");
    }
    prevMessagesLengthRef.current = messages.length;
  }, [messages, scrollToBottom]);

  // 8. ส่งข้อความ
  const handleSendMessage = (e) => {
    e.preventDefault();
    const text = inputText.trim();
    if (!text || !isSocketConnected || !activeChat) return;

    // หยุด typing ทันทีเมื่อกดส่ง
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    socket.emit("stop_typing", { chatRoomId: activeChat });

    const messagePayload = {
      id: `temp-${Date.now()}`,
      chatRoomId: activeChat,
      senderId: myUserId,
      content: text,
      createdAt: new Date().toISOString(),
      isOptimistic: true,
      isSent: false,
      isRead: false,
      sender: {
        username: user?.username || user?.firstName,
        profileImage: user?.profileImage,
      },
    };

    setMessages((prev) => [...prev, messagePayload]);
    setInputText("");
    scrollToBottom("smooth");
    socket.emit("send_message", messagePayload);
  };

  // 8.1 จัดการ Typing Indicator ขณะพิมพ์
  const handleInputChange = (e) => {
    setInputText(e.target.value);
    if (!socket || !activeChat || !isSocketConnected) return;

    socket.emit("typing", {
      chatRoomId: String(activeChat),
      userName: user?.username || user?.firstName || "User",
    });

    // Debounce: หยุดพิมพ์ 1.5 วินาทีค่อยส่ง stop_typing
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stop_typing", { chatRoomId: activeChat });
    }, 1500);
  };

  // 9. จัดกลุ่มข้อความ
  const groupedMessages = useMemo(() => {
    return messages.map((msg, index) => {
      const prevMsg = messages[index - 1];
      const isMe = msg.senderId === myUserId;
      const isSameSender = prevMsg && prevMsg.senderId === msg.senderId;
      const isTimeClose = prevMsg && new Date(msg.createdAt) - new Date(prevMsg.createdAt) < 5 * 60 * 1000;

      return {
        ...msg,
        isMe,
        isGrouped: isSameSender && isTimeClose,
        showTime: !isSameSender || !isTimeClose,
      };
    });
  }, [messages, myUserId]);

  return (
    <div className="flex h-[calc(100vh-80px)] w-full bg-[#0a0a0a] text-zinc-200 p-4 gap-4 overflow-hidden font-sans">
      {/* Sidebar */}
      <div className="w-80 shrink-0 bg-[#141414] rounded-2xl border border-white/5 flex flex-col overflow-hidden shadow-2xl">
        <div className="p-6 font-bold text-xl border-b border-white/5 flex justify-between items-center bg-[#1a1a1a]">
          <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">4B1K Chats</span>
          <div className={`w-3 h-3 rounded-full shadow-[0_0_10px] ${isSocketConnected ? "bg-green-500 shadow-green-500/50" : "bg-red-500 shadow-red-500/50"}`} />
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
          {contacts.map((room) => (
            <button
              key={room.id}
              onClick={() => setActiveChat(room.id)}
              className={`w-full p-4 rounded-2xl flex items-center justify-between transition-all duration-300 ${activeChat === room.id ? "bg-blue-600 shadow-lg text-white scale-[1.02]" : "hover:bg-white/5 text-zinc-400"}`}
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-zinc-800 to-zinc-700 flex items-center justify-center font-bold text-lg border border-white/10">{room.id}</div>
                <div className="text-left font-bold text-sm tracking-wide">Room {room.id}</div>
              </div>
              {unreadCounts[room.id] > 0 && activeChat !== room.id && (
                <span className="bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded-full animate-bounce">{unreadCounts[room.id]}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 min-w-0 bg-[#141414] rounded-3xl border border-white/5 flex flex-col overflow-hidden relative">
        {activeChat ? (
          <>
            <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
              <div className="space-y-1 flex flex-col">
                {groupedMessages.map((msg, index) => {
                  const isMe = msg.isMe;
                  const senderName = msg.sender?.username || "Member";
                  const avatar = msg.sender?.profileImage || `https://ui-avatars.com/api/?name=${senderName}&background=random`;
                  const formattedTime = formatRelative(new Date(msg.createdAt), new Date(), { locale: th });

                  return (
                    <div key={msg.id || index} className={`flex flex-col ${isMe ? "items-end" : "items-start"} mt-4 w-full`}>
                      <div className={`flex items-center gap-2 mb-1.5 ${isMe ? "flex-row-reverse pr-12" : "pl-12"}`}>
                        <span className="text-[11px] font-bold text-zinc-400">{isMe ? "คุณ" : senderName}</span>
                        <span className="text-[9px] text-zinc-600 font-medium uppercase">{formattedTime}</span>
                      </div>
                      <div className={`flex gap-3 max-w-[85%] ${isMe ? "flex-row-reverse" : "flex-row"}`}>
                        <div className="shrink-0 self-end">
                          <img src={avatar} className="w-9 h-9 rounded-full border-2 object-cover" alt="profile" />
                        </div>
                        <div className="flex flex-col">
                          <div className={`px-4 py-2.5 text-sm leading-relaxed shadow-lg ${isMe ? "bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl rounded-tr-none" : "bg-[#242424] text-zinc-100 rounded-2xl rounded-tl-none border border-white/5"}`}>
                            <div className="whitespace-pre-wrap">{msg.content}</div>
                          </div>
                          <MessageStatus isMe={isMe} isSent={msg.isSent} isRead={msg.isRead} />
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={scrollRef} className="h-2" />
              </div>
            </div>

            {/* Typing Indicator */}
            <div className="px-6 h-6 flex items-center">
              {typingText && (
                <div className="flex items-center gap-2 text-[11px] text-cyan-400/80 font-medium animate-pulse">
                  <span className="flex gap-0.5">
                    <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </span>
                  <span>{typingText}</span>
                </div>
              )}
            </div>

            <form onSubmit={handleSendMessage} className="px-5 pb-5 bg-[#1a1a1a]/80 backdrop-blur-xl flex gap-3 border-t border-white/5 items-center pt-3">
              <input
                value={inputText}
                onChange={handleInputChange}
                placeholder="พิมพ์ข้อความของคุณ..."
                className="flex-1 bg-zinc-900 border border-white/5 rounded-2xl px-6 py-3.5 outline-none text-sm text-white focus:ring-2 focus:ring-blue-600/50"
              />
              <button type="submit" disabled={!inputText.trim() || !isSocketConnected} className="bg-blue-600 p-3.5 rounded-2xl text-white disabled:opacity-50">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-zinc-600">
            <p className="text-sm font-medium tracking-widest uppercase">เลือกห้องเพื่อเริ่มพูดคุย</p>
          </div>
        )}
      </div>
    </div>
  );
}