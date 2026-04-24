import { Plus } from 'lucide-react'

// --- 🧩 SUB-COMPONENTS (เพื่อความคลีนของโค้ด) ---
export const SidebarItem = ({ icon, label, active = false, badge, onClick, activeColor = "from-[#7C4DFF] to-[#00E5FF]", iconColor = "text-white" }) => {
  return (
    <li
      onClick={onClick}
      className={`flex items-center justify-between gap-4 cursor-pointer p-3.5 rounded-2xl transition-all duration-300 ${active
        ? `bg-gradient-to-r ${activeColor} text-white shadow-[0_0_20px_rgba(124,77,255,0.3)] translate-x-1`
        : 'text-gray-400 hover:bg-white/5 hover:text-white'
        }`}
    >
      <div className="flex items-center gap-4">
        <div className={`${active ? `scale-110 ${iconColor}` : ''} transition-transform`}>
          {icon}
        </div>
        <span className={`font-black text-sm uppercase tracking-tighter ${active ? 'text-white' : ''}`}>{label}</span>
      </div>
      {badge && (
        <span className="text-[10px] font-black bg-white text-[#7C4DFF] w-5 h-5 flex items-center justify-center rounded-full shadow-lg">
          {badge}
        </span>
      )}
    </li>
  );
}


export const PostToolButton = ({ icon, label }) => {
  return (
    <button className="text-gray-500 hover:text-white flex items-center gap-2 text-sm bg-white/5 px-4 py-2 rounded-full border border-white/5 hover:border-[#00E5FF]/30 transition-all">
      {icon} {label}
    </button>
  );
}

export const ActionButton = ({ icon, label, hoverColor, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative z-10 cursor-pointer flex items-center gap-2.5 transition-colors ${hoverColor === 'hover:text-[#00E5FF]' ? 'hover:text-[#00E5FF]' : hoverColor} group border-none bg-transparent p-1`}
    >
      <div className="group-hover:scale-110 transition-transform pointer-events-none">
        {icon}
      </div>
      {label && <span className="text-sm font-bold group-hover:text-white pointer-events-none">{label}</span>}
    </button>
  );
}



export const ArtistItem = ({ name, fans, avatar }) => {
  return (
    <div className="flex items-center justify-between group cursor-pointer p-2 rounded-xl hover:bg-white/5 transition-colors">
      <div className="flex items-center gap-3">
        <img src={avatar} className="w-10 h-10 rounded-xl object-cover border border-white/10" alt={name} />
        <div>
          <p className="text-sm font-black tracking-tight group-hover:text-[#00E5FF] transition-colors">{name}</p>
          <p className="text-[10px] text-gray-500 uppercase tracking-tighter">{fans} Fans</p>
        </div>
      </div>
      <button className="text-gray-500 group-hover:text-white transition p-2 rounded-full bg-white/5 hover:bg-gradient-to-r hover:from-[#7C4DFF] hover:to-[#00E5FF] hover:scale-110">
        <Plus size={16} />
      </button>
    </div>
  );
}

