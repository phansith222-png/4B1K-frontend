import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Bell, Users, Calendar, MapPin, 
  MessageCircle, Heart, Plus, Share2, MoreHorizontal,
  Flame, Music4, Verified, Filter
} from 'lucide-react';
import PostContainer from '../components/PostContainer';
import { ArtistItem, PostToolButton, SidebarItem } from '../icon/icon';

// --- 🌟 MOCK DATA (เพื่อให้หน้าเว็บดูมีชีวิต) ---
const mockPosts = [
  {
    id: 1,
    user: { name: 'DJ_AstroNinja', avatar: 'https://i.pravatar.cc/150?u=astro', verified: true },
    time: '5m ago',
    content: 'ใครมาคอนเสิร์ต *Nebula Festival* เมื่อคืนบ้าง? เซ็ตลิตส์ของ Martin Garrix คือที่สุด! เวิลด์คลาสมากกก 🔥🔥🔥',
    tag: 'NebulaFest2026',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1000&auto=format&fit=crop',
    likes: 1250,
    comments: 88,
  },
  {
    id: 2,
    user: { name: 'Ploy_Chiba', avatar: 'https://i.pravatar.cc/150?u=ploy' },
    time: '28m ago',
    content: 'อยากหาเพื่อนแชร์ค่ารถไปดู *LANY* รอบเสาร์นี้ค่ะ มีใครพักแถวสยามไหมคะ? ทัก DM มาได้เลยย ✌️',
    tag: 'LANY_BKK',
    likes: 45,
    comments: 12,
  },
  {
    id: 3,
    user: { name: 'BassHead_Thailand', avatar: 'https://i.pravatar.cc/150?u=bass', verified: true },
    time: '1h ago',
    content: 'แอบสปอยล์! เวที *EDC Thailand* ปีนี้อลังการกว่าเดิม 3 เท่า! เตรียมตัวหูแตกกันได้เลย 😏 #EDC #RaveCulture',
    tag: 'EDCThailand',
    likes: 890,
    comments: 210,
  },
];

const trendingTags = [
  { name: 'NebulaFest2026', posts: '1.2K' },
  { name: 'LANY_BKK', posts: '850' },
  { name: 'ColdplayWorldTour', posts: '2.3K' },
  { name: 'EDCThailand', posts: '910' },
];

export default function CommunityHomePage() {
  const [activeTab, setActiveTab] = useState('Feed');

  return (
    // ครอบด้วย ID เฉพาะ เพื่อจำกัด Scope ของสไตล์ (กันรั่วไปหน้าอื่น)
    <div id="community-page" className="min-h-screen bg-black text-white font-sans pt-24 pb-12 px-4 md:px-8">
      
      {/* 🌌 สไตล์เฉพาะหน้า (Scoped Style) */}
      <style>{`
        #community-page { scroll-behavior: smooth; }
        #community-page ::-webkit-scrollbar { width: 6px; }
        #community-page ::-webkit-scrollbar-track { background: transparent; }
        #community-page ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        #community-page ::-webkit-scrollbar-thumb:hover { background: #c6ff00; }
        
        @keyframes laserGlow {
          0%, 100% { opacity: 0.5; filter: blur(10px); }
          50% { opacity: 1; filter: blur(15px); }
        }
      `}</style>

      {/* 🔮 MAIN CONTENT LAYOUT */}
      <main className="max-w-[1400px] mx-auto grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* --- 👈 LEFT SIDEBAR (Navigation & Shortcuts) --- */}
        <aside className="hidden xl:col-span-3 xl:block space-y-6 sticky top-28 h-[calc(100vh-140px)]">
          <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
            <h3 className="text-gray-500 text-xs font-black tracking-widest mb-6 uppercase">Navigation</h3>
            <ul className="space-y-3">
              <SidebarItem icon={<Flame size={20} />} label="Hot Feed" active />
              <SidebarItem icon={<Users size={20} />} label="My Squads" badge="3" />
              <SidebarItem icon={<Calendar size={20} />} label="Upcoming Gigs" />
              <SidebarItem icon={<Music4 size={20} />} label="Favorite Artists" />
              <SidebarItem icon={<MapPin size={20} />} label="Nearby Events" />
            </ul>
          </div>

          <div className="bg-gradient-to-br from-[#d000ff]/10 to-transparent border border-[#d000ff]/20 rounded-3xl p-6 relative overflow-hidden group">
            {/* Background Effect */}
            <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-[#d000ff] rounded-full blur-[50px] opacity-20 group-hover:opacity-40 transition-opacity" />
            
            <h4 className="font-bold text-lg mb-2 relative z-10">Start a New Squad?</h4>
            <p className="text-xs text-gray-400 mb-5 relative z-10 leading-relaxed">Find rave mates for the *Coldplay World Tour 2026* in Bangkok.</p>
            <button className="w-full bg-[#c6ff00] text-black py-3 rounded-2xl text-sm font-black hover:scale-[1.03] transition-transform relative z-10 shadow-[0_0_20px_rgba(198,255,0,0.3)]">
              CREATE SQUAD
            </button>
          </div>
        </aside>

        {/* --- 📱 CENTER FEED (Main Content) --- */}
        <div className="xl:col-span-6 space-y-8">
          {/* Post Creator */}
          <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 backdrop-blur-xl shadow-2xl">
            <div className="flex gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#c6ff00] to-blue-500 flex-shrink-0 shadow-lg border-2 border-white/10" />
              <textarea 
                placeholder="Share your concert vibes, ask questions, or find squad mates..." 
                className="w-full bg-transparent border-none outline-none resize-none pt-2 text-lg text-white placeholder:text-gray-600 h-20"
              />
            </div>
            <div className="flex justify-between items-center mt-5 pt-5 border-t border-white/5">
              <div className="flex gap-2">
                <PostToolButton icon={<Plus size={18} />} label="Media" />
                <PostToolButton icon={<Music4 size={18} />} label="Artist" />
              </div>
              <button className="bg-[#c6ff00] text-black px-8 py-3 rounded-full font-black text-sm hover:bg-white transition-colors shadow-lg">
                Post
              </button>
            </div>
          </div>

          {/* Feed Filter (น่าเชื่อถือตรงนี้) */}
          <div className="flex items-center justify-between bg-white/[0.02] border border-white/5 p-2 rounded-full px-6">
            <div className="flex gap-6 text-sm font-bold text-gray-400">
              {['All', 'Squads', 'Reviews', 'Photos'].map(tab => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-2 relative ${activeTab === tab ? 'text-white' : 'hover:text-white'}`}
                >
                  {tab}
                  {activeTab === tab && (
                    <motion.div layoutId="activeTab" className="absolute -bottom-2 left-0 right-0 h-0.5 bg-[#c6ff00]" />
                  )}
                </button>
              ))}
            </div>
            <button className="text-gray-500 hover:text-[#c6ff00] flex items-center gap-2 text-sm">
              <Filter size={16} /> Filter
            </button>
          </div>

          <AnimatePresence>
              <PostContainer/>
          </AnimatePresence>
        </div>

        {/* --- 👉 RIGHT SIDEBAR (Trending & Discover) --- */}
        <aside className="xl:col-span-3 space-y-8 sticky top-28 h-[calc(100vh-140px)]">
          <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
            <h3 className="text-[#c6ff00] text-xs font-black tracking-widest mb-6 uppercase flex items-center gap-2">
              <Flame size={16} /> Trending Tags
            </h3>
            <div className="space-y-5">
              {trendingTags.map(tag => (
                <div key={tag.name} className="flex justify-between items-center group cursor-pointer">
                  <span className="text-gray-300 group-hover:text-white transition-colors">#{tag.name}</span>
                  <span className="text-xs text-gray-600 bg-white/5 px-3 py-1 rounded-full group-hover:bg-[#c6ff00]/10 group-hover:text-[#c6ff00] transition-all">
                    {tag.posts} posts
                  </span>
                </div>
              ))}
            </div>
          </div>


          <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 backdrop-blur-xl relative overflow-hidden">
            {/* Laser Decorative Line */}
            <div className="absolute top-0 left-10 w-0.5 h-full bg-[#c6ff00] blur-[8px] opacity-30" style={{ animation: 'laserGlow 3s infinite' }} />
            
            <h3 className="text-gray-500 text-xs font-black tracking-widest mb-6 uppercase relative z-10">Discover Artists</h3>
            <div className="space-y-4 relative z-10">
              <ArtistItem name="Blackpink" fans="1.2M" avatar="https://i.pravatar.cc/150?u=bp" />
              <ArtistItem name="Coldplay" fans="980K" avatar="https://i.pravatar.cc/150?u=cp" />
              <ArtistItem name="LANY" fans="450K" avatar="https://i.pravatar.cc/150?u=lany" />
            </div>
            <button className="w-full mt-6 text-xs text-gray-500 hover:text-white transition relative z-10">View all artists</button>
          </div>
        </aside>

      </main>
    </div>
  );
}







// --- 🧩 SUB-COMPONENTS (เพื่อความคลีนของโค้ด) ---

// function SidebarItem({ icon, label, active = false, badge }) {
//   return (
//     <li className={`flex items-center justify-between gap-4 cursor-pointer p-3 rounded-xl transition-all ${active ? 'bg-[#c6ff00]/10 text-[#c6ff00]' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
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
//                 <span className="font-black text-base group-hover:text-[#c6ff00] transition-colors">{post.user.name}</span>
//                 {post.user.verified && <Verified size={16} className="text-[#c6ff00]" />}
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
//           <ActionButton icon={<MessageCircle size={18} />} label={post.comments.toLocaleString()} hoverColor="hover:text-[#c6ff00]" />
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
//       <button className="text-gray-500 group-hover:text-[#c6ff00] transition p-2 rounded-full bg-white/5 hover:scale-110">
//         <Plus size={16} />
//       </button>
//     </div>
//   );
// }