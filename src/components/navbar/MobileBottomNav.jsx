import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Music, Users, Search, Compass } from 'lucide-react';
import useSearchStore from '../../stores/searchStore';
import NavSearchBar from './NavSearchBar';

export default function MobileBottomNav() {
    const navigate = useNavigate();
    const location = useLocation();

    const { toggleSearch, isSearchOpen } = useSearchStore();

    const navItems = [
        { icon: <Home size={22} />, label: 'Home', path: '/' },
        { icon: <Music size={22} />, label: 'Events', path: '/new-event' },
        { icon: <Compass size={22} />, label: 'Nearby', path: '/nearby-events' },
        { icon: <Users size={22} />, label: 'Artists', path: '/artists' },
        { icon: <Search size={22} />, label: 'Search', onClick: toggleSearch },
    ];

    return (
        <div className="xl:hidden fixed bottom-0 left-0 right-0 z-[100] bg-[#0B0C10]/90 backdrop-blur-xl border-t border-white/5 pb-safe pt-2">
            {/* 🔍 Search Popover - Slides up from Bottom Nav */}
            <AnimatePresence>
                {isSearchOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="absolute bottom-full left-0 right-0 bg-[#0B0C10]/95 backdrop-blur-2xl p-4 border-t border-white/10 shadow-[0_-10px_30px_rgba(0,0,0,0.5)] z-[101]"
                    >
                        <div className="max-w-2xl mx-auto">
                            <NavSearchBar navigate={navigate} />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex justify-around items-center px-4 h-16">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <button
                            key={item.label}
                            onClick={item.onClick ? item.onClick : () => navigate(item.path)}
                            className="flex flex-col items-center gap-1 relative group"
                        >
                            <div className={`transition-all duration-300 ${isActive ? 'text-[#00E5FF] scale-110' : 'text-gray-500 hover:text-gray-300'}`}>
                                {item.icon}
                            </div>
                            <span className={`text-[10px] font-black uppercase tracking-wider transition-all duration-300 ${isActive ? 'text-[#00E5FF] opacity-100' : 'text-gray-500 opacity-60'}`}>
                                {item.label}
                            </span>

                            {isActive && (
                                <motion.div
                                    layoutId="mobileNavIndicator"
                                    className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-1 bg-[#00E5FF] rounded-full shadow-[0_0_10px_#00E5FF]"
                                />
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
