import React from "react";
import { motion } from "framer-motion";
import { formatRelative } from "date-fns";
import { avatarUrl } from "../../utils/chatUtils";

export default function ChatBubble({ msg, isMe, showAvatar, senderName, onAvatarClick, onImageClick, showDateDivider }) {
  const time = (() => {
    try { 
      const date = new Date(msg.createdAt);
      return formatRelative(date, new Date()); 
    }
    catch { return ""; }
  })();

  const displayTime = time.split(' at ')[1] || time;

  return (
    <div className="flex flex-col w-full">
      {showDateDivider && (
        <div className="flex items-center gap-4 my-8 animate-in fade-in slide-in-from-top-2 duration-700">
          <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
          <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] bg-white/[0.02] backdrop-blur-md px-5 py-2 rounded-full border border-white/5 shadow-xl">
            {(() => {
              const d = new Date(msg.createdAt);
              const now = new Date();
              if (d.toDateString() === now.toDateString()) return "Today";
              const yesterday = new Date(); yesterday.setDate(now.getDate() - 1);
              if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
              return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            })()}
          </span>
          <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        </div>
      )}

      <motion.div 
        variants={{
          hidden: { opacity: 0, y: 60, scale: 0.7, filter: "blur(15px)" },
          show: { 
            opacity: 1, 
            y: 0, 
            scale: 1, 
            filter: "blur(0px)",
            transition: {
              type: "spring",
              damping: 15,
              stiffness: 150,
              mass: 1
            }
          }
        }}
        className={`flex items-end gap-3 group ${isMe ? "flex-row-reverse" : "flex-row"} w-full relative`}
      >
        {/* Avatar */}
        <div className="w-10 shrink-0 mb-1">
          {showAvatar && (
            <motion.div 
              whileHover={{ scale: 1.1 }}
              className="relative group/avatar cursor-pointer" 
              onClick={() => onAvatarClick?.(msg.sender)}
            >
              <div className="absolute -inset-0.5 bg-gradient-to-br from-[#7000FF] to-[#00E5FF] rounded-[14px] opacity-0 group-hover/avatar:opacity-40 blur-sm transition-opacity" />
              <img 
                src={avatarUrl(senderName, msg.sender?.profileImage)}
                className="relative w-10 h-10 rounded-[12px] object-cover border border-white/10 shadow-lg transition-transform" 
                alt="" 
              />
            </motion.div>
          )}
        </div>

        <div className={`flex flex-col max-w-[85%] md:max-w-[75%] ${isMe ? "items-end" : "items-start"}`}>
          {/* Sender Name */}
          {showAvatar && !isMe && (
            <span className="text-[11px] font-black text-gray-400 mb-1.5 ml-1 tracking-[0.12em] uppercase">{senderName}</span>
          )}

          <div className={`flex items-end gap-2.5 ${isMe ? "flex-row-reverse" : "flex-row"}`}>
            {/* Message Bubble */}
            <motion.div 
              whileHover={{ scale: msg.fileUrl ? 1.02 : 1.01 }}
              className={`relative group/msg shadow-2xl break-words transition-all duration-300
                ${isMe
                  ? "bg-gradient-to-br from-[#7000FF] to-[#8220FF] text-white rounded-[20px] rounded-br-none border border-white/10"
                  : "bg-[#1A1C23]/80 backdrop-blur-md text-gray-100 rounded-[20px] rounded-bl-none border border-white/5"}
                ${msg.fileUrl ? "p-1.5 cursor-pointer" : "px-4.5 py-3 text-[14px] leading-relaxed"}`}
              onClick={() => msg.fileUrl && onImageClick?.(msg.fileUrl)}
            >
              {msg.fileUrl ? (
                <div className="relative overflow-hidden rounded-[16px]">
                  <img 
                    src={msg.fileUrl} 
                    className="max-w-[240px] md:max-w-[320px] max-h-[400px] object-cover transition-transform duration-500 group-hover/msg:scale-110" 
                    alt="Message Content" 
                    onLoad={() => {
                        // Optional: trigger scroll if container ref was available
                    }}
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/msg:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </div>
                  </div>
                </div>
              ) : (
                msg.content
              )}
            </motion.div>

            {/* Metadata (Time & Read Status) beside the bubble */}
            <div className={`flex flex-col mb-1 ${isMe ? "items-end" : "items-start"} min-w-fit opacity-60 transition-opacity duration-500 group-hover:opacity-100`}>
              <span className="text-[9px] font-bold text-gray-500/60 leading-none tabular-nums uppercase">{displayTime}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
