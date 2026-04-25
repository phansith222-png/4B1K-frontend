import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import useUserStore from '../stores/userStore';

const SocketContext = createContext();
export const useSocket = () => useContext(SocketContext);

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    console.log("🔍 [SocketDebug] useEffect triggered! User data:", user);

    const authData = localStorage.getItem('auth-storage');
    let token = null;

    if (authData) {
      try {
        const parsedData = JSON.parse(authData);
        token = parsedData.state?.token;
        console.log("🔍 [SocketDebug] Token found in Storage:", token ? "YES" : "NO");
      } catch (error) {
        console.error("❌ [SocketDebug] JSON Parse Error:", error);
      }
    }

    if (!token) {
      console.warn("⚠️ [SocketDebug] Execution stopped: No Token found in localStorage");
      return;
    }

    // Create Connection
    console.log(`🚀 [SocketDebug] Attempting to connect to ${API_URL} ...`);
    const newSocket = io(API_URL, {
      auth: { token },
      reconnection: true,
      reconnectionAttempts: 5,
    });

    newSocket.on("connect", () => {
      console.log("✅ [SocketDebug] Connected successfully! ID:", newSocket.id);
      setSocket(newSocket);
    });

    newSocket.on("connect_error", (err) => {
      console.error("❌ [SocketDebug] Connection failed:", err.message);
    });

    newSocket.on("disconnect", (reason) => {
      console.log("🟡 [SocketDebug] Disconnected:", reason);
      setSocket(null);
    });

    return () => {
      console.log("🧹 [SocketDebug] Cleanup: Closing Socket");
      newSocket.disconnect();
    };
  }, [user]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
