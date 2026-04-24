import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// Hooks
import { useNavbarData } from '../hooks/useNavbarData';

// Sub-components
import NavSearchBar from './navbar/NavSearchBar';
import NavArtistMenu from './navbar/NavArtistMenu';
import useSearchStore from '../stores/searchStore';

export default function Navbar() {
    const navigate = useNavigate();
    const menuRef = useRef(null);
    const buttonRef = useRef(null);

    const [isArtistMenuOpen, setIsArtistMenuOpen] = useState(false);
    const [language, setLanguage] = useState('EN');
    const { isSearchOpen } = useSearchStore();

    const {
        mainSlides, topEvents,
        currentSlide, setCurrentSlide,
        isHoveringMain, setIsHoveringMain,
        chartOrder, setChartOrder,
    } = useNavbarData();

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
            setChartOrder(prev => {
                const next = [...prev];
                next.push(next.shift());
                return next;
            });
        }, 3000);
        return () => clearInterval(t);
    }, [isArtistMenuOpen, topEvents.length]);

    const handleNavigate = (path) => { setIsArtistMenuOpen(false); navigate(path); };

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

            <header className="flex justify-between items-center px-6 md:px-10 py-4 md:py-5 bg-[#0B0C10]/95 backdrop-blur-md relative z-50 border-b border-white/5 shadow-lg font-sans">

                {/* Left: Logo (flex-1 to balance right side) */}
                <div className="flex-1 flex justify-start">
                    <div className="flex items-center gap-2 cursor-pointer z-50" onClick={() => navigate('/')}>
                        <div className="flex items-end gap-[2px] h-6 w-5">
                            <div className="w-1 rounded-full bar-1" />
                            <div className="w-1 rounded-full bar-2" />
                            <div className="w-1 rounded-full bar-3" />
                            <div className="w-1 rounded-full bar-4" />
                        </div>
                        <div className="text-2xl md:text-3xl font-black italic tracking-tighter text-shine mt-1">4B1K</div>
                    </div>
                </div>

                {/* Center: Navigation (Absolute Center) */}
                <motion.nav
                    animate={{
                        opacity: isSearchOpen ? 0.2 : 1,
                        x: isSearchOpen ? '-120%' : '-50%',
                        pointerEvents: isSearchOpen ? 'none' : 'auto'
                    }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute left-1/2 hidden xl:block z-[60]"
                >
                    <ul className="flex items-center gap-10 text-[15px] font-bold text-gray-300">
                        <li><Link to="/new-event" className="hover:text-[#00E5FF] transition-colors">Concert Event</Link></li>
                        <li>
                            <button
                                ref={buttonRef}
                                onClick={() => setIsArtistMenuOpen(v => !v)}
                                className={`flex items-center gap-1.5 focus:outline-none transition-colors ${isArtistMenuOpen ? 'text-[#00E5FF]' : 'hover:text-[#00E5FF]'}`}
                            >
                                Artist Biology
                                <motion.svg
                                    animate={{ rotate: isArtistMenuOpen ? 180 : 0 }}
                                    className={`w-4 h-4 ${isArtistMenuOpen ? 'text-[#00E5FF]' : 'text-gray-500'}`}
                                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                                </motion.svg>
                            </button>
                        </li>
                        <li><Link to="/community" className="hover:text-[#00E5FF] transition-colors">Community</Link></li>
                    </ul>
                </motion.nav>

                {/* Right: Search + Actions (flex-1) */}
                <div className="flex-1 flex items-center justify-end gap-4 md:gap-6 z-50">
                    {/* Desktop Search Bar (Placed here to be near Community but not affect centering) */}
                    <div className="hidden xl:block mr-4">
                        <NavSearchBar navigate={navigate} />
                    </div>

                    <div className="flex items-center gap-4 whitespace-nowrap">
                        <button onClick={() => navigate('/login')} className="text-[15px] font-bold text-gray-400 hover:text-white transition-colors">
                            Log In
                        </button>
                        <button onClick={() => navigate('/register')} className="text-[15px] font-bold bg-white text-black hover:bg-[#00E5FF] px-6 md:px-8 py-2.5 rounded-full transition-all duration-300">
                            Join
                        </button>
                    </div>
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
