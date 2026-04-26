import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Hooks
import { useNavbarData } from '../hooks/useNavbarData';
import useUserStore from '../stores/userStore';

// Sub-components
import NavSearchBar from './navbar/NavSearchBar';
import NavArtistMenu from './navbar/NavArtistMenu';
import useSearchStore from '../stores/searchStore';

export default function NavbarUser({ isLanding = false }) {
    const navigate = useNavigate();
    const menuRef = useRef(null);
    const buttonRef = useRef(null);
    const profileRef = useRef(null);

    const user = useUserStore(s => s.user);
    const logout = useUserStore(s => s.logout);

    const [isArtistMenuOpen, setIsArtistMenuOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [language, setLanguage] = useState('EN');
    const { isSearchOpen } = useSearchStore();

    const {
        mainSlides, topEvents,
        currentSlide, setCurrentSlide,
        isHoveringMain, setIsHoveringMain,
        chartOrder, setChartOrder,
    } = useNavbarData();

    const location = useLocation();
    const path = location.pathname;
    const isConcertActive = ['/new-event', '/nearby-events'].some(p => path.startsWith(p));
    const isArtistActive = ['/artists', '/pop', '/rock', '/classic', '/etc', '/entertainment'].some(p => path.startsWith(p)) || isArtistMenuOpen;
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
            `}</style>

            <header className="flex justify-between items-center px-6 md:px-10 py-4 md:py-5 bg-[#0B0C10]/98 relative z-50 border-b border-white/5 shadow-lg font-sans">

                {/* Left: Logo + Search */}
                <div className="flex-1 flex justify-start items-center gap-6">
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
                                    animate={{ rotate: isArtistMenuOpen ? 180 : 0 }}
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
                        <div className="flex items-center gap-4 lg:gap-6 whitespace-nowrap">
                            {/* Enhanced Chat Button (Right side) */}
                            <button
                                onClick={() => navigate('/chat')}
                                className="hidden md:flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#7C4DFF]/10 to-[#00E5FF]/10 border border-[#00E5FF]/20 hover:border-[#00E5FF] transition-all duration-300 group relative shadow-[0_0_15px_rgba(0,229,255,0.1)] hover:shadow-[0_0_25px_rgba(0,229,255,0.3)]"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-[#7C4DFF] to-[#00E5FF] opacity-0 group-hover:opacity-10 transition-opacity rounded-2xl" />
                                <svg className="w-5 h-5 text-[#00E5FF] group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                                <span className="text-[13px] font-black uppercase tracking-widest text-[#00E5FF] group-hover:text-white transition-colors">Chat</span>
                                <div className="w-2 h-2 rounded-full bg-[#FF007F] animate-pulse shadow-[0_0_10px_#FF007F]" />
                            </button>

                            {/* Profile dropdown */}
                            <div className="relative" ref={profileRef}>
                                <button onClick={() => setIsProfileMenuOpen(v => !v)} className="flex items-center gap-2 focus:outline-none group">
                                    <div className="w-[40px] h-[40px] rounded-full border-2 border-white/20 group-hover:border-[#00E5FF] overflow-hidden bg-[#1A1C23] transition-colors">
                                        <img src={user.profileImage || `https://ui-avatars.com/api/?name=${displayName}&background=1A1C23&color=00E5FF`} alt="Profile" className="w-full h-full object-cover" />
                                    </div>
                                    <motion.svg animate={{ rotate: isProfileMenuOpen ? 180 : 0 }} className={`w-4 h-4 ${isProfileMenuOpen ? 'text-[#00E5FF]' : 'text-gray-400 group-hover:text-white'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                                                <p className="text-sm font-black text-white truncate uppercase tracking-wider">{displayName}</p>
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
            </header>

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
