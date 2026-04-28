import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

// Hooks
import { useNavbarData } from '../hooks/useNavbarData';

// Sub-components
import NavSearchBar from './navbar/NavSearchBar';
import NavArtistMenu from './navbar/NavArtistMenu';
import useSearchStore from '../stores/searchStore';
import useUserStore from '../stores/userStore';
import useUIStore from '../stores/uiStore';

export default function Navbar() {
    const { user, logout } = useUserStore();
    const navigate = useNavigate();
    const menuRef = useRef(null);
    const buttonRef = useRef(null);

    const [isArtistMenuOpen, setIsArtistMenuOpen] = useState(false);
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
    const isCommunityActive = path.startsWith('/community') || path.startsWith('/home');
    const isChatActive = path.startsWith('/chat');

    // Close mega-menu on outside click
    useEffect(() => {
        const handler = (e) => {
            if (
                menuRef.current && !menuRef.current.contains(e.target) &&
                buttonRef.current && !buttonRef.current.contains(e.target)
            ) setIsArtistMenuOpen(false);
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

    // Auto-shuffle concert chart
    useEffect(() => {
        if (!isArtistMenuOpen || topEvents.length === 0) return;
        const t = setInterval(() => {
            setChartOrder(prev => [...prev].sort(() => Math.random() - 0.5));
        }, 10000);
        return () => clearInterval(t);
    }, [isArtistMenuOpen, topEvents.length]);

    const handleNavigate = (path) => { setIsArtistMenuOpen(false); navigate(path); };

    const handleLinkClick = (e, targetPath) => {
        if (location.pathname === targetPath) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <div className="relative">
            <style>{`
                @keyframes smoothWave { 0%,100%{height:12px;opacity:.7}50%{height:28px;opacity:1;box-shadow:0 0 10px currentColor} }
                .bar-1{background-color:#FF00FF;color:#FF00FF;animation:smoothWave 2.5s infinite ease-in-out 0s}
                .bar-2{background-color:#7000FF;color:#7000FF;animation:smoothWave 2.5s infinite ease-in-out .4s}
                .bar-3{background-color:#00E5FF;color:#00E5FF;animation:smoothWave 2.5s infinite ease-in-out .8s}
                .bar-4{background-color:#FFFFFF;color:#FFFFFF;animation:smoothWave 2.5s infinite ease-in-out 1.2s}
                .text-shine{background:linear-gradient(120deg,#FFF 0%,#FFF 40%,#00E5FF 50%,#FFF 60%,#FFF 100%);background-size:200% auto;color:transparent;-webkit-background-clip:text;background-clip:text;animation:shine 4s linear infinite}
                @keyframes shine{to{background-position:200% center}}
            `}</style>

            <motion.header 
                initial={{ y: 0 }}
                animate={{ y: isNavbarVisible ? 0 : -110 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="fixed top-0 left-0 right-0 flex justify-between items-center px-2 md:px-10 py-3 md:py-5 bg-[#0B0C10]/98 z-50 border-b border-white/5 shadow-lg font-sans"
            >

                {/* --- 📱 MOBILE NAVBAR (3 Items Spread) --- */}
                <div className="xl:hidden flex items-center justify-between w-full">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-1.5 text-gray-400 hover:text-[#00E5FF] transition-colors rounded-full hover:bg-white/5 shrink-0"
                    >
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    <div
                        className="flex items-center gap-1.5 cursor-pointer"
                        onClick={() => navigate('/landing')}
                    >
                        <div className="flex items-end gap-[1px] h-4 w-3.5">
                            <div className="w-0.5 rounded-full bar-1" />
                            <div className="w-0.5 rounded-full bar-2" />
                            <div className="w-0.5 rounded-full bar-3" />
                        </div>
                        <div className="text-lg font-black italic tracking-tighter text-shine">4B1K</div>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Mobile Search Toggle */}
                        <button 
                            onClick={() => useSearchStore.getState().toggleSearch()}
                            className="p-2 text-gray-400 hover:text-[#00E5FF] transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </button>

                        <Link to="/editprofile" className="relative group shrink-0">
                            <img
                                src={user?.profileImage || `https://ui-avatars.com/api/?name=${user?.username}&background=random`}
                                className="w-8 h-8 rounded-xl object-cover border border-white/10"
                                alt=""
                            />
                        </Link>
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

                {/* --- 💻 DESKTOP NAVBAR (Original) --- */}
                <div className="hidden xl:flex flex-1 items-center justify-start gap-6">
                    <div
                        className="flex items-center gap-2 cursor-pointer z-50 shrink-0"
                        onClick={() => navigate('/landing')}
                    >
                        <div className="flex items-end gap-[2px] h-6 w-5">
                            <div className="w-1 rounded-full bar-1" />
                            <div className="w-1 rounded-full bar-2" />
                            <div className="w-1 rounded-full bar-3" />
                            <div className="w-1 rounded-full bar-4" />
                        </div>
                        <div className="text-3xl font-black italic tracking-tighter text-shine mt-1">4B1K</div>
                    </div>
                    <NavSearchBar navigate={navigate} />
                </div>

                {/* Center: Navigation (Absolute Center) */}
                <motion.nav
                    animate={{ opacity: 1, x: '-50%', pointerEvents: 'auto' }}
                    className="absolute left-1/2 hidden xl:block z-[60]"
                >
                    <ul className="flex items-center gap-10 text-[15px] font-bold">
                        <li className="relative group">
                            <Link to="/community" onClick={(e) => handleLinkClick(e, '/community')} className={`transition-all duration-300 ${isCommunityActive ? 'text-[#00E5FF] drop-shadow-[0_0_8px_rgba(0,229,255,0.5)]' : 'text-gray-300 hover:text-[#00E5FF]'}`}>Community</Link>
                            {isCommunityActive && <motion.div layoutId="nav-active" className="absolute -bottom-2 left-0 right-0 h-[2px] bg-[#00E5FF] shadow-[0_0_10px_#00E5FF]" />}
                        </li>
                        <li className="relative">
                            <button ref={buttonRef} onClick={() => setIsArtistMenuOpen(v => !v)} className={`flex items-center gap-1.5 focus:outline-none transition-all duration-300 ${isArtistActive ? 'text-[#00E5FF] drop-shadow-[0_0_8px_rgba(0,229,255,0.5)]' : 'text-gray-300 hover:text-[#00E5FF]'}`}>Artist Biology <motion.svg animate={{ rotate: isArtistMenuOpen ? 180 : 0 }} className={`w-4 h-4 ${isArtistActive ? 'text-[#00E5FF]' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></motion.svg></button>
                            {isArtistActive && !isArtistMenuOpen && <motion.div layoutId="nav-active" className="absolute -bottom-2 left-0 right-0 h-[2px] bg-[#00E5FF] shadow-[0_0_10px_#00E5FF]" />}
                        </li>
                        <li className="relative group">
                            <Link to="/new-event" onClick={(e) => handleLinkClick(e, '/new-event')} className={`transition-all duration-300 ${isConcertActive ? 'text-[#00E5FF] drop-shadow-[0_0_8px_rgba(0,229,255,0.5)]' : 'text-gray-300 hover:text-[#00E5FF]'}`}>Concert Event</Link>
                            {isConcertActive && <motion.div layoutId="nav-active" className="absolute -bottom-2 left-0 right-0 h-[2px] bg-[#00E5FF] shadow-[0_0_10px_#00E5FF]" />}
                        </li>
                    </ul>
                </motion.nav>

                <div className="hidden xl:flex flex-1 items-center justify-end gap-6 z-50">
                    {user ? (
                        <div className="flex items-center gap-5">
                            <Link to="/chat" className={`p-2 rounded-xl transition-all ${isChatActive ? 'bg-[#00E5FF]/10 text-[#00E5FF]' : 'text-gray-400 hover:text-white'}`}>
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                            </Link>
                            <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                                <div className="flex flex-col items-end">
                                    <span className="text-[14px] font-black text-white leading-none">{user.username}</span>
                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Verified Fan</span>
                                </div>
                                <Link to="/editprofile" className="relative group shrink-0">
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-[#00E5FF] to-[#7000FF] rounded-xl blur opacity-0 group-hover:opacity-40 transition duration-300" />
                                    <img src={user.profileImage || `https://ui-avatars.com/api/?name=${user.username}&background=random`} className="w-10 h-10 rounded-xl object-cover border border-white/10" alt="" />
                                </Link>
                                <button onClick={() => { logout(); navigate('/landing'); }} className="text-[13px] font-bold text-gray-500 hover:text-red-400 transition-colors ml-2">Log Out</button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-4">
                            <button onClick={() => navigate('/login')} className="font-bold text-gray-300 hover:text-white transition-colors">Log In</button>
                            <button onClick={() => navigate('/register')} className="font-bold bg-white text-black hover:bg-[#00E5FF] px-8 py-2.5 rounded-full transition-all duration-300">Join Now</button>
                        </div>
                    )}
                </div>
            </motion.header>

            {/* Mega-menu */}
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
        </div>
    );
}
