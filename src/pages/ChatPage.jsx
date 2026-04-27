import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import mainapi from "../api/auth";
import { useSocket } from "../contexts/SocketContext";
import useUserStore from "../stores/userStore";
import { avatarUrl } from "../utils/chatUtils";

// Import new modular components
import ChatSidebar from "../components/chat/ChatSidebar";
import ChatArea from "../components/chat/ChatArea";

export default function ChatPage() {
  const socket = useSocket();
  const user = useUserStore((s) => s.user);
  const myUserId = user?.id;
  const messageImageInputRef = useRef(null);

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

  const scrollRef = useRef(null);
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
  // เชื่อใจค่า isGroup จาก DB เป็นหลัก
  const isGroup = activeRoom?.isGroup ?? false;
  const other = !isGroup ? activeRoom?.users?.find((u) => u.userId !== myUserId)?.user : null;
  const roomName = isGroup ? (activeRoom?.name || `กลุ่ม ${activeRoom?.id}`) : (other?.firstName ? `${other.firstName} ${other.lastName || ''}`.trim() : other?.username || "กำลังโหลด...");
  const roomAvatar = avatarUrl(roomName, isGroup ? activeRoom?.coverImage : other?.profileImage);
  const myName = (user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user?.username) || "U";
  const myAvatar = avatarUrl(myName, user?.profileImage);

  const handleAvatarClick = () => {
    if (isGroup) {
      if (activeRoom?.creatorId === myUserId) {
        fileInputRef.current?.click();
      } else {
        alert("เฉพาะผู้สร้างห้องเท่านั้นที่สามารถเปลี่ยนรูปได้");
      }
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !activeChat) return;

    // Convert to base64
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result;
      
      try {
        await mainapi.patch(`/chats/rooms/${activeChat}/avatar`, {
          coverImage: base64String
        });
        const res = await mainapi.get("/chats/rooms");
        setContacts(res.data);
      } catch (err) {
        console.error("Failed to update avatar:", err);
        alert("ไม่สามารถเปลี่ยนรูปโปรไฟล์ได้ในขณะนี้");
      }
    };
    reader.readAsDataURL(file);
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
      alert("ไม่สามารถสร้างห้องแชทได้ในขณะนี้");
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
      
      // 4. Automatically switch to the "Personal" tab so the user sees the active chat in the sidebar
      setTab("personal");
      
      // 5. On mobile, hide the sidebar to show the chat area
      if (window.innerWidth < 768) {
        setShowSidebar(false);
      } else {
        setShowSidebar(true);
      }
    } catch (err) {
      console.error("Failed to start private chat:", err);
      alert("ไม่สามารถเริ่มแชทส่วนตัวได้ในขณะนี้");
    }
  };

  const handleDeleteRoom = async () => {
    const confirmMsg = isGroup 
      ? "คุณแน่ใจหรือไม่ว่าต้องการลบกลุ่มนี้? ข้อมูลทั้งหมดจะสูญหาย" 
      : "คุณแน่ใจหรือไม่ว่าต้องการลบการสนทนานี้? ข้อความทั้งหมดจะถูกลบถาวร";
      
    if (window.confirm(confirmMsg)) {
      try {
        if (isGroup) {
          // ถ้าเป็นกลุ่ม ใช้ socket เพื่อแจ้งเตือนทุกคนในกลุ่ม
          socket.emit("delete_group", { roomId: activeChat, userId: myUserId });
        } else {
          // ถ้าเป็นแชทส่วนตัว ใช้ API ลบปกติ
          await mainapi.delete(`/chats/rooms/${activeChat}`);
          // อัปเดต UI ฝั่งเรา
          setContacts((prev) => prev.filter((c) => c.id !== activeChat));
          setActiveChat(null);
          alert("ลบการสนทนาเรียบร้อยแล้ว");
        }
      } catch (err) {
        console.error("Failed to delete room:", err);
        alert("ไม่สามารถลบได้ในขณะนี้");
      }
    }
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

  const scrollToBottom = useCallback((b = "auto") => {
    setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: b, block: "end" }), 80);
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
      if (String(d.roomId) === String(p)) setTypingText(`${d.user} กำลังพิมพ์...`);
      return p;
    });
    const onGroupDeleted = (data) => {
      alert("กลุ่มนี้ถูกลบโดยผู้สร้างแล้ว");
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
    }).catch(console.error);
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
    if (!socket || !activeChat) return;
    prevLenRef.current = 0;
    setTypingText("");
    setUnreadCounts((u) => ({ ...u, [activeChat]: 0 }));
    mainapi.get(`/chats/${activeChat}/messages`)
      .then((r) => { 
        setMessages(r.data.map((m) => ({ ...m, isSent: true }))); 
        scrollToBottom(); 
        if (r.data.length > 0) {
          const lastMsg = r.data[r.data.length - 1];
          socket.emit("mark_read", { chatRoomId: activeChat, userId: myUserId, lastMessageId: lastMsg.id });
        }
      })
      .catch(console.error);
    socket.emit("join_room", String(activeChat));
  }, [socket, activeChat, myUserId, scrollToBottom]);

  useEffect(() => {
    if (messages.length > prevLenRef.current && prevLenRef.current !== 0) scrollToBottom("smooth");
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
      sender: { username: user?.username, firstName: user?.firstName, lastName: user?.lastName, profileImage: user?.profileImage },
    };
    setMessages((ms) => [...ms, payload]);
    setInputText("");
    scrollToBottom("smooth");
    socket.emit("send_message", payload);
  };

  const handleMessageImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !activeChat || !connected) return;
    
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const base64Data = reader.result;
        // Temporary optimistic payload
        const payload = {
          id: `tmp-${Date.now()}`, chatRoomId: activeChat, senderId: myUserId,
          content: "[IMAGE]:" + base64Data, createdAt: new Date().toISOString(),
          isOptimistic: true, isSent: false, isRead: false,
          sender: { username: user?.username, firstName: user?.firstName, lastName: user?.lastName, profileImage: user?.profileImage },
        };
        setMessages((ms) => [...ms, payload]);
        scrollToBottom("smooth");

        // Upload to backend
        const res = await mainapi.post(`/chats/rooms/${activeChat}/messages/image`, { image: base64Data });
        const imageUrl = res.data.imageUrl;

        // Emit real message
        const realPayload = {
          ...payload,
          content: "[IMAGE]:" + imageUrl,
        };

        // Update the optimistic message in state so that handleReceive can filter it out by matching content
        setMessages((ms) => ms.map(m => m.id === payload.id ? { ...m, content: "[IMAGE]:" + imageUrl } : m));

        socket.emit("send_message", realPayload);
        
        // Let handleReceive update the temporary payload when server acknowledges
      } catch (err) {
        console.error("Failed to upload image:", err);
        alert("ไม่สามารถส่งรูปภาพได้");
        // Remove temporary message on failure
        setMessages((ms) => ms.filter(m => !(m.isOptimistic && m.content.startsWith("[IMAGE]:") && m.id > payload.id - 100)));
      }
    };
    reader.readAsDataURL(file);
    // clear input
    if (messageImageInputRef.current) messageImageInputRef.current.value = "";
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
    // Always show avatar for every message as requested
    return { ...m, isMe, isGrouped: false, showAvatar: true };
  }), [messages, myUserId]);

  const filtered = useMemo(() => {
    // กรองตาม Tab (ใช้ isGroup จาก DB ตรงๆ)
    const byTab = contacts.filter((r) => tab === "community" ? r.isGroup : !r.isGroup);

    if (!search.trim()) return byTab;
    const q = search.toLowerCase();
    return byTab.filter((r) => {
      const otherUser = r.users?.find((u) => u.userId !== myUserId)?.user;
      const name = r.isGroup ? r.name : (otherUser?.username || otherUser?.firstName || "");
      return (name || "").toLowerCase().includes(q);
    });
  }, [contacts, search, tab, myUserId]);

  const openChat = (id) => { setActiveChat(id); setShowSidebar(false); };
  const goBack = () => { setActiveChat(null); setShowSidebar(true); };

  return (
    <div className="flex h-full w-full overflow-hidden bg-[#13141a] text-gray-100" style={{ fontFamily: "'Inter', sans-serif" }}>
      <ChatSidebar
        showSidebar={showSidebar}
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
      />

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
        messageImageInputRef={messageImageInputRef}
        handleMessageImageChange={handleMessageImageChange}
      />

      {/* ── Create Room Modal ── */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="w-full max-w-sm relative group animate-in zoom-in-90 slide-in-from-bottom-8 duration-500 ease-out">
            {/* Grand Glowing Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 rounded-[20px] blur opacity-40 group-hover:opacity-70 transition duration-1000"></div>
            
            <div className="relative bg-[#13141a]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-7 shadow-2xl">
              <div className="mb-8 text-center">
                <div className="w-16 h-16 mx-auto bg-gradient-to-tr from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-purple-500/30 transform rotate-3">
                  <span className="text-3xl filter drop-shadow-md -rotate-3">🚀</span>
                </div>
                <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 tracking-tight mb-2">
                  Create Community
                </h3>
                <p className="text-[13px] text-gray-400 font-medium">Start a new space for conversations and connections.</p>
              </div>

              <form onSubmit={handleCreateRoom}>
                <div className="mb-8">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Community Name</label>
                  <input
                    autoFocus
                    value={newRoomName}
                    onChange={(e) => setNewRoomName(e.target.value)}
                    placeholder="e.g., Gaming Lounge, Tech Talk..."
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-gray-100 outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all placeholder-gray-600 font-medium"
                  />
                </div>

                <div className="flex gap-3 pt-2 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => { setIsCreateModalOpen(false); setNewRoomName(""); }}
                    className="flex-1 py-3.5 rounded-xl text-sm font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!newRoomName.trim() || isCreating}
                    className="flex-1 py-3.5 rounded-xl text-sm font-bold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg shadow-purple-600/25 disabled:opacity-50 disabled:shadow-none transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                  >
                    {isCreating ? "Creating..." : "Create"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
