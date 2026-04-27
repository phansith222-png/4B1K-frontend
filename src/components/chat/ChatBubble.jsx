import React from "react";
import { motion } from "framer-motion";
import { formatRelative } from "date-fns";
import { avatarUrl } from "../../utils/chatUtils";

export default function ChatBubble({ msg, isMe, showAvatar, senderName, onAvatarClick, onImageClick, showDateDivider }) {
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
      {/* MY message → float RIGHT, no avatar */}
      {isMe ? (
        <div className="flex justify-end mb-1 px-2">
          <div className="flex flex-col items-end max-w-[75%]">
            {/* Bubble */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 28 }}
              className="cursor-pointer relative"
              onClick={() => isImageMessage && onImageClick?.(imageUrl)}
            >
              {isImageMessage ? (
                <div className="relative overflow-hidden rounded-[20px] rounded-br-[4px] border border-[#7000FF]/50 shadow-[0_0_20px_rgba(112,0,255,0.2)]">
                  <img
                    src={imageUrl}
                    alt="attachment"
                    className="max-w-[260px] md:max-w-[320px] max-h-[400px] object-cover block transform transition-transform duration-700 hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#7000FF]/20 to-transparent pointer-events-none" />
                  <div className="absolute inset-0 bg-black/10 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                      <svg className="w-5 h-5 text-white shadow-lg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative group overflow-hidden bg-gradient-to-br from-[#7000FF] to-[#9b4dff] text-white px-4 py-2.5 rounded-[22px] rounded-br-[4px] text-[14px] leading-relaxed shadow-[0_10px_25px_rgba(112,0,255,0.4)] border border-white/20 backdrop-blur-sm">
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative z-10">{renderText(msg.content)}</div>
                  {youtubeId && (
                    <div className="mt-2 rounded-[12px] overflow-hidden border border-white/30 shadow-2xl relative z-10">
                      <div className="border-l-4 border-red-500">
                        <iframe
                          width="100%"
                          height="180"
                          src={`https://www.youtube.com/embed/${youtubeId}`}
                          title="YouTube video"
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
            </motion.div>

            {/* Timestamp */}
            <span className="text-[9px] text-gray-500 font-bold mt-1.5 mr-1 uppercase tracking-widest opacity-80">
              {time}
              {!msg.isSent && <span className="ml-2 animate-pulse text-[#00E5FF]">• transmitting</span>}
            </span>
          </div>
        </div>
      ) : (
        /* OTHERS' messages → float LEFT, with avatar + name */
        <div className="flex items-end gap-2.5 mb-1 px-2">
          {/* Avatar column — always reserve space */}
          <div className="w-8 shrink-0 self-end mb-4">
            {showAvatar ? (
              <div
                className="relative cursor-pointer group/av"
                onClick={() => onAvatarClick?.({ ...msg.sender, id: msg.senderId })}
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-[#7000FF] to-[#00E5FF] rounded-xl blur-[4px] opacity-0 group-hover/av:opacity-100 transition duration-300" />
                <img
                  src={avatarUrl(senderName, msg.sender?.profileImage)}
                  alt=""
                  className="relative w-8 h-8 rounded-xl object-cover border border-white/20 shadow-lg group-hover/av:scale-110 transition-transform"
                />
              </div>
            ) : (
              <div className="w-8 h-8" /> // placeholder to keep alignment
            )}
          </div>

          {/* Bubble + meta */}
          <div className="flex flex-col items-start max-w-[75%]">
            {/* Sender name — shown above first message in a group */}
            {showAvatar && (
              <span className="text-[10px] font-black text-[#00E5FF] mb-1.5 ml-1 uppercase tracking-[0.15em] drop-shadow-[0_0_8px_rgba(0,229,255,0.5)]">
                {senderName}
              </span>
            )}

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 28 }}
              className="cursor-pointer relative"
              onClick={() => isImageMessage && onImageClick?.(imageUrl)}
            >
              {isImageMessage ? (
                <div className="relative overflow-hidden rounded-[20px] rounded-bl-[4px] border border-white/10 shadow-[0_5px_15px_rgba(0,0,0,0.3)]">
                  <img
                    src={imageUrl}
                    alt="attachment"
                    className="max-w-[260px] md:max-w-[320px] max-h-[400px] object-cover block transform transition-transform duration-700 hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/10 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center border border-white/20">
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-[#1c1e26]/90 backdrop-blur-md text-gray-100 px-4 py-2.5 rounded-[22px] rounded-bl-[4px] text-[14px] leading-relaxed shadow-2xl border border-white/10 relative group overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative z-10">{renderText(msg.content)}</div>
                  {youtubeId && (
                    <div className="mt-2 rounded-[12px] overflow-hidden border border-white/10 shadow-2xl relative z-10">
                      <div className="border-l-4 border-red-500">
                        <iframe
                          width="100%"
                          height="180"
                          src={`https://www.youtube.com/embed/${youtubeId}`}
                          title="YouTube video"
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
            </motion.div>

            {/* Timestamp */}
            <span className="text-[9px] text-gray-600 font-bold mt-1 ml-1 uppercase tracking-wider">
              {time}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
