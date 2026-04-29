import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, SlidersHorizontal, Flame, Sparkles } from 'lucide-react';
import { getAllArtists } from '../api/artist';



// Separate Components
import NavigationSidebar from '../components/HomePage/NavigationSidebar';
import FeedFilter from '../components/HomePage/FeedFilter';
import TrendingArtists from '../components/HomePage/TrendingArtists';
import DiscoverArtists from '../components/HomePage/DiscoverArtists';
import PostContainer from '../components/PostContainer';
import PostCreator from '../components/PostCreator';
import ArtistPickerModal from '../components/ArtistPickerModal';

import { useRef } from 'react';
import useUIStore from '../stores/uiStore';

export default function CommunityHomePage() {
  const [activeTab, setActiveTab] = useState('All');
  const [selectedArtists, setSelectedArtists] = useState([]);
  const [isArtistPickerOpen, setIsArtistPickerOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const { isNavbarVisible, setNavbarVisible } = useUIStore();
  const lastScrollY = useRef(0);

  const handleScroll = (e) => {
    if (window.innerWidth >= 1280) {
        if (!isNavbarVisible) setNavbarVisible(true);
        return;
    }

    const currentScrollY = e.currentTarget.scrollTop;
    const diff = currentScrollY - lastScrollY.current;
    
    // Only trigger if scroll difference is significant (e.g., > 10px)
    // and not near the very top of the page
    if (Math.abs(diff) > 10) {
        if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
            if (isNavbarVisible) setNavbarVisible(false);
        } else if (currentScrollY < lastScrollY.current) {
            if (!isNavbarVisible) setNavbarVisible(true);
        }
        lastScrollY.current = currentScrollY;
    }

    // Always show when near top
    if (currentScrollY < 50) {
        if (!isNavbarVisible) setNavbarVisible(true);
    }
  };

  const handleArtistSelect = (selected) => {
    setSelectedArtists(selected);
    if (selected.length > 0) setActiveTab('All');
    setIsArtistPickerOpen(false);
  };

  // 🎯 Scroll to Post from Notification (Robust version)
  useEffect(() => {
    const postId = searchParams.get('postId');
    if (postId) {
      // Ensure we are on "All" tab so the post is likely to be rendered
      setActiveTab('All');
      setSelectedArtists([]);

      let attempts = 0;
      const maxAttempts = 10;
      
      const scrollInterval = setInterval(() => {
        const element = document.getElementById(`post-${postId}`);
        const container = document.getElementById('main-scroll-container');
        
        if (element && container) {
          // 🛑 Stop searching immediately once found
          clearInterval(scrollInterval);
          
          // ⏳ Small delay to let the DOM settle for maximum smoothness
          setTimeout(() => {
            const targetScroll = element.offsetTop - 100;
            container.scrollTo({
              top: targetScroll,
              behavior: 'smooth'
            });
            
            // ✨ Premium Highlight Effect
            element.classList.add('ring-2', 'ring-[#00E5FF]', 'ring-offset-4', 'ring-offset-[#13141C]', 'shadow-[0_0_50px_rgba(0,229,255,0.4)]', 'transition-all', 'duration-700');
            setTimeout(() => {
              element.classList.remove('ring-2', 'ring-[#00E5FF]', 'ring-offset-4', 'ring-offset-[#13141C]', 'shadow-[0_0_50px_rgba(0,229,255,0.4)]');
            }, 3000);
          }, 100);
        }
        
        attempts++;
        if (attempts >= maxAttempts) clearInterval(scrollInterval);
      }, 300); // Faster check, but stops sooner

      return () => clearInterval(scrollInterval);
    }
  }, [searchParams]);

  const toggleArtist = (artist) => {
    setSelectedArtists(prev => {
      const already = prev.find(a => a.id === artist.id);
      if (already) return prev.filter(a => a.id !== artist.id);
      return [...prev, artist];
    });
    setActiveTab('All');
  };

  return (
    <div id="community-page" className="h-screen bg-[#13141C] text-white font-sans overflow-hidden flex flex-row">
      
      {/* 🔮 DYNAMIC LASER BACKGROUND ANIMATIONS */}
      <style>{`
        @keyframes float-magenta {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.08; }
          33% { transform: translate(100px, -150px) scale(1.2); opacity: 0.15; }
          66% { transform: translate(-100px, 150px) scale(0.8); opacity: 0.08; }
        }
        @keyframes float-cyan {
          0%, 100% { transform: translate(0, 0) scale(0.8); opacity: 0.05; }
          50% { transform: translate(-120px, 200px) scale(1.1); opacity: 0.12; }
        }
        @keyframes float-purple {
          0%, 100% { transform: scale(1); opacity: 0.05; }
          50% { transform: scale(1.5); opacity: 0.1; }
        }
        .bg-bloom { will-change: transform, opacity; pointer-events: none; }
      `}</style>

      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div 
          style={{ animation: 'float-magenta 15s ease-in-out infinite' }}
          className="bg-bloom absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#FF00FF]/20 blur-[120px] rounded-full"
        />
        <div 
          style={{ animation: 'float-purple 10s ease-in-out infinite' }}
          className="bg-bloom absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#7000FF]/15 blur-[200px] rounded-full"
        />
      </div>

      {/* --- 👈 LEFT SIDEBAR --- */}
      <aside className="hidden xl:block w-[380px] shrink-0 h-screen relative group/left z-30 overscroll-none mt-20">
          {/* Solid Black Background */}
          <div className="absolute inset-0 bg-black z-10" />
          
          {/* 🌟 Particle Underglow (Points of light like Landing Page) */}
          <div className="absolute inset-y-0 right-[-100px] w-[300px] z-0 pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: [0.1, 0.3, 0.1],
                  scale: [1, 1.5, 1],
                  y: [0, -20, 20, 0],
                  x: [0, 10, -10, 0]
                }}
                transition={{ 
                  duration: 4 + i, 
                  repeat: Infinity, 
                  delay: i * 0.8,
                  ease: "easeInOut"
                }}
                className="absolute rounded-full blur-3xl"
                style={{
                  top: `${15 + i * 15}%`,
                  right: `${10 + (i % 3) * 20}%`,
                  width: `${100 + i * 20}px`,
                  height: `${100 + i * 20}px`,
                  background: i % 3 === 0 ? '#00E5FF' : i % 3 === 1 ? '#7000FF' : '#FF00FF'
                }}
              />
            ))}
          </div>
          <div className="absolute inset-y-0 right-[-40px] w-[150px] bg-gradient-to-l from-transparent via-[#00E5FF]/10 to-transparent blur-[60px] z-0 pointer-events-none opacity-40" />
          
          <div className="relative z-20 h-full overflow-y-auto hide-scrollbar p-10">
            <NavigationSidebar />
            
            <div className="pt-6 border-t border-white/5 mt-6">
              <div className="flex items-center gap-4 mb-8 group">
                <div className="w-10 h-10 rounded-xl bg-[#00E5FF]/10 flex items-center justify-center text-[#00E5FF] group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(0,229,255,0.2)]">
                  <SlidersHorizontal size={20} />
                </div>
                <span className="text-sm font-black text-[#00E5FF] uppercase tracking-[0.25em]">Feed Discover</span>
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
          </div>
        </aside>

      {/* --- 📱 CENTER FEED (Scrollable) --- */}
      <main 
        id="main-scroll-container" 
        onScroll={handleScroll}
        className="flex-1 h-screen relative z-10 overflow-y-auto hide-scrollbar overscroll-none transform-gpu pt-[70px] md:pt-[80px] pb-32 xl:pb-10"
      >
        <div className="flex-1 max-w-[820px] min-w-0 relative z-10 w-full group/feed px-0 md:px-10 mx-auto">
          {/* Subtle Top Fade (Overlay) */}
          <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-[#0B0C10] to-transparent z-20 pointer-events-none" />
          
          <div className="space-y-0 md:space-y-4 pt-0 md:pt-2 pb-6 transform-gpu will-change-transform">
            
            {/* Post Creator (Top on Mobile) */}
            <motion.div 
              animate={{ 
                y: isNavbarVisible ? 0 : -20,
                opacity: isNavbarVisible ? 1 : 0,
              }}
              transition={{ duration: 0.2 }}
              className={`pt-0 pb-0 md:p-0 overflow-hidden ${!isNavbarVisible && 'pointer-events-none'}`}
            >
              <PostCreator />
            </motion.div>

            {/* Mobile Filter Tabs (Compact, Full-Width) */}
            <motion.div 
              animate={{ 
                y: isNavbarVisible ? 0 : -80,
                top: isNavbarVisible ? '0px' : '-80px'
              }}
              transition={{ duration: 0.3 }}
              className="xl:hidden sticky top-0 z-30 py-1 bg-[#0B0C10]/95 backdrop-blur-xl border-b border-white/5"
            >
              <FeedFilter 
                activeTab={activeTab} 
                setActiveTab={(tab) => {
                  setActiveTab(tab);
                  setSelectedArtists([]);
                }} 
                onOpenArtistPicker={() => setIsArtistPickerOpen(true)}
                selectedArtistName={selectedArtists.length > 0 ? `${selectedArtists.length} Selected` : null}
              />
            </motion.div>

            {/* Selected Artists Tags */}
            <motion.div 
              animate={{ 
                y: isNavbarVisible ? 0 : -10,
                opacity: isNavbarVisible ? 1 : 0,
              }}
              transition={{ duration: 0.2 }}
              className={`overflow-hidden ${!isNavbarVisible && 'pointer-events-none'}`}
            >
              {selectedArtists.length > 0 && (
                <div className="flex flex-wrap gap-3 pb-2 px-4 md:px-0 md:mt-0">
                  {selectedArtists.map(artist => (
                    <motion.div 
                      key={artist.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center gap-3 bg-gradient-to-r from-[#7000FF]/15 to-[#00E5FF]/5 border border-white/10 px-4 py-2.5 rounded-2xl shadow-lg group hover:border-[#00E5FF]/30 transition-all"
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
            </motion.div>

            <PostContainer activeTab={activeTab} selectedArtistIds={selectedArtists.map(a => a.id)} />
          </div>
        </div>
      </main>

      {/* --- 👉 RIGHT SIDEBAR --- */}
      <aside className="hidden xl:block w-[380px] shrink-0 h-screen relative group/right z-30 overscroll-none mt-20">
          {/* Solid Black Background */}
          <div className="absolute inset-0 bg-black z-10" />
          
          {/* 🌟 Particle Underglow (Points of light like Landing Page) */}
          <div className="absolute inset-y-0 left-[-100px] w-[300px] z-0 pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: [0.1, 0.3, 0.1],
                  scale: [1, 1.5, 1],
                  y: [0, 20, -20, 0],
                  x: [0, -10, 10, 0]
                }}
                transition={{ 
                  duration: 5 + i, 
                  repeat: Infinity, 
                  delay: i * 0.7 + 1,
                  ease: "easeInOut"
                }}
                className="absolute rounded-full blur-3xl"
                style={{
                  top: `${10 + i * 15}%`,
                  left: `${10 + (i % 3) * 20}%`,
                  width: `${120 + i * 15}px`,
                  height: `${120 + i * 15}px`,
                  background: i % 3 === 0 ? '#7000FF' : i % 3 === 1 ? '#00E5FF' : '#FF00FF'
                }}
              />
            ))}
          </div>
          <div className="absolute inset-y-0 left-[-40px] w-[150px] bg-gradient-to-r from-transparent via-[#7000FF]/10 to-transparent blur-[60px] z-0 pointer-events-none opacity-40" />

          <div className="relative z-20 h-full overflow-y-auto hide-scrollbar p-10 space-y-4">
            <div>
              <div className="flex items-center gap-4 mb-4 group">
                <div className="w-10 h-10 rounded-xl bg-[#FF4D00]/10 flex items-center justify-center text-[#FF4D00] group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(255,77,0,0.2)]">
                  <Flame size={20} />
                </div>
                <span className="text-sm font-black text-[#FF4D00] uppercase tracking-[0.25em]">Trending Artists</span>
              </div>
              <TrendingArtists 
                onToggleArtist={toggleArtist} 
                selectedArtistIds={selectedArtists.map(a => a.id)} 
              />
            </div>

            <div className="border-t border-white/5 pt-4">
              <div className="flex items-center gap-4 mb-4 group">
                <div className="w-10 h-10 rounded-xl bg-[#00E5FF]/10 flex items-center justify-center text-[#00E5FF] group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(0,229,255,0.2)]">
                  <Sparkles size={20} />
                </div>
                <span className="text-sm font-black text-[#00E5FF] uppercase tracking-[0.25em]">Discover Artists</span>
              </div>
              <DiscoverArtists />
            </div>
          </div>
        </aside>

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
//        className="bg-white/[0.03] border-y md:border border-white/10 rounded-2xl md:rounded-[32px] overflow-hidden hover:border-white/20 transition-all group shadow-xl"
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
