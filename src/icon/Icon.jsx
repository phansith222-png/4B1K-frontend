import { Plus } from 'lucide-react'

// --- 🧩 SUB-COMPONENTS (เพื่อความคลีนของโค้ด) ---

export const SidebarItem = ({ icon, label, active = false, badge, onClick }) =>{
  return (
    <li 
      onClick={onClick}
      className={`flex items-center justify-between gap-4 cursor-pointer p-3 rounded-xl transition-all ${active ? 'bg-[#c6ff00]/10 text-[#c6ff00]' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
    >
      <div className="flex items-center gap-4">
        {icon}
        <span className="font-bold text-sm">{label}</span>
      </div>
      {badge && (
        <span className="text-xs font-black bg-[#d000ff] text-white w-5 h-5 flex items-center justify-center rounded-full shadow-lg">
          {badge}
        </span>
      )}
    </li>
  );
}

export const PostToolButton = ({ icon, label }) => {
  return (
    <button className="text-gray-500 hover:text-white flex items-center gap-2 text-sm bg-white/5 px-4 py-2 rounded-full border border-white/5 hover:border-white/10 transition-all">
      {icon} {label}
    </button>
  );
}

export const ActionButton = ({ icon, label, hoverColor, onClick }) => {
  return (
    <button 
      type="button"
      onClick={onClick}
      // เพิ่ม relative, z-10 และ cursor-pointer เพื่อความชัวร์
      className={`relative z-10 cursor-pointer flex items-center gap-2.5 transition-colors ${hoverColor} group border-none bg-transparent p-1`}
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
          <p className="text-sm font-black tracking-tight">{name}</p>
          <p className="text-[10px] text-gray-500 uppercase tracking-tighter">{fans} Fans</p>
        </div>
      </div>
      <button className="text-gray-500 group-hover:text-[#c6ff00] transition p-2 rounded-full bg-white/5 hover:scale-110">
        <Plus size={16} />
      </button>
    </div>
  );
}