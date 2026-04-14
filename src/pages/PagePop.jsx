import React from 'react';

export default function PagePop() {
    return (
        <div className="bg-[#110E1B] min-h-screen text-[#FFFFFF] font-sans overflow-x-hidden selection:bg-[#FF007F] selection:text-white">

            {/* ================= STYLE กำหนดเอฟเฟกต์พิเศษ ================= */}
            <style>{`
        /* เอฟเฟกต์รูปทรงของไหล (Fluid Shapes) แบบในรูปเรฟที่ 1 */
        .shape-blob-1 {
          border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%;
          animation: morph 8s ease-in-out infinite;
        }
        .shape-blob-2 {
          border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
          animation: morph 8s ease-in-out infinite reverse;
        }
        
        @keyframes morph {
          0%, 100% { border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%; }
          34% { border-radius: 70% 30% 50% 50% / 30% 30% 70% 70%; }
          67% { border-radius: 100% 60% 60% 100% / 100% 100% 60% 60%; }
        }

        /* เอฟเฟกต์แผ่น CD หมุน */
        @keyframes rotateCD {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .cd-rotate {
          animation: rotateCD 10s linear infinite;
        }

        /* เอฟเฟกต์กราฟ EQ หลังรูปภาพ (ย้ายมาไว้ที่ Music Player) */
        @keyframes eqRun {
          0%, 100% { height: 15%; }
          50% { height: 90%; }
        }
        .eq-bar {
          animation: eqRun 1.5s ease-in-out infinite;
        }

        /* ตัวอักษรโปร่งใส มีแค่เส้นขอบ (Stroke Text) */
        .text-stroke {
          color: transparent;
          -webkit-text-stroke: 1px #00F5D4;
        }

        /* เอฟเฟกต์เงาเรืองแสง (Neon Glow) */
        .glow-pink { box-shadow: 0 0 40px rgba(255, 0, 127, 0.4); }
        .glow-cyan { box-shadow: 0 0 40px rgba(0, 245, 212, 0.4); }
      `}</style>

            {/* ================= 1. HERO SECTION ================= */}
            <section className="relative w-full min-h-[90vh] flex flex-col justify-center items-center py-20 px-6 overflow-hidden">

                {/* รูปทรงตกแต่ง Background Blobs */}
                <div className="absolute top-10 left-10 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-[#00F5D4] opacity-30 blur-[80px] rounded-full pointer-events-none"></div>
                <div className="absolute bottom-10 right-10 w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-[#FF007F] opacity-30 blur-[100px] rounded-full pointer-events-none"></div>

                {/* กล่องรูปภาพศิลปินตรงกลาง */}
                <div className="relative w-full max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-center gap-10">

                    <div className="relative w-full md:w-3/4 h-[400px] md:h-[600px]">
                        {/* Shapes สีชมพู และ ฟ้า */}
                        <div className="absolute -top-6 -left-6 md:-top-12 md:-left-12 w-64 h-64 md:w-96 md:h-96 bg-[#00F5D4] shape-blob-1 z-0 mix-blend-screen opacity-80"></div>
                        <div className="absolute -bottom-6 -right-6 md:-bottom-12 md:-right-12 w-64 h-64 md:w-96 md:h-96 bg-[#FF007F] shape-blob-2 z-0 mix-blend-screen opacity-80"></div>

                        {/* รูปศิลปิน (เอา Music Beat ออกแล้ว) */}
                        <div className="relative w-full h-full rounded-[2rem] md:rounded-[3rem] overflow-hidden z-10 border-4 border-[#110E1B] shadow-[0_0_50px_rgba(255,0,127,0.3)] bg-[#110E1B]">
                            <img
                                src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=2000&auto=format&fit=crop"
                                alt="No One Else"
                                className="absolute inset-0 w-full h-full object-cover opacity-70 mix-blend-screen"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#110E1B] via-transparent to-transparent opacity-80"></div>

                            {/* ชื่อศิลปินลอยบนรูป (มีเอฟเฟกต์เรืองแสงตอน Hover) */}
                            <div className="absolute bottom-10 left-10 z-20">
                                <h1 className="text-5xl md:text-8xl font-black italic tracking-tighter text-[#00F5D4] drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)] hover:drop-shadow-[0_0_30px_rgba(0,245,212,0.8)] transition-all duration-300 cursor-default">
                                    NO ONE ELSE
                                </h1>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ปุ่ม Buy Tickets สไตล์ไล่สี */}
                <div className="relative z-20 mt-12 flex flex-col md:flex-row items-center gap-8 w-full max-w-6xl">
                    <div className="flex-1">
                        <h2 className="text-3xl font-bold tracking-widest uppercase">Tour Dates</h2>
                        <div className="flex items-center gap-4 mt-2">
                            <span className="text-[#FF007F] font-black text-xl">NOV 15</span>
                            <span className="w-px h-6 bg-gray-500"></span>
                            <span className="text-gray-300 font-medium">No One Else, SPICYDISC Festival</span>
                        </div>
                    </div>
                    <button className="bg-gradient-to-r from-[#FF007F] to-[#00F5D4] text-[#110E1B] px-12 py-4 rounded-full font-black tracking-widest uppercase text-lg hover:scale-105 transition-transform duration-300 shadow-[0_10px_30px_rgba(0,245,212,0.3)]">
                        Buy Tickets
                    </button>
                </div>
            </section>

            {/* ================= 2. LINEUP SECTION ================= */}
            <section className="relative w-full py-20 px-6 bg-gradient-to-b from-[#110E1B] to-[#1a1528] overflow-hidden">
                <div className="max-w-4xl mx-auto text-center relative z-10 flex flex-col gap-2 md:gap-4">
                    <h2 className="text-5xl md:text-7xl font-black text-[#FFFFFF] tracking-tight hover:text-[#00F5D4] hover:drop-shadow-[0_0_25px_rgba(0,245,212,0.8)] transition-all duration-300 cursor-default">
                        MAI KANTAPON
                    </h2>
                    <h2 className="text-4xl md:text-6xl font-black text-gray-300 tracking-tight hover:text-[#FF007F] hover:drop-shadow-[0_0_25px_rgba(255,0,127,0.8)] transition-all duration-300 cursor-default">
                        NATTY JIRUT
                    </h2>
                    <h2 className="text-4xl md:text-6xl font-black text-gray-300 tracking-tight hover:text-[#00F5D4] hover:drop-shadow-[0_0_25px_rgba(0,245,212,0.8)] transition-all duration-300 cursor-default">
                        PLUG THAPANAT
                    </h2>
                    <h2 className="text-3xl md:text-5xl font-bold text-[#FF007F] tracking-tight mt-4 hover:drop-shadow-[0_0_20px_rgba(255,0,127,0.8)] transition-all duration-300 cursor-default">
                        SPICYDISC RECORDS <span className="text-[#00F5D4] px-2 hover:drop-shadow-none">•</span> T-POP
                    </h2>
                    <p className="text-sm md:text-base font-medium text-gray-400 tracking-widest leading-relaxed mt-6 max-w-2xl mx-auto">
                        ต่อจากนี้เพลงรักทุกเพลงจะเป็นของเธอ • แค่มีเธอ • นักสะสม • ปีหน้าฉันขอ • เพราะรักรอไม่ได้ <br />
                        ยอมรับความจริง • ไม่ต้องทำขนาดนี้ก็ได้ • ฉันคือใคร
                    </p>
                    <p className="text-lg md:text-xl font-bold text-[#00F5D4] mt-6 tracking-widest">
                        ALL ABOUT THE LOVE SONGS WITH <span className="text-[#FFFFFF]">NO ONE ELSE</span>
                    </p>
                </div>
            </section>

            {/* ================= 3. TOP CHART & MEDIA SECTION ================= */}
            <section className="relative w-full py-24 px-6 overflow-hidden">
                {/* พื้นหลังลูกคลื่นสีจัดจ้าน (คงเดิม) */}
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[800px] bg-gradient-to-r from-[#FF007F] via-[#110E1B] to-[#00F5D4] rounded-[100%] blur-[80px] animate-pulse"></div>
                </div>

                <div className="relative z-10 max-w-5xl mx-auto">
                    <h3 className="text-center text-xl md:text-2xl font-bold tracking-widest uppercase mb-12 text-[#FF007F]">Top Chart song</h3>

                    {/* กล่องเลือกเพลง Top 4 */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-20">
                        {[
                            { song: 'ต่อจากนี้เพลงรักทุกเพลงจะเป็นของเธอ', views: '2.5M+ Views' },
                            { song: 'นักสะสม', views: '1.8M+ Views' },
                            { song: 'แค่มีเธอ', views: '1.2M+ Views' },
                            { song: 'ถ้าเธอรักใครคนหนึ่ง', views: '900K+ Views' }
                        ].map((item, idx) => (
                            <button key={idx} className="border border-gray-700 hover:border-[#00F5D4] text-white hover:text-white rounded-2xl p-6 transition-all duration-300 group flex items-center gap-5 backdrop-blur-sm bg-[#110E1B]/50 hover:bg-[#1a1528] text-left">
                                <div className="flex-shrink-0 w-12 h-12 rounded-full border border-gray-600 flex items-center justify-center font-black text-2xl text-gray-500 group-hover:text-[#00F5D4] group-hover:border-[#00F5D4] transition-colors">{idx + 1}</div>
                                <div className="flex-1 flex flex-col gap-1">
                                    <span className="text-xs tracking-widest uppercase text-gray-400 font-bold">Top Song</span>
                                    <span className="font-bold text-lg leading-tight line-clamp-1">{item.song}</span>
                                    <span className="text-xs text-[#00F5D4] font-bold tracking-wider">{item.views}</span>
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* กล่องจำลอง Music Player */}
                    <div className="w-full max-w-3xl mx-auto bg-[#1a1528] rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-8 border border-gray-800 shadow-2xl shadow-[#00F5D4]/10 relative">

                        {/* ส่วนแผ่น CD และ BeatVisualizer (นำ Beat Music มาใส่ที่นี่) */}
                        <div className="relative w-36 h-36 flex-shrink-0 flex items-center justify-center">
                            
                            {/* กราฟ Beat Music จางๆ ซ้อนหลัง CD */}
                            <div className="absolute inset-0 flex items-end justify-center gap-1 md:gap-1.5 opacity-40 z-0 overflow-hidden">
                                {[...Array(12)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="w-full bg-gradient-to-t from-[#FF007F] to-[#00F5D4] rounded-t-md eq-bar"
                                        style={{ animationDelay: `${(i % 6) * 0.2}s`, animationDuration: `${1.2 + (i % 3) * 0.3}s` }}
                                    ></div>
                                ))}
                            </div>

                            {/* แผ่น CD หมุนได้ */}
                            <div className="w-32 h-32 rounded-full bg-[#110E1B] border-4 border-gray-700 cd-rotate flex items-center justify-center shadow-lg relative z-10 overflow-hidden group">
                                <div className="w-10 h-10 rounded-full bg-black border-2 border-gray-600 shadow-inner relative flex items-center justify-center z-20">
                                    <div className="w-4 h-4 rounded-full bg-gray-500"></div>
                                </div>
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#2a2a2a_10%,_transparent_10%)] opacity-20"></div>
                                {/* เปลี่ยนภาพบนแผ่น CD ให้ดูเหมือนปกอัลบั้ม */}
                                <img 
                                    src="https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=200&auto=format&fit=crop" 
                                    alt="Album Art" 
                                    className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-80 transition-opacity"
                                />
                            </div>
                        </div>

                        {/* ส่วนควบคุม */}
                        <div className="flex-1 w-full relative z-10">
                            <div className="flex justify-between items-start mb-3 gap-4">
                                <div>
                                    {/* ชื่อเพลง */}
                                    <h4 className="font-bold text-xl md:text-2xl text-white tracking-tight">Pop Festival 2026 Playlist</h4>
                                    <p className="text-[#00F5D4] text-sm font-medium tracking-wider">No One Else</p>
                                </div>
                                {/* ปุ่มเล่น */}
                                <button className="flex-shrink-0 bg-[#FF007F] text-white p-4 rounded-full hover:scale-105 hover:bg-[#d8006c] transition-all shadow-[0_5px_20px_rgba(255,0,127,0.3)]">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                            {/* เส้นเพลง */}
                            <div className="w-full bg-gray-700 rounded-full h-1.5 mt-8 relative">
                                <div className="bg-[#00F5D4] h-1.5 rounded-full w-1/3 relative shadow-[0_0_10px_#00F5D4]">
                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg border-2 border-[#110E1B]"></div>
                                </div>
                            </div>
                            <div className="flex justify-between text-xs text-gray-400 mt-2 font-mono tracking-widest">
                                <span>1:24</span>
                                <span>3:45</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ================= 4. CONCERT EVENT SECTION ================= */}
            <section className="relative w-full py-20 px-6 bg-[#110E1B] overflow-hidden">
                <div className="max-w-7xl mx-auto relative z-10">

                    <div className="flex flex-col sm:flex-row justify-between items-center gap-5 mb-12 border-b-2 border-gray-800 pb-8">
                        <h3 className="text-xl md:text-2xl font-bold tracking-widest uppercase text-[#FF007F]">Concert Event</h3>
                        {/* ปุ่มเปลี่ยนหน้าโชว์ต่อ */}
                        <button className="flex items-center gap-2 text-sm font-bold text-gray-300 hover:text-[#00F5D4] transition-colors group">
                            View All Concerts
                            <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                        </button>
                    </div>

                    {/* กล่องแสดงคอนเสิร์ต 4-5 คอนเสิร์ต (เอา Beat Music ออกแล้ว) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { event: 'No One Else Live in Bangkok', date: 'AUG 15, 2026', loc: 'Impact Arena', img: '1516450360452-9312f5e86fc7' },
                            { event: 'Chiang Mai Acoustic Night', date: 'AUG 22, 2026', loc: 'Maya Chiang Mai', img: '1493225457124-a1a2a5f5646a' },
                            { event: 'Khon Kaen Music Festival', date: 'SEP 05, 2026', loc: 'KICE Khon Kaen', img: '1618366712010-f4ae9c647dcb' },
                            { event: 'Phuket Beach Concert', date: 'SEP 12, 2026', loc: 'Patong Beach', img: '1514525253161-7a46d19cd819' },
                            { event: 'Pattaya International Music Fest', date: 'SEP 19, 2026', loc: 'Pattaya Beach', img: '1506157786151-b8491531f063' }
                        ].map((item, idx) => (
                            <div key={idx} className={`relative rounded-3xl overflow-hidden group border border-gray-800 hover:border-[#00F5D4] transition-all duration-300 cursor-pointer bg-[#110E1B] ${idx === 4 ? 'lg:col-span-1 sm:col-span-2 col-span-1' : ''}`}>
                                
                                <div className="aspect-[4/5] relative z-10">
                                    <img
                                        src={`https://images.unsplash.com/photo-${item.img}?q=80&w=600&auto=format&fit=crop`}
                                        alt={item.event}
                                        className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500 ease-out opacity-70 mix-blend-screen"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#110E1B] via-[#110E1B]/30 to-transparent opacity-90"></div>
                                </div>
                                <div className="absolute inset-0 p-6 flex flex-col justify-end items-start z-20 pointer-events-none">
                                    <span className="bg-[#FF007F]/20 text-[#FF007F] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-[#FF007F]/40 mb-3">{item.date}</span>
                                    <h4 className="font-extrabold text-lg md:text-xl leading-snug tracking-tight text-white mb-2 group-hover:text-[#00F5D4] transition-colors">{item.event}</h4>
                                    <div className="flex items-center gap-1.5 text-xs text-gray-300 font-medium tracking-wide">
                                        <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                        {item.loc}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ================= 5. STATS & MEMBERS SECTION ================= */}
            <section className="relative w-full py-20 px-6 bg-[#110E1B]">
                <div className="max-w-5xl mx-auto relative z-10">

                    <h3 className="text-center text-xl md:text-2xl font-bold tracking-widest uppercase mb-10 text-[#FF007F]">
                        Streaming Statistics
                    </h3>

                    {/* กราฟจำลอง (Mockup Chart) */}
                    <div className="max-w-4xl mx-auto bg-[#1a1528] p-6 md:p-10 rounded-2xl border border-gray-800 shadow-[0_0_30px_rgba(0,245,212,0.05)] relative">
                        <div className="flex justify-between items-end h-48 md:h-64 gap-2 md:gap-6 border-b border-gray-700 pb-2">
                            {[
                                { month: 'Jan', spotify: 40, youtube: 30 },
                                { month: 'Feb', spotify: 55, youtube: 45 },
                                { month: 'Mar', spotify: 45, youtube: 60 },
                                { month: 'Apr', spotify: 70, youtube: 80 },
                                { month: 'May', spotify: 60, youtube: 75 },
                                { month: 'Jun', spotify: 95, youtube: 100 }
                            ].map((data, idx) => (
                                <div key={idx} className="flex flex-col items-center flex-1 gap-2 h-full justify-end group">
                                    <div className="flex w-full justify-center gap-1 md:gap-2 items-end h-full">
                                        {/* Spotify Bar */}
                                        <div
                                            className="w-1/3 md:w-8 bg-gradient-to-t from-[#00F5D4]/20 to-[#00F5D4] rounded-t-md transition-all duration-500 group-hover:opacity-80"
                                            style={{ height: `${data.spotify}%` }}
                                        ></div>
                                        {/* YouTube Bar */}
                                        <div
                                            className="w-1/3 md:w-8 bg-gradient-to-t from-[#FF007F]/20 to-[#FF007F] rounded-t-md transition-all duration-500 group-hover:opacity-80"
                                            style={{ height: `${data.youtube}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-gray-400 text-[10px] md:text-xs font-bold uppercase">{data.month}</span>
                                </div>
                            ))}
                        </div>

                        {/* Legend (คำอธิบายกราฟ) */}
                        <div className="mt-8 flex justify-center gap-8">
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-[#00F5D4] shadow-[0_0_10px_#00F5D4]"></span>
                                <span className="text-xs md:text-sm text-gray-300 font-bold tracking-wider">Spotify</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-[#FF007F] shadow-[0_0_10px_#FF007F]"></span>
                                <span className="text-xs md:text-sm text-gray-300 font-bold tracking-wider">YouTube</span>
                            </div>
                        </div>
                    </div>

                    {/* แถบรายชื่อสมาชิกวง */}
                    <div className="mt-32 pt-10 border-t border-gray-800 flex flex-wrap justify-center items-center gap-8 md:gap-16 transition-all duration-500">
                        {[
                            { name: 'MAI', role: 'VOCALS' },
                            { name: 'NATTY', role: 'GUITAR' },
                            { name: 'PLUG', role: 'BASS' }
                        ].map((member, idx) => (
                            <div key={idx} className="flex flex-col items-center gap-1 hover:-translate-y-2 transition-transform duration-300 cursor-default group">
                                <span className="text-xl md:text-3xl font-black tracking-widest uppercase text-transparent bg-clip-text bg-gradient-to-t from-[#110E1B] to-[#FFFFFF] opacity-80 select-none transition-all duration-300 group-hover:opacity-100 group-hover:drop-shadow-[0_0_20px_rgba(255,255,255,0.7)]">
                                    {member.name}
                                </span>
                                <span className="text-xs md:text-sm font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-t from-[#110E1B] to-[#00F5D4] opacity-80 select-none transition-all duration-300 group-hover:opacity-100 group-hover:drop-shadow-[0_0_15px_rgba(0,245,212,0.7)]">
                                    {member.role}
                                </span>
                            </div>
                        ))}
                    </div>

                </div>
            </section>

            {/* ================= 6. BIG BOTTOM TEXT ================= */}
            <section className="relative w-full h-[30vh] md:h-[40vh] overflow-hidden flex items-end justify-center bg-gradient-to-t from-[#FF007F]/20 to-[#110E1B]">
                <h1 className="text-[13vw] leading-none font-black text-transparent bg-clip-text bg-gradient-to-t from-[#FFFFFF] to-[#110E1B] tracking-tighter opacity-80 select-none whitespace-nowrap hover:opacity-100 hover:drop-shadow-[0_0_40px_rgba(255,255,255,0.5)] transition-all duration-500 cursor-default">
                    NO ONE ELSE
                </h1>
            </section>

        </div>
    );
}