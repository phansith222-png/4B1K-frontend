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

  // เลื่อนจอลงล่างสุด (ใช้ ScrollIntoView)
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // จัดการ Socket Events
  useEffect(() => {
    if (!socket || !roomId) return;

    // เข้าห้องแชท
    socket.emit("join_room", roomId);

    // รับข้อความ
    socket.on("receive_message", (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
    });

    // รับสัญญาณ Typing
    socket.on("display_typing", (data) => {
      // เช็กให้แน่ใจว่าเป็น roomId เดียวกัน (ป้องกันสัญญาณข้ามห้อง)
      if (String(data.roomId) === String(roomId)) {
        setTypingUser(`${data.user} กำลังพิมพ์...`);
      }
    });

    // รับสัญญาณหยุด Typing
    socket.on("hide_typing", () => {
      setTypingUser("");
    });

    // Clean up function: สำคัญมากเพื่อไม่ให้ Event ซ้ำซ้อน
    return () => {
      socket.off("receive_message");
      socket.off("display_typing");
      socket.off("hide_typing");
    };
  }, [socket, roomId]); // ต้องมี roomId ตรงนี้เพื่อให้เริ่มใหม่เมื่อเปลี่ยนห้อง

  const handleTyping = (e) => {
    const value = e.target.value;
    setInput(value);

    if (!socket || !roomId) return;

    // ส่งสัญญาณ Typing
    socket.emit("typing", {
      chatRoomId: String(roomId),
      userName: currentUserName || "Guest User"
    });

    // Debounce: ถ้าหยุดพิมพ์ 2 วินาทีค่อยส่ง stop_typing
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stop_typing", { chatRoomId: roomId });
    }, 1500);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    const text = input.trim();

    if (!text || !socket) return;

    const messagePayload = {
      chatRoomId: roomId,
      senderId: currentUserId,
      content: text,
    };

    // ส่งข้อความ
    socket.emit("send_message", messagePayload);

    // ล้างค่าและหยุด Typing ทันที
    setInput("");
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    socket.emit("stop_typing", { chatRoomId: roomId });
  };

  return (
    <div className="chat-container" style={styles.container}>
      <div className="message-list" style={styles.messageList}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              textAlign: msg.senderId === currentUserId ? "right" : "left",
            }}
          >
            <span
              style={{
                ...styles.messageBubble,
                background: msg.senderId === currentUserId ? "#dcf8c6" : "#fff",
              }}
            >
              {msg.content}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Typing Indicator */}
      <div style={styles.typingArea}>
        {typingUser && <span style={styles.typingText}>{typingUser}</span>}
      </div>

      <form onSubmit={handleSendMessage} style={styles.form}>
        <input
          type="text"
          value={input}
          onChange={handleTyping}
          style={styles.input}
          placeholder="พิมพ์ข้อความ..."
        />
        <button type="submit" style={styles.button}>ส่ง</button>
      </form>
    </div>
  );
}

// แยก Styles ออกมาให้ดูสะอาดตามสไตล์ Pro
// const styles = {
//   container: {
//     border: "1px solid #ccc",
//     padding: "10px",
//     height: "450px",
//     display: "flex",
//     flexDirection: "column",
//     backgroundColor: "#f9f9f9",
//     borderRadius: "8px"
//   },
//   messageList: {
//     flex: 1,
//     overflowY: "auto",
//     marginBottom: "5px",
//     padding: "10px"
//   },
//   messageBubble: {
//     padding: "8px 12px",
//     borderRadius: "15px",
//     display: "inline-block",
//     margin: "4px",
//     maxWidth: "80%",
//     boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
//     fontSize: "14px"
//   },
//   typingArea: {
//     height: "20px",
//     paddingLeft: "10px",
//     marginBottom: "5px"
//   },
//   typingText: {
//     fontSize: "12px",
//     color: "#06b6d4",
//     fontStyle: "italic",
//     animation: "pulse 1.5s infinite"
//   },
//   form: {
//     display: "flex",
//     gap: "8px"
//   },
//   input: {
//     flex: 1,
//     padding: "10px",
//     borderRadius: "20px",
//     border: "1px solid #ddd",
//     outline: "none"
//   },
//   button: {
//     padding: "10px 20px",
//     borderRadius: "20px",
//     backgroundColor: "#06b6d4",
//     color: "white",
//     border: "none",
//     cursor: "pointer"
//   }
// };