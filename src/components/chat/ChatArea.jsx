import React from "react";
import ChatBubble from "./ChatBubble";
import EmojiPicker from "./EmojiPicker";

const TypingDots = () => (
  <span className="flex gap-[3px] items-center">
    {[0, 160, 320].map((d) => (
      <span key={d} style={{ animationDelay: `${d}ms` }}
        className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" />
    ))}
  </span>
);

export default function ChatArea({
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
  messageImageInputRef,
  handleMessageImageChange
}) {
  return (
    <main className={`flex-1 flex flex-col min-w-0 bg-[#0B0C10] ${!showSidebar || activeChat ? "flex" : "hidden"} md:flex h-full relative overflow-hidden`}>
      {activeChat ? (
        <div className="flex flex-col h-full w-full min-h-0">
          {/* ── Fixed Header ── */}
          <header className="shrink-0 z-30 border-b border-white/5 bg-[#13141a]/95 backdrop-blur-xl">
            <div className="flex items-center gap-4 px-6 py-4">
              <button onClick={goBack} className="md:hidden p-2 -ml-2 rounded-xl hover:bg-white/10 text-gray-400 transition-colors">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M15 19l-7-7 7-7"/></svg>
              </button>

              <div className="relative group cursor-pointer shrink-0" onClick={handleAvatarClick}>
                <div className={`w-11 h-11 rounded-2xl overflow-hidden ring-2 ring-white/5 group-hover:ring-blue-500/50 transition-all shadow-lg ${isGroup ? "bg-gradient-to-br from-indigo-600 to-purple-600" : ""}`}>
                  <img src={roomAvatar} className="w-full h-full object-cover" alt="" />
                </div>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="font-extrabold text-base text-gray-100 truncate tracking-tight">{roomName}</h2>
                  {!isGroup && (
                    <span className="px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[9px] font-black text-blue-400 uppercase tracking-tighter">
                      Personal
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className={`w-2 h-2 rounded-full ${connected ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-gray-600"}`} />
                  <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest opacity-80">
                    {isGroup ? "Community Room" : "Encrypted Direct Message"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                {/* ปุ่มลบแชท: โชว์ถ้าเป็นกลุ่มและเราเป็นคนสร้าง OR โชว์ถ้าเป็นแชทส่วนตัว */}
                {(isGroup ? activeRoom?.creatorId === myUserId : true) && (
                  <button onClick={handleDeleteRoom} 
                    title={isGroup ? "Delete Group" : "Delete Conversation"}
                    className="p-2.5 rounded-xl hover:bg-red-500/10 text-red-500 transition-all group/del">
                    <svg className="w-5 h-5 group-hover/del:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                )}
              </div>
            </div>
          </header>

          {/* ── Scrollable Messages ── */}
          <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 scroll-smooth min-h-0" style={{ scrollbarWidth: "thin", scrollbarColor: "#ffffff10 transparent" }}>
            <div className="max-w-4xl mx-auto flex flex-col gap-4 min-h-full">
              <div className="flex-1" />
              <div className="flex flex-col gap-3">
                {messagesGrouped.map((msg, i) => (
                  <ChatBubble 
                    key={msg.id || i} 
                    msg={msg} 
                    isMe={msg.isMe}
                    showAvatar={msg.showAvatar}
                    senderName={msg.sender?.firstName ? `${msg.sender.firstName} ${msg.sender.lastName || ''}`.trim() : msg.sender?.username || "Member"}
                    onAvatarClick={startPrivateChat} 
                  />
                ))}
              </div>
              <div ref={scrollRef} className="h-4 w-full shrink-0" />
            </div>
          </div>

          {/* ── Fixed Footer/Input ── */}
          <footer className="shrink-0 z-30 px-4 pb-[90px] md:pb-[90px] pt-2 bg-gradient-to-t from-[#0B0C10] to-transparent">
            <div className="px-8 h-8 flex items-center mb-1">
              {typingText && (
                <div className="flex items-center gap-3 text-[11px] text-blue-400 font-bold bg-blue-500/10 px-3 py-1 rounded-full animate-pulse">
                  <TypingDots />
                  <span className="italic uppercase tracking-wider">{typingText}</span>
                </div>
              )}
            </div>
            
            <form onSubmit={send} className="max-w-4xl mx-auto flex items-end gap-2 bg-[#1c1e26]/90 backdrop-blur-xl border border-white/10 p-1.5 rounded-[22px] shadow-2xl focus-within:border-blue-500/40 transition-all">
              <input type="file" ref={messageImageInputRef} className="hidden" accept="image/*" onChange={handleMessageImageChange} />
              <button type="button" onClick={() => messageImageInputRef.current?.click()}
                className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              </button>
              
              <div className="flex-1 relative flex items-center" ref={emojiRef}>
                {showEmoji && (
                  <div className="absolute bottom-full mb-4 right-0">
                    <EmojiPicker onSelect={(em) => {
                      const el = inputRef.current;
                      if (!el) { setInputText((p) => p + em); setShowEmoji(false); return; }
                      const start = el.selectionStart ?? inputText.length;
                      const end   = el.selectionEnd   ?? inputText.length;
                      const next  = inputText.slice(0, start) + em + inputText.slice(end);
                      setInputText(next);
                      setShowEmoji(false);
                      setTimeout(() => { el.focus(); el.setSelectionRange(start + em.length, start + em.length); }, 0);
                    }} />
                  </div>
                )}
                <textarea
                  ref={inputRef}
                  rows="1"
                  value={inputText}
                  onChange={(e) => {
                    onInput(e);
                    e.target.style.height = 'auto';
                    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                  }}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(e); e.target.style.height = 'auto'; } }}
                  placeholder="Message..."
                  className="w-full bg-transparent px-4 py-2 pr-12 text-[14px] text-gray-100 placeholder-gray-600 outline-none resize-none"
                />
                <button type="button" onClick={() => setShowEmoji((v) => !v)} 
                  className={`absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-all ${
                    showEmoji ? "text-yellow-400 bg-yellow-400/10 scale-110" : "text-gray-500 hover:text-gray-300 hover:scale-110"
                  }`}>
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </button>
              </div>
              <button type="submit" disabled={!inputText.trim() || !connected}
                className={`w-10 h-10 rounded-[18px] flex items-center justify-center shrink-0 transition-all
                  ${inputText.trim() && connected ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30" : "bg-white/5 text-gray-700"}`}>
                <svg className="w-5 h-5 transform rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
              </button>
            </form>
          </footer>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center gap-6 text-gray-700 select-none bg-gradient-to-b from-[#13141a] to-[#0B0C10]">
          <div className="w-32 h-32 rounded-[40px] bg-[#1c1e26] border border-white/5 flex items-center justify-center text-6xl shadow-2xl">💬</div>
          <div className="text-center space-y-2">
            <h3 className="text-xl font-extrabold text-gray-300">Welcome to Chat</h3>
            <p className="text-sm text-gray-600">Select a room to start messaging.</p>
          </div>
        </div>
      )}
    </main>
  );
}
