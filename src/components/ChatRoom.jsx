import React, { useEffect, useState, useRef, useCallback } from "react";
import { useSocket } from "../contexts/SocketContext";

export default function ChatRoom({
  roomId,
  currentUserId,
  currentUserName = "User",
}) {
  const socket = useSocket();
  const typingTimeoutRef = useRef(null);
  const messagesEndRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typingUser, setTypingUser] = useState("");

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (!socket || !roomId) return;

    socket.emit("join_room", roomId);

    socket.on("receive_message", (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
    });

    socket.on("display_typing", (data) => {
      if (String(data.roomId) === String(roomId)) {
        setTypingUser(`${data.user} กำลังพิมพ์...`);
      }
    });

    socket.on("hide_typing", () => setTypingUser(""));

    return () => {
      socket.off("receive_message");
      socket.off("display_typing");
      socket.off("hide_typing");
    };
  }, [socket, roomId]);

  const handleTyping = (e) => {
    setInput(e.target.value);
    if (!socket || !roomId) return;

    socket.emit("typing", {
      chatRoomId: String(roomId),
      userName: currentUserName || "Guest",
    });

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stop_typing", { chatRoomId: roomId });
    }, 1500);
  };

  const handleSend = (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || !socket) return;

    socket.emit("send_message", {
      chatRoomId: roomId,
      senderId: currentUserId,
      content: text,
    });

    setInput("");
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    socket.emit("stop_typing", { chatRoomId: roomId });
  };

  return (
    <div
      data-theme="night"
      className="flex flex-col h-full w-full bg-base-100 rounded-2xl overflow-hidden border border-base-content/5 shadow-xl"
    >
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-thin scrollbar-thumb-base-content/10">
        {messages.map((msg, idx) => {
          const isMe = msg.senderId === currentUserId;
          return (
            <div
              key={idx}
              className={`chat ${isMe ? "chat-end" : "chat-start"}`}
            >
              <div
                className={`chat-bubble text-sm ${
                  isMe
                    ? "chat-bubble-primary"
                    : "bg-base-300 text-base-content"
                }`}
              >
                {msg.content}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Typing Indicator */}
      <div className="px-4 h-7 flex items-center">
        {typingUser && (
          <div className="flex items-center gap-2 text-[11px] text-primary/80 font-medium">
            <span className="flex gap-0.5">
              {[0, 150, 300].map((d) => (
                <span
                  key={d}
                  className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce"
                  style={{ animationDelay: `${d}ms` }}
                />
              ))}
            </span>
            <span>{typingUser}</span>
          </div>
        )}
      </div>

      {/* Input */}
      <form
        onSubmit={handleSend}
        className="px-4 pb-4 pt-2 flex gap-3 items-center border-t border-base-content/5 bg-base-200/40"
      >
        <input
          type="text"
          value={input}
          onChange={handleTyping}
          placeholder="พิมพ์ข้อความ..."
          className="input input-bordered flex-1 bg-base-300 border-base-content/10 focus:border-primary focus:outline-none text-sm h-10 rounded-2xl"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="btn btn-primary btn-sm h-10 w-10 rounded-2xl p-0 shadow-lg shadow-primary/20 disabled:opacity-40"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </form>
    </div>
  );
}