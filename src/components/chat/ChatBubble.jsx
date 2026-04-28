import React from "react";
import { motion } from "framer-motion";
import { formatRelative } from "date-fns";
import { avatarUrl } from "../../utils/chatUtils";

export default function ChatBubble({ msg, isMe, showAvatar, senderName, onAvatarClick, onImageClick, showDateDivider, myAvatar }) {
  const time = (() => {
    try {
      return formatRelative(new Date(msg.createdAt), new Date());
    } catch {
      return "";
    }
  })();

  const isImageMessage = msg.content && msg.content.startsWith("[IMAGE]:");
  const imageUrl = isImageMessage ? msg.content.substring(8) : null;

  const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const youtubeMatch = !isImageMessage && msg.content ? msg.content.match(youtubeRegex) : null;
  const youtubeId = youtubeMatch ? youtubeMatch[1] : null;

  const renderText = (text) => {
    if (!text) return null;
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.split(urlRegex).map((part, i) =>
      part.match(urlRegex)
        ? <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 opacity-90 hover:opacity-100 break-all">{part}</a>
        : <span key={i} className="whitespace-pre-wrap">{part}</span>
    );
  };

  return (
    <div className="w-full flex flex-col">
      {/* ── Date Divider ── */}
      {showDateDivider && (
        <div className="flex items-center gap-3 my-4 px-2">
          <div className="flex-1 h-[1px] bg-white/5" />
          <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest whitespace-nowrap">
            {(() => {
              try { return new Date(msg.createdAt).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }); }
              catch { return ""; }
            })()}
          </span>
          <div className="flex-1 h-[1px] bg-white/5" />
        </div>
      )}

      {/* ── Message Row ── */}
      {isMe ? (
        <div className="flex items-end justify-end gap-3 mb-1.5 px-2">
          <div className="flex flex-col items-end max-w-[80%] md:max-w-[70%]">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="cursor-pointer relative"
              onClick={() => isImageMessage && onImageClick?.(imageUrl)}
            >
              <div className={`${msg.isOptimistic ? "opacity-60" : "opacity-100"} transition-opacity duration-300`}>
                {isImageMessage ? (
                  <div className="relative overflow-hidden rounded-2xl rounded-br-sm border border-[#7000FF]/30 shadow-2xl">
                    <img src={imageUrl} alt="" className="max-w-xs md:max-w-md max-h-[450px] object-cover hover:scale-[1.02] transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
                  </div>
                ) : (
                  <div className="bg-gradient-to-br from-[#7000FF] to-[#8E24AA] text-white px-4 py-2.5 rounded-[20px] rounded-br-sm text-[14px] leading-relaxed shadow-lg shadow-purple-900/20 border border-white/10">
                    <div className="relative z-10 font-medium">{renderText(msg.content)}</div>
                    {youtubeId && (
                      <div className="mt-2 rounded-xl overflow-hidden border border-white/20 shadow-xl">
                        <iframe width="100%" height="180" src={`https://www.youtube.com/embed/${youtubeId}`} title="YouTube" frameBorder="0" allowFullScreen className="bg-black" />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>

            <div className="flex items-center gap-1.5 mt-1 mr-0.5">
              <span className="text-[9px] text-gray-500 font-bold uppercase tracking-tighter opacity-70">{time}</span>
              {msg.isOptimistic ? (
                <div className="w-3 h-3 rounded-full border-[1.5px] border-white/10 border-t-[#00E5FF] animate-spin" />
              ) : (
                <div className="text-[#00E5FF] drop-shadow-[0_0_5px_rgba(0,229,255,0.5)]">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M5 13l4 4L19 7" /></svg>
                </div>
              )}
            </div>
          </div>
          <div className="w-8 h-8 shrink-0 self-end mb-4">
            <img src={avatarUrl("Me", myAvatar)} className="w-full h-full rounded-lg object-cover ring-1 ring-white/10 shadow-lg" alt="" />
          </div>
        </div>
      ) : (
        <div className="flex items-end gap-3 mb-1.5 px-2">
          <div className="w-8 h-8 shrink-0 self-end mb-4 cursor-pointer" onClick={() => onAvatarClick?.({ ...msg.sender, id: msg.senderId })}>
            <img src={avatarUrl(senderName, msg.sender?.profileImage)} className="w-full h-full rounded-lg object-cover ring-1 ring-white/10 shadow-lg" alt="" />
          </div>
          <div className="flex flex-col items-start max-w-[80%] md:max-w-[70%]">
            {showAvatar && <span className="text-[10px] font-black text-[#00E5FF] mb-1 ml-1 uppercase tracking-widest">{senderName}</span>}
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="relative" onClick={() => isImageMessage && onImageClick?.(imageUrl)}>
              {isImageMessage ? (
                <div className="relative overflow-hidden rounded-2xl rounded-bl-sm border border-white/5 shadow-2xl">
                  <img src={imageUrl} alt="" className="max-w-xs md:max-w-md max-h-[450px] object-cover hover:scale-[1.02] transition-transform duration-500" />
                </div>
              ) : (
                <div className="bg-[#1A1C23] text-gray-200 px-4 py-2.5 rounded-[20px] rounded-bl-sm text-[14px] leading-relaxed shadow-lg border border-white/5 font-medium">
                  {renderText(msg.content)}
                  {youtubeId && (
                    <div className="mt-2 rounded-xl overflow-hidden border border-white/10 shadow-xl">
                      <iframe width="100%" height="180" src={`https://www.youtube.com/embed/${youtubeId}`} title="YouTube" frameBorder="0" allowFullScreen className="bg-black" />
                    </div>
                  )}
                </div>
              )}
            </motion.div>
            <span className="text-[9px] text-gray-600 font-bold mt-1 ml-1 uppercase tracking-tighter opacity-70">{time}</span>
          </div>
        </div>
      )}
    </div>
  );
}
