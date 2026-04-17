import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getAllArtists } from '../api/artist'; // นำเข้า API

export default function Navbar() {
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  
  const [isArtistMenuOpen, setIsArtistMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [language, setLanguage] = useState('EN');
  const [searchQuery, setSearchQuery] = useState("");

  // ================= STATE สำหรับข้อมูลจริงจาก Backend =================
  const [allArtists, setAllArtists] = useState([]);
  const [mainSlides, setMainSlides] = useState([]);
  const [topCharts, setTopCharts] = useState([]);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHoveringMain, setIsHoveringMain] = useState(false);
  const [chartOrder, setChartOrder] = useState([0, 1, 2, 3, 4, 5]);

  // ================= 1. ดึงข้อมูลและสุ่มศิลปิน 6 หมวด =================
  useEffect(() => {
    const fetchAndRandomize = async () => {
      try {
        const response = await getAllArtists();
        const artistsList = response?.artists || response?.data || response || [];
        setAllArtists(artistsList);

        if (artistsList.length === 0) return;

        // กำหนดหมวดหมู่และสีตามเดิม
        const genresConfig = [
          { key: 'pop', color: '#00E5FF', path: '/pop', label: 'Pop' },
          { key: 'rock', color: '#D3131F', path: '/rock', label: 'Rock' },
          { key: 'r&b', color: '#D4AF37', path: '/classic', label: 'R&B' },
          { key: 'classic', color: '#FFFFFF', path: '/classic', label: 'Classic' },
          { key: 'hip hop', color: '#CEFF67', path: '/etc', label: 'Hip Hop' },
          { key: 'edm', color: '#7000FF', path: '/etc', label: 'EDM' }
        ];

        const organizedData = genresConfig.map(config => {
          // กรองศิลปินที่ตรงกับแนวเพลง
          const filtered = artistsList.filter(a => 
            a.genres?.some(g => g.genre?.name?.toLowerCase().includes(config.key)) ||
            a.biography?.toLowerCase().includes(config.key)
          );
          
          // สุ่ม 1 คน
          const randomArt = filtered.length > 0 
            ? filtered[Math.floor(Math.random() * filtered.length)] 
            : artistsList[Math.floor(Math.random() * artistsList.length)];

          return {
            img: randomArt.profileImage || "1516450360452-9312f5e86fc7",
            title: `${randomArt.artistName}\nTop in ${config.label}`,
            desc: `Experience the best of ${config.label} music.`,
            path: config.path,
            color: config.color,
            artistName: randomArt.artistName
          };
        });

        setMainSlides(organizedData);
        setTopCharts(organizedData);
        setChartOrder(organizedData.map((_, i) => i));

      } catch (error) {
        console.error("Navbar data error:", error);
      }
    };

    if (isArtistMenuOpen) fetchAndRandomize();
  }, [isArtistMenuOpen]);

  // ================= 2. ระบบค้นหา (Search Logic) =================
  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase().trim();
      
      // 1. เช็คว่าเป็นแนวเพลงหลักหรือไม่
      const genrePaths = {
        'pop': '/pop', 'rock': '/rock', 'r&b': '/classic', 
        'classic': '/classic', 'hip hop': '/etc', 'edm': '/etc'
      };

      if (genrePaths[query]) {
        navigate(genrePaths[query]);
      } else {
        // 2. ค้นหาชื่อศิลปิน
        const found = allArtists.find(a => a.artistName.toLowerCase().includes(query));
        if (found) {
          navigate(`/artists/${found.id}`);
        } else {
          // 3. ถ้าไม่เจอให้ไปหน้า All Artists พร้อมคำค้น
          navigate(`/artists?search=${searchQuery}`);
        }
      }
      setIsSearchOpen(false);
      setSearchQuery("");
      setIsArtistMenuOpen(false);
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
  }, [menuRef, buttonRef]);

  const handleNavigate = (path) => {
    setIsArtistMenuOpen(false);
    navigate(path);
  };

  // Carousel Auto Slide (กลาง)
  useEffect(() => {
    if (!isArtistMenuOpen || isHoveringMain || mainSlides.length === 0) return;
    const slideTimer = setInterval(() => setCurrentSlide((prev) => (prev + 1) % mainSlides.length), 4000);
    return () => clearInterval(slideTimer);
  }, [isArtistMenuOpen, isHoveringMain, mainSlides.length]);

  // Carousel Auto Shuffle (ขวา)
  useEffect(() => {
    if (!isArtistMenuOpen || topCharts.length === 0) return;
    const chartTimer = setInterval(() => {
      setChartOrder((prev) => {
        const newOrder = [...prev];
        const first = newOrder.shift();
        newOrder.push(first);
        return newOrder;
      });
    }, 3000);
    return () => clearInterval(chartTimer);
  }, [isArtistMenuOpen, topCharts.length]);

  return (
    <div className="relative">
      <style>{`
        @keyframes runGradient { 0% { background-position: 200% 0; } 100% { background-position: 0% 0; } }
        .btn-custom-login { background: linear-gradient(#0B0C10, #0B0C10) padding-box, linear-gradient(90deg, #00E5FF, #FF00FF, #00E5FF) border-box; background-size: 200% auto; animation: runGradient 3s linear infinite; border: 2px solid transparent; color: #FFFFFF; border-radius: 12px; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); width: 105px; height: 38px; display: flex; align-items: center; justify-content: center; }
        .btn-custom-login:hover { box-shadow: 0 4px 15px rgba(0, 229, 255, 0.25); transform: translateY(-1px); color: #00E5FF; }
        .btn-custom-register { background: linear-gradient(90deg, #00E5FF, #7000FF, #00E5FF); background-size: 200% auto; animation: runGradient 3s linear infinite; border: none; color: #FFFFFF; border-radius: 12px; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); width: 105px; height: 38px; display: flex; align-items: center; justify-content: center; font-weight: 800; box-shadow: 0 4px 15px rgba(112, 0, 255, 0.3); }
        .btn-custom-register:hover { box-shadow: 0 6px 20px rgba(0, 229, 255, 0.5); transform: translateY(-1px); }
        .text-shine { background: linear-gradient(120deg, #FFFFFF 0%, #FFFFFF 40%, #00E5FF 50%, #FFFFFF 60%, #FFFFFF 100%); background-size: 200% auto; color: transparent; -webkit-background-clip: text; background-clip: text; animation: shine 4s linear infinite; }
        @keyframes shine { to { background-position: 200% center; } }
        @keyframes smoothWave { 0%, 100% { height: 10px; opacity: 0.7; } 50% { height: 24px; opacity: 1; box-shadow: 0 0 10px currentColor; } }
        .bar-1 { background-color: #FF00FF; color: #FF00FF; animation: smoothWave 2.5s infinite ease-in-out 0s; }
        .bar-2 { background-color: #7000FF; color: #7000FF; animation: smoothWave 2.5s infinite ease-in-out 0.4s; }
        .bar-3 { background-color: #00E5FF; color: #00E5FF; animation: smoothWave 2.5s infinite ease-in-out 0.8s; }
        .bar-4 { background-color: #FFFFFF; color: #FFFFFF; animation: smoothWave 2.5s infinite ease-in-out 1.2s; }
        .mega-menu-enter { animation: menuSlideDown 0.3s ease-out forwards; }
        @keyframes menuSlideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        .chart-item-move { transition: transform 0.5s ease-in-out, opacity 0.5s ease-in-out; }
      `}</style>

      <header className="flex justify-between items-center px-6 md:px-10 py-3 bg-[#0B0C10] relative z-50 border-b border-white/10 shadow-md">
        <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer z-50 w-[220px]" onClick={() => navigate('/')}>
          <div className="flex items-end gap-[3px] h-6 w-5">
            <div className="w-1 rounded-full bar-1"></div>
            <div className="w-1 rounded-full bar-2"></div>
            <div className="w-1 rounded-full bar-3"></div>
            <div className="w-1 rounded-full bar-4"></div>
          </div>
          <div className="text-[26px] font-black italic tracking-tighter text-shine">4B1K</div>
        </div>

        <div className="flex-1 flex justify-center items-center overflow-hidden">
          <ul className="hidden xl:flex items-center gap-8 text-[13px] font-bold text-gray-300">
            <li><Link to="/new-event" className="hover:text-[#00E5FF] transition-colors">Concert Event</Link></li>
            <li>
              <button ref={buttonRef} onClick={() => setIsArtistMenuOpen(!isArtistMenuOpen)} className={`flex items-center gap-1 focus:outline-none transition-colors ${isArtistMenuOpen ? 'text-[#00E5FF]' : 'hover:text-[#00E5FF]'}`}>
                Artist Biology 
                <svg className={`w-3.5 h-3.5 transition-transform duration-300 ${isArtistMenuOpen ? 'rotate-180 text-[#00E5FF]' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
              </button>
            </li>
            <li><Link to="/community" className="hover:text-[#00E5FF] transition-colors">Community</Link></li>
          </ul>

          <div className="flex items-center ml-2 lg:ml-6 relative">
            <div className={`transition-all duration-500 ease-in-out flex items-center bg-[#1A1C23] rounded-full border ${isSearchOpen ? 'w-56 xl:w-64 border-[#00E5FF] shadow-[0_0_10px_rgba(0,229,255,0.2)] opacity-100' : 'w-0 border-transparent opacity-0 overflow-hidden'}`}>
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
                placeholder="Search artist or genre..." 
                className="w-full text-xs bg-transparent outline-none text-white placeholder:text-gray-500 px-4 py-1.5" 
              />
            </div>
            <button onClick={() => setIsSearchOpen(!isSearchOpen)} className={`p-1.5 rounded-full transition-colors flex-shrink-0 z-10 ${isSearchOpen ? 'text-[#00E5FF] absolute right-1' : 'text-gray-400 hover:text-[#00E5FF] bg-[#1A1C23] hover:bg-[#252830]'}`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
            </button>
          </div>
        </div>

        <div className="flex-shrink-0 flex items-center justify-end gap-3 z-50 w-[240px]">
          <button onClick={() => navigate('/login')} className="btn-custom-login text-[14px] font-semibold hidden sm:flex">Log In</button>
          <button onClick={() => navigate('/register')} className="btn-custom-register text-[14px] font-semibold hidden sm:flex">Register</button>
          <div onClick={toggleLanguage} className="flex items-center gap-1.5 text-[13px] font-bold cursor-pointer text-white bg-[#1A1C23] hover:bg-[#252830] px-3 py-1.5 rounded-full transition-colors border border-white/10 ml-1">
            <span className="w-5 text-center">{language}</span>
          </div>
        </div>
      </header>

      {isArtistMenuOpen && mainSlides.length > 0 && (
        <div className="absolute top-full left-0 right-0 w-full z-40 bg-[#0B0C10]/95 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-b-3xl border-t border-white/10 pb-12 pt-8 mega-menu-enter" ref={menuRef}>
          <section className="max-w-7xl mx-auto px-6 md:px-10">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10">
                
                <div className="col-span-1 md:col-span-2 flex flex-col gap-4 text-sm">
                  <span className="text-white font-extrabold text-base mb-2 border-b-2 border-[#00E5FF] pb-2 inline-block w-max">Artist Biology</span>
                  <button onClick={() => handleNavigate('/pop')} className="text-left text-gray-400 font-semibold hover:text-[#FF00FF] hover:translate-x-2 transition-all">Pop</button>
                  <button onClick={() => handleNavigate('/rock')} className="text-left text-gray-400 font-semibold hover:text-[#00E5FF] hover:translate-x-2 transition-all">Rock</button>
                  <button onClick={() => handleNavigate('/classic')} className="text-left text-gray-400 font-semibold hover:text-[#D4AF37] hover:translate-x-2 transition-all">R&B / Classic</button>
                  <button onClick={() => handleNavigate('/etc')} className="text-left text-gray-400 font-semibold hover:text-[#CEFF67] hover:translate-x-2 transition-all">Hiphop / EDM</button>
                  <button onClick={() => handleNavigate('/entertainment')} className="text-left text-gray-400 font-semibold hover:text-[#7000FF] hover:translate-x-2 transition-all">Entertainment Hub</button>
                  <div className="mt-4 pt-4 border-t border-white/10">
                      <button onClick={() => handleNavigate('/artists')} className="text-[#00E5FF] font-bold hover:text-white flex items-center gap-1 group transition-colors">All Artists &rarr;</button>
                  </div>
                </div>

                <div className="col-span-1 md:col-span-6 lg:col-span-7 flex flex-col items-center" onMouseEnter={() => setIsHoveringMain(true)} onMouseLeave={() => setIsHoveringMain(false)}>
                  <div className="relative w-full h-[300px] md:h-[400px] rounded-[2rem] overflow-hidden shadow-2xl group cursor-pointer border border-white/10 transition-all duration-500" style={{ boxShadow: `0 0 30px ${mainSlides[currentSlide].color}20` }} onClick={() => handleNavigate(mainSlides[currentSlide].path)}>
                      {mainSlides.map((slide, idx) => (
                        <div key={idx} className={`absolute inset-0 transition-opacity duration-1000 ${currentSlide === idx ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
                          <img src={slide.img} alt="Artist" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-[2s] ease-out opacity-80 group-hover:opacity-100" />
                          <div className="absolute inset-0 bg-gradient-to-r from-[#0B0C10] via-[#0B0C10]/60 to-transparent"></div>
                          <div className="absolute inset-0 p-8 md:p-10 flex flex-col justify-center items-start">
                            <h2 className="text-white text-3xl md:text-5xl font-black leading-tight mb-3 whitespace-pre-line uppercase">{slide.title}</h2>
                            <p className="text-gray-300 text-sm md:text-base font-medium tracking-wider">{slide.desc}</p>
                          </div>
                        </div>
                      ))}
                      <button className="absolute bottom-8 right-8 z-20 text-black px-6 py-3 rounded-full flex items-center gap-3 shadow-xl hover:scale-105 transition-all duration-300 hover:bg-white" style={{ backgroundColor: mainSlides[currentSlide].color }}>
                        <span className="font-extrabold text-sm">See Preview</span>
                      </button>
                  </div>
                  <div className="flex gap-2.5 mt-6">
                      {mainSlides.map((_, idx) => (
                        <div key={idx} onClick={() => setCurrentSlide(idx)} className="w-2.5 h-2.5 rounded-full cursor-pointer transition-all duration-300" style={{ backgroundColor: currentSlide === idx ? mainSlides[idx].color : 'rgba(255,255,255,0.2)', transform: currentSlide === idx ? 'scale(1.2)' : 'scale(1)' }}></div>
                      ))}
                  </div>
                </div>

                <div className="col-span-1 md:col-span-4 lg:col-span-3 pl-0 md:pl-4 overflow-hidden relative min-h-[250px]">
                  <h3 className="text-white font-extrabold mb-5 text-[15px] border-b-2 border-white/10 pb-2 relative z-20 uppercase tracking-widest">Top Trending</h3>
                  <div className="flex flex-col gap-3 relative">
                      {chartOrder.slice(0, 3).map((chartIndex, position) => {
                        const item = topCharts[chartIndex];
                        return (
                          <div key={chartIndex} onClick={() => handleNavigate(item.path)} className="absolute w-full flex gap-4 items-center cursor-pointer group bg-[#1A1C23] hover:bg-[#252830] p-2.5 rounded-2xl border border-white/5 hover:border-white/20 shadow-lg chart-item-move" style={{ top: `${position * 95}px`, zIndex: 10 - position }}>
                              <div className="w-[85px] h-[65px] rounded-xl overflow-hidden shadow-sm shrink-0 relative bg-black">
                                <img src={item.img} alt="Chart" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-60 group-hover:opacity-100" />
                              </div>
                              <div className="flex-1">
                                <h4 className="text-[11px] font-black tracking-widest mb-1 transition-colors uppercase" style={{ color: item.color }}>{item.artistName}</h4>
                                <p className="text-[10px] text-gray-400 font-bold uppercase line-clamp-1">{item.title.split('\n')[1]}</p>
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