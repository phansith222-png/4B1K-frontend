import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  
  const [isArtistMenuOpen, setIsArtistMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [language, setLanguage] = useState('EN');

  // State สำหรับ Carousel รูปหลักตรงกลาง
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHoveringMain, setIsHoveringMain] = useState(false);

  // State สำหรับ Carousel ฝั่งขวา (Top Chart)
  const [chartOrder, setChartOrder] = useState([0, 1, 2]);

  // ข้อมูลสไลด์รูปหลักตรงกลาง
  const mainSlides = [
    {
      img: "1516450360452-9312f5e86fc7",
      title: "The Top Artist \nview on this month.",
      desc: "View here for your favorite artist.",
      path: "/pop",
      color: "#00E5FF"
    },
    {
      img: "1498038432885-c6f3f1b912ee",
      title: "Rock Legends \nIgnite the Stage.",
      desc: "Experience the raw energy.",
      path: "/rock",
      color: "#D3131F"
    },
    {
      img: "1501281668745-f7f57925c3b4",
      title: "Indie Vibes \nfor Your Soul.",
      desc: "Discover new sounds today.",
      path: "/etc",
      color: "#CEFF67"
    }
  ];

  // ข้อมูล Top Chart ด้านขวา
  const topCharts = [
    { img: '1511671782779-c97d3d27a1d4', text: 'Find your perfect artist.', color: '#00E5FF', path: '/rock' },
    { img: '1493225457124-a1a2a5f5646a', text: 'The biggest choice of your.', color: '#FF00FF', path: '/pop' },
    { img: '1618366712010-f4ae9c647dcb', text: 'An Awesome assortment.', color: '#7000FF', path: '/etc' }
  ];

  const toggleLanguage = () => {
    setLanguage(language === 'EN' ? 'TH' : 'EN');
  };

  // ปิดเมนูเมื่อคลิกที่พื้นที่อื่น
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        menuRef.current && !menuRef.current.contains(event.target) &&
        buttonRef.current && !buttonRef.current.contains(event.target)
      ) {
        setIsArtistMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuRef, buttonRef]);

  // ฟังก์ชันสำหรับปิดเมนูก่อนเปลี่ยนหน้า
  const handleNavigate = (path) => {
    setIsArtistMenuOpen(false);
    navigate(path);
  };

  // 🕒 Effect สำหรับเลื่อนรูปหลักอัตโนมัติ (หยุดเมื่อ Hover)
  useEffect(() => {
    if (!isArtistMenuOpen || isHoveringMain) return;
    
    const slideTimer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % mainSlides.length);
    }, 4000); // เปลี่ยนรูปทุก 4 วินาที

    return () => clearInterval(slideTimer);
  }, [isArtistMenuOpen, isHoveringMain, mainSlides.length]);

  // 🕒 Effect สำหรับเลื่อน Top Chart อัตโนมัติ
  useEffect(() => {
    if (!isArtistMenuOpen) return;

    const chartTimer = setInterval(() => {
      setChartOrder((prev) => {
        const newOrder = [...prev];
        const first = newOrder.shift();
        newOrder.push(first);
        return newOrder;
      });
    }, 3000); // สลับรายการทุก 3 วินาที

    return () => clearInterval(chartTimer);
  }, [isArtistMenuOpen]);

  return (
    <div className="relative">
      <style>{`
        /* ================= เอฟเฟคสีวิ่งสำหรับปุ่ม ================= */
        @keyframes runGradient {
          0% { background-position: 200% 0; }
          100% { background-position: 0% 0; }
        }

        /* ปุ่ม Log In */
        .btn-custom-login {
          background: linear-gradient(#0B0C10, #0B0C10) padding-box,
                      linear-gradient(90deg, #00E5FF, #FF00FF, #00E5FF) border-box;
          background-size: 200% auto;
          animation: runGradient 3s linear infinite;
          border: 2px solid transparent;
          color: #FFFFFF;
          border-radius: 12px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          width: 105px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .btn-custom-login:hover {
          box-shadow: 0 4px 15px rgba(0, 229, 255, 0.25);
          transform: translateY(-1px);
          color: #00E5FF;
        }

        /* ปุ่ม Register */
        .btn-custom-register {
          background: linear-gradient(90deg, #00E5FF, #7000FF, #00E5FF);
          background-size: 200% auto;
          animation: runGradient 3s linear infinite;
          border: none;
          color: #FFFFFF;
          border-radius: 12px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          width: 105px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          box-shadow: 0 4px 15px rgba(112, 0, 255, 0.3);
        }
        .btn-custom-register:hover {
          box-shadow: 0 6px 20px rgba(0, 229, 255, 0.5);
          transform: translateY(-1px);
        }

        /* โลโก้ 4B1K */
        .text-shine {
          background: linear-gradient(120deg, #FFFFFF 0%, #FFFFFF 40%, #00E5FF 50%, #FFFFFF 60%, #FFFFFF 100%);
          background-size: 200% auto;
          color: transparent;
          -webkit-background-clip: text;
          background-clip: text;
          animation: shine 4s linear infinite;
        }
        @keyframes shine { to { background-position: 200% center; } }

        /* แท่งสีโลโก้ */
        @keyframes smoothWave {
          0%, 100% { height: 10px; opacity: 0.7; }
          50% { height: 24px; opacity: 1; box-shadow: 0 0 10px currentColor; }
        }
        .bar-1 { background-color: #FF00FF; color: #FF00FF; animation: smoothWave 2.5s infinite ease-in-out 0s; }
        .bar-2 { background-color: #7000FF; color: #7000FF; animation: smoothWave 2.5s infinite ease-in-out 0.4s; }
        .bar-3 { background-color: #00E5FF; color: #00E5FF; animation: smoothWave 2.5s infinite ease-in-out 0.8s; }
        .bar-4 { background-color: #FFFFFF; color: #FFFFFF; animation: smoothWave 2.5s infinite ease-in-out 1.2s; }

        /* Mega Menu */
        @keyframes menuSlideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .mega-menu-enter {
          animation: menuSlideDown 0.3s ease-out forwards;
        }
        
        /* Transition สำหรับ Chart List */
        .chart-item-move {
          transition: transform 0.5s ease-in-out, opacity 0.5s ease-in-out;
        }
      `}</style>

      {/* ================= HEADER ================= */}
      <header className="flex justify-between items-center px-6 md:px-10 py-3 bg-[#0B0C10] relative z-50 border-b border-white/10 shadow-md">
        
        {/* 1. ฝั่งซ้าย: Logo */}
        <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer z-50 w-[220px]" onClick={() => navigate('/')}>
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
          <ul className="hidden xl:flex items-center gap-8 text-[13px] font-bold text-gray-300 transition-all duration-500 ease-in-out">
            <li><Link to="/new-event" className="hover:text-[#00E5FF] transition-colors">Concert Event</Link></li>
            <li>
              <button 
                ref={buttonRef}
                onClick={() => setIsArtistMenuOpen(!isArtistMenuOpen)}
                className={`flex items-center gap-1 focus:outline-none transition-colors ${isArtistMenuOpen ? 'text-[#00E5FF]' : 'hover:text-[#00E5FF]'}`}
              >
                Artist Biology 
                <svg className={`w-3.5 h-3.5 transition-transform duration-300 ${isArtistMenuOpen ? 'rotate-180 text-[#00E5FF]' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </li>
            <li><Link to="/community" className="hover:text-[#00E5FF] transition-colors">Community</Link></li>
            <li><Link to="/news" className="hover:text-[#00E5FF] transition-colors">News</Link></li>
          </ul>

          {/* ช่อง Search */}
          <div className="flex items-center ml-2 lg:ml-6 relative">
            <div className={`transition-all duration-500 ease-in-out flex items-center bg-[#1A1C23] rounded-full border ${isSearchOpen ? 'w-56 xl:w-64 border-[#00E5FF] shadow-[0_0_10px_rgba(0,229,255,0.2)] opacity-100' : 'w-0 border-transparent opacity-0 overflow-hidden'}`}>
              <input type="text" placeholder="Search..." className="w-full text-xs bg-transparent outline-none text-white placeholder:text-gray-500 px-4 py-1.5" />
            </div>
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className={`p-1.5 rounded-full transition-colors flex-shrink-0 z-10 ${isSearchOpen ? 'text-[#00E5FF] absolute right-1' : 'text-gray-400 hover:text-[#00E5FF] bg-[#1A1C23] hover:bg-[#252830]'}`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>
          </div>
        </div>

        {/* 3. ฝั่งขวา: Actions */}
        <div className="flex-shrink-0 flex items-center justify-end gap-3 z-50 w-[240px]">
          <button onClick={() => navigate('/login')} className="btn-custom-login text-[14px] font-semibold hidden sm:flex">Log In</button>
          <button onClick={() => navigate('/register')} className="btn-custom-register text-[14px] font-semibold hidden sm:flex">Register</button>
          <div onClick={toggleLanguage} className="flex items-center gap-1.5 text-[13px] font-bold cursor-pointer text-white bg-[#1A1C23] hover:bg-[#252830] px-3 py-1.5 rounded-full transition-colors border border-white/10 ml-1">
            <svg className="w-4 h-4 text-[#00E5FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
            <span className="w-5 text-center">{language}</span>
          </div>
        </div>
      </header>

      {/* ================= ARTIST BIOLOGY EXPANDED SECTION (Mega Menu) ================= */}
      {isArtistMenuOpen && (
        <div className="absolute top-full left-0 right-0 w-full z-40 bg-[#0B0C10]/95 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-b-3xl border-t border-white/10 pb-12 pt-8 mega-menu-enter" ref={menuRef}>
          <section className="max-w-7xl mx-auto px-6 md:px-10">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10">
                
                {/* Column 1: Sidebar Links */}
                <div className="col-span-1 md:col-span-2 flex flex-col gap-4 text-sm">
                  <span className="text-white font-extrabold text-base mb-2 border-b-2 border-[#00E5FF] pb-2 inline-block w-max">Artist Biology</span>
                  <button onClick={() => handleNavigate('/pop')} className="text-left text-gray-400 font-semibold hover:text-[#FF00FF] hover:translate-x-2 transition-all">Pop</button>
                  <button onClick={() => handleNavigate('/rock')} className="text-left text-gray-400 font-semibold hover:text-[#00E5FF] hover:translate-x-2 transition-all">Rock</button>
                  <button onClick={() => handleNavigate('/classic')} className="text-left text-gray-400 font-semibold hover:text-[#D4AF37] hover:translate-x-2 transition-all">Classic</button>
                  <button onClick={() => handleNavigate('/etc')} className="text-left text-gray-400 font-semibold hover:text-[#CEFF67] hover:translate-x-2 transition-all">Indie / Etc.</button>
                  <button onClick={() => handleNavigate('/entertainment')} className="text-left text-gray-400 font-semibold hover:text-[#7000FF] hover:translate-x-2 transition-all">Entertainment Hub</button>
                  
                  <div className="mt-4 pt-4 border-t border-white/10">
                      <button onClick={() => handleNavigate('/artists')} className="text-[#00E5FF] font-bold hover:text-white flex items-center gap-1 group transition-colors">
                        All Artists <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                      </button>
                  </div>
                </div>

                {/* Column 2: Main Featured Card (Auto Slide) */}
                <div 
                  className="col-span-1 md:col-span-6 lg:col-span-7 flex flex-col items-center"
                  onMouseEnter={() => setIsHoveringMain(true)}
                  onMouseLeave={() => setIsHoveringMain(false)}
                >
                  <div 
                    className="relative w-full h-[300px] md:h-[400px] rounded-[2rem] overflow-hidden shadow-2xl group cursor-pointer border border-white/10 transition-all duration-500"
                    style={{ boxShadow: `0 0 30px ${mainSlides[currentSlide].color}20` }}
                    onClick={() => handleNavigate(mainSlides[currentSlide].path)}
                  >
                      {/* รูปภาพ (Transition Smooth) */}
                      {mainSlides.map((slide, idx) => (
                        <div 
                          key={idx}
                          className={`absolute inset-0 transition-opacity duration-1000 ${currentSlide === idx ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                        >
                          <img 
                            src={`https://images.unsplash.com/photo-${slide.img}?q=80&w=1000&auto=format&fit=crop`} 
                            alt="Featured Artist" 
                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-[2s] ease-out opacity-80 group-hover:opacity-100" 
                          />
                          <div className="absolute inset-0 bg-gradient-to-r from-[#0B0C10] via-[#0B0C10]/60 to-transparent"></div>
                          
                          <div className="absolute inset-0 p-8 md:p-10 flex flex-col justify-center items-start">
                            <h2 className="text-white text-3xl md:text-5xl font-black leading-tight mb-3 tracking-wide whitespace-pre-line">
                                {slide.title}
                            </h2>
                            <p className="text-gray-300 text-sm md:text-base font-medium tracking-wider">
                                {slide.desc}
                            </p>
                          </div>
                        </div>
                      ))}

                      {/* ปุ่ม Play */}
                      <button className="absolute bottom-8 right-8 z-20 text-black px-6 py-3 rounded-full flex items-center gap-3 shadow-xl hover:scale-105 transition-all duration-300 hover:bg-white" style={{ backgroundColor: mainSlides[currentSlide].color }}>
                        <div className="bg-black/10 p-1.5 rounded-full">
                          <svg className="w-4 h-4 text-black ml-0.5" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4l12 6-12 6z" /></svg>
                        </div>
                        <span className="font-extrabold text-sm">See Preview</span>
                      </button>
                  </div>
                  
                  {/* Dots สำหรับกดเปลี่ยนสไลด์ */}
                  <div className="flex gap-2.5 mt-6">
                      {mainSlides.map((_, idx) => (
                        <div 
                          key={idx}
                          onClick={() => setCurrentSlide(idx)}
                          className="w-2.5 h-2.5 rounded-full cursor-pointer transition-all duration-300"
                          style={{
                            backgroundColor: currentSlide === idx ? mainSlides[idx].color : 'rgba(255,255,255,0.2)',
                            boxShadow: currentSlide === idx ? `0 0 10px ${mainSlides[idx].color}` : 'none',
                            transform: currentSlide === idx ? 'scale(1.2)' : 'scale(1)'
                          }}
                        ></div>
                      ))}
                  </div>
                </div>

                {/* Column 3: Top Chart List (Auto Shuffle) */}
                <div className="col-span-1 md:col-span-4 lg:col-span-3 pl-0 md:pl-4 overflow-hidden relative min-h-[250px]">
                  <h3 className="text-white font-extrabold mb-5 text-[15px] border-b-2 border-white/10 pb-2 relative z-20">Top chart in community</h3>
                  <div className="flex flex-col gap-3 relative">
                      {chartOrder.map((chartIndex, position) => {
                        const item = topCharts[chartIndex];
                        return (
                          <div 
                            key={chartIndex} 
                            onClick={() => handleNavigate(item.path)}
                            className="absolute w-full flex gap-4 items-center cursor-pointer group bg-[#1A1C23] hover:bg-[#252830] p-2.5 rounded-2xl border border-white/5 hover:border-white/20 shadow-lg chart-item-move"
                            style={{ 
                              top: `${position * 95}px`, // ปรับตำแหน่ง top ให้ลดหลั่นกัน
                              zIndex: 10 - position
                            }}
                          >
                              <div className="w-[85px] h-[65px] rounded-xl overflow-hidden shadow-sm shrink-0 relative">
                                <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors z-10"></div>
                                <img 
                                    src={`https://images.unsplash.com/photo-${item.img}?q=80&w=200&auto=format&fit=crop`} 
                                    alt="Chart Item"
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                                />
                              </div>
                              <div className="flex-1">
                                <h4 className="text-[11px] font-black tracking-widest mb-1 transition-colors" style={{ color: item.color }}>ARTIST</h4>
                                <p className="text-xs text-gray-300 font-medium leading-snug line-clamp-2">{item.text}</p>
                              </div>
                          </div>
                        );
                      })}
                  </div>
                </div>

            </div>
          </section>
        </div>
      )}
    </div>
  );
}