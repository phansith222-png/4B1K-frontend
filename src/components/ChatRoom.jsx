import React, { useEffect, useState, useRef } from 'react';
import { useSocket } from '../contexts/SocketContext';

export default function ChatRoom({ roomId, currentUserId }) {
  const socket = useSocket();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null); // เอาไว้เลื่อนจอลงมาล่างสุดอัตโนมัติ

  useEffect(() => {
    if (!socket) return;

    // 1. สั่ง Join ห้องเมื่อเปิด Component นี้
    socket.emit('join_room', roomId);

    // 2. รอรับข้อความใหม่
    socket.on('receive_message', (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
    });

    // 3. Cleanup: ป้องกัน Event ซ้ำซ้อนตอนเปลี่ยนหน้า
    return () => {
      socket.off('receive_message');
    };
  }, [socket, roomId]);

  // เลื่อนหน้าจอลงล่างสุดเมื่อมีข้อความใหม่
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (input.trim() === '') return;

    // ส่งข้อความไปที่ Server
    socket.emit('send_message', {
      content: input,
      chatRoomId: roomId,
    });
    
    setInput(''); // เคลียร์ช่องพิมพ์
  };

  return (
    <div className="chat-container" style={{ border: '1px solid #ccc', padding: '10px', height: '400px', display: 'flex', flexDirection: 'column' }}>
      
      {/* โซนแสดงข้อความ (MessageList) */}
      <div className="message-list" style={{ flex: 1, overflowY: 'auto', marginBottom: '10px' }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{ textAlign: msg.senderId === currentUserId ? 'right' : 'left' }}>
            <span style={{ 
              background: msg.senderId === currentUserId ? '#dcf8c6' : '#fff', 
              padding: '5px 10px', 
              borderRadius: '10px',
              display: 'inline-block',
              margin: '5px'
            }}>
              {msg.content}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* โซนพิมพ์ข้อความ (MessageInput) */}
      <form onSubmit={handleSendMessage} style={{ display: 'flex' }}>
        <input 
          type="text" 
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          style={{ flex: 1, padding: '10px' }}
          placeholder="พิมพ์ข้อความ..."
        />
        <button type="submit" style={{ padding: '10px 20px' }}>ส่ง</button>
      </form>
    </div>
  );
}