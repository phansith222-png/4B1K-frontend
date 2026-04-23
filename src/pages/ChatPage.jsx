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

  const activeRoom = contacts.find((r) => r.id === activeChat);
  const isGroup = activeRoom?.type === "community" || activeRoom?.name || (activeRoom?.participants?.length ?? 0) > 2;
  const other = !isGroup ? activeRoom?.participants?.find((p) => p.id !== myUserId) : null;
  const roomName = activeRoom?.name || other?.username || other?.firstName || (activeRoom ? `ห้อง ${activeRoom.id}` : "");
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
      alert("ไม่สามารถเปลี่ยนรูปโปรไฟล์ได้ในขณะนี้");
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
      alert("ไม่สามารถสร้างห้องแชทได้ในขณะนี้");
    } finally {
      setIsCreating(false);
    }
  };

  const startPrivateChat = async (friendId) => {
    if (!friendId || friendId === myUserId) return;
    try {
      const res = await mainapi.post("/chats/personal", { friendId });
      const listRes = await mainapi.get("/chats/rooms");
      setContacts(listRes.data);
      setActiveChat(res.data.id);
      setTab("personal");
      if (window.innerWidth < 768) setShowSidebar(false);
    } catch (err) {
      console.error("Failed to start private chat:", err);
    }
  };

  const handleDeleteGroup = () => {
    if (window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบกลุ่มนี้? ข้อมูลทั้งหมดจะสูญหาย")) {
      socket.emit("delete_group", { roomId: activeChat, userId: myUserId });
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
    setActiveChat((prev) => {
      if (rid === String(prev)) {
        setMessages((ms) => {
          if (ms.some((m) => m.id === msg.id)) return ms;
          return [...ms.filter((m) => !(m.isOptimistic && m.content === msg.content)),
            { ...msg, isSent: true, isOptimistic: false }];
        });
        socket?.emit("mark_read", { chatRoomId: rid, userId: myUserId });
      } else {
        setUnreadCounts((u) => ({ ...u, [rid]: (u[rid] || 0) + 1 }));
      }
      return prev;
    });
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

    socket.on("connect", () => setConnected(true));
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
    mainapi.get("/chats/rooms").then((r) => setContacts(r.data)).catch(console.error);
  }, []);

  useEffect(() => {
    if (!socket || !activeChat) return;
    prevLenRef.current = 0;
    setTypingText("");
    setUnreadCounts((u) => ({ ...u, [activeChat]: 0 }));
    mainapi.get(`/chats/${activeChat}/messages`)
      .then((r) => { setMessages(r.data.map((m) => ({ ...m, isSent: true }))); scrollToBottom(); })
      .catch(console.error);
    socket.emit("join_room", String(activeChat));
    socket.emit("mark_read", { chatRoomId: activeChat, userId: myUserId });
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
      sender: { username: user?.username || user?.firstName, profileImage: user?.profileImage },
    };
    setMessages((ms) => [...ms, payload]);
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
    const prev = messages[i - 1];
    const isMe = m.senderId === myUserId;
    const same = prev?.senderId === m.senderId;
    const close = prev && new Date(m.createdAt) - new Date(prev.createdAt) < 300000;
    return { ...m, isMe, isGrouped: same && close, showAvatar: !same || !close };
  }), [messages, myUserId]);

  const filtered = useMemo(() => {
    const byTab = contacts.filter((r) => {
      const isCommunity = r.type === "community" || r.name || (r.participants?.length ?? 0) > 2;
      return tab === "community" ? isCommunity : !isCommunity;
    });
    if (!search.trim()) return byTab;
    const q = search.toLowerCase();
    return byTab.filter((r) => {
      const n = r.name || r.participants?.find((p) => p.id !== myUserId)?.username || "";
      return n.toLowerCase().includes(q);
    });
  }, [contacts, tab, search, myUserId]);

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
        handleDeleteGroup={handleDeleteGroup}
        startPrivateChat={startPrivateChat}
        scrollRef={scrollRef}
        emojiRef={emojiRef}
        inputRef={inputRef}
      />

      {/* ── Create Room Modal ── */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-[#1c1e26] border border-white/10 rounded-2xl p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-gray-100 mb-1">สร้างห้องชุมชนใหม่</h3>
            <p className="text-sm text-gray-500 mb-6">สร้างพื้นที่สำหรับพูดคุยกับสมาชิกคนอื่นๆ</p>

            <form onSubmit={handleCreateRoom}>
              <div className="mb-6">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">ชื่อห้อง</label>
                <input
                  autoFocus
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  placeholder="เช่น คนรักเสียงเพลง, กิจกรรมวันหยุด..."
                  className="w-full bg-[#2a2d35] border border-white/5 rounded-xl px-4 py-3 text-sm text-gray-200 outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => { setIsCreateModalOpen(false); setNewRoomName(""); }}
                  className="flex-1 py-3 rounded-xl text-sm font-bold text-gray-400 hover:bg-white/5 transition-all"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={!newRoomName.trim() || isCreating}
                  className="flex-1 py-3 rounded-xl text-sm font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 disabled:opacity-50 disabled:shadow-none transition-all"
                >
                  {isCreating ? "กำลังสร้าง..." : "สร้างห้อง"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}