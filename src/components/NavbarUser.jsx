import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function NavbarUser() {
    const navigate = useNavigate();
    const menuRef = useRef(null);
    const buttonRef = useRef(null);
    const profileRef = useRef(null); // Ref สำหรับ Profile Dropdown

    const [isArtistMenuOpen, setIsArtistMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false); // State สำหรับ Profile Dropdown
    const [language, setLanguage] = useState('EN');

    const toggleLanguage = () => {
        setLanguage(language === 'EN' ? 'TH' : 'EN');
    };

    // ปิดเมนูเมื่อคลิกที่พื้นที่อื่น
    useEffect(() => {
        function handleClickOutside(event) {
            // ปิด Artist Menu
            if (
                menuRef.current && !menuRef.current.contains(event.target) &&
                buttonRef.current && !buttonRef.current.contains(event.target)
            ) {
                setIsArtistMenuOpen(false);
            }

            // ปิด Profile Menu
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setIsProfileMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [menuRef, buttonRef, profileRef]);

    return (
        <div className="relative">
            <style>{`
        /* ================= เอฟเฟคสีวิ่งสำหรับปุ่ม ================= */
        @keyframes runGradient {
          0% { background-position: 200% 0; }
          100% { background-position: 0% 0; }
        }

        /* ================= เอฟเฟคปุ่ม Chat ================= */
        .text-gradient-chat {
          background: linear-gradient(90deg, #2B5AE8, #CEFF67, #2B5AE8);
          background-size: 200% auto;
          color: transparent;
          -webkit-background-clip: text;
          background-clip: text;
          animation: runGradient 3s linear infinite;
        }

        .btn-custom-chat {
          background: transparent;
          border: none; /* ไม่มีขอบตามที่ต้องการ */
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          cursor: pointer;
        }
        .btn-custom-chat:hover {
          transform: translateY(-2px) scale(1.05); /* เด้งขึ้นนิดหน่อยตอนเอาเมาส์ชี้ */
        }

        /* Profile Dropdown Animation */
        @keyframes dropdownFade {
          from { opacity: 0; transform: translateY(10px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .profile-dropdown-animate {
          animation: dropdownFade 0.2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          transform-origin: top right;
        }

        /* ================= เอฟเฟคโลโก้ 4B1K ================= */
        .text-shine {
          background: linear-gradient(120deg, #1a1a1a 0%, #1a1a1a 40%, #888 50%, #1a1a1a 60%, #1a1a1a 100%);
          background-size: 200% auto;
          color: transparent;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-stroke: 0.5px #333;
          animation: shine 4s linear infinite;
        }
        @keyframes shine {
          to { background-position: 200% center; }
        }

        /* ================= เอฟเฟคแท่งสีโลโก้ ================= */
        @keyframes smoothWave {
          0%, 100% { height: 10px; opacity: 0.7; }
          50% { height: 24px; opacity: 1; }
        }
        .bar-1 { background-color: #ff3b7c; animation: smoothWave 2.5s infinite ease-in-out 0s; }
        .bar-2 { background-color: #ffaa00; animation: smoothWave 2.5s infinite ease-in-out 0.4s; }
        .bar-3 { background-color: #2bd4ff; animation: smoothWave 2.5s infinite ease-in-out 0.8s; }
        .bar-4 { background-color: #4da6ff; animation: smoothWave 2.5s infinite ease-in-out 1.2s; }

        /* ================= เอฟเฟค Mega Menu (สไลด์ลงมาอย่างสมูท) ================= */
        @keyframes menuSlideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .mega-menu-enter {
          animation: menuSlideDown 0.3s ease-out forwards;
        }
      `}</style>

            {/* ================= HEADER ================= */}
            <header className="flex justify-between items-center px-6 md:px-10 py-3 bg-[#F9F8F3] relative z-50 border-b border-gray-100 shadow-sm">

                {/* 1. ฝั่งซ้าย: Logo */}
                <div
                    className="flex-shrink-0 flex items-center gap-2 cursor-pointer z-50 w-[220px]"
                    onClick={() => navigate('/')}
                >
                    <div className="flex items-end gap-[3px] h-6 w-5">
                        <div className="w-1 rounded-full bar-1"></div>
                        <div className="w-1 rounded-full bar-2"></div>
                        <div className="w-1 rounded-full bar-3"></div>
                        <div className="w-1 rounded-full bar-4"></div>
                    </div>
                    <div className="text-[26px] font-black italic tracking-tighter text-shine">4B1K</div>
                </div>

                {/* 2. ตรงกลาง: Navigation + Search */}
                <div className="flex-1 flex justify-center items-center overflow-hidden">

                    {/* เมนูลิงก์ */}
                    <ul className="hidden xl:flex items-center gap-8 text-[13px] font-bold text-gray-700 transition-all duration-500 ease-in-out">
                        <li><a href="#" className="hover:text-blue-600 transition-colors">Concert Event</a></li>
                        <li>
                            <button
                                ref={buttonRef}
                                onClick={() => setIsArtistMenuOpen(!isArtistMenuOpen)}
                                className={`flex items-center gap-1 focus:outline-none transition-colors ${isArtistMenuOpen ? 'text-blue-600' : 'hover:text-blue-600'}`}
                            >
                                Artist Biology
                                <svg className={`w-3.5 h-3.5 transition-transform duration-300 ${isArtistMenuOpen ? 'rotate-180 text-blue-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                        </li>
                        <li><a href="#" className="hover:text-blue-600 transition-colors">Community</a></li>
                        <li><a href="#" className="hover:text-blue-600 transition-colors">News</a></li>
                    </ul>

                    {/* ช่อง Search */}
                    <div className="flex items-center ml-2 lg:ml-6 relative">
                        <div
                            className={`transition-all duration-500 ease-in-out flex items-center bg-gray-50 rounded-full border ${isSearchOpen
                                    ? 'w-56 xl:w-64 border-blue-400 shadow-sm opacity-100'
                                    : 'w-0 border-transparent opacity-0 overflow-hidden'
                                }`}
                        >
                            <input
                                type="text"
                                placeholder="Search..."
                                className="w-full text-xs bg-transparent outline-none text-gray-800 placeholder:text-gray-400 px-4 py-1.5"
                            />
                        </div>

                        <button
                            onClick={() => setIsSearchOpen(!isSearchOpen)}
                            className={`p-1.5 rounded-full transition-colors flex-shrink-0 z-10 ${isSearchOpen ? 'text-blue-600 absolute right-1' : 'text-gray-700 hover:text-blue-600 bg-gray-50 hover:bg-gray-100'
                                }`}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8" />
                                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                            </svg>
                        </button>
                    </div>

                </div>

                {/* 3. ฝั่งขวา: Actions (Profile & Chat) */}
                <div className="flex-shrink-0 flex items-center justify-end gap-5 z-50 w-[240px]">

                    {/* ปุ่ม Chat (คำขึ้นก่อน ไอคอนตามหลัง ตัวหนังสือเป็นสีวิ่ง) */}
                    <button
                        onClick={() => navigate('/chat')}
                        className="btn-custom-chat hidden sm:flex"
                    >
                        <span className="text-gradient-chat text-[15px] font-extrabold tracking-wide">Chat</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#2B5AE8]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                    </button>

                    {/* ปุ่ม Profile (ตั้งรูปได้ มี Dropdown) */}
                    <div className="relative" ref={profileRef}>
                        <button
                            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                            className="flex items-center gap-2 focus:outline-none transition-all hover:opacity-80"
                        >
                            <div className="w-[38px] h-[38px] rounded-full border-2 border-white shadow-sm overflow-hidden bg-gray-200">
                                <img src="https://i.pravatar.cc/150?img=32" alt="Profile" className="w-full h-full object-cover" />
                            </div>
                            <svg className={`w-3.5 h-3.5 text-gray-500 transition-transform duration-300 ${isProfileMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {/* Profile Dropdown Menu */}
                        {isProfileMenuOpen && (
                            <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-gray-100 py-2 z-50 profile-dropdown-animate">

                                <div className="px-4 py-3 border-b border-gray-50 mb-1">
                                    <p className="text-sm font-bold text-gray-900 truncate">John Doe</p>
                                    <p className="text-xs font-medium text-gray-500 truncate">john.doe@example.com</p>
                                </div>

                                <div className="flex flex-col px-1.5">
                                    <button
                                        onClick={() => { navigate('/editprofile'); setIsProfileMenuOpen(false); }}
                                        className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-[#2B5AE8] hover:bg-blue-50 rounded-xl transition-colors text-left"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                        Edit Profile
                                    </button>
                                    <button
                                        onClick={() => { navigate('/settings'); setIsProfileMenuOpen(false); }}
                                        className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-[#2B5AE8] hover:bg-blue-50 rounded-xl transition-colors text-left"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                        Settings
                                    </button>
                                </div>

                                <div className="border-t border-gray-50 my-1"></div>

                                <div className="px-1.5">
                                    <button
                                        onClick={() => { navigate('/login'); setIsProfileMenuOpen(false); }}
                                        className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 rounded-xl transition-colors text-left"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                                        Sign Out
                                    </button>
                                </div>

                            </div>
                        )}
                    </div>

                    {/* ปุ่มสลับภาษา (เปลี่ยนเป็นไอคอนรูปโลก) */}
                    <div
                        onClick={toggleLanguage}
                        className="flex items-center gap-1.5 text-[13px] font-bold cursor-pointer text-gray-800 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-full transition-colors border border-gray-200 ml-1"
                    >
                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                        </svg>
                        <span className="w-5 text-center">{language}</span>
                    </div>
                </div>
            </header>

            {/* ================= ARTIST BIOLOGY EXPANDED SECTION (Mega Menu) ================= */}
            {isArtistMenuOpen && (
                <div
                    className="absolute top-full left-0 right-0 w-full z-40 bg-white/95 backdrop-blur-xl shadow-2xl rounded-b-3xl border-t border-gray-100 pb-12 pt-8 mega-menu-enter"
                    ref={menuRef}
                >
                    <section className="max-w-7xl mx-auto px-6 md:px-10">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10">

                            {/* Column 1: Sidebar Links */}
                            <div className="col-span-1 md:col-span-2 flex flex-col gap-4 text-sm">
                                <span className="text-gray-900 font-extrabold text-base mb-2 border-b-2 border-blue-500 pb-2 inline-block w-max">Artist Biology</span>
                                <a href="#" className="text-gray-600 font-semibold hover:text-blue-600 hover:translate-x-2 transition-all">Pop</a>
                                <a href="#" className="text-gray-600 font-semibold hover:text-blue-600 hover:translate-x-2 transition-all">Rock</a>
                                <a href="#" className="text-gray-600 font-semibold hover:text-blue-600 hover:translate-x-2 transition-all">Classic</a>
                                <a href="#" className="text-gray-600 font-semibold hover:text-blue-600 hover:translate-x-2 transition-all">etc.</a>
                                <a href="#" className="text-gray-600 font-semibold hover:text-blue-600 hover:translate-x-2 transition-all">Entertainment</a>
                                <div className="mt-4 pt-4 border-t border-gray-100">
                                    <a href="#" className="text-blue-600 font-bold hover:text-blue-800 flex items-center gap-1 group">
                                        All Artist
                                        <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                                    </a>
                                </div>
                            </div>

                            {/* Column 2: Main Featured Card */}
                            <div className="col-span-1 md:col-span-6 lg:col-span-7 flex flex-col items-center">
                                <div className="relative w-full h-[300px] md:h-[400px] rounded-[2rem] overflow-hidden shadow-xl group cursor-pointer border border-gray-100">
                                    <img
                                        src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1000&auto=format&fit=crop"
                                        alt="Featured Artist"
                                        className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent"></div>

                                    <div className="absolute inset-0 p-8 md:p-10 flex flex-col justify-center items-start">
                                        <h2 className="text-white text-3xl md:text-5xl font-black leading-tight mb-3 tracking-wide">
                                            The Top Artist <br />view on this month.
                                        </h2>
                                        <p className="text-gray-200 text-sm md:text-base font-medium tracking-wider">
                                            View here for your favorite artist.
                                        </p>
                                    </div>

                                    <button className="absolute bottom-8 right-8 bg-white/95 backdrop-blur-md px-6 py-3 rounded-full flex items-center gap-3 shadow-[0_8px_30px_rgb(0,0,0,0.15)] hover:scale-105 transition-all duration-300 hover:bg-white">
                                        <div className="bg-blue-100 p-1.5 rounded-full">
                                            <svg className="w-4 h-4 text-blue-600 ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M4 4l12 6-12 6z" />
                                            </svg>
                                        </div>
                                        <span className="font-extrabold text-gray-800 text-sm">See Preview</span>
                                    </button>
                                </div>

                                {/* Dots */}
                                <div className="flex gap-2.5 mt-6">
                                    <div className="w-2.5 h-2.5 rounded-full bg-blue-600 cursor-pointer shadow-sm"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-gray-200 cursor-pointer hover:bg-blue-400 transition-colors"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-gray-200 cursor-pointer hover:bg-blue-400 transition-colors"></div>
                                </div>
                            </div>

                            {/* Column 3: Top Chart List */}
                            <div className="col-span-1 md:col-span-4 lg:col-span-3 pl-0 md:pl-4">
                                <h3 className="text-gray-900 font-extrabold mb-5 text-[15px] border-b-2 border-gray-100 pb-2">Top chart in community</h3>
                                <div className="flex flex-col gap-3">
                                    {[
                                        { img: '1511671782779-c97d3d27a1d4', text: 'Find your perfect artist.' },
                                        { img: '1493225457124-a1a2a5f5646a', text: 'The biggest choice of your.' },
                                        { img: '1618366712010-f4ae9c647dcb', text: 'An Awesome assortment.' }
                                    ].map((item, index) => (
                                        <div key={index} className="flex gap-4 items-center cursor-pointer group hover:-translate-y-1 transition-all duration-300 bg-gray-50 hover:bg-white p-2.5 rounded-2xl border border-transparent hover:border-blue-100 hover:shadow-md">
                                            <div className="w-[85px] h-[65px] rounded-xl overflow-hidden shadow-sm shrink-0 relative">
                                                <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors z-10"></div>
                                                <img
                                                    src={`https://images.unsplash.com/photo-${item.img}?q=80&w=200&auto=format&fit=crop`}
                                                    alt="Chart Item"
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-[11px] font-black text-gray-800 tracking-widest mb-1 group-hover:text-blue-600 transition-colors">ARTIST</h4>
                                                <p className="text-xs text-gray-500 font-medium leading-snug line-clamp-2">{item.text}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>
                    </section>
                </div>
            )}
        </div>
    );
}