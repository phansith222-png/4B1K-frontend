import { useState, useEffect } from "react";
import mainapi from "../../api/auth";

export function useChatContacts({ socket, connected }) {
  const [contacts, setContacts] = useState([]);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [isLoadingContacts, setIsLoadingContacts] = useState(true);

  useEffect(() => {
    mainapi
      .get("/chats/rooms")
      .then((r) => {
        setContacts(r.data);
        const initialUnread = {};
        r.data.forEach((room) => {
          if (room.unreadCount > 0) initialUnread[room.id] = room.unreadCount;
        });
        setUnreadCounts((prev) => ({ ...prev, ...initialUnread }));
      })
      .catch(console.error)
      .finally(() => setIsLoadingContacts(false));
  }, []);

  useEffect(() => {
    if (socket && connected && contacts.length > 0) {
      contacts.forEach((room) => socket.emit("join_room", String(room.id)));
    }
  }, [socket, connected, contacts]);

  return { contacts, setContacts, unreadCounts, setUnreadCounts, isLoadingContacts };
}
