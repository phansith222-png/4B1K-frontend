import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { getAllArtists } from '../api/auth';



// Separate Components
import NavigationSidebar from '../components/HomePage/NavigationSidebar';
import MusicDiscoveryCard from '../components/HomePage/MusicDiscoveryCard';
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
    <div id="community-page" className="min-h-screen bg-[#0B0C10] text-white font-sans pt-8 pb-24 px-4 md:px-8">
      
      {/* 🔮 MAIN CONTENT LAYOUT */}
      <main className="max-w-[1400px] mx-auto grid grid-cols-1 xl:grid-cols-12 gap-8 mt-4">
        
        {/* --- 👈 LEFT SIDEBAR (Navigation & Shortcuts) --- */}
        <aside className="hidden xl:col-span-3 xl:block space-y-6 h-fit z-20">
          <NavigationSidebar />
          <MusicDiscoveryCard />
        </aside>

        {/* --- 📱 CENTER FEED (Main Content) --- */}
        <div className="xl:col-span-6 space-y-4 relative z-10">
          {/* Post Creator */}
          <PostCreator />

          {/* Feed Filter Consolidated */}
          <div className="flex flex-col gap-6">
            <FeedFilter 
              activeTab={activeTab} 
              setActiveTab={(tab) => {
                setActiveTab(tab);
                setSelectedArtists([]);
              }} 
              onOpenArtistPicker={() => setIsArtistPickerOpen(true)}
              selectedArtistName={selectedArtists.length > 0 ? `${selectedArtists.length} Selected` : null}
            />
            
            {selectedArtists.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {selectedArtists.map(artist => (
                  <motion.div 
                    key={artist.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-3 bg-gradient-to-r from-[#7C4DFF]/15 to-[#00E5FF]/5 border border-white/10 px-4 py-2.5 rounded-2xl shadow-lg group hover:border-[#00E5FF]/30 transition-all"
                  >
                    <img 
                      src={artist.profileImage || `https://ui-avatars.com/api/?name=${artist.artistName}`} 
                      className="w-7 h-7 rounded-full border border-white/10" 
                      alt="" 
                    />
                    <span className="text-white text-sm font-bold">{artist.artistName}</span>
                    <button 
                      onClick={() => setSelectedArtists(prev => prev.filter(a => a.id !== artist.id))}
                      className="text-gray-500 hover:text-red-500 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          <AnimatePresence mode="wait">
              <PostContainer activeTab={activeTab} selectedArtistIds={selectedArtists.map(a => a.id)} />
          </AnimatePresence>
        </div>

        {/* --- 👉 RIGHT SIDEBAR (Trending & Discover) --- */}
        <aside className="xl:col-span-3 space-y-8 h-fit z-20">
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
        const resp = await getAllArtists();
        setArtists(resp.data.artists || []);
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
