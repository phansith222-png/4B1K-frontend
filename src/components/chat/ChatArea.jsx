import React, { useState, useEffect, useLayoutEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ChatBubble from "./ChatBubble";
import EmojiPicker from "./EmojiPicker";

const TypingDots = () => (
  <span className="flex gap-[4px] items-center">
    {[0, 160, 320].map((d) => (
      <motion.span
        key={d}
        animate={{
          y: [0, -4, 0],
          opacity: [0.3, 1, 0.3]
        }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          delay: d / 1000
        }}
        className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] shadow-[0_0_8px_#00E5FF]"
      />
    ))}
  </span>
);

// ── Aggressive Scroll Anchor ──
const ChatArea = React.memo(({
  activeChat,
  showSidebar,
  isGroup,
  roomName,
  roomAvatar,
  activeRoom,
  myUserId,
  myAvatar,
  typingText,
  connected,
  messagesGrouped,
  inputText,
  showEmoji,
  setShowEmoji,
  setInputText,
  onInput,
  send,
  goBack,
  handleAvatarClick,
  fileInputRef,
  handleFileChange,
  handleDeleteRoom,
  startPrivateChat,
  scrollRef,
  emojiRef,
  inputRef,
  isLoading,
  onImageClick,
  chatContainerRef,
  onAvatarClick,
  onRenameGroup,
  messageImageInputRef,
  handleMessageImageChange,
  pendingImage,
  setPendingImage
}) => {
  const [showGroupMenu, setShowGroupMenu] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editName, setEditName] = useState("");

  // Force scroll to bottom on EVERY render to fight against layout shifts
  useLayoutEffect(() => {
    if (chatContainerRef.current) {
      const container = chatContainerRef.current;
      container.scrollTop = container.scrollHeight;
    }
  });

  // Secondary backup for messages changes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'auto', block: 'end' });
    }
  }, [messagesGrouped]);
  return (
    <motion.main
      initial={false}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="flex-1 flex flex-col min-w-0 bg-[#0B0C10] h-full relative overflow-hidden"
    >
      <AnimatePresence mode="wait">
        {activeChat ? (
          <motion.div
            key="active-chat"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col h-full w-full min-h-0"
          >
            {/* ── Fixed Header ── */}
            <header className="shrink-0 z-[100] border-b border-white/5 bg-[#0B0C10]/80 backdrop-blur-xl relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#7000FF]/10 to-[#00E5FF]/10 opacity-20" />
              <div className="absolute -bottom-[1px] left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#00E5FF]/40 to-transparent shadow-[0_0_15px_#00E5FF]" />
              
              {/* Animated Spotlights */}
              <motion.div 
                animate={{ 
                  x: [-200, 200, -200],
                  opacity: [0.2, 0.4, 0.2]
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-1/2 left-1/4 w-[400px] h-[200%] bg-[#7000FF]/20 blur-[120px] rotate-45 pointer-events-none" 
              />
              <motion.div 
                animate={{ 
                  x: [200, -200, 200],
                  opacity: [0.2, 0.4, 0.2]
                }}
                transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-1/2 right-1/4 w-[400px] h-[200%] bg-[#00E5FF]/20 blur-[120px] -rotate-45 pointer-events-none" 
              />

              <div className="flex items-center gap-4 px-4 md:px-6 py-3 md:py-4 relative z-10">
                {/* Back Arrow (LINE Style) */}
                <motion.button
                  whileHover={{ scale: 1.1, x: -2, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                  whileTap={{ scale: 0.9 }}
                  onClick={goBack}
                  className="p-2.5 -ml-2 rounded-2xl bg-white/5 border border-white/10 text-gray-400 hover:text-[#00E5FF] transition-all"
                  title="Go Back"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                </motion.button>

                <motion.div
                  layoutId={`avatar-${activeChat}`}
                  className="relative group cursor-pointer shrink-0"
                  onClick={handleAvatarClick}
                >
                  <div className="absolute -inset-1.5 bg-gradient-to-r from-[#7000FF] to-[#00E5FF] rounded-[22px] blur opacity-40 group-hover:opacity-100 animate-pulse transition duration-500" />
                  <div className={`relative w-13 h-13 rounded-[20px] overflow-hidden ring-1 ring-white/20 group-hover:ring-[#00E5FF] transition-all shadow-2xl ${isGroup ? "bg-gradient-to-br from-[#7000FF] to-[#9b4dff]" : ""}`}>
                    <img src={roomAvatar} className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110" alt="" />
                  </div>
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                </motion.div>

                <div className="flex-1 min-w-0 group/title relative">
                  <div className="flex items-center gap-2">
                    {isEditingName ? (
                      <input
                        autoFocus
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onBlur={() => {
                          if (editName.trim() !== "" && editName !== roomName) {
                            onRenameGroup?.(editName.trim());
                          }
                          setIsEditingName(false);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            if (editName.trim() !== "" && editName !== roomName) {
                              onRenameGroup?.(editName.trim());
                            }
                            setIsEditingName(false);
                          }
                          if (e.key === "Escape") {
                            setEditName(roomName);
                            setIsEditingName(false);
                          }
                        }}
                        className="bg-white/5 border border-[#00E5FF]/30 rounded-lg px-2 py-1 text-lg font-black text-white outline-none focus:ring-1 focus:ring-[#00E5FF] w-full max-w-[300px]"
                      />
                    ) : (
                      <div className="flex items-center gap-2 group/title">
                        <h2 className="font-black text-lg text-white truncate tracking-tight transition-colors">{roomName}</h2>
                      </div>
                    )}
                    {!isGroup && !isEditingName && (
                      <span className="px-2.5 py-0.5 rounded-full bg-[#00E5FF]/10 border border-[#00E5FF]/20 text-[9px] font-black text-[#00E5FF] uppercase tracking-widest">
                        Personal
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <div className="flex items-center gap-1.5 bg-white/5 px-2 py-0.5 rounded-full border border-white/5">
                      <span className={`w-1.5 h-1.5 rounded-full ${connected ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-gray-600"}`} />
                      <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">
                        {isGroup ? "Community Hub" : "Direct Link"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 relative">
                  {(isGroup ? activeRoom?.creatorId === myUserId : true) && (
                    <div className="relative">
                      <motion.button
                        whileHover={{ scale: 1.1, backgroundColor: "rgba(255, 255, 255, 0.05)" }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setShowGroupMenu(!showGroupMenu)}
                        className="p-3 rounded-2xl text-[#00E5FF] transition-all border border-[#00E5FF]/20 shadow-[0_0_15px_rgba(0,229,255,0.2)] hover:shadow-[0_0_20px_rgba(0,229,255,0.4)] hover:bg-[#00E5FF]/5"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </motion.button>

                      {/* ── Group/Personal Settings Dropdown ── */}
                      <AnimatePresence>
                        {showGroupMenu && (
                          <>
                            <div className="fixed inset-0 z-40" onClick={() => setShowGroupMenu(false)} />
                            <motion.div
                              initial={{ opacity: 0, y: 10, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 10, scale: 0.95 }}
                              className="fixed top-20 right-4 w-64 bg-[#1A1C23] border border-white/10 rounded-2xl shadow-2xl z-[200] overflow-hidden py-1.5"
                            >
                              {isGroup && activeRoom?.creatorId === myUserId && (
                                <>
                                  <button
                                    onClick={() => {
                                      setShowGroupMenu(false);
                                      fileInputRef.current?.click();
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-300 hover:text-white hover:bg-white/5 transition-all text-left"
                                  >
                                    <svg className="w-4 h-4 text-[#00E5FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                      <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    Change Group Photo
                                  </button>
                                  <button
                                    onClick={() => {
                                      setShowGroupMenu(false);
                                      setEditName(roomName);
                                      setIsEditingName(true);
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-300 hover:text-white hover:bg-white/5 transition-all text-left"
                                  >
                                    <svg className="w-4 h-4 text-[#7000FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                      <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    Rename Group
                                  </button>
                                  <div className="my-1 border-t border-white/5" />
                                </>
                              )}

                              <button
                                onClick={() => {
                                  setShowGroupMenu(false);
                                  handleDeleteRoom();
                                }}
                                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500/80 hover:text-red-500 hover:bg-red-500/5 transition-all text-left"
                              >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                  <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                {isGroup ? "Delete Group" : "Delete Conversation"}
                              </button>
                            </motion.div>
                          </>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </div>
              </div>
            </header>

            {/* ── Scrollable Messages ── */}
            <div 
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto px-2 md:px-4 py-8 min-h-0 relative chat-no-scrollbar"
              style={{ overflowAnchor: 'auto' }}
            >
              <style>{`
                .chat-no-scrollbar::-webkit-scrollbar { display: none; }
                .chat-no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
              `}</style>

              {/* Top Fade Gradient Overlay */}
              <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-[#0B0C10] via-[#0B0C10]/80 to-transparent z-20 pointer-events-none" />
              {/* Background Effects */}
              <div className="absolute inset-0 pointer-events-none z-0">
                <div className="absolute top-[10%] left-[5%] w-[400px] h-[400px] bg-[#7000FF] rounded-full blur-[150px] opacity-[0.07]" />
                <div className="absolute bottom-[10%] right-[5%] w-[400px] h-[400px] bg-[#00E5FF] rounded-full blur-[150px] opacity-[0.07]" />
              </div>

              <div className="w-full flex flex-col gap-6 min-h-full relative z-10">
                <div className="flex flex-col gap-4">
                    {isLoading ? (
                      // Skeleton for Messages
                      [...Array(4)].map((_, i) => (
                        <motion.div
                          key={`msg-skeleton-${i}`}
                          initial={{ opacity: 0, x: i % 2 === 0 ? -10 : 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className={`flex ${i % 2 === 0 ? "justify-start" : "justify-end"} mb-4`}
                        >
                          <div className={`flex gap-3 max-w-[70%] ${i % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}>
                            <div className="w-10 h-10 rounded-2xl bg-white/5 animate-pulse shrink-0" />
                            <div className={`space-y-2 ${i % 2 === 0 ? "items-start" : "items-end"}`}>
                              <div className="h-12 w-48 bg-white/5 rounded-2xl animate-pulse" />
                              <div className="h-3 w-16 bg-white/5 rounded-lg animate-pulse" />
                            </div>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      messagesGrouped.map((msg, i) => (
                        <ChatBubble
                          key={msg.id || i}
                          msg={msg}
                          isMe={msg.isMe}
                          showAvatar={msg.showAvatar && !msg.isMe}
                          senderName={msg.sender?.firstName ? `${msg.sender.firstName} ${msg.sender.lastName || ''}`.trim() : msg.sender?.username || "Member"}
                          onAvatarClick={onAvatarClick}
                          onImageClick={onImageClick}
                          showDateDivider={msg.showDateDivider}
                        />
                      ))
                    )}
                </div>
                {/* Hidden Anchor for Scrolling */}
                <div ref={scrollRef} className="h-1 w-full shrink-0 mt-4" />
              </div>
            </div>

            {/* ── Locked Footer/Input (Solid Style) ── */}
            <footer className="shrink-0 z-40 bg-[#0B0C10] border-t border-white/5 px-4 pb-32 pt-6 md:px-8 md:pb-24 md:pt-8">
              <div className="max-w-5xl mx-auto">
                <AnimatePresence>
                  {typingText && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.9 }}
                      className="flex items-center gap-3 text-[10px] text-[#00E5FF] font-black bg-[#0B0C10]/80 backdrop-blur-md border border-[#00E5FF]/30 px-4 py-1.5 rounded-full w-fit mb-3 shadow-[0_0_20px_rgba(0,229,255,0.15)] ml-2"
                    >
                      <TypingDots />
                      <span className="uppercase tracking-[0.2em]">{typingText}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {pendingImage && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.9 }}
                      className="relative w-24 h-24 mb-4 ml-2 group"
                    >
                      <div className="absolute -inset-1 bg-[#00E5FF] rounded-2xl blur-md opacity-20" />
                      <img src={pendingImage} className="relative w-full h-full object-cover rounded-xl border border-white/20 shadow-xl" alt="Pending" />
                      <button
                        onClick={() => setPendingImage(null)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-[#1A1C23] border border-white/20 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-500/80 transition-all z-10"
                      >
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="relative group bg-[#1A1C23]/80 backdrop-blur-3xl border border-white/10 p-2 rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] focus-within:border-[#00E5FF]/60 focus-within:shadow-[0_0_30px_rgba(0,229,255,0.2)] focus-within:ring-1 focus-within:ring-[#00E5FF]/30 transition-all duration-500">
                  <div className="flex items-center gap-2" ref={emojiRef}>
                    
                    {/* ── Left: Image Attachment Button ── */}
                    <div className="shrink-0 flex items-center justify-center pl-2">
                      <input
                        type="file"
                        ref={messageImageInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleMessageImageChange}
                      />
                      <motion.button
                        whileHover={{ scale: 1.1, color: "#00E5FF" }}
                        whileTap={{ scale: 0.9 }}
                        type="button"
                        onClick={() => messageImageInputRef?.current?.click()}
                        className={`w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 ${pendingImage ? "text-[#00E5FF] bg-[#00E5FF]/10 border border-[#00E5FF]/30 shadow-[0_0_15px_rgba(0,229,255,0.2)]" : "text-gray-500 hover:bg-white/5"}`}
                        title="Attach Image"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                        </svg>
                      </motion.button>
                    </div>

                    {/* ── Center: Textarea ── */}
                    <div className="flex-1 relative min-w-0">
                      <AnimatePresence>
                        {showEmoji && (
                          <motion.div
                            initial={{ opacity: 0, y: -20, scale: 0.95 }}
                            animate={{ opacity: 1, y: -10, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.95 }}
                            className="absolute bottom-full mb-4 right-0 z-[60]"
                          >
                            <EmojiPicker onSelect={(em) => {
                              const el = inputRef.current;
                              if (!el) { setInputText((p) => p + em); setShowEmoji(false); return; }
                              const start = el.selectionStart ?? inputText.length;
                              const end = el.selectionEnd ?? inputText.length;
                              const next = inputText.slice(0, start) + em + inputText.slice(end);
                              setInputText(next);
                              setShowEmoji(false);
                              setTimeout(() => { el.focus(); el.setSelectionRange(start + em.length, start + em.length); }, 0);
                            }} />
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <textarea
                        ref={inputRef}
                        rows="1"
                        value={inputText}
                        onChange={(e) => {
                          onInput(e);
                          e.target.style.height = 'auto';
                          e.target.style.height = Math.min(e.target.scrollHeight, 150) + 'px';
                        }}
                        onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(e); e.target.style.height = 'auto'; } }}
                        placeholder={pendingImage ? "Add a caption..." : "Type your message here..."}
                        className="w-full bg-transparent px-3 py-3.5 text-[15px] text-gray-100 placeholder-gray-500 outline-none resize-none font-medium custom-scrollbar leading-relaxed"
                      />
                    </div>

                    {/* ── Right: Emoji + Send ── */}
                    <div className="flex items-center gap-1.5 shrink-0 pr-1">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        type="button"
                        onClick={() => setShowEmoji((v) => !v)}
                        className={`w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 ${showEmoji ? "text-yellow-400 bg-yellow-400/10 shadow-[0_0_15px_rgba(250,204,21,0.3)]" : "text-gray-500 hover:text-gray-300 hover:bg-white/5"}`}
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(112,0,255,0.5)" }}
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        onClick={send}
                        disabled={(!inputText.trim() && !pendingImage) || !connected}
                        className={`w-11 h-11 rounded-[20px] flex items-center justify-center shrink-0 transition-all duration-300
                          ${(inputText.trim() || pendingImage) && connected 
                            ? "bg-gradient-to-br from-[#7000FF] to-[#9b4dff] text-white shadow-[0_8px_20px_rgba(112,0,255,0.4)]" 
                            : "bg-white/5 text-gray-700 cursor-not-allowed"}`}
                      >
                        <svg className="w-5 h-5 transform rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            </footer>
          </motion.div>
        ) : (
          <motion.div
            key="empty-state"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center p-8 text-center relative overflow-hidden"
          >
            {/* Background Tech Decor */}
            <div className="absolute inset-0 z-0">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#7000FF]/5 rounded-full blur-[120px]" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-white/5 rounded-full" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] border border-[#00E5FF]/10 rounded-full animate-pulse" />
            </div>

            <div className="relative z-10">
              <div className="relative w-32 h-32 mx-auto mb-8">
                <div className="absolute inset-0 bg-gradient-to-br from-[#7000FF] to-[#00E5FF] rounded-[40px] blur-2xl opacity-20 animate-pulse" />
                <div className="relative w-full h-full bg-[#1A1C23] border border-white/10 rounded-[40px] flex items-center justify-center text-5xl shadow-2xl overflow-hidden">
                  <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]" />
                  💬
                </div>
              </div>

              <h2 className="text-2xl font-black text-white uppercase tracking-[0.2em] mb-4">
                Encryption <span className="text-[#00E5FF]">Active</span>
              </h2>
              <p className="text-gray-400 font-bold max-w-sm mx-auto leading-relaxed uppercase tracking-widest text-[10px]">
                Select a frequency from the sidebar to establish a secure connection with the community.
              </p>

              <div className="mt-12 flex flex-wrap justify-center gap-4">
                <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Network Secure</span>
                </div>
                <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] animate-pulse" />
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">P2P Ready</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.main>
  );
});

export default ChatArea;
