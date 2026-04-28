import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Hooks
import { useNavbarData } from '../hooks/useNavbarData';
import useUserStore from '../stores/userStore';
import useUIStore from '../stores/uiStore';

// Sub-components
import NavSearchBar from './navbar/NavSearchBar';
import NavArtistMenu from './navbar/NavArtistMenu';
import useSearchStore from '../stores/searchStore';
import { getImageUrl } from '../utils/imageUtils';
import useNotificationStore from '../stores/notificationStore';

export default function NavbarUser({ isLanding = false }) {
    const navigate = useNavigate();
    const menuRef = useRef(null);
    const buttonRef = useRef(null);
    const profileRef = useRef(null);

    const user = useUserStore(s => s.user);
    const logout = useUserStore(s => s.logout);

    const [isArtistMenuOpen, setIsArtistMenuOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [isNotifyOpen, setIsNotifyOpen] = useState(false);
    const notifyRef = useRef(null);
    const [language, setLanguage] = useState('EN');
    const { isSearchOpen } = useSearchStore();
    const { isNavbarVisible } = useUIStore();

    const {
        mainSlides, topEvents,
        currentSlide, setCurrentSlide,
        isHoveringMain, setIsHoveringMain,
        chartOrder, setChartOrder,
    } = useNavbarData();

    const location = useLocation();
    const path = location.pathname;
    const isConcertActive = ['/new-event', '/nearby-events'].some(p => path.startsWith(p));
    const isArtistActive = ['/artists', '/pop', '/rock', '/classic', '/edm', '/etc', '/entertainment'].some(p => path.startsWith(p)) || isArtistMenuOpen;
    const isCommunityActive = path === '/' || path.startsWith('/community') || path.startsWith('/home');
    const isChatActive = path.startsWith('/chat');

    // Close on outside click
    useEffect(() => {
        const handler = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target) &&
                buttonRef.current && !buttonRef.current.contains(e.target))
                setIsArtistMenuOpen(false);
            if (profileRef.current && !profileRef.current.contains(e.target))
                setIsProfileMenuOpen(false);
            if (notifyRef.current && !notifyRef.current.contains(e.target))
                setIsNotifyOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    // Auto-slide hero
    useEffect(() => {
        if (!isArtistMenuOpen || isHoveringMain || mainSlides.length === 0) return;
        const t = setInterval(() => setCurrentSlide(p => (p + 1) % mainSlides.length), 4000);
        return () => clearInterval(t);
    }, [isArtistMenuOpen, isHoveringMain, mainSlides.length]);

    // Auto-shuffle chart
    useEffect(() => {
        if (!isArtistMenuOpen || topEvents.length === 0) return;
        const t = setInterval(() => {
            setChartOrder(prev => {
                const next = [...prev];
                next.push(next.shift());
                return next;
            });
        }, 3000);
        return () => clearInterval(t);
    }, [isArtistMenuOpen, topEvents.length]);

    const handleNavigate = (path) => {
        setIsArtistMenuOpen(false);
        setIsProfileMenuOpen(false);
        setIsNotifyOpen(false);
        navigate(path);
    };

    const handleLinkClick = (e, targetPath) => {
        if (location.pathname === targetPath) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleLogout = () => {
        logout();
        setIsArtistMenuOpen(false);
        setIsProfileMenuOpen(false);
        navigate('/');
        window.location.reload();
    };

    const displayName = user?.firstName && user?.lastName
        ? `${user.firstName} ${user.lastName}`
        : user?.username || 'User';

    const { notifications: storeNotifications } = useNotificationStore();

    // 🔔 Combine Store Notifications (Social) + Top Events
    const socialNotifications = [...storeNotifications].sort((a, b) => new Date(b.time) - new Date(a.time));
    const eventNotifications = topEvents.slice(0, 3).map(e => ({
        id: `event-${e.id}`,
        type: 'event',
        title: e.eventName,
        desc: e.description || 'New concert frequency detected.',
        img: e.posterImage || e.coverImage || e.image,
        time: e.startTime,
        link: `/new-event?eventId=${e.id}`
    }));

    const notifications = [...socialNotifications, ...eventNotifications];

    return (
        <div className="relative">
            <style>{`
                @keyframes smoothWave{0%,100%{height:12px;opacity:.7}50%{height:28px;opacity:1;box-shadow:0 0 10px currentColor}}
                .bar-1{background-color:#FF00FF;color:#FF00FF;animation:smoothWave 2.5s infinite ease-in-out 0s}
                .bar-2{background-color:#7000FF;color:#7000FF;animation:smoothWave 2.5s infinite ease-in-out .4s}
                .bar-3{background-color:#00E5FF;color:#00E5FF;animation:smoothWave 2.5s infinite ease-in-out .8s}
                .bar-4{background-color:#FFFFFF;color:#FFFFFF;animation:smoothWave 2.5s infinite ease-in-out 1.2s}
                .text-shine{background:linear-gradient(120deg,#FFF 0%,#FFF 40%,#00E5FF 50%,#FFF 60%,#FFF 100%);background-size:200% auto;color:transparent;-webkit-background-clip:text;background-clip:text;animation:shine 4s linear infinite}
                @keyframes shine{to{background-position:200% center}}
                .custom-scrollbar-smooth {
                    scrollbar-width: thin;
                    scrollbar-color: rgba(0, 229, 255, 0.2) transparent;
                    scroll-behavior: smooth;
                }
                .custom-scrollbar-smooth::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar-smooth::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar-smooth::-webkit-scrollbar-thumb { 
                    background: rgba(0, 229, 255, 0.2); 
                    border-radius: 20px;
                }
                .custom-scrollbar-smooth::-webkit-scrollbar-thumb:hover { background: rgba(0, 229, 255, 0.4); }
            `}</style>

            <motion.header
                initial={{ y: 0 }}
                animate={{ y: isNavbarVisible ? 0 : -110 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="fixed top-0 left-0 right-0 flex justify-between items-center px-2 md:px-10 py-4 md:py-5 bg-[#0B0C10]/98 z-50 border-b border-white/5 shadow-lg font-sans"
            >

                {/* Left: Back (Mobile) + Logo + Search (Desktop) */}
                <div className="flex-1 flex justify-start items-center gap-1 md:gap-6">
                    {/* Back Button - Mobile Only */}
                    <button
                        onClick={() => navigate(-1)}
                        className="xl:hidden p-1.5 text-gray-400 hover:text-[#00E5FF] transition-colors"
                    >
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    <div
                        className="flex items-center gap-2 cursor-pointer z-50 shrink-0"
                        onClick={(e) => {
                            if (location.pathname === '/landing') {
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            } else {
                                navigate('/landing');
                            }
                        }}
                    >
                        <div className="flex items-end gap-[2px] h-6 w-5">
                            <div className="w-1 rounded-full bar-1" />
                            <div className="w-1 rounded-full bar-2" />
                            <div className="w-1 rounded-full bar-3" />
                            <div className="w-1 rounded-full bar-4" />
                        </div>
                        <div className="text-2xl md:text-3xl font-black italic tracking-tighter text-shine mt-1">4B1K</div>
                    </div>

                    {/* Desktop Search Bar (Now on the left) */}
                    <div className="hidden xl:block">
                        <NavSearchBar navigate={navigate} />
                    </div>
                </div>

                {/* Mobile Search Overlay - Drops from top */}
                <AnimatePresence>
                    {isSearchOpen && (
                        <motion.div
                            initial={{ y: -100, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -100, opacity: 0 }}
                            className="xl:hidden absolute top-full left-0 right-0 bg-[#0B0C10]/95 backdrop-blur-2xl p-4 border-b border-white/10 shadow-2xl z-[45]"
                        >
                            <NavSearchBar navigate={navigate} />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Center: Navigation (Absolute Center) */}
                <motion.nav
                    animate={{
                        opacity: 1,
                        x: '-50%',
                        pointerEvents: 'auto'
                    }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute left-1/2 hidden xl:block z-[60]"
                >
                    <ul className="flex items-center gap-10 text-[15px] font-bold">
                        <li className="relative group">
                            <Link
                                to="/home"
                                onClick={(e) => handleLinkClick(e, '/home')}
                                className={`transition-all duration-300 ${isCommunityActive ? 'text-[#00E5FF] drop-shadow-[0_0_8px_rgba(0,229,255,0.5)]' : 'text-gray-300 hover:text-[#00E5FF]'}`}
                            >
                                Community
                            </Link>
                            {isCommunityActive && <motion.div layoutId="nav-active-user" className="absolute -bottom-2 left-0 right-0 h-[2px] bg-[#00E5FF] shadow-[0_0_10px_#00E5FF]" />}
                        </li>
                        <li className="relative">
                            <button
                                ref={buttonRef}
                                onClick={() => setIsArtistMenuOpen(v => !v)}
                                className={`flex items-center gap-1.5 focus:outline-none transition-all duration-300 ${isArtistActive ? 'text-[#00E5FF] drop-shadow-[0_0_8px_rgba(0,229,255,0.5)]' : 'text-gray-300 hover:text-[#00E5FF]'}`}
                            >
                                Artist Biology
                                <motion.svg
                                    animate={{ rotate: isArtistMenuOpen ? 0 : 180 }}
                                    className={`w-4 h-4 ${isArtistActive ? 'text-[#00E5FF]' : 'text-gray-500'}`}
                                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                                </motion.svg>
                            </button>
                            {isArtistActive && !isArtistMenuOpen && <motion.div layoutId="nav-active-user" className="absolute -bottom-2 left-0 right-0 h-[2px] bg-[#00E5FF] shadow-[0_0_10px_#00E5FF]" />}
                        </li>
                        <li className="relative group">
                            <Link
                                to="/new-event"
                                onClick={(e) => handleLinkClick(e, '/new-event')}
                                className={`transition-all duration-300 ${isConcertActive ? 'text-[#00E5FF] drop-shadow-[0_0_8px_rgba(0,229,255,0.5)]' : 'text-gray-300 hover:text-[#00E5FF]'}`}
                            >
                                Concert Event
                            </Link>
                            {isConcertActive && <motion.div layoutId="nav-active-user" className="absolute -bottom-2 left-0 right-0 h-[2px] bg-[#00E5FF] shadow-[0_0_10px_#00E5FF]" />}
                        </li>
                    </ul>
                </motion.nav>

                {/* Right: Search + Actions (flex-1) */}
                <div className="flex-1 flex items-center justify-end gap-3 md:gap-5 z-50">

                    {!user || isLanding ? (
                        <div className="flex items-center gap-4 whitespace-nowrap">
                            <button onClick={() => navigate('/login')} className="text-[15px] font-bold text-gray-400 hover:text-white transition-colors">Log In</button>
                            <button onClick={() => navigate('/register')} className="text-[15px] font-bold bg-white text-black hover:bg-[#00E5FF] px-6 md:px-8 py-2.5 rounded-full transition-all duration-300">Join</button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3 md:gap-6 whitespace-nowrap">
                            {/* Mobile Search Toggle */}
                            <button
                                onClick={() => useSearchStore.getState().toggleSearch()}
                                className="xl:hidden p-2 text-gray-400 hover:text-[#00E5FF] transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </button>

                            {/* 🔔 Notification Button with Dropdown */}
                            <div className="relative" ref={notifyRef}>
                                <button
                                    onClick={() => setIsNotifyOpen(v => !v)}
                                    className={`hidden xl:flex items-center justify-center w-11 h-11 rounded-2xl border transition-all duration-300 relative group ${
                                        isNotifyOpen 
                                        ? 'bg-[#00E5FF]/10 border-[#00E5FF] shadow-[0_0_15px_rgba(0,229,255,0.3)]' 
                                        : 'bg-white/5 border-white/10 hover:border-[#00E5FF]/50 hover:bg-white/10'
                                    }`}
                                >
                                    <svg className={`w-5 h-5 transition-all duration-300 ${isNotifyOpen ? 'text-[#00E5FF]' : 'text-gray-400 group-hover:text-white'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                    </svg>
                                    {/* 🔴 Dynamic Notification Badge */}
                                    {storeNotifications.filter(n => !n.isRead).length > 0 && (
                                        <div className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-red-500 rounded-full border-2 border-[#0B0C10] flex items-center justify-center shadow-[0_0_10px_rgba(239,68,68,0.5)] z-10">
                                            <span className="text-[9px] font-black text-white leading-none">
                                                {storeNotifications.filter(n => !n.isRead).length > 9 ? '9+' : storeNotifications.filter(n => !n.isRead).length}
                                            </span>
                                        </div>
                                    )}
                                </button>

                                <AnimatePresence>
                                    {isNotifyOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute right-0 mt-4 w-80 bg-[#1A1C23]/95 backdrop-blur-2xl rounded-[1.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-white/10 overflow-hidden z-50"
                                        >
                                            <div className="px-5 py-4 border-b border-white/5 bg-gradient-to-r from-white/5 to-transparent flex justify-between items-center">
                                                <h3 className="text-sm font-black text-white uppercase tracking-widest">Incoming Frequencies</h3>
                                                {notifications.length > 0 && (
                                                    <span className="text-[10px] font-bold text-[#00E5FF] px-2 py-0.5 bg-[#00E5FF]/10 rounded-full border border-[#00E5FF]/20 animate-pulse">
                                                        {notifications.length} NEW
                                                    </span>
                                                )}
                                            </div>

                                            <div className="max-h-[400px] overflow-y-auto custom-scrollbar-smooth">
                                                {notifications.length > 0 ? (
                                                    notifications.map((item, idx) => (
                                                        <div 
                                                            key={item.id || idx}
                                                            onClick={() => {
                                                                // ✅ Mark as read
                                                                if (item.id && typeof item.id === 'number') {
                                                                    useNotificationStore.getState().markAsRead(item.id);
                                                                }
                                                                // 🚀 Add timestamp to force scroll logic even if URL is the same
                                                                const forceLink = item.link.includes('?') 
                                                                    ? `${item.link}&t=${Date.now()}` 
                                                                    : `${item.link}?t=${Date.now()}`;
                                                                
                                                                navigate(forceLink);
                                                                setIsNotifyOpen(false);
                                                            }}
                                                            className={`p-4 border-b border-white/5 hover:bg-white/[0.03] transition-all duration-300 cursor-pointer group ${!item.isRead && item.type !== 'event' ? 'bg-[#00E5FF]/5' : 'opacity-60'}`}
                                                        >
                                                            <div className="flex gap-3">
                                                                <div className="shrink-0 relative">
                                                                    <div className="w-12 h-12 rounded-xl border border-white/10 overflow-hidden shadow-lg shadow-black/50 relative bg-white/5">
                                                                        <img 
                                                                            src={getImageUrl(item.img)} 
                                                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                                            alt="" 
                                                                        />
                                                                    </div>
                                                                    {/* Type Badge Icon - Nudged slightly up ("ขึ้นตรงๆ") */}
                                                                    <div className={`absolute bottom-0 -right-2 w-6 h-6 rounded-full flex items-center justify-center border-2 border-[#0B0C10] shadow-[0_2px_8px_rgba(0,0,0,0.8)] z-50 ${
                                                                        item.type === 'like' ? 'bg-gradient-to-br from-pink-400 to-pink-600' : 
                                                                        item.type === 'comment' ? 'bg-gradient-to-br from-blue-400 to-blue-600' : 'bg-gradient-to-br from-[#00E5FF] to-[#008CFF]'
                                                                    }`}>
                                                                        {item.type === 'like' && <svg className="w-3 h-3 text-white drop-shadow-md" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>}
                                                                        {item.type === 'comment' && <svg className="w-3 h-3 text-white drop-shadow-md" fill="currentColor" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10z"/></svg>}
                                                                        {item.type === 'event' && <svg className="w-3 h-3 text-black drop-shadow-md" fill="currentColor" viewBox="0 0 24 24"><path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10z"/></svg>}
                                                                    </div>
                                                                </div>
                                                                <div className="min-w-0">
                                                                    <p className="text-[13px] font-black text-white group-hover:text-[#00E5FF] transition-colors truncate">
                                                                        {item.title}
                                                                    </p>
                                                                    <p className="text-[11px] text-gray-400 mt-1 line-clamp-2 italic">
                                                                        {item.desc}
                                                                    </p>
                                                                    <p className={`text-[9px] font-bold mt-2 uppercase tracking-tighter ${
                                                                        item.type === 'like' ? 'text-pink-500' : 
                                                                        item.type === 'comment' ? 'text-blue-500' : 'text-[#00E5FF]'
                                                                    }`}>
                                                                        {item.type.toUpperCase()} • {new Date(item.time).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="p-10 text-center text-gray-500">
                                                        <p className="text-sm italic">No new frequencies detected...</p>
                                                    </div>
                                                )}
                                            </div>

                                            <button 
                                                onClick={() => navigate('/new-event')}
                                                className="w-full py-4 bg-white/5 text-[11px] font-black text-gray-400 hover:text-white hover:bg-white/10 transition-all uppercase tracking-widest border-t border-white/5"
                                            >
                                                View All Chronicles
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Enhanced Chat Button (Desktop Only) */}
                            <button
                                onClick={() => navigate('/chat')}
                                className="hidden xl:flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#7C4DFF]/10 to-[#00E5FF]/10 border border-[#00E5FF]/20 hover:border-[#00E5FF] transition-all duration-300 group relative shadow-[0_0_15px_rgba(0,229,255,0.1)] hover:shadow-[0_0_25px_rgba(0,229,255,0.3)]"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-[#7C4DFF] to-[#00E5FF] opacity-0 group-hover:opacity-10 transition-opacity rounded-2xl" />
                                <svg className="w-5 h-5 text-[#00E5FF] group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                                <span className="text-[13px] font-black uppercase tracking-widest text-[#00E5FF] group-hover:text-white transition-colors">Chat</span>

                            </button>

                            {/* Profile dropdown */}
                            <div className="relative" ref={profileRef}>
                                <button onClick={() => setIsProfileMenuOpen(v => !v)} className="flex items-center gap-2 focus:outline-none group">
                                    <div className="relative">
                                        <div className="w-[40px] h-[40px] rounded-full border-2 border-white/20 group-hover:border-[#00E5FF] overflow-hidden bg-[#1A1C23] transition-colors">
                                            <img src={user.profileImage || `https://ui-avatars.com/api/?name=${displayName}&background=1A1C23&color=00E5FF`} alt="Profile" className="w-full h-full object-cover" />
                                        </div>
                                        {/* 🛡️ Mini Verified Badge (Bottom-Left) - MOCK: true */}
                                        {(true) && (
                                            <div className="absolute -bottom-0.5 -left-0.5 w-4 h-4 bg-[#0B0C10] rounded-full border border-[#00E5FF] flex items-center justify-center shadow-[0_0_10px_rgba(0,229,255,0.5)] z-10">
                                                <svg className="w-2.5 h-2.5 text-[#00E5FF]" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                    <motion.svg animate={{ rotate: isProfileMenuOpen ? 0 : 180 }} className={`w-4 h-4 ${isProfileMenuOpen ? 'text-[#00E5FF]' : 'text-gray-400 group-hover:text-white'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                                    </motion.svg>
                                </button>

                                <AnimatePresence>
                                    {isProfileMenuOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute right-0 mt-4 w-60 bg-[#1A1C23]/95 backdrop-blur-2xl rounded-[1.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-white/10 py-2 z-50"
                                        >
                                            <div className="px-5 py-4 border-b border-white/5 mb-2 bg-gradient-to-b from-white/5 to-transparent">
                                                <div className="flex items-center gap-2">
                                                    <p className="text-sm font-black text-white truncate uppercase tracking-wider">{displayName}</p>
                                                    {/* MOCK: true */}
                                                    {true && (
                                                        <svg className="w-4 h-4 text-[#00E5FF] flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                                        </svg>
                                                    )}
                                                </div>
                                                <p className="text-[10px] font-bold text-gray-400 truncate mt-1 tracking-widest">{user?.email || 'No email provided'}</p>
                                            </div>
                                            <div className="flex flex-col px-2">
                                                <button onClick={() => handleNavigate('/editprofile')} className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-300 hover:text-[#00E5FF] hover:bg-white/5 rounded-xl transition-all group">
                                                    <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                                    Edit Profile
                                                </button>
                                            </div>
                                            <div className="border-t border-white/5 my-2" />
                                            <div className="px-2">
                                                <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 text-sm font-bold text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-xl transition-all group">
                                                    <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013-3v1" /></svg>
                                                    Sign Out
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    )}
                </div>

                {/* Mega-menu - Moved inside header to ensure it follows fixed position */}
                <NavArtistMenu
                    isOpen={isArtistMenuOpen}
                    menuRef={menuRef}
                    mainSlides={mainSlides}
                    currentSlide={currentSlide}
                    setCurrentSlide={setCurrentSlide}
                    isHoveringMain={isHoveringMain}
                    setIsHoveringMain={setIsHoveringMain}
                    topEvents={topEvents}
                    chartOrder={chartOrder}
                    onNavigate={handleNavigate}
                />
            </motion.header>
        </div>
    );
}
