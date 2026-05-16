import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import useUserStore from '../stores/userStore';
import { SOCKET_URL } from '../config/env';
import { STORAGE_KEYS } from '../config/constants';

const SocketContext = createContext();
export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    const authData = localStorage.getItem(STORAGE_KEYS.AUTH);
    let token = null;

    if (authData) {
      try {
        const parsedData = JSON.parse(authData);
        token = parsedData.state?.token;
      } catch (error) {
        console.error("Socket auth parse error:", error);
      }
    }

    if (!token) return;

    const newSocket = io(SOCKET_URL, {
      auth: { token },
      reconnection: true,
      reconnectionAttempts: 5,
    });

    newSocket.on("connect", () => {
      setSocket(newSocket);
    });

    newSocket.on("connect_error", (err) => {
      console.error("Socket connection failed:", err.message);
    });

    newSocket.on("disconnect", () => {
      setSocket(null);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [user, SOCKET_URL]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
