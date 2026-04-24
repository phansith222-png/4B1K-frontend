import React from "react";
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
  setIsCreateModalOpen
}) {
  return (
    <aside className={`w-full md:w-[360px] flex-col bg-[#13141a] border-r border-white/5 ${showSidebar ? "flex" : "hidden"} md:flex z-30 transition-all duration-300`}>
      {/* ── User Profile Header ── */}
      <div className="p-6 bg-gradient-to-b from-[#1c1e26] to-transparent">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img src={myAvatar} className="w-11 h-11 rounded-2xl object-cover ring-2 ring-blue-500/20 shadow-xl" alt="" />
              <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#13141a] ${connected ? "bg-emerald-500" : "bg-gray-600"}`} />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm font-extrabold text-gray-100 truncate tracking-tight">{myName}</h2>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{connected ? "Online Now" : "Reconnecting..."}</p>
            </div>
          </div>
          <button onClick={() => setIsCreateModalOpen(true)}
            className="p-2.5 rounded-xl bg-blue-600/10 text-blue-500 hover:bg-blue-600 hover:text-white transition-all shadow-lg shadow-blue-600/5">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>

        {/* ── Search Bar ── */}
        <div className="relative group">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search communities..."
            className="w-full bg-[#1c1e26] border border-white/5 rounded-2xl pl-10 pr-4 py-3 text-sm text-gray-200 placeholder-gray-600 outline-none focus:border-blue-500/40 transition-all shadow-inner" />
        </div>

        {/* ── Tabs ── */}
        <div className="flex gap-1 mt-5 bg-[#0B0C10] p-1.5 rounded-2xl border border-white/5">
          {["community", "personal"].map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-2 rounded-xl text-[11px] font-extrabold uppercase tracking-widest transition-all duration-300
                ${tab === t ? "bg-[#1c1e26] text-blue-400 shadow-xl border border-white/5" : "text-gray-600 hover:text-gray-400"}`}>
              {t === "community" ? "Community" : "Personal"}
            </button>
          ))}
        </div>
      </div>

      {/* ── Room List ── */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2" style={{ scrollbarWidth: "thin", scrollbarColor: "#ffffff05 transparent" }}>
        {filteredContacts.length > 0 ? (
          filteredContacts.map((room) => {
            const isRoomGroup = room.isGroup;
            const otherUser = !isRoomGroup ? room.users?.find((u) => u.userId !== myUserId)?.user : null;
            const displayName = isRoomGroup ? (room.name || `กลุ่ม ${room.id}`) : (otherUser?.username || otherUser?.firstName || "กำลังโหลด...");
            const unread = unreadCounts[room.id] || 0;
            const isActive = activeChat === room.id;

            return (
              <button key={room.id} onClick={() => openChat(room.id)}
                className={`w-full flex items-center gap-4 p-3.5 rounded-2xl transition-all duration-300 group
                  ${isActive ? "bg-blue-600 text-white shadow-2xl shadow-blue-600/20" : "hover:bg-white/5 text-gray-400 hover:text-gray-200"}`}>
                <div className="relative shrink-0">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-extrabold overflow-hidden shadow-lg border border-white/5
                    ${isActive ? "bg-white/20" : isRoomGroup ? "bg-gradient-to-tr from-indigo-500 to-purple-600" : "bg-[#2a2d35]"}`}>
                    <img src={avatarUrl(displayName, isRoomGroup ? room.profileImage : otherUser?.profileImage)} 
                      className="w-full h-full object-cover" alt="" />
                  </div>
                  {isActive && <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-full" />}
                </div>

                <div className="flex-1 text-left min-w-0">
                  <div className="flex justify-between items-center mb-0.5">
                    <span className={`text-[14px] font-bold truncate tracking-tight ${isActive ? "text-white" : "text-gray-200"}`}>{displayName}</span>
                    {unread > 0 && (
                      <span className="bg-red-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full shadow-lg animate-pulse">{unread}</span>
                    )}
                  </div>
                  <p className={`text-[11px] truncate opacity-60 font-medium ${isActive ? "text-white/80" : "text-gray-500"}`}>
                    {isRoomGroup ? `${room.users?.length || 0} participants` : "Click to message"}
                  </p>
                </div>
              </button>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-20 opacity-20 grayscale">
            <div className="text-4xl mb-4">🔍</div>
            <p className="text-xs font-bold uppercase tracking-widest text-center">No chats found</p>
          </div>
        )}
      </div>
    </aside>
  );
}
