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
    <div className={`${vertical ? 'flex flex-col gap-3' : 'flex items-center justify-between mb-1 bg-[#0B0C10]/80 border border-white/10 p-1.5 rounded-full px-2 backdrop-blur-2xl shadow-lg w-full'} relative overflow-hidden group`}>
      <div className={`${vertical ? 'flex flex-col' : 'flex items-center w-full'} gap-1 relative z-10`}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => tab.special ? onOpenArtistPicker() : setActiveTab(tab.id)}
            className={`${vertical ? 'w-full justify-start px-6 py-4' : 'flex-1 justify-center px-2 py-2'} flex items-center rounded-2xl md:rounded-[24px] transition-all relative group/btn whitespace-nowrap`}
          >
            <div className={`relative z-20 flex items-center ${vertical ? 'gap-4' : 'gap-2'} transition-all duration-300 ${(activeTab === tab.id || (tab.special && selectedArtistName)) ? 'text-[#00E5FF] scale-105' : 'text-white/70 hover:text-white'}`}>
              <div className={`${vertical ? 'opacity-100' : 'hidden md:block'} shrink-0`}>
                {tab.icon}
              </div>
              <span className={`font-black uppercase tracking-widest ${vertical ? 'text-[13px]' : 'text-[9px] md:text-[12px]'}`}>
                {tab.label}
              </span>
            </div>

            {(activeTab === tab.id || (tab.special && selectedArtistName)) && (
              <motion.div
                layoutId="activeTabBG"
                className={`absolute inset-0 ${vertical ? 'bg-white/5 border border-white/10' : 'bg-gradient-to-r from-[#00E5FF] via-[#7C4DFF] to-[#00E5FF] shadow-[0_0_20px_rgba(0,229,255,0.3)]'} rounded-2xl md:rounded-[24px]`}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
