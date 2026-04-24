import React from 'react';
import { motion } from 'framer-motion';
import { Music2, Image as ImageIcon, LayoutGrid, UserPlus } from 'lucide-react';


export default function FeedFilter({ activeTab, setActiveTab, onOpenArtistPicker, selectedArtistName }) {
  const tabs = [
    { id: 'All', label: 'All Feed', icon: <LayoutGrid size={16} /> },
    { id: 'Reviews', label: 'Artists', icon: <Music2 size={16} /> },
    { id: 'Photos', label: 'Media', icon: <ImageIcon size={16} /> },
    { id: 'Picker', label: selectedArtistName || 'By Artist', icon: <UserPlus size={16} />, special: true },
  ];

  return (
    <div className="flex items-center justify-between bg-[#0B0C10]/80 border border-white/10 p-1.5 rounded-[28px] px-2 mb-4 backdrop-blur-2xl shadow-[inset_0_2px_10px_rgba(255,255,255,0.02)] relative overflow-hidden group">
      {/* Background Tube Glow */}
      <div className="absolute inset-0 bg-white/[0.01] pointer-events-none" />

      <div className="flex gap-1 text-sm font-black text-gray-500 w-full uppercase tracking-tighter relative z-10">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => tab.special ? onOpenArtistPicker() : setActiveTab(tab.id)}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-[22px] transition-all relative"
          >
            <div className={`relative z-20 flex items-center gap-2 transition-all duration-500 ${(activeTab === tab.id || (tab.special && selectedArtistName)) ? 'text-white scale-105' : 'hover:text-white'}`}>
              {tab.icon}
              <span className="hidden md:inline">{tab.label}</span>
            </div>

            {(activeTab === tab.id || (tab.special && selectedArtistName)) && (
              <motion.div
                layoutId="activeTabBG"
                className="absolute inset-1 bg-gradient-to-r from-[#00E5FF] via-[#7C4DFF] to-[#00E5FF] bg-[length:200%_auto] rounded-[22px] shadow-[0_0_25px_rgba(0,229,255,0.2)]"
                animate={{
                  backgroundPosition: ["0% center", "200% center"],
                }}
                transition={{
                  layout: {
                    type: "spring",
                    stiffness: 200,
                    damping: 25,
                    mass: 0.5
                  },
                  backgroundPosition: {
                    duration: 4,
                    repeat: Infinity,
                    ease: "linear"
                  }
                }}
              >
                {/* Surface Reflection */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent rounded-[22px] opacity-30" />
              </motion.div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
