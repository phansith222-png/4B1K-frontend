import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import mainapi from "../api/auth";
import { useSocket } from "../contexts/SocketContext";
import useUserStore from "../stores/userStore";
import { avatarUrl } from "../utils/chatUtils";

// Import new modular components
import ChatSidebar from "../components/chat/ChatSidebar";
import ChatArea from "../components/chat/ChatArea";
import { useCyberToast } from "../components/CyberToast";
import CyberConfirmModal from "../components/chat/CyberConfirmModal";
import UserProfileModal from "../components/chat/UserProfileModal";
import ConcertBackground from "../components/chat/ConcertBackground";
import CreateRoomModal from "../components/chat/CreateRoomModal";
import ImageLightbox from "../components/chat/ImageLightbox";

// Custom hooks
import { useChatContacts } from "../hooks/chat/useChatContacts";
import { useChatMessages } from "../hooks/chat/useChatMessages";
import { useChatSocket } from "../hooks/chat/useChatSocket";
import { useIsMobile } from "../hooks/useIsMobile";

export default function ChatPage() {
  const socket = useSocket();
  const user = useUserStore((s) => s.user);
  const { showToast } = useCyberToast();
  const myUserId = user?.id;
  const isMobile = useIsMobile();

  // ── UI state ──
  const [activeChat, setActiveChat] = useState(null);
  const [connected, setConnected] = useState(false);
  const [tab, setTab] = useState("community");
  const [search, setSearch] = useState("");
  const [showSidebar, setShowSidebar] = useState(true);
  const [showEmoji, setShowEmoji] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: "", message: "", onConfirm: () => {} });
  const [viewingUser, setViewingUser] = useState(null);

  const emojiRef = useRef(null);
  const fileInputRef = useRef(null);
  const activeChatRef = useRef(activeChat);

  useEffect(() => {
    activeChatRef.current = activeChat;
  }, [activeChat]);

  // ── Data hooks ──
  const { contacts, setContacts, unreadCounts, setUnreadCounts, isLoadingContacts } =
    useChatContacts({ socket, connected });

  const {
    setMessages,
    isLoadingMessages,
    inputText,
    setInputText,
    pendingImage,
    setPendingImage,
    typingText,
    setTypingText,
    send,
    onInput,
    handleMessageImageChange,
    grouped,
    scrollRef,
    chatContainerRef,
    inputRef,
    messageImageInputRef,
  } = useChatMessages({ socket, connected, activeChat, myUserId, user, showToast, setContacts, setUnreadCounts });

  // ── Socket callbacks ──
  const handleReceive = useCallback((msg) => {
    const rid = String(msg.chatRoomId);
    const currentActiveChat = String(activeChatRef.current);

    setContacts((prev) => prev.map((c) =>
      String(c.id) === rid ? { ...c, lastMessageAt: msg.createdAt } : c
    ));

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

  useChatSocket({ socket, handleReceive, handleRead, setConnected, setActiveChat, setContacts, showToast, setTypingText });

  // ── Emoji picker outside-click close ──
  useEffect(() => {
    if (!showEmoji) return;
    const handler = (e) => {
      if (emojiRef.current && !emojiRef.current.contains(e.target)) setShowEmoji(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showEmoji]);

  // ── Derived display values ──
  const activeRoom = contacts.find((r) => r.id === activeChat);
  const isGroup = activeRoom?.isGroup ?? false;
  const other = !isGroup ? activeRoom?.users?.find((u) => u.userId !== myUserId)?.user : null;
  const roomName = isGroup
    ? (activeRoom?.name || `กลุ่ม ${activeRoom?.id}`)
    : (other?.firstName ? `${other.firstName} ${other.lastName || ""}`.trim() : other?.username || "กำลังโหลด...");
  const roomAvatar = avatarUrl(roomName, isGroup ? activeRoom?.coverImage : other?.profileImage);
  const myName = (user?.firstName ? `${user.firstName} ${user.lastName || ""}`.trim() : user?.username) || "U";
  const myAvatar = avatarUrl(myName, user?.profileImage);

  // ── Room action handlers ──
  const handleRoomAvatarClick = () => {
    if (isGroup) {
      if (activeRoom?.creatorId === myUserId) {
        fileInputRef.current?.click();
      } else {
        showToast("เฉพาะผู้สร้างห้องเท่านั้นที่สามารถเปลี่ยนรูปได้", "error");
      }
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !activeChat) return;
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        await mainapi.patch(`/chats/rooms/${activeChat}/avatar`, { coverImage: reader.result });
        const res = await mainapi.get("/chats/rooms");
        setContacts(res.data);
      } catch (err) {
        console.error("Failed to update avatar:", err);
        showToast("ไม่สามารถเปลี่ยนรูปโปรไฟล์ได้ในขณะนี้", "error");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    if (!newRoomName.trim() || isCreating) return;
    setIsCreating(true);
    try {
      const res = await mainapi.post("/chats/rooms", { name: newRoomName.trim(), type: "community" });
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
      const res = await mainapi.post("/chats/personal", { friendId });
      const listRes = await mainapi.get("/chats/rooms");
      setContacts(listRes.data);
      setActiveChat(res.data.id);
      setTab("personal");
      setShowSidebar(!isMobile);
    } catch (err) {
      console.error("Failed to start private chat:", err);
      showToast("Unable to start private chat at this time.", "error");
    }
  };

  const handleRenameGroup = async (newName) => {
    if (!activeChat) return;
    try {
      await mainapi.patch(`/chats/rooms/${activeChat}`, { roomName: newName });
      setContacts((prev) =>
        prev.map((c) => String(c.id) === String(activeChat) ? { ...c, name: newName } : c)
      );
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
      },
    });
  };

  const handleUserAvatarClick = useCallback(async (userData) => {
    setViewingUser(userData);
    try {
      const res = await mainapi.get(`/users/${userData.id}`);
      setViewingUser(res.data);
    } catch (err) {
      console.error("Failed to fetch latest user details:", err);
    }
  }, []);

  const filtered = useMemo(() => {
    let result = contacts.filter((r) => tab === "community" ? r.isGroup : !r.isGroup);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((r) => {
        const otherUser = r.users?.find((u) => u.userId !== myUserId)?.user;
        const name = r.isGroup ? r.name : (otherUser?.username || otherUser?.firstName || "");
        return (name || "").toLowerCase().includes(q);
      });
    }
    return [...result].sort((a, b) => {
      const dateA = new Date(a.lastMessageAt || a.updatedAt || 0).getTime();
      const dateB = new Date(b.lastMessageAt || b.updatedAt || 0).getTime();
      return dateB - dateA;
    });
  }, [contacts, search, tab, myUserId, unreadCounts]);

  const goBack = () => { setActiveChat(null); setShowSidebar(true); };
  const openChat = (id) => { setActiveChat(id); if (isMobile) setShowSidebar(false); };

  return (
    <div className="flex h-full w-full bg-[#0B0C10] text-gray-200 overflow-hidden relative font-sans selection:bg-[#00E5FF]/30">
      <ConcertBackground />

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
              showSidebar={true}
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
            key="chat-area-wrapper"
            initial={isMobile ? { x: 300, opacity: 0 } : { opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={isMobile ? { x: 300, opacity: 0 } : { opacity: 0 }}
            transition={{ duration: 0.3 }}
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
              handleAvatarClick={handleRoomAvatarClick}
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
              onAvatarClick={handleUserAvatarClick}
              onRenameGroup={handleRenameGroup}
              messageImageInputRef={messageImageInputRef}
              handleMessageImageChange={handleMessageImageChange}
              pendingImage={pendingImage}
              setPendingImage={setPendingImage}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <CreateRoomModal
        isOpen={isCreateModalOpen}
        onClose={() => { setIsCreateModalOpen(false); setNewRoomName(""); }}
        newRoomName={newRoomName}
        setNewRoomName={setNewRoomName}
        onSubmit={handleCreateRoom}
        isCreating={isCreating}
      />

      <ImageLightbox src={selectedImage} onClose={() => setSelectedImage(null)} />

      <CyberConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
      />

      <UserProfileModal
        isOpen={!!viewingUser}
        onClose={() => setViewingUser(null)}
        user={viewingUser}
        onChat={startPrivateChat}
      />
    </div>
  );
}
