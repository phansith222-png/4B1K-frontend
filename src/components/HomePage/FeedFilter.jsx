import React from 'react';
import { motion } from 'framer-motion';
import { Music2, Image as ImageIcon, LayoutGrid, UserPlus } from 'lucide-react';


export default function FeedFilter({ activeTab, setActiveTab, onOpenArtistPicker, selectedArtistName, vertical = false }) {
  const tabs = [
    { id: 'All', label: 'All Feed', icon: <LayoutGrid size={18} /> },
    { id: 'Reviews', label: 'Artists', icon: <Music2 size={18} /> },
    { id: 'Photos', label: 'Media', icon: <ImageIcon size={18} /> },
    { id: 'Picker', label: selectedArtistName || 'Select Artist', icon: <UserPlus size={18} />, special: true },
  ];

  return (
    <div className={`${vertical ? 'flex flex-col gap-3' : 'flex items-center justify-between mb-4 bg-[#0B0C10]/80 border border-white/10 p-1.5 rounded-[28px] px-2 backdrop-blur-2xl shadow-[inset_0_2px_10px_rgba(255,255,255,0.02)]'} relative overflow-hidden group`}>
      {!vertical && <div className="absolute inset-0 bg-white/[0.01] pointer-events-none" />}

      <div className={`${vertical ? 'flex flex-col' : 'flex'} gap-2 text-[15px] font-bold text-white w-full tracking-tight relative z-10`}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => tab.special ? onOpenArtistPicker() : setActiveTab(tab.id)}
            className={`flex-1 flex items-center ${vertical ? 'justify-start px-4' : 'justify-center px-4'} gap-4 py-3.5 rounded-2xl transition-all relative group/btn`}
          >
            <div className={`relative z-20 flex items-center gap-4 transition-all duration-300 ${(activeTab === tab.id || (tab.special && selectedArtistName)) ? 'text-white scale-105' : 'text-white hover:text-[#00E5FF]'}`}>
              <div className={`${(activeTab === tab.id || (tab.special && selectedArtistName)) ? 'text-[#00E5FF]' : ''}`}>
                {tab.icon}
              </div>
              <span className={`${vertical ? 'inline' : 'hidden md:inline'} font-semibold`}>{tab.label}</span>
            </div>

            {(activeTab === tab.id || (tab.special && selectedArtistName)) && (
              <motion.div
                layoutId="activeTabBG"
                className={`absolute inset-0 ${vertical ? 'bg-white/5 border border-white/10' : 'bg-gradient-to-r from-[#00E5FF] via-[#7C4DFF] to-[#00E5FF] bg-[length:200%_auto] shadow-[0_0_25px_rgba(0,229,255,0.2)]'} rounded-2xl`}
                animate={!vertical ? { backgroundPosition: ["0% center", "200% center"] } : {}}
                transition={{
                  layout: { type: "spring", stiffness: 200, damping: 25, mass: 0.5 },
                  backgroundPosition: { duration: 4, repeat: Infinity, ease: "linear" }
                }}
              >
                {!vertical && <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent rounded-2xl opacity-30" />}
              </motion.div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
