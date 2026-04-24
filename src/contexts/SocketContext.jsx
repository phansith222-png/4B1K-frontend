import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import useUserStore from '../stores/userStore';

const SocketContext = createContext();
export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    console.log("🔍 [SocketDebug] useEffect เริ่มทำงานแล้ว! ข้อมูล User คือ:", user);

    const authData = localStorage.getItem('auth-storage');
    let token = null;

    if (authData) {
      try {
        const parsedData = JSON.parse(authData);
        token = parsedData.state?.token;
        console.log("🔍 [SocketDebug] พบ Token ใน Storage:", token ? "YES" : "NO");
      } catch (error) {
        console.error("❌ [SocketDebug] JSON Parse Error:", error);
      }
    }

    if (!token) {
      console.warn("⚠️ [SocketDebug] หยุดทำงาน: ไม่พบ Token ใน localStorage");
      return;
    }

    // สร้างการเชื่อมต่อ
    console.log("🚀 [SocketDebug] กำลังพยายามเชื่อมต่อกับ http://localhost:5000 ...");
    const newSocket = io('http://localhost:5000', {
      auth: { token },
      // transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
    });

    newSocket.on("connect", () => {
      console.log("✅ [SocketDebug] เชื่อมต่อสำเร็จ! ID:", newSocket.id);
      setSocket(newSocket);
    });

    newSocket.on("connect_error", (err) => {
      console.error("❌ [SocketDebug] การเชื่อมต่อล้มเหลว:", err.message);
    });

    newSocket.on("disconnect", (reason) => {
      console.log("🟡 [SocketDebug] หลุดการเชื่อมต่อ:", reason);
      setSocket(null);
    });

    return () => {
      console.log("🧹 [SocketDebug] Cleanup: ปิด Socket");
      newSocket.disconnect();
    };
  }, [user]); // ทำงานใหม่ทุกครั้งที่ user เปลี่ยนสถานะ

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
