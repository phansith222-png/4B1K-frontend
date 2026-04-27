import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import mainapi from "../api/auth";
import { useSocket } from "../contexts/SocketContext";
import useUserStore from "../stores/userStore";
import { avatarUrl } from "../utils/chatUtils";

// Import new modular components
import ChatSidebar from "../components/chat/ChatSidebar";
import ChatArea from "../components/chat/ChatArea";
import BackButton from "../components/BackButton";
import { useCyberToast } from "../components/CyberToast";
import CyberConfirmModal from "../components/chat/CyberConfirmModal";
import UserProfileModal from "../components/chat/UserProfileModal";

export default function ChatPage() {
  const socket = useSocket();
  const user = useUserStore((s) => s.user);
  const { showToast } = useCyberToast();
  const myUserId = user?.id || user?._id;

  const [activeChat, setActiveChat] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [inputText, setInputText] = useState("");
  const [connected, setConnected] = useState(false);
  const [typingText, setTypingText] = useState("");
  const [tab, setTab] = useState("community");
  const [search, setSearch] = useState("");
  const [showSidebar, setShowSidebar] = useState(true); // mobile toggle
  const [showEmoji, setShowEmoji] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isLoadingContacts, setIsLoadingContacts] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: "", message: "", onConfirm: () => { } });
  const [viewingUser, setViewingUser] = useState(null);

  const scrollRef = useRef(null);
  const chatContainerRef = useRef(null);
  const prevLenRef = useRef(0);
  const typingTimer = useRef(null);
  const emojiRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);
  const activeChatRef = useRef(activeChat);

  useEffect(() => {
    activeChatRef.current = activeChat;
  }, [activeChat]);

  const activeRoom = contacts.find((r) => r.id === activeChat);
  // Rely on isGroup value from DB as primary source of truth
  const isGroup = activeRoom?.isGroup ?? false;
  const other = !isGroup ? activeRoom?.users?.find((u) => u.userId !== myUserId)?.user : null;
  const roomName = isGroup ? (activeRoom?.name || `Group ${activeRoom?.id}`) : (other?.username || other?.firstName || "Loading...");
  const roomAvatar = avatarUrl(roomName, isGroup ? activeRoom?.profileImage : other?.profileImage);
  const myName = user?.username || user?.firstName || "U";
  const myAvatar = avatarUrl(myName, user?.profileImage);

  const handleAvatarClick = () => {
    if (isGroup) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !activeChat) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      await mainapi.patch(`/chats/rooms/${activeChat}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const res = await mainapi.get("/chats/rooms");
      setContacts(res.data);
    } catch (err) {
      console.error("Failed to update avatar:", err);
      showToast("Unable to update profile picture at this time.", "error");
    }
  };

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    if (!newRoomName.trim() || isCreating) return;

    setIsCreating(true);
    try {
      const res = await mainapi.post("/chats/rooms", {
        name: newRoomName.trim(),
        type: "community",
      });
      setContacts((prev) => [res.data, ...prev]);
      setIsCreateModalOpen(false);
      setNewRoomName("");
      setActiveChat(res.data.id);
    } catch (err) {
      console.error("Failed to create room:", err);
      showToast("Unable to create chat room at this time.", "error");
    } finally {
      setIsCreating(false);
    }
  };

  const startPrivateChat = async (friendId) => {
    if (!friendId || friendId === myUserId) return;
    try {
      // 1. Call API to find or create a private room
      const res = await mainapi.post("/chats/personal", { friendId });

      // 2. Refresh the room list to include the new/updated room
      const listRes = await mainapi.get("/chats/rooms");
      setContacts(listRes.data);

      // 3. Navigate to the private room
      setActiveChat(res.data.id);

      // 4. Automatically switch to the "Personal" tab
      setTab("personal");

      // 5. On mobile, hide the sidebar
      if (window.innerWidth < 768) {
        setShowSidebar(false);
      } else {
        setShowSidebar(true);
      }
    } catch (err) {
      console.error("Failed to start private chat:", err);
      showToast("Unable to start private chat at this time.", "error");
    }
  };

  const handleRenameGroup = async (newName) => {
    if (!activeChat) return;
    try {
      await mainapi.patch(`/chats/rooms/${activeChat}`, { roomName: newName });
      setContacts(prev => prev.map(c => 
        String(c.id) === String(activeChat) ? { ...c, roomName: newName } : c
      ));
      showToast("Group renamed successfully!", "success");
    } catch (err) {
      console.error("Failed to rename group:", err);
      showToast("Unable to rename group at this time.", "error");
    }
  };

  const handleDeleteRoom = () => {
    const title = isGroup ? "Delete Group" : "Delete Chat";
    const message = isGroup
      ? "Are you sure you want to delete this group? All members will be removed and messages will be lost forever."
      : "Are you sure you want to delete this conversation? Your chat history will be permanently cleared.";

    setConfirmModal({
      isOpen: true,
      title,
      message,
      onConfirm: async () => {
        try {
          if (isGroup) {
            socket.emit("delete_group", { roomId: activeChat, userId: myUserId });
          } else {
            await mainapi.delete(`/chats/rooms/${activeChat}`);
            setContacts((prev) => prev.filter((c) => c.id !== activeChat));
            setActiveChat(null);
            showToast("Conversation deleted successfully.");
          }
        } catch (err) {
          console.error("Failed to delete room:", err);
          showToast("Unable to delete at this time.", "error");
        }
      }
    });
  };

  // close emoji picker on outside click
  useEffect(() => {
    if (!showEmoji) return;
    const handler = (e) => {
      if (emojiRef.current && !emojiRef.current.contains(e.target)) setShowEmoji(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showEmoji]);

  const scrollToBottom = useCallback(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, []);

  const handleReceive = useCallback((msg) => {
    const rid = String(msg.chatRoomId);
    const currentActiveChat = String(activeChatRef.current);

    if (rid === currentActiveChat) {
      setMessages((ms) => {
        if (ms.some((m) => m.id === msg.id)) return ms;
        return [...ms.filter((m) => !(m.isOptimistic && m.content === msg.content)),
        { ...msg, isSent: true, isOptimistic: false }];
      });
      socket?.emit("mark_read", { chatRoomId: rid, userId: myUserId, lastMessageId: msg.id });
    } else {
      if (msg.senderId !== myUserId) {
        setUnreadCounts((u) => ({ ...u, [rid]: (u[rid] || 0) + 1 }));
      }
    }
  }, [socket, myUserId]);

  const handleRead = useCallback(({ chatRoomId, readByUserId }) => {
    setActiveChat((prev) => {
      if (String(chatRoomId) === String(prev) && readByUserId !== myUserId)
        setMessages((ms) => ms.map((m) => ({ ...m, isRead: true })));
      return prev;
    });
  }, [myUserId]);

  useEffect(() => {
    if (!socket) return;
    const onTyping = (d) => setActiveChat((p) => {
      if (String(d.roomId) === String(p)) setTypingText(`${d.user} is typing...`);
      return p;
    });
    const onGroupDeleted = (data) => {
      showToast("This group has been deleted by the creator.", "error");
      setActiveChat((prev) => {
        if (String(data.roomId) === String(prev)) return null;
        return prev;
      });
      mainapi.get("/chats/rooms").then((r) => setContacts(r.data)).catch(console.error);
    };

    socket.on("connect", () => {
      setConnected(true);
    });
    socket.on("disconnect", () => setConnected(false));
    socket.on("receive_message", handleReceive);
    socket.on("message_read", handleRead);
    socket.on("display_typing", onTyping);
    socket.on("hide_typing", () => setTypingText(""));
    socket.on("group_deleted", onGroupDeleted);
    setConnected(socket.connected);
    return () => {
      socket.off("connect"); socket.off("disconnect");
      socket.off("receive_message", handleReceive);
      socket.off("message_read", handleRead);
      socket.off("display_typing", onTyping);
      socket.off("hide_typing");
      socket.off("group_deleted", onGroupDeleted);
    };
  }, [socket, handleReceive, handleRead]);

  useEffect(() => {
    mainapi.get("/chats/rooms").then((r) => {
      setContacts(r.data);
      const initialUnread = {};
      r.data.forEach(room => {
        if (room.unreadCount > 0) {
          initialUnread[room.id] = room.unreadCount;
        }
      });
      setUnreadCounts(prev => ({ ...prev, ...initialUnread }));
    }).catch(console.error)
      .finally(() => setIsLoadingContacts(false));
  }, []); // Remove socket dependency as we handle join separately

  // Dedicated effect to join rooms when socket is connected and contacts are loaded
  useEffect(() => {
    if (socket && connected && contacts.length > 0) {
      contacts.forEach(room => {
        socket.emit("join_room", String(room.id));
      });
    }
  }, [socket, connected, contacts]);

  useEffect(() => {
    if (!activeChat) {
      setMessages([]);
      setIsLoadingMessages(false);
      return;
    }

    let isCurrent = true;
    prevLenRef.current = 0;
    setTypingText("");
    setUnreadCounts((u) => ({ ...u, [activeChat]: 0 }));
    setMessages([]); 
    setIsLoadingMessages(true);

    mainapi.get(`/chats/${activeChat}/messages`)
      .then((r) => {
        if (!isCurrent) return;
        setMessages(r.data.map((m) => ({ ...m, isSent: true })));
        
        // Robust first-time scroll
        setTimeout(() => { if (isCurrent) scrollToBottom(); }, 50);
        setTimeout(() => { if (isCurrent) scrollToBottom(); }, 200);
        setTimeout(() => { if (isCurrent) scrollToBottom(); }, 500);

        if (r.data.length > 0 && socket) {
          const lastMsg = r.data[r.data.length - 1];
          socket.emit("mark_read", { chatRoomId: activeChat, userId: myUserId, lastMessageId: lastMsg.id });
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

    if (socket) {
      socket.emit("join_room", String(activeChat));
    }
    
    return () => { isCurrent = false; };
  }, [socket, activeChat, myUserId, scrollToBottom]);

  useEffect(() => {
    if (messages.length > 0) {
      const timer = setTimeout(() => scrollToBottom(), 50);
      return () => clearTimeout(timer);
    }
    prevLenRef.current = messages.length;
  }, [messages, scrollToBottom]);

  const send = (e) => {
    e.preventDefault();
    const text = inputText.trim();
    if (!text || !connected || !activeChat) return;
    clearTimeout(typingTimer.current);
    socket.emit("stop_typing", { chatRoomId: activeChat });
    const payload = {
      id: `tmp-${Date.now()}`, chatRoomId: activeChat, senderId: myUserId,
      content: text, createdAt: new Date().toISOString(),
      isOptimistic: true, isSent: false, isRead: false,
      sender: { username: user?.username || user?.firstName, profileImage: user?.profileImage },
    };
    setMessages((ms) => [...ms, payload]);

    // Update the room's last activity date to move it to the top in the sidebar
    setContacts((prev) => prev.map((c) =>
      String(c.id) === String(activeChat) ? { ...c, lastMessageAt: payload.createdAt } : c
    ));

    setInputText("");
    scrollToBottom("smooth");
    socket.emit("send_message", payload);
  };

  const onInput = (e) => {
    setInputText(e.target.value);
    if (!socket || !activeChat || !connected) return;
    socket.emit("typing", { chatRoomId: String(activeChat), userName: user?.username || "User" });
    clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => socket.emit("stop_typing", { chatRoomId: activeChat }), 1500);
  };

  const grouped = useMemo(() => messages.map((m, i) => {
    const isMe = m.senderId === myUserId;
    const prev = messages[i - 1];
    const isNewDay = !prev || new Date(m.createdAt).toDateString() !== new Date(prev.createdAt).toDateString();

    return { ...m, isMe, isGrouped: false, showAvatar: true, showDateDivider: isNewDay };
  }), [messages, myUserId]);

  const filtered = useMemo(() => {
    // 1. Filter by Tab
    let result = contacts.filter((r) => tab === "community" ? r.isGroup : !r.isGroup);

    // 2. Apply Search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((r) => {
        const otherUser = r.users?.find((u) => u.userId !== myUserId)?.user;
        const name = r.isGroup ? r.name : (otherUser?.username || otherUser?.firstName || "");
        return (name || "").toLowerCase().includes(q);
      });
    }

    // 3. Sort strictly by newest date (last message or update)
    return [...result].sort((a, b) => {
      const dateA = new Date(a.lastMessageAt || a.updatedAt || 0).getTime();
      const dateB = new Date(b.lastMessageAt || b.updatedAt || 0).getTime();
      return dateB - dateA;
    });
  }, [contacts, search, tab, myUserId, unreadCounts]);

  const openChat = (id) => { setActiveChat(id); setShowSidebar(false); };
  const goBack = () => { setActiveChat(null); setShowSidebar(true); };
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <div className="flex h-[100dvh] w-full overflow-hidden bg-[#0B0C10] text-gray-100" style={{ fontFamily: "'Inter', sans-serif" }}>
      <AnimatePresence mode="wait">
        {(showSidebar || !isMobile) && (
          <motion.div
            key="sidebar"
            initial={isMobile ? { x: -300, opacity: 0 } : false}
            animate={{ x: 0, opacity: 1 }}
            exit={isMobile ? { x: -300, opacity: 0 } : false}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className={`${isMobile ? "fixed inset-0 z-50" : "relative w-[380px] shrink-0"} h-full bg-[#0B0C10]`}
          >
            <ChatSidebar
              showSidebar={true} // Now managed by ChatPage's AnimatePresence
              connected={connected}
              search={search}
              setSearch={setSearch}
              tab={tab}
              setTab={setTab}
              filteredContacts={filtered}
              activeChat={activeChat}
              unreadCounts={unreadCounts}
              openChat={openChat}
              myUserId={myUserId}
              myName={myName}
              myAvatar={myAvatar}
              user={user}
              setIsCreateModalOpen={setIsCreateModalOpen}
              isLoading={isLoadingContacts}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {(!showSidebar || activeChat || !isMobile) && (
          <motion.div
            key="chat-area-container"
            initial={isMobile ? { x: 300, opacity: 0 } : { x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={isMobile ? { x: 300, opacity: 0 } : { x: 20, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="flex-1 h-full"
          >
            <ChatArea
              activeChat={activeChat}
              showSidebar={showSidebar}
              isGroup={isGroup}
              roomName={roomName}
              roomAvatar={roomAvatar}
              activeRoom={activeRoom}
              myUserId={myUserId}
              myAvatar={myAvatar}
              typingText={typingText}
              connected={connected}
              messagesGrouped={grouped}
              inputText={inputText}
              showEmoji={showEmoji}
              setShowEmoji={setShowEmoji}
              setInputText={setInputText}
              onInput={onInput}
              send={send}
              goBack={goBack}
              handleAvatarClick={handleAvatarClick}
              fileInputRef={fileInputRef}
              handleFileChange={handleFileChange}
              handleDeleteRoom={handleDeleteRoom}
              startPrivateChat={startPrivateChat}
              scrollRef={scrollRef}
              emojiRef={emojiRef}
              inputRef={inputRef}
              isLoading={isLoadingMessages}
              onImageClick={setSelectedImage}
              chatContainerRef={chatContainerRef}
              onAvatarClick={setViewingUser}
              onRenameGroup={handleRenameGroup}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ... (Modal remains the same) */}

      {/* ── Create Room Modal ── */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-[#1A1C23] border border-white/5 rounded-2xl p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-gray-100 mb-1">Create New Community</h3>
            <p className="text-sm text-gray-500 mb-6">Start a space to chat with other members.</p>

            <form onSubmit={handleCreateRoom}>
              <div className="mb-6">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Room Name</label>
                <input
                  autoFocus
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  placeholder="e.g. Music Lovers, Weekend Events..."
                  className="w-full bg-[#2a2d35] border border-white/5 rounded-xl px-4 py-3 text-sm text-gray-200 outline-none focus:border-[#7000FF]/50 focus:ring-1 focus:ring-[#7000FF]/20 transition-all"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => { setIsCreateModalOpen(false); setNewRoomName(""); }}
                  className="flex-1 py-3 rounded-xl text-sm font-bold text-gray-400 hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newRoomName.trim() || isCreating}
                  className="flex-1 py-3 rounded-xl text-sm font-bold bg-[#7000FF] hover:bg-[#8220FF] text-white shadow-lg shadow-[#7000FF]/30 disabled:opacity-50 disabled:shadow-none transition-all"
                >
                  {isCreating ? "Creating..." : "Create Room"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Image Lightbox ── */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-[1000] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 md:p-12 cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-full max-h-full"
              onClick={e => e.stopPropagation()}
            >
              <img
                src={selectedImage}
                alt="Fullscreen Preview"
                className="max-w-full max-h-[90dvh] rounded-2xl shadow-[0_0_100px_rgba(0,0,0,0.5)] border border-white/10"
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-12 right-0 text-white/60 hover:text-white flex items-center gap-2 group transition-colors"
              >
                <span className="text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Close Terminal</span>
                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M6 18L18 6M6 6l12 12" /></svg>
                </div>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Confirm Modal ── */}
      <CyberConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
      />

      {/* ── User Profile Modal ── */}
      <UserProfileModal
        isOpen={!!viewingUser}
        onClose={() => setViewingUser(null)}
        user={viewingUser}
        onChat={startPrivateChat}
      />
    </div>
  );
}
