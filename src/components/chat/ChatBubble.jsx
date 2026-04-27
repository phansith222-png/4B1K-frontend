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
      {/* TEMP DEBUG — remove later */}
      <div className="text-[9px] text-yellow-400 px-4 font-mono">
        senderId={String(msg.senderId)} | isMe={String(isMe)}
      </div>
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
              className="cursor-pointer"
              onClick={() => isImageMessage && onImageClick?.(imageUrl)}
            >
              {isImageMessage ? (
                <div className="relative overflow-hidden rounded-[20px] rounded-br-[4px] border border-white/10">
                  <img
                    src={imageUrl}
                    alt="attachment"
                    className="max-w-[260px] md:max-w-[320px] max-h-[400px] object-cover block"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/10 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gradient-to-br from-[#7000FF] to-[#9b4dff] text-white px-4 py-2.5 rounded-[20px] rounded-br-[4px] text-[14px] leading-relaxed shadow-lg shadow-[#7000FF]/20 border border-white/10">
                  {renderText(msg.content)}
                  {youtubeId && (
                    <div className="mt-2 rounded-[10px] overflow-hidden border border-white/20 shadow-xl">
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
            <span className="text-[9px] text-gray-600 font-bold mt-1 mr-1 uppercase tracking-wider">
              {time}
              {!msg.isSent && <span className="ml-1 opacity-50">• sending</span>}
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
                onClick={() => onAvatarClick?.(msg.senderId)}
              >
                <img
                  src={avatarUrl(senderName, msg.sender?.profileImage)}
                  alt=""
                  className="w-8 h-8 rounded-xl object-cover border border-white/10 shadow group-hover/av:scale-110 transition-transform"
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
              <span className="text-[10px] font-extrabold text-gray-500 mb-1 ml-1 uppercase tracking-widest">
                {senderName}
              </span>
            )}

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 28 }}
              className="cursor-pointer"
              onClick={() => isImageMessage && onImageClick?.(imageUrl)}
            >
              {isImageMessage ? (
                <div className="relative overflow-hidden rounded-[20px] rounded-bl-[4px] border border-white/10">
                  <img
                    src={imageUrl}
                    alt="attachment"
                    className="max-w-[260px] md:max-w-[320px] max-h-[400px] object-cover block"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/10 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-[#1c1e26] text-gray-100 px-4 py-2.5 rounded-[20px] rounded-bl-[4px] text-[14px] leading-relaxed shadow border border-white/5">
                  {renderText(msg.content)}
                  {youtubeId && (
                    <div className="mt-2 rounded-[10px] overflow-hidden border border-white/10 shadow-xl">
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
