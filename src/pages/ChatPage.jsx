import React, { useState, useEffect, useRef, useCallback } from 'react';
import mainapi from '../api/auth';
import { useSocket } from '../contexts/SocketContext';
import useUserStore from '../stores/userStore';

export default function ChatPage() {
  const socket = useSocket();
  const user = useUserStore(state => state.user);
  const myUserId = user?.id;

  const [activeChat, setActiveChat] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const scrollRef = useRef(null);

  // 1. ตรวจสอบสถานะการเชื่อมต่อ
  useEffect(() => {
    if (!socket) return;

    const onConnect = () => setIsSocketConnected(true);
    const onDisconnect = () => setIsSocketConnected(false);

    setIsSocketConnected(socket.connected);

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, [socket]);

  // 2. รับข้อความใหม่แบบ Real-time (ใช้ useCallback เพื่อไม่ให้ Re-render พร่ำเพรื่อ)
  const handleReceive = useCallback((newMessage) => {
    // เช็คว่าข้อความเป็นของห้องที่เปิดอยู่หรือไม่ (ใช้ == เพื่อรองรับทั้ง String และ Number)
    if (newMessage.chatRoomId == activeChat) {
      setMessages(prev => {
        // ป้องกันข้อความซ้ำจาก ID จริงที่ส่งมาจาก Server
        if (prev.some(m => m.id === newMessage.id)) return prev;

        // หาข้อความที่เป็น Temp (Optimistic UI) ที่เราส่งไปเอง เพื่อแทนที่ด้วยข้อมูลจริงจาก DB
        const tempIndex = prev.findIndex(m => m.isTemp && m.content === newMessage.content);
        if (tempIndex !== -1) {
          const updated = [...prev];
          updated[tempIndex] = newMessage; // แทนที่ด้วยข้อมูลจริงที่มี id จาก DB
          return updated;
        }
        return [...prev, newMessage];
      });
    }
  }, [activeChat]);

  // 3. โหลดรายชื่อห้องแชทครั้งแรก
  useEffect(() => {
    mainapi.get('/chats/rooms')
      .then(res => setContacts(res.data))
      .catch(err => console.error("Error loading rooms:", err));
  }, []);

  // 4. จัดการเรื่องการเปลี่ยนห้อง (Join Room & Listen)
  useEffect(() => {
    if (!socket || !activeChat) return;

    // โหลดประวัติแชทเก่า
    mainapi.get(`/chats/${activeChat}/messages`)
      .then(res => setMessages(res.data))
      .catch(err => console.error("Error loading messages:", err));

    // บอก Server ว่าขอเข้าห้องนี้
    socket.emit("join_room", String(activeChat));

    // เปิดหูรอฟังข้อความ
    socket.on("receive_message", handleReceive);

    return () => {
      // ปิดหูฟังเมื่อออกจากห้องหรือเปลี่ยนห้อง เพื่อไม่ให้ Listener ซ้อนกัน
      socket.off("receive_message", handleReceive);
    };
  }, [socket, activeChat, handleReceive]);

  // 5. ฟังก์ชันส่งข้อความ
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim() || !isSocketConnected || !activeChat) return;

    const content = inputText.trim();
    
    // ข้อมูลที่ต้องส่งให้ Server (ต้องมีครบตามที่ server.js และ Prisma ต้องการ)
    const messagePayload = { 
      chatRoomId: activeChat, 
      senderId: myUserId, 
      content: content 
    };

    // Optimistic UI: แสดงข้อความบนหน้าจอตัวเองทันที (ตัวจางๆ)
    const tempMsg = { 
      id: Date.now(), 
      ...messagePayload, 
      isTemp: true 
    };
    setMessages(prev => [...prev, tempMsg]); 
    
    setInputText("");

    // ส่งออกไปหา Server ผ่านท่อ Socket
    socket.emit("send_message", messagePayload);
  };

  // 6. เลื่อนลงล่างสุดอัตโนมัติเมื่อมีข้อความใหม่
  useEffect(() => { 
    scrollRef.current?.scrollIntoView({ behavior: "smooth" }); 
  }, [messages]);

  return (
    <div className="flex h-[calc(100vh-80px)] w-full bg-[#0a0a0a] text-zinc-200 p-4 gap-4">
      {/* Sidebar ห้องแชท */}
      <div className="w-80 bg-[#141414] rounded-2xl border border-white/5 flex flex-col overflow-hidden">
        <div className="p-5 font-bold text-xl border-b border-white/5 flex justify-between items-center">
          <span>Chats</span>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-wider text-zinc-500">
              {isSocketConnected ? 'Live' : 'Offline'}
            </span>
            <div className={`w-2.5 h-2.5 rounded-full ${isSocketConnected ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-red-500'}`} />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {contacts.map(room => (
            <button 
              key={room.id} 
              onClick={() => setActiveChat(room.id)}
              className={`w-full p-4 rounded-xl mb-1 flex items-center gap-3 transition-all duration-200 ${activeChat === room.id ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-white/5 text-zinc-400'}`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${activeChat === room.id ? 'bg-white/20' : 'bg-zinc-800'}`}>
                {room.id}
              </div>
              <div className="text-left">
                <div className="font-semibold text-sm">Room {room.id}</div>
                <div className="text-xs opacity-60">คลิกเพื่อเข้าสู่ห้องแชท</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* พื้นที่แสดงข้อความ */}
      <div className="flex-1 bg-[#141414] rounded-2xl border border-white/5 flex flex-col overflow-hidden">
        {activeChat ? (
          <>
            <div className="flex-1 p-6 overflow-y-auto space-y-4 custom-scrollbar">
              {messages.map((msg) => (
                <div key={msg.id} className={`chat ${msg.senderId === myUserId ? 'chat-end' : 'chat-start'}`}>
                  <div className={`chat-bubble max-w-md rounded-2xl px-4 py-2 text-sm shadow-sm ${
                    msg.senderId === myUserId 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-zinc-800 text-zinc-200'
                  } ${msg.isTemp ? 'opacity-50 italic' : ''}`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              <div ref={scrollRef} />
            </div>

            <form onSubmit={handleSendMessage} className="p-4 bg-[#1c1c1c] flex gap-2 border-t border-white/5">
              <input 
                value={inputText} 
                onChange={e => setInputText(e.target.value)} 
                placeholder="Type a message..."
                className="flex-1 bg-zinc-900 border-none rounded-full px-5 py-3 focus:ring-2 focus:ring-blue-600 outline-none text-sm transition-all" 
              />
              <button 
                type="submit" 
                disabled={!inputText.trim() || !isSocketConnected}
                className="bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-700 p-3 rounded-full active:scale-95 transition-all shadow-md"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                </svg>
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-zinc-600 gap-3">
            <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center opacity-50">
               <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>
            </div>
            <p>เลือกห้องแชทเพื่อเริ่มสนทนา</p>
          </div>
        )}
      </div>
    </div>
  );
}