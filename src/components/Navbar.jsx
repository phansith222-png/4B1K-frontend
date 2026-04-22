import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getAllArtists } from '../api/artist'; 
import { getAllEvents } from '../api/event';

export default function Navbar() {
    const navigate = useNavigate();
    const menuRef = useRef(null);
    const buttonRef = useRef(null);

    const [isArtistMenuOpen, setIsArtistMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [language, setLanguage] = useState('EN');
    const [searchQuery, setSearchQuery] = useState("");

    const [mainSlides, setMainSlides] = useState([]);
    const [topEvents, setTopEvents] = useState([]); 
    const [allArtists, setAllArtists] = useState([]); 

    const [currentSlide, setCurrentSlide] = useState(0);
    const [isHoveringMain, setIsHoveringMain] = useState(false);
    const [chartOrder, setChartOrder] = useState([0, 1, 2, 3, 4, 5]);

    // ================= 1. ดึงข้อมูล ศิลปิน และ คอนเสิร์ต =================
    useEffect(() => {
        const fetchAndOrganize = async () => {
            try {
                // ดึงข้อมูลศิลปิน
                const response = await getAllArtists();
                const artistsList = response?.artists || response?.data || response || [];
                setAllArtists(artistsList);

                // ดึงข้อมูลคอนเสิร์ต
                const eventRes = await getAllEvents();
                let eventsList = [];
                if (Array.isArray(eventRes)) eventsList = eventRes;
                else if (eventRes?.data?.events) eventsList = eventRes.data.events;
                else if (eventRes?.events) eventsList = eventRes.events;
                
                eventsList.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
                
                let validEvents = eventsList.slice(0, 6);
                if(validEvents.length > 0 && validEvents.length < 6) {
                    while(validEvents.length < 6) {
                        validEvents = [...validEvents, ...validEvents].slice(0, 6);
                    }
                }
                setTopEvents(validEvents);

                if (artistsList.length === 0) return;

                // 📌 อัปเดตลอจิก: สุ่มศิลปินขึ้นมาก่อน 6 คน แล้วค่อยเช็คว่าอยู่หมวดไหน
                const getArtistInfo = (artist) => {
                    const aId = Number(artist.id);
                    const popIds = [1, 2, 3, 4, 5];
                    const rockIds = [6, 7, 8, 9, 10];
                    const classicIds = [16, 17, 18, 19, 20];
                    const etcIds = [11, 12, 13, 14, 15, 21, 22, 23, 24, 25];

                    let type = 'pop'; 
                    if (popIds.includes(aId)) type = 'pop';
                    else if (rockIds.includes(aId)) type = 'rock';
                    else if (classicIds.includes(aId)) type = 'classic';
                    else if (etcIds.includes(aId)) type = 'etc';
                    else {
                        const isRock = artist.genres?.some(g => g.genre?.name?.toLowerCase().includes('rock'));
                        const isClassic = artist.genres?.some(g => {
                            const gName = g.genre?.name?.toLowerCase() || '';
                            return gName.includes('r&b') || gName.includes('rnb') || gName.includes('classic');
                        });
                        const isEtc = artist.genres?.some(g => {
                            const gName = g.genre?.name?.toLowerCase() || '';
                            return gName.includes('hip hop') || gName.includes('rap') || gName.includes('edm') || gName.includes('electronic');
                        });

                        if (isRock) type = 'rock';
                        else if (isClassic) type = 'classic';
                        else if (isEtc) type = 'etc';
                    }

                    switch (type) {
                        case 'pop': return { path: '/pop', color: '#FF007F', label: 'Pop' };
                        case 'rock': return { path: '/rock', color: '#D3131F', label: 'Rock' };
                        case 'classic': return { path: '/classic', color: '#d83bb6', label: 'R&B / Classic' };
                        case 'etc': return { path: '/etc', color: '#CEFF67', label: 'Hiphop / EDM' };
                        default: return { path: '/pop', color: '#FF007F', label: 'Pop' };
                    }
                };

                const shuffled = [...artistsList].sort(() => 0.5 - Math.random());
                const selected = shuffled.slice(0, 6);

                const randomizedData = selected.map(art => {
                    const info = getArtistInfo(art);
                    return {
                        img: art.profileImage || "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=800&auto=format&fit=crop",
                        title: `${art.artistName}\nTop in ${info.label}`,
                        desc: `View the latest from our ${info.label} collection.`,
                        path: info.path,
                        color: info.color,
                        artistId: art.id,
                        artistName: art.artistName
                    };
                });

                setMainSlides(randomizedData);
                setChartOrder(randomizedData.map((_, i) => i));

            } catch (error) {
                console.error("Failed to load data for navbar:", error);
            }
        };

        fetchAndOrganize(); 
    }, []);

    // ================= 2. ระบบค้นหา =================
    const executeSearch = () => {
        if (searchQuery.trim() !== "") {
            const query = searchQuery.toLowerCase().trim();
            const genres = ['pop', 'rock', 'r&b', 'classic', 'hip hop', 'edm'];
            
            if (genres.includes(query)) {
                const path = query === 'pop' ? '/pop' : query === 'rock' ? '/rock' : (query === 'classic' || query === 'r&b') ? '/classic' : '/etc';
                navigate(path);
            } else {
                const foundArtist = allArtists.find(a => a.artistName.toLowerCase().includes(query));
                
                if (foundArtist) {
                    const aId = Number(foundArtist.id);
                    let targetPath = '/artists';

                    const popIds = [1, 2, 3, 4, 5];
                    const rockIds = [6, 7, 8, 9, 10];
                    const classicIds = [16, 17, 18, 19, 20];
                    const etcIds = [11, 12, 13, 14, 15, 21, 22, 23, 24, 25];

                    if (popIds.includes(aId)) targetPath = '/pop';
                    else if (rockIds.includes(aId)) targetPath = '/rock';
                    else if (classicIds.includes(aId)) targetPath = '/classic';
                    else if (etcIds.includes(aId)) targetPath = '/etc';
                    else {
                        const isPop = foundArtist.genres?.some(g => g.genre?.name?.toLowerCase().includes('pop'));
                        const isRock = foundArtist.genres?.some(g => g.genre?.name?.toLowerCase().includes('rock'));
                        const isClassic = foundArtist.genres?.some(g => {
                            const gName = g.genre?.name?.toLowerCase() || '';
                            return gName.includes('r&b') || gName.includes('rnb') || gName.includes('classic');
                        });
                        const isEtc = foundArtist.genres?.some(g => {
                            const gName = g.genre?.name?.toLowerCase() || '';
                            return gName.includes('hip hop') || gName.includes('rap') || gName.includes('edm') || gName.includes('electronic');
                        });

                        if (isPop) targetPath = '/pop';
                        else if (isRock) targetPath = '/rock';
                        else if (isClassic) targetPath = '/classic';
                        else if (isEtc) targetPath = '/etc';
                    }

                    navigate(`${targetPath}?artistId=${aId}`); 
                } else {
                    navigate(`/artists?search=${searchQuery}`);
                }
            }
            setIsSearchOpen(false);
            setSearchQuery("");
        }
    };

    const handleSearchKeyDown = (e) => {
        if (e.key === 'Enter') {
            executeSearch();
        }
    };

    const toggleLanguage = () => setLanguage(language === 'EN' ? 'TH' : 'EN');

    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target) && buttonRef.current && !buttonRef.current.contains(event.target)) {
                setIsArtistMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleNavigate = (path) => {
        setIsArtistMenuOpen(false);
        navigate(path);
    };

    // Auto-slide 
    useEffect(() => {
        if (!isArtistMenuOpen || isHoveringMain || mainSlides.length === 0) return;
        const slideTimer = setInterval(() => setCurrentSlide((prev) => (prev + 1) % mainSlides.length), 4000);
        return () => clearInterval(slideTimer);
    }, [isArtistMenuOpen, isHoveringMain, mainSlides.length]);

    // Auto-shuffle Events
    useEffect(() => {
        if (!isArtistMenuOpen || topEvents.length === 0) return;
        const chartTimer = setInterval(() => {
            setChartOrder((prev) => {
                const newOrder = [...prev];
                const first = newOrder.shift();
                newOrder.push(first);
                return newOrder;
            });
        }, 3000);
        return () => clearInterval(chartTimer);
    }, [isArtistMenuOpen, topEvents.length]);

    return (
        <div className="relative">
            <style>{`
                @keyframes runGradient { 0% { background-position: 200% 0; } 100% { background-position: 0% 0; } }
                .text-shine { background: linear-gradient(120deg, #FFFFFF 0%, #FFFFFF 40%, #00E5FF 50%, #FFFFFF 60%, #FFFFFF 100%); background-size: 200% auto; color: transparent; -webkit-background-clip: text; background-clip: text; animation: shine 4s linear infinite; }
                @keyframes shine { to { background-position: 200% center; } }
                @keyframes smoothWave { 0%, 100% { height: 12px; opacity: 0.7; } 50% { height: 28px; opacity: 1; box-shadow: 0 0 10px currentColor; } }
                
                .bar-1 { background-color: #FF00FF; color: #FF00FF; animation: smoothWave 2.5s infinite ease-in-out 0s; }
                .bar-2 { background-color: #7000FF; color: #7000FF; animation: smoothWave 2.5s infinite ease-in-out 0.4s; }
                .bar-3 { background-color: #00E5FF; color: #00E5FF; animation: smoothWave 2.5s infinite ease-in-out 0.8s; }
                .bar-4 { background-color: #FFFFFF; color: #FFFFFF; animation: smoothWave 2.5s infinite ease-in-out 1.2s; }
                
                .chart-item-move { transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.5s ease; }
            `}</style>

            <header className="flex justify-between items-center px-6 md:px-10 py-4 md:py-5 bg-[#0B0C10]/95 backdrop-blur-md relative z-50 border-b border-white/5 shadow-lg font-sans">
                <div className="flex-shrink-0 flex items-center gap-3 cursor-pointer z-50 w-auto md:w-[240px]" onClick={() => navigate('/')}>
                    <div className="flex items-end gap-[3px] h-7 w-6">
                        <div className="w-1.5 rounded-full bar-1"></div>
                        <div className="w-1.5 rounded-full bar-2"></div>
                        <div className="w-1.5 rounded-full bar-3"></div>
                        <div className="w-1.5 rounded-full bar-4"></div>
                    </div>
                    <div className="text-3xl font-black italic tracking-tighter text-shine mt-1">4B1K</div>
                </div>

                <div className="flex-1 flex justify-center items-center overflow-hidden">
                    <ul className="hidden xl:flex items-center gap-10 text-[15px] font-bold text-gray-300">
                        <li><Link to="/new-event" className="hover:text-[#00E5FF] transition-colors">Concert Event</Link></li>
                        <li>
                            <button ref={buttonRef} onClick={() => setIsArtistMenuOpen(!isArtistMenuOpen)} className={`flex items-center gap-1.5 focus:outline-none transition-colors ${isArtistMenuOpen ? 'text-[#00E5FF]' : 'hover:text-[#00E5FF]'}`}>
                                Artist Biology
                                <motion.svg animate={{ rotate: isArtistMenuOpen ? 180 : 0 }} className={`w-4 h-4 ${isArtistMenuOpen ? 'text-[#00E5FF]' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></motion.svg>
                            </button>
                        </li>
                        <li><Link to="/community" className="hover:text-[#00E5FF] transition-colors">Community</Link></li>
                    </ul>

                    <div className="flex items-center ml-2 lg:ml-8 relative">
                        <div className={`transition-all duration-500 ease-in-out flex items-center bg-[#1A1C23]/80 backdrop-blur-sm rounded-full border ${isSearchOpen ? 'w-64 xl:w-72 border-[#00E5FF] shadow-[0_0_15px_rgba(0,229,255,0.2)] opacity-100' : 'w-0 border-transparent opacity-0 overflow-hidden'}`}>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={handleSearchKeyDown}
                                placeholder="Artist or Genre..."
                                className="w-full text-[14px] bg-transparent outline-none text-white placeholder:text-gray-500 px-5 py-2.5"
                            />
                            {isSearchOpen && (
                                <button onClick={executeSearch} className="pr-4 text-gray-400 hover:text-[#00E5FF] transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                </button>
                            )}
                        </div>
                        {!isSearchOpen && (
                            <button onClick={() => setIsSearchOpen(true)} className="p-2.5 rounded-full transition-all duration-300 flex-shrink-0 z-10 text-gray-400 hover:text-[#00E5FF] bg-[#1A1C23] hover:bg-[#252830]">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            </button>
                        )}
                        {isSearchOpen && (
                             <button onClick={() => setIsSearchOpen(false)} className="p-2.5 rounded-full transition-all duration-300 absolute -right-10 text-gray-500 hover:text-red-400">
                                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                             </button>
                        )}
                    </div>
                </div>

                <div className="flex-shrink-0 flex items-center justify-end gap-4 lg:gap-6 z-50 w-auto">
                    <div className="flex items-center gap-4 lg:gap-6 whitespace-nowrap">
                        <button 
                            onClick={() => navigate('/login')} 
                            className="text-[15px] font-bold text-gray-400 hover:text-white transition-colors"
                        >
                            Log In
                        </button>
                        <button 
                            onClick={() => navigate('/register')} 
                            className="text-[15px] font-bold bg-white text-black hover:bg-[#00E5FF] px-6 md:px-8 py-2.5 rounded-full transition-all duration-300 hover:scale-105 shadow-[0_4px_15px_rgba(255,255,255,0.1)] hover:shadow-[0_4px_20px_rgba(0,229,255,0.4)]"
                        >
                            Register
                        </button>
                    </div>
                    <div onClick={toggleLanguage} className="flex items-center gap-1.5 text-[14px] font-bold cursor-pointer text-white bg-[#1A1C23] hover:bg-[#252830] px-4 py-2 rounded-full transition-colors border border-white/10 shrink-0">
                        <svg className="w-4 h-4 text-[#00E5FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
                        <span className="w-6 text-center">{language}</span>
                    </div>
                </div>
            </header>

            <AnimatePresence>
                {isArtistMenuOpen && mainSlides.length > 0 && (
                    <motion.div 
                        initial={{ opacity: 0, y: -20, scaleY: 0.95 }} 
                        animate={{ opacity: 1, y: 0, scaleY: 1 }} 
                        exit={{ opacity: 0, y: -20, scaleY: 0.95 }} 
                        transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }} 
                        className="absolute top-full left-0 right-0 w-full z-40 bg-[#0B0C10]/95 backdrop-blur-2xl shadow-[0_30px_60px_rgba(0,0,0,0.8)] rounded-b-[2.5rem] border-t border-white/5 pb-12 pt-10 overflow-hidden" 
                        ref={menuRef}
                    >
                        <section className="max-w-7xl mx-auto px-6 md:px-10 relative z-10">
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10">
                                
                                <div className="col-span-1 md:col-span-2 flex flex-col gap-2 text-sm pr-4">
                                    <span className="text-white font-extrabold text-base mb-3 border-b-2 border-[#00E5FF] pb-2 inline-block w-max">Artist Hub</span>
                                    
                                    <button onClick={() => handleNavigate('/pop')} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-400 font-semibold hover:text-[#FF007F] hover:bg-[#FF007F]/10 hover:translate-x-1 transition-all group">
                                        <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
                                        Pop
                                    </button>
                                    <button onClick={() => handleNavigate('/rock')} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-400 font-semibold hover:text-[#D3131F] hover:bg-[#D3131F]/10 hover:translate-x-1 transition-all group">
                                        <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                        Rock
                                    </button>
                                    <button onClick={() => handleNavigate('/classic')} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-400 font-semibold hover:text-[#d83bb6] hover:bg-[#d83bb6]/10 hover:translate-x-1 transition-all group">
                                        <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" /></svg>
                                        R&B / Classic
                                    </button>
                                    <button onClick={() => handleNavigate('/etc')} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-400 font-semibold hover:text-[#CEFF67] hover:bg-[#CEFF67]/10 hover:translate-x-1 transition-all group">
                                        <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 001.414 1.414m2.828-9.9a9 9 0 012.828-2.828" /></svg>
                                        Hiphop / EDM
                                    </button>
                                    <button onClick={() => handleNavigate('/entertainment')} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-400 font-semibold hover:text-[#7000FF] hover:bg-[#7000FF]/10 hover:translate-x-1 transition-all group">
                                        <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        Entertainment Hub
                                    </button>
                                    
                                    <div className="mt-2 pt-4 border-t border-white/5">
                                        <button onClick={() => handleNavigate('/artists')} className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-[#00E5FF] font-bold hover:text-white hover:bg-white/5 transition-all group">
                                            <div className="flex items-center gap-3">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                                                All Artists
                                            </div>
                                            <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                                        </button>
                                    </div>
                                </div>

                                <div className="col-span-1 md:col-span-6 lg:col-span-7 flex flex-col items-center" onMouseEnter={() => setIsHoveringMain(true)} onMouseLeave={() => setIsHoveringMain(false)}>
                                    <div 
                                        className="relative w-full h-[300px] md:h-[420px] rounded-[2.5rem] overflow-hidden shadow-2xl group cursor-pointer border border-white/5 transition-all duration-700 bg-black" 
                                        style={{ boxShadow: `0 20px 50px -10px ${mainSlides[currentSlide].color}40` }} 
                                        onClick={() => handleNavigate(`${mainSlides[currentSlide].path}?artistId=${mainSlides[currentSlide].artistId}`)}
                                    >
                                        <AnimatePresence mode="wait">
                                            <motion.div 
                                                key={currentSlide}
                                                initial={{ opacity: 0, scale: 1.05 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ duration: 0.8 }}
                                                className="absolute inset-0"
                                            >
                                                <img src={mainSlides[currentSlide].img} alt="Featured Artist" className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-[3s] ease-out" />
                                                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C10] via-[#0B0C10]/40 to-transparent"></div>
                                                <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end items-start pb-16">
                                                    <h2 className="text-white text-3xl md:text-5xl font-black leading-tight mb-3 whitespace-pre-line uppercase drop-shadow-lg">{mainSlides[currentSlide].title}</h2>
                                                    <p className="text-gray-300 text-sm md:text-base font-medium tracking-wider">{mainSlides[currentSlide].desc}</p>
                                                </div>
                                            </motion.div>
                                        </AnimatePresence>

                                        <button className="absolute bottom-8 right-8 z-20 text-black px-6 py-3 rounded-full flex items-center gap-3 shadow-xl hover:scale-105 transition-all duration-300 hover:bg-white" style={{ backgroundColor: mainSlides[currentSlide].color }}>
                                            <div className="bg-black/10 p-1.5 rounded-full">
                                                <svg className="w-4 h-4 text-black ml-0.5" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4l12 6-12 6z" /></svg>
                                            </div>
                                            <span className="font-extrabold text-sm">Preview</span>
                                        </button>
                                    </div>
                                    <div className="flex gap-2.5 mt-6">
                                        {mainSlides.map((_, idx) => (
                                            <div key={idx} onClick={() => setCurrentSlide(idx)} className="w-2.5 h-2.5 rounded-full cursor-pointer transition-all duration-300" style={{ backgroundColor: currentSlide === idx ? mainSlides[idx].color : 'rgba(255,255,255,0.2)', boxShadow: currentSlide === idx ? `0 0 12px ${mainSlides[idx].color}` : 'none', transform: currentSlide === idx ? 'scale(1.3)' : 'scale(1)' }} />
                                        ))}
                                    </div>
                                </div>

                                <div className="col-span-1 md:col-span-4 lg:col-span-3 pl-0 md:pl-4 overflow-hidden relative min-h-[320px]">
                                    <h3 className="text-white font-extrabold mb-5 text-[15px] border-b-2 border-white/5 pb-2 uppercase tracking-widest">Upcoming Concerts</h3>
                                    <div className="flex flex-col gap-3 relative">
                                        {topEvents.length > 0 ? chartOrder.slice(0, 3).map((chartIndex, position) => {
                                            const event = topEvents[chartIndex];
                                            if (!event) return null;
                                            return (
                                                <div 
                                                    key={chartIndex} 
                                                    onClick={() => window.open('https://www.thaiticketmajor.com/', '_blank')}
                                                    className="absolute w-full flex gap-4 items-center cursor-pointer group bg-[#1A1C23]/80 backdrop-blur-md hover:bg-[#252830] p-2.5 rounded-2xl border border-white/5 hover:border-[#00E5FF]/40 shadow-lg chart-item-move"
                                                    style={{ 
                                                        top: `${position * 95}px`,
                                                        zIndex: 10 - position,
                                                        boxShadow: `0 4px 20px rgba(0,229,255,0.05)`
                                                    }}
                                                >
                                                    <div className="w-[85px] h-[65px] rounded-xl overflow-hidden shadow-sm shrink-0 relative bg-black border border-white/5">
                                                        <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors z-10"></div>
                                                        <img src={event.posterImage || "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=600&auto=format&fit=crop"} alt="Concert" className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-500 group-hover:opacity-100" />
                                                    </div>
                                                    <div className="flex-1 pr-2">
                                                        <h4 className="text-[11px] font-black tracking-widest mb-1 transition-colors uppercase text-[#00E5FF] group-hover:text-white line-clamp-1">
                                                            {event.eventName}
                                                        </h4>
                                                        <p className="text-[10px] text-gray-400 font-medium line-clamp-1 group-hover:text-gray-300 transition-colors">
                                                            {new Date(event.startTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} • {event.venue?.name || "TBA"}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        }) : (
                                            <p className="text-gray-500 text-sm mt-4 italic">No upcoming concerts.</p>
                                        )}
                                    </div>
                                </div>

                            </div>
                        </section>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}