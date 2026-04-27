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

  const isImageMessage = msg.content && msg.content.startsWith("[IMAGE]:");
  const imageUrl = isImageMessage ? msg.content.substring(8) : null;

  const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = msg.content && !isImageMessage ? msg.content.match(youtubeRegex) : null;
  const youtubeId = match ? match[1] : null;

  const renderText = (text) => {
    if (!text) return null;
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.split(urlRegex).map((part, i) => {
      if (part.match(urlRegex)) {
        return <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:text-blue-200 underline underline-offset-2 break-all">{part}</a>;
      }
      return <span key={i} className="whitespace-pre-wrap">{part}</span>;
    });
  };

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

      <div className={`flex flex-col max-w-[85%] md:max-w-[75%] ${isMe ? "items-end" : "items-start"}`}>
        {/* Sender Name */}
        {showAvatar && !isMe && (
          <span className="text-[11px] font-extrabold text-gray-500 mb-1.5 ml-1 tracking-wide uppercase">{senderName}</span>
        )}

        {/* Message Bubble */}
        <div className={`relative text-[14px] leading-relaxed shadow-xl break-words
          ${isImageMessage ? "p-1 rounded-[20px] bg-white/5 border border-white/10" : "px-4 py-3"}
          ${!isImageMessage && isMe
            ? "bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-[20px] rounded-br-none"
            : !isImageMessage ? "bg-[#1c1e26] text-gray-100 rounded-[20px] rounded-bl-none border border-white/5" : ""}
          ${isImageMessage && isMe ? "rounded-br-none" : isImageMessage ? "rounded-bl-none" : ""}`}>
          {isImageMessage ? (
            <img src={imageUrl} alt="attachment" className="max-w-full max-h-[300px] object-cover rounded-[16px]" loading="lazy" />
          ) : (
            <div className="space-y-3">
              <div>{renderText(msg.content)}</div>
              {youtubeId && (
                <div className={`w-full max-w-[320px] sm:max-w-[360px] rounded-[12px] overflow-hidden shadow-2xl bg-black/50 ${isMe ? "border border-white/20" : "border border-white/10"}`}>
                  {/* Fake Discord-like left border for aesthetics */}
                  <div className="relative border-l-4 border-red-600">
                    <iframe
                      width="100%"
                      height="200"
                      src={`https://www.youtube.com/embed/${youtubeId}`}
                      title="YouTube video player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="block bg-black"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Timestamp & Status */}
        <div className={`flex items-center gap-2 mt-1.5 px-1 opacity-40 group-hover:opacity-100 transition-all duration-300 ${isMe ? "flex-row-reverse" : "flex-row"}`}>
          <span className="text-[10px] font-bold text-gray-500">{time}</span>
          {isMe && (
            <div className="flex items-center">
              {!msg.isSent && <span className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-pulse" />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
