import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, SlidersHorizontal } from 'lucide-react';
import { getAllArtists } from '../api/artist';



// Separate Components
import NavigationSidebar from '../components/HomePage/NavigationSidebar';
import FeedFilter from '../components/HomePage/FeedFilter';
import TrendingArtists from '../components/HomePage/TrendingArtists';
import DiscoverArtists from '../components/HomePage/DiscoverArtists';
import PostContainer from '../components/PostContainer';
import PostCreator from '../components/PostCreator';
import ArtistPickerModal from '../components/ArtistPickerModal';

export default function CommunityHomePage() {
  const [activeTab, setActiveTab] = useState('All');
  const [selectedArtists, setSelectedArtists] = useState([]);
  const [isArtistPickerOpen, setIsArtistPickerOpen] = useState(false);
  const navigate = useNavigate();

  const handleArtistSelect = (selected) => {
    setSelectedArtists(selected);
    if (selected.length > 0) setActiveTab('All');
    setIsArtistPickerOpen(false);
  };

  const toggleArtist = (artist) => {
    setSelectedArtists(prev => {
      const already = prev.find(a => a.id === artist.id);
      if (already) return prev.filter(a => a.id !== artist.id);
      return [...prev, artist];
    });
    setActiveTab('All');
  };

  return (
    <div id="community-page" className="h-[calc(100vh-64px)] bg-[#0B0C10] text-white font-sans overflow-hidden">
      
      {/* 🔮 MAIN CONTENT LAYOUT - Scrollable container for the whole viewport area */}
      <main className="w-full h-full flex flex-col xl:flex-row justify-between items-start relative pt-0 pb-0 overflow-y-auto hide-scrollbar overscroll-contain transform-gpu">
        
        {/* --- 👈 LEFT SIDEBAR (Locked in place) --- */}
        <aside className="hidden xl:block w-[350px] shrink-0 sticky top-0 h-[calc(100vh-64px)] overflow-hidden">
          <NavigationSidebar />
          
          <div className="pt-6">
            <div className="flex items-center gap-3 px-6 mb-6 group">
              <div className="w-8 h-8 rounded-lg bg-[#00E5FF]/10 flex items-center justify-center text-[#00E5FF] group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(0,229,255,0.1)]">
                <SlidersHorizontal size={16} />
              </div>
              <span className="text-xs font-black text-[#00E5FF] uppercase tracking-[0.2em]">Feed Discover</span>
            </div>
            <FeedFilter 
              activeTab={activeTab} 
              setActiveTab={(tab) => {
                setActiveTab(tab);
                setSelectedArtists([]);
              }} 
              onOpenArtistPicker={() => setIsArtistPickerOpen(true)}
              selectedArtistName={selectedArtists.length > 0 ? `${selectedArtists.length} Selected` : null}
              vertical={true}
            />
          </div>
        </aside>

        {/* --- 📱 CENTER FEED (Primary scroll content) --- */}
        <div className="flex-1 max-w-[720px] min-w-0 relative z-10 w-full group/feed px-6">
          {/* Subtle Top Fade (Overlay) */}
          <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-[#0B0C10] to-transparent z-20 pointer-events-none" />
          
          <div className="space-y-4 pt-2 pb-6 transform-gpu will-change-transform">
            {/* Post Creator */}
            <PostCreator />

            {/* Selected Artists Tags */}
            {selectedArtists.length > 0 && (
              <div className="flex flex-wrap gap-3 pb-2">
                {selectedArtists.map(artist => (
                  <motion.div 
                    key={artist.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-3 bg-gradient-to-r from-[#7C4DFF]/15 to-[#00E5FF]/5 border border-white/10 px-4 py-2.5 rounded-2xl shadow-lg group hover:border-[#00E5FF]/30 transition-all"
                  >
                    <span className="text-white text-sm font-bold uppercase tracking-tight">{artist.artistName}</span>
                    <button 
                      onClick={() => setSelectedArtists(prev => prev.filter(a => a.id !== artist.id))}
                      className="flex items-center justify-center ml-1 p-0.5 hover:bg-white/10 rounded-md transition-all"
                    >
                      <X size={15} className="text-white" strokeWidth={3} />
                    </button>
                  </motion.div>
                ))}
              </div>
            )}

            <AnimatePresence mode="wait">
                <PostContainer activeTab={activeTab} selectedArtistIds={selectedArtists.map(a => a.id)} />
            </AnimatePresence>
          </div>
        </div>

        {/* --- 👉 RIGHT SIDEBAR (Locked in place) --- */}
        <aside className="hidden xl:block w-[350px] shrink-0 sticky top-0 h-[calc(100vh-64px)] overflow-hidden">
          <TrendingArtists 
            onToggleArtist={toggleArtist} 
            selectedArtistIds={selectedArtists.map(a => a.id)} 
          />
          <DiscoverArtists />
        </aside>

      </main>

      {/* Artist Selection Modal */}
      {isArtistPickerOpen && (
        <ArtistPickerModal 
          selectedArtists={selectedArtists}
          onSelectionChange={handleArtistSelect}
          onClose={() => setIsArtistPickerOpen(false)}
        />
      )}
    </div>
  );
}


// Sub-component for the new tag filter
function ArtistTagSelector({ selectedArtistId, onSelect }) {
  const [artists, setArtists] = useState([]);
  
  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const res = await getAllArtists();
        const artistData = res?.artists || res?.data?.artists || res?.data || (Array.isArray(res) ? res : []);
        setArtists(Array.isArray(artistData) ? artistData : []);
      } catch (err) { console.error(err); }
    };
    fetchArtists();
  }, []);

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
      {artists.map(artist => (
        <button
          key={artist.id}
          onClick={() => onSelect(selectedArtistId === artist.id ? null : artist.id)}
          className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all border ${
            selectedArtistId === artist.id 
              ? 'bg-[#00F5D4] border-[#00F5D4] text-black shadow-[0_0_15px_rgba(0,245,212,0.4)]' 
              : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20 hover:text-white'
          }`}
        >
          {artist.artistName}
        </button>
      ))}
    </div>
  );
}










// --- 🧩 SUB-COMPONENTS (เพื่อความคลีนของโค้ด) ---

// function SidebarItem({ icon, label, active = false, badge }) {
//   return (
//     <li className={`flex items-center justify-between gap-4 cursor-pointer p-3 rounded-xl transition-all ${active ? 'bg-[#00E5FF]/10 text-[#00E5FF]' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
//       <div className="flex items-center gap-4">
//         {icon}
//         <span className="font-bold text-sm">{label}</span>
//       </div>
//       {badge && (
//         <span className="text-xs font-black bg-[#d000ff] text-white w-5 h-5 flex items-center justify-center rounded-full shadow-lg">
//           {badge}
//         </span>
//       )}
//     </li>
//   );
// }

// function PostToolButton({ icon, label }) {
//   return (
//     <button className="text-gray-500 hover:text-white flex items-center gap-2 text-sm bg-white/5 px-4 py-2 rounded-full border border-white/5 hover:border-white/10 transition-all">
//       {icon} {label}
//     </button>
//   );
// }

// function PostCard({ post, index }) {
//   return (
//     <motion.div 
//       initial={{ opacity: 0, y: 30 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ delay: index * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
//       className="bg-white/[0.03] border border-white/10 rounded-[32px] overflow-hidden hover:border-white/20 transition-all group shadow-xl"
//     >
//       {/* Post Header */}
//       <div className="p-6 pb-4">
//         <div className="flex items-center justify-between mb-4">
//           <div className="flex items-center gap-4">
//             <img src={post.user.avatar} className="w-12 h-12 rounded-full border-2 border-white/10 shadow-md" alt={post.user.name} />
//             <div>
//               <div className="flex items-center gap-2">
//                 <span className="font-black text-base group-hover:text-[#00E5FF] transition-colors">{post.user.name}</span>
//                 {post.user.verified && <Verified size={16} className="text-[#00E5FF]" />}
//               </div>
//               <span className="text-xs text-gray-500">{post.time}</span>
//             </div>
//           </div>
//           <button className="text-gray-600 hover:text-white p-2 rounded-full hover:bg-white/5">
//             <MoreHorizontal size={20} />
//           </button>
//         </div>
        
//         {/* Post Content */}
//         <p className="text-gray-200 mb-4 leading-relaxed font-light text-[15px]">
//           {post.content.split('*').map((part, i) => i % 2 === 1 ? <b key={i} className="font-bold text-white">{part}</b> : part)}
//         </p>
        
//         {post.tag && (
//           <span className="text-[#d000ff] text-xs font-bold bg-[#d000ff]/10 px-3 py-1 rounded-full border border-[#d000ff]/20">
//             #{post.tag}
//           </span>
//         )}
//       </div>

//       {/* Post Image (If exists) */}
//       {post.image && (
//         <div className="px-6 mb-4">
//           <img src={post.image} className="w-full h-[350px] object-cover rounded-2xl border border-white/10 shadow-inner" alt="Post content" />
//         </div>
//       )}

//       {/* Post Actions (น่าใช้งานตรงนี้) */}
//       <div className="px-6 py-4 flex justify-between items-center text-gray-400 border-t border-white/5 bg-white/[0.01]">
//         <div className="flex gap-6">
//           <ActionButton icon={<Heart size={18} />} label={post.likes.toLocaleString()} hoverColor="hover:text-red-500" />
//           <ActionButton icon={<MessageCircle size={18} />} label={post.comments.toLocaleString()} hoverColor="hover:text-[#00E5FF]" />
//         </div>
//         <ActionButton icon={<Share2 size={18} />} hoverColor="hover:text-blue-400" />
//       </div>
//     </motion.div>
//   );
// }

// function ActionButton({ icon, label, hoverColor }) {
//   return (
//     <button className={`flex items-center gap-2.5 transition-colors ${hoverColor} group`}>
//       <div className="group-hover:scale-110 transition-transform">{icon}</div>
//       {label && <span className="text-sm font-bold group-hover:text-white">{label}</span>}
//     </button>
//   );
// }

// function ArtistItem({ name, fans, avatar }) {
//   return (
//     <div className="flex items-center justify-between group cursor-pointer p-2 rounded-xl hover:bg-white/5 transition-colors">
//       <div className="flex items-center gap-3">
//         <img src={avatar} className="w-10 h-10 rounded-xl object-cover border border-white/10" alt={name} />
//         <div>
//           <p className="text-sm font-black tracking-tight">{name}</p>
//           <p className="text-[10px] text-gray-500 uppercase tracking-tighter">{fans} Fans</p>
//         </div>
//       </div>
//       <button className="text-gray-500 group-hover:text-[#00E5FF] transition p-2 rounded-full bg-white/5 hover:scale-110">
//         <Plus size={16} />
//       </button>
//     </div>
//   );
// }
