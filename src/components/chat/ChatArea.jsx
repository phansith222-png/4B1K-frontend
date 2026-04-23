import React from "react";
import ChatBubble from "./ChatBubble";
import EmojiPicker from "./EmojiPicker";

const TypingDots = () => (
  <span className="flex gap-[3px] items-center">
    {[0, 160, 320].map((d) => (
      <span key={d} style={{ animationDelay: `${d}ms` }}
        className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" />
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
  handleDeleteGroup,
  startPrivateChat,
  scrollRef,
  emojiRef,
  inputRef
}) {
  return (
    <main className={`flex-1 flex flex-col min-w-0 bg-[#13141a] ${!showSidebar || activeChat ? "flex" : "hidden"} md:flex`}>
      {activeChat ? (
        <>
          {/* header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5 bg-[#1c1e26]/80 backdrop-blur shrink-0">
            {/* mobile back */}
            <button onClick={goBack} className="md:hidden p-1.5 rounded-lg hover:bg-white/5 text-gray-400 mr-1">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
              </svg>
            </button>

            <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
              {isGroup
                ? <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-600 to-blue-500 flex items-center justify-center font-bold text-white shrink-0 relative overflow-hidden">
                    {activeRoom?.profileImage ? (
                      <img src={activeRoom.profileImage} className="w-full h-full object-cover" alt="" />
                    ) : (
                      roomName.charAt(0).toUpperCase()
                    )}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                  </div>
                : <img src={roomAvatar} className="w-10 h-10 rounded-full object-cover border-2 border-white/10 shrink-0" alt="" />
              }
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-bold text-sm text-gray-100 truncate">{roomName}</h2>
              <p className="text-[11px] text-gray-500 truncate">
                {isGroup ? `${activeRoom?.participants?.length ?? "—"} สมาชิก · Community` : "แชทส่วนตัว · Personal"}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {isGroup && activeRoom?.creatorId === myUserId && (
                <button onClick={handleDeleteGroup} className="p-2 rounded-xl hover:bg-white/5 text-red-500 hover:text-red-400 transition-colors" title="Delete Group">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
              <button className="p-2 rounded-xl hover:bg-white/5 text-gray-500 hover:text-blue-400 transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </button>
            </div>
          </div>

          {/* messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1" style={{ scrollbarWidth: "thin", scrollbarColor: "#ffffff10 transparent" }}>
            {messagesGrouped.map((msg, i) => (
              <ChatBubble key={msg.id || i} msg={msg} isMe={msg.isMe}
                showAvatar={msg.showAvatar}
                senderName={msg.sender?.username || msg.sender?.firstName || "Member"}
                onAvatarClick={startPrivateChat} />
            ))}
            <div ref={scrollRef} className="h-1" />
          </div>

          {/* typing */}
          <div className="px-5 h-7 flex items-center shrink-0">
            {typingText && (
              <div className="flex items-center gap-2 text-[11px] text-blue-400/80 font-medium">
                <TypingDots />
                <span className="italic">{typingText}</span>
              </div>
            )}
          </div>

          {/* input */}
          <form onSubmit={send} className="px-3 pb-4 pt-1 flex items-center gap-2 shrink-0 border-t border-white/5 bg-[#1c1e26]/60">
            <img src={myAvatar} className="w-8 h-8 rounded-full object-cover shrink-0" alt="" />
            <div className="flex-1 relative" ref={emojiRef}>
              {/* emoji picker popup */}
              {showEmoji && (
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
              )}
              <input ref={inputRef} value={inputText} onChange={onInput}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) send(e); }}
                placeholder="Aa"
                className="w-full bg-[#2a2d35] border border-white/5 rounded-2xl px-4 py-2.5 pr-12 text-sm text-gray-200 placeholder-gray-600 outline-none focus:border-blue-500/40 focus:ring-1 focus:ring-blue-500/20 transition-all" />
              <button type="button"
                onClick={() => setShowEmoji((v) => !v)}
                className={`absolute right-3 top-1/2 -translate-y-1/2 text-xl transition-all duration-150 ${
                  showEmoji ? "text-yellow-400 scale-125" : "text-gray-500 hover:text-yellow-400 hover:scale-110"
                }`}>😊</button>
            </div>
            <button type="submit" disabled={!inputText.trim() || !connected}
              className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all duration-200
                ${inputText.trim() && connected
                  ? "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 scale-100"
                  : "bg-white/5 text-gray-600 cursor-not-allowed scale-95"}`}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </form>
        </>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-gray-700 select-none">
          <div className="w-20 h-20 rounded-full bg-[#1c1e26] border border-white/5 flex items-center justify-center text-4xl shadow-xl">
            💬
          </div>
          <div className="text-center">
            <p className="text-base font-bold text-gray-400">เลือกการสนทนา</p>
            <p className="text-sm text-gray-600 mt-1">เลือกจากรายการด้านซ้ายเพื่อเริ่มแชท</p>
          </div>
        </div>
      )}
    </main>
  );
}
