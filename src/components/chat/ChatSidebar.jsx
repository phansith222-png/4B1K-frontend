import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { avatarUrl } from "../../utils/chatUtils";

export default function ChatSidebar({
  showSidebar,
  connected,
  search,
  setSearch,
  tab,
  setTab,
  filteredContacts,
  activeChat,
  unreadCounts,
  openChat,
  myUserId,
  myName,
  myAvatar,
  user,
  setIsCreateModalOpen,
  isLoading
}) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  return (
    <motion.aside
      initial={false}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="w-full md:w-[380px] flex flex-col bg-[#0B0C10] border-r border-white/5 z-30 relative overflow-hidden"
    >
      {/* Background Decorative Glows */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#7000FF]/5 to-transparent pointer-events-none" />

      {/* ── User Profile Header ── */}
      <div className="p-4 md:p-6 relative z-10">
        <div className="flex items-center justify-between mb-5 md:mb-8">
          <div className="flex items-center gap-4 relative">
            {/* Exit Chat Button */}
            <Link to="/home">
              <motion.button
                whileHover={{ scale: 1.1, x: -2 }}
                whileTap={{ scale: 0.9 }}
                className="p-2.5 -ml-1 rounded-2xl bg-white/5 text-gray-500 hover:text-white transition-all border border-white/5 hover:border-white/10 group"
                title="Back to Community"
              >
                <svg className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </motion.button>
            </Link>

            <div className="relative group cursor-pointer" onClick={() => setShowUserMenu(!showUserMenu)}>
              <div className="absolute -inset-1 bg-gradient-to-r from-[#7000FF]/20 to-[#00E5FF]/20 rounded-[20px] blur opacity-0 group-hover:opacity-100 transition duration-500" />
              <img src={myAvatar} className="relative w-12 h-12 rounded-[18px] object-cover border border-white/10 shadow-2xl" alt="" />
              <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-[3px] border-[#0B0C10] ${connected ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" : "bg-gray-600"}`} />
            </div>

            <div className="min-w-0 cursor-pointer" onClick={() => setShowUserMenu(!showUserMenu)}>
              <h2 className="text-base font-black text-white truncate tracking-tight">{myName}</h2>
              <div className="flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${connected ? "bg-emerald-500" : "bg-gray-600"}`} />
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{connected ? "Online" : "Connecting"}</p>
              </div>
            </div>

            {/* ── User Dropdown Menu ── */}
            <AnimatePresence>
              {showUserMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-full left-10 mt-2 w-48 bg-[#1A1C23] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden py-1.5"
                  >
                    <Link
                      to="/editprofile"
                      className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-300 hover:text-white hover:bg-white/5 transition-all"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <svg className="w-4 h-4 text-[#7000FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit Profile
                    </Link>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          <motion.button
            whileHover={{ scale: 1.05, rotate: 90 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsCreateModalOpen(true)}
            className="w-11 h-11 flex items-center justify-center rounded-2xl bg-gradient-to-br from-[#7000FF] to-[#8220FF] text-white shadow-lg shadow-[#7000FF]/20 border border-white/10"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path d="M12 4v16m8-8H4" />
            </svg>
          </motion.button>
        </div>

        {/* ── Search Bar ── */}
        <div className="relative group mb-6">
          <div className="absolute inset-0 bg-[#00E5FF]/5 opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 rounded-2xl" />
          <div className="relative flex items-center bg-[#15171e] border border-white/5 rounded-2xl p-0.5 group-focus-within:border-[#00E5FF]/30 transition-all duration-300">
            <div className="pl-4">
              <svg className="w-4 h-4 text-gray-600 group-focus-within:text-[#00E5FF] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
            </div>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search frequency..."
              className="w-full bg-transparent border-none pl-3 pr-4 py-3 text-sm text-gray-200 placeholder-gray-600 outline-none font-medium"
            />
            {search && (
              <div className="flex items-center gap-2 pr-2">
                <span className="text-[9px] font-black text-[#00E5FF] bg-[#00E5FF]/10 px-2 py-1 rounded-lg border border-[#00E5FF]/20 animate-in fade-in zoom-in duration-300 uppercase tracking-tighter whitespace-nowrap">
                  {filteredContacts.length} Hits
                </span>
                <button
                  onClick={() => setSearch("")}
                  className="p-2 hover:bg-white/10 rounded-xl text-gray-500 hover:text-white transition-all"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="flex gap-1 p-1 bg-[#15171e] rounded-2xl border border-white/5 relative overflow-hidden">
          {["community", "personal"].map((t) => {
            const isActive = tab === t;
            return (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-colors duration-300 relative
                  ${isActive ? "text-[#00E5FF]" : "text-gray-500 hover:text-gray-300"}`}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebarActiveTab"
                    className="absolute inset-0 bg-[#1c1e26] border border-white/10 rounded-xl shadow-lg"
                    transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                  />
                )}
                <span className="relative z-10">{t}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Room List ── */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2" style={{ scrollbarWidth: "thin", scrollbarColor: "#ffffff05 transparent" }}>
        <AnimatePresence mode="popLayout">
          {filteredContacts.length > 0 ? (
            <motion.div
              key={tab}
              initial="hidden"
              animate="show"
              exit="hidden"
              variants={{
                show: { transition: { staggerChildren: 0.05 } },
                hidden: { transition: { staggerChildren: 0.03, staggerDirection: -1 } }
              }}
              className="flex flex-col gap-2"
            >
              {filteredContacts.map((room) => {
                const isRoomGroup = room.isGroup;
                const otherUser = !isRoomGroup ? room.users?.find((u) => u.userId !== myUserId)?.user : null;
                const displayName = isRoomGroup 
                  ? (room.name || `Group ${room.id}`) 
                  : (otherUser?.firstName ? `${otherUser.firstName} ${otherUser.lastName || ''}`.trim() : otherUser?.username || "Loading...");
                const unread = unreadCounts[room.id] || 0;
                const isActive = activeChat === room.id;

                return (
                  <motion.button
                    key={room.id}
                    variants={{
                      hidden: { opacity: 0, y: 10 },
                      show: { opacity: 1, y: 0 }
                    }}
                    onClick={() => openChat(room.id)}
                    className={`w-full flex items-center gap-4 p-3.5 rounded-2xl transition-all duration-300 group relative border
                      ${isActive
                        ? "bg-gradient-to-r from-[#7000FF] to-[#8220FF] text-white shadow-[0_15px_30px_rgba(112,0,255,0.25)] border-white/10"
                        : "hover:bg-white/[0.03] text-gray-400 hover:text-gray-100 border-transparent"}`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeGlow"
                        className="absolute inset-0 bg-gradient-to-r from-[#7000FF]/20 to-[#00E5FF]/20 rounded-2xl blur-md opacity-50"
                      />
                    )}
                    
                    <div className="relative shrink-0 z-10">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden border border-white/10 shadow-lg group-hover:scale-105 transition-transform duration-500
                        ${isActive ? "ring-2 ring-[#00E5FF]/50" : ""}`}>
                        <img
                          src={avatarUrl(displayName, isRoomGroup ? room.coverImage : otherUser?.profileImage)}
                          className="w-full h-full object-cover"
                          alt=""
                        />
                      </div>
                      {unread > 0 && !isActive && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#00E5FF] text-[#0B0C10] text-[10px] font-black rounded-full flex items-center justify-center border-2 border-[#0B0C10] shadow-[0_0_10px_#00E5FF]">
                          {unread}
                        </div>
                      )}
                    </div>

                    <div className="flex-1 text-left min-w-0 z-10">
                      <div className="flex justify-between items-center mb-0.5">
                        <span className={`text-[14px] font-bold truncate tracking-tight ${isActive ? "text-white" : "text-gray-200"}`}>{displayName}</span>
                      </div>
                      <p className={`text-[11px] truncate opacity-60 font-medium uppercase tracking-widest ${isActive ? "text-white/80" : "text-gray-500"}`}>
                        {isRoomGroup ? `${room.users?.length || 0} Participants` : "Private Line"}
                      </p>
                    </div>

                    {/* Removed sidebarActiveIndicator dot/bar */}
                  </motion.button>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-20 px-6 text-center"
            >
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-[#7000FF]/10 rounded-full" />
                <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-[#1A1C23] to-[#0B0C10] border border-white/10 flex items-center justify-center text-4xl shadow-2xl">
                  📡
                </div>
              </div>
              <h3 className="text-sm font-black text-white uppercase tracking-widest mb-2">No transmissions found</h3>
              <p className="text-[11px] font-bold text-gray-500 leading-relaxed max-w-[200px]">
                Initiate a new connection to start the broadcast.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsCreateModalOpen(true)}
                className="mt-6 px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-[#00E5FF] hover:border-[#00E5FF]/30 transition-all"
              >
                Create Community
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.aside>
  );
}
