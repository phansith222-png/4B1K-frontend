import React from "react";
import { avatarUrl } from "../../utils/chatUtils";

const RoomItem = ({ room, isActive, unread, onClick, myUserId }) => {
  const isGroup = room.type === "community" || room.name || (room.participants?.length ?? 0) > 2;
  const other = !isGroup ? room.participants?.find((p) => p.id !== myUserId) : null;
  const name = room.name || other?.username || other?.firstName || `ห้อง ${room.id}`;
  const src = avatarUrl(name, isGroup ? room.profileImage : other?.profileImage);

  return (
    <button onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 text-left group
        ${isActive ? "bg-blue-600/20 border border-blue-500/30" : "hover:bg-white/5 border border-transparent"}`}>
      <div className="relative shrink-0">
        {isGroup
          ? <div className="w-11 h-11 rounded-full bg-gradient-to-br from-violet-600 to-blue-500 flex items-center justify-center font-bold text-white text-base shadow">
              {name.charAt(0).toUpperCase()}
            </div>
          : <img src={src} className="w-11 h-11 rounded-full object-cover" alt="" />
        }
        <span className="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-[#1c1e26]" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <span className={`text-sm font-semibold truncate ${isActive ? "text-blue-400" : "text-gray-200"}`}>{name}</span>
          {unread > 0 && !isActive && (
            <span className="ml-1 shrink-0 bg-blue-600 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">
              {unread > 9 ? "9+" : unread}
            </span>
          )}
        </div>
        {room.lastMessage && (
          <p className="text-xs text-gray-500 truncate mt-0.5">{room.lastMessage}</p>
        )}
      </div>
    </button>
  );
};

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
    <aside className={`
      flex flex-col shrink-0 border-r border-white/5 bg-[#1c1e26]
      w-full md:w-[320px] lg:w-[360px]
      ${showSidebar ? "flex" : "hidden"} md:flex
      transition-all duration-300
    `}>
      {/* top bar */}
      <div className="px-4 pt-4 pb-3 border-b border-white/5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg font-black bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent tracking-tight">
              Messages
            </span>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="p-1 rounded-full bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white transition-all shadow-sm"
              title="สร้างห้องชุมชนใหม่"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
          <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-[11px] font-bold
            ${connected ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${connected ? "bg-green-500" : "bg-red-500"}`} />
            {connected ? "Online" : "Offline"}
          </div>
        </div>

        {/* search */}
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="ค้นหาการสนทนา..."
            className="w-full bg-[#2a2d35] border border-white/5 rounded-xl pl-9 pr-4 py-2.5 text-sm text-gray-200 placeholder-gray-600 outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all" />
        </div>

        {/* tabs */}
        <div className="flex gap-1 mt-3 bg-[#13141a] p-1 rounded-xl">
          {["community", "personal"].map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all duration-200
                ${tab === t ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30" : "text-gray-500 hover:text-gray-300"}`}>
              {t === "community" ? "🌐 Community" : "💬 Personal"}
            </button>
          ))}
        </div>
      </div>

      {/* room list */}
      <div className="flex-1 overflow-y-auto p-2 space-y-0.5" style={{ scrollbarWidth: "thin", scrollbarColor: "#ffffff10 transparent" }}>
        {filteredContacts.length === 0
          ? <div className="flex flex-col items-center justify-center h-40 gap-2 text-gray-600">
              <span className="text-4xl">{tab === "community" ? "🌐" : "💬"}</span>
              <p className="text-xs font-semibold">ไม่มีการสนทนา</p>
            </div>
          : filteredContacts.map((r) => (
              <RoomItem key={r.id} room={r} isActive={activeChat === r.id}
                unread={unreadCounts[r.id] || 0} onClick={() => openChat(r.id)} myUserId={myUserId} />
            ))
        }
      </div>

      {/* me */}
      <div className="px-3 py-3 border-t border-white/5 flex items-center gap-3 bg-[#16181f]">
        <img src={myAvatar} className="w-9 h-9 rounded-full object-cover ring-2 ring-blue-500/40" alt="" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold truncate text-gray-200">{myName}</p>
          <p className="text-[11px] text-gray-600 truncate">{user?.email || ""}</p>
        </div>
        <span className="w-2 h-2 bg-green-500 rounded-full" />
      </div>
    </aside>
  );
}
