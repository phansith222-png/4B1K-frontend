import React from "react";
import { formatRelative } from "date-fns";
import { th } from "date-fns/locale";
import { avatarUrl } from "../../utils/chatUtils"; // We will create this

export default function ChatBubble({ msg, isMe, showAvatar, senderName, onAvatarClick }) {
  const time = (() => {
    try { return formatRelative(new Date(msg.createdAt), new Date(), { locale: th }); }
    catch { return ""; }
  })();

  return (
    <div className={`flex items-end gap-2 group ${isMe ? "flex-row-reverse" : "flex-row"}`}>
      {/* avatar slot */}
      <div className="w-8 shrink-0">
        {showAvatar && !isMe && (
          <img src={avatarUrl(senderName, msg.sender?.profileImage)}
            onClick={() => onAvatarClick?.(msg.senderId)}
            className="w-8 h-8 rounded-full object-cover border-2 border-white/10 cursor-pointer" alt="" />
        )}
      </div>

      <div className={`flex flex-col max-w-[72%] ${isMe ? "items-end" : "items-start"}`}>
        {showAvatar && !isMe && (
          <span className="text-[10px] text-gray-500 mb-1 ml-1 font-semibold">{senderName}</span>
        )}
        <div className={`px-4 py-2.5 text-sm leading-relaxed shadow-md whitespace-pre-wrap break-words
          ${isMe
            ? "bg-blue-600 text-white rounded-2xl rounded-br-md"
            : "bg-[#2a2d35] text-gray-100 rounded-2xl rounded-bl-md border border-white/5"}`}>
          {msg.content}
        </div>
        <div className={`flex items-center gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity ${isMe ? "flex-row-reverse" : "flex-row"}`}>
          <span className="text-[10px] text-gray-600">{time}</span>
          {isMe && (
            <span className="text-[10px]">
              {!msg.isSent && <span className="text-gray-500">⏳</span>}
              {msg.isSent && !msg.isRead && <span className="text-blue-400">✓</span>}
              {msg.isSent && msg.isRead && <span className="text-cyan-400">✓✓</span>}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
