import React from "react";
import { formatRelative } from "date-fns";
import { th } from "date-fns/locale";
import { avatarUrl } from "../../utils/chatUtils";

export default function ChatBubble({ msg, isMe, showAvatar, senderName, onAvatarClick }) {
  const time = (() => {
    try { 
      const date = new Date(msg.createdAt);
      return formatRelative(date, new Date(), { locale: th }); 
    }
    catch { return ""; }
  })();

  return (
    <div className={`flex items-end gap-3 group ${isMe ? "flex-row-reverse" : "flex-row"} w-full animate-in fade-in slide-in-from-bottom-1 duration-300`}>
      {/* Avatar */}
      <div className="w-9 shrink-0">
        {showAvatar && (
          <div className="relative group/avatar cursor-pointer" onClick={() => onAvatarClick?.(msg.senderId)}>
            <img src={avatarUrl(senderName, msg.sender?.profileImage)}
              className="w-9 h-9 rounded-xl object-cover border border-white/10 shadow-lg group-hover/avatar:scale-110 transition-transform" alt="" />
            <div className="absolute inset-0 bg-blue-500/10 rounded-xl opacity-0 group-hover/avatar:opacity-100 transition-opacity" />
          </div>
        )}
      </div>

      <div className={`flex flex-col max-w-[80%] md:max-w-[70%] ${isMe ? "items-end" : "items-start"}`}>
        {/* Sender Name */}
        {showAvatar && !isMe && (
          <span className="text-[11px] font-extrabold text-gray-500 mb-1.5 ml-1 tracking-wide uppercase">{senderName}</span>
        )}

        {/* Message Bubble */}
        <div className={`relative px-4 py-3 text-[14px] leading-relaxed shadow-xl break-words
          ${isMe
            ? "bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-[20px] rounded-br-none"
            : "bg-[#1c1e26] text-gray-100 rounded-[20px] rounded-bl-none border border-white/5"}`}>
          {msg.content}
        </div>

        {/* Timestamp & Status */}
        <div className={`flex items-center gap-2 mt-1.5 px-1 opacity-40 group-hover:opacity-100 transition-all duration-300 ${isMe ? "flex-row-reverse" : "flex-row"}`}>
          <span className="text-[10px] font-bold text-gray-500">{time}</span>
          {isMe && (
            <div className="flex items-center">
              {!msg.isSent && <span className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-pulse" />}
              {msg.isSent && !msg.isRead && (
                <svg className="w-3 h-3 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
              {msg.isSent && msg.isRead && (
                <div className="flex -space-x-1">
                  <svg className="w-3 h-3 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <svg className="w-3 h-3 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
