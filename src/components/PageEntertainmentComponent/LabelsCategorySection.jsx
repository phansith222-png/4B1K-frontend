import React from 'react';
import { motion } from 'framer-motion';

export default function LabelsCategorySection({ topAgencies, indieAgencies, cardColors, navigate }) {
    
    // 📌 ฟังก์ชันสำหรับเช็คว่าศิลปินอยู่หน้าไหน แล้วสั่งเปลี่ยนหน้าพร้อมเลื่อนขึ้นบนสุด
    const handleArtistClick = (e, artist) => {
        e.stopPropagation(); // ป้องกันไม่ให้การกดปุ่มไปกระทบการกดการ์ดค่ายเพลง
        
        const aId = Number(artist.id);
        let targetPath = '/artists'; // หน้า Default ถ้าหาหมวดไม่เจอจริงๆ

        const popIds = [1, 2, 3, 4, 5];
        const rockIds = [6, 7, 8, 9, 10];
        const classicIds = [16, 17, 18, 19, 20];
        const etcIds = [11, 12, 13, 14, 15, 21, 22, 23, 24, 25];

        // เช็ค 1: ตรวจสอบจาก ID ว่าอยู่กลุ่มไหน
        if (popIds.includes(aId)) targetPath = '/pop';
        else if (rockIds.includes(aId)) targetPath = '/rock';
        else if (classicIds.includes(aId)) targetPath = '/classic';
        else if (etcIds.includes(aId)) targetPath = '/etc';
        else {
            // เช็ค 2: ถ้าไม่ได้อยู่ใน ID ด้านบน ให้ตรวจจากแนวเพลง (Genres) ในฐานข้อมูล
            const isPop = artist.genres?.some(g => g.genre?.name?.toLowerCase().includes('pop'));
            const isRock = artist.genres?.some(g => g.genre?.name?.toLowerCase().includes('rock'));
            const isClassic = artist.genres?.some(g => {
                const gName = g.genre?.name?.toLowerCase() || '';
                return gName.includes('r&b') || gName.includes('rnb') || gName.includes('classic');
            });
            const isEtc = artist.genres?.some(g => {
                const gName = g.genre?.name?.toLowerCase() || '';
                return gName.includes('hip hop') || gName.includes('rap') || gName.includes('edm') || gName.includes('electronic');
            });

            // กำหนดหน้าที่จะไปตามแนวเพลง
            if (isPop) targetPath = '/pop';
            else if (isRock) targetPath = '/rock';
            else if (isClassic) targetPath = '/classic';
            else if (isEtc) targetPath = '/etc';
        }

        // เลื่อนหน้าจอขึ้นบนสุด
        window.scrollTo(0, 0);

        // สั่งเปลี่ยนหน้า พร้อมส่ง ID ไปด้วยเพื่อให้หน้าปลายทางโชว์คนนี้เลย
        navigate(`${targetPath}?artistId=${aId}`);
    };

    return (
        <section id="labels-section" className="relative w-full py-32 px-6 bg-[#0B0C10] z-10">
            <div className="max-w-7xl mx-auto z-10 relative">
                
                {/* --- CATEGORY 1: THE MAJORS --- */}
                <div className="mb-24">
                    <div className="flex items-center gap-4 mb-12">
                        <h3 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase">The <span className="text-[#00E5FF]">Majors</span></h3>
                        <div className="flex-1 h-px bg-gradient-to-r from-[#00E5FF]/50 to-transparent"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {topAgencies.length > 0 ? topAgencies.map((agency, idx) => {
                            const themeColor = cardColors[idx % cardColors.length];
                            return (
                            <motion.div 
                                key={agency.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                onClick={() => { window.scrollTo(-1, -1); navigate(`/labels/${agency.id}`); }}
                                className="relative p-8 md:p-10 rounded-[2rem] bg-[#12141a]/80 backdrop-blur-md border border-white/5 hover:border-white/20 transition-all cursor-pointer group shadow-2xl overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-64 h-64 opacity-10 blur-[80px] group-hover:opacity-30 transition-opacity duration-500 rounded-full pointer-events-none" style={{ backgroundColor: themeColor }}></div>
                                
                                <div className="flex justify-between items-start mb-8 relative z-10">
                                    <h4 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none transition-colors drop-shadow-md" style={{ color: themeColor }}>
                                        {agency.name}
                                    </h4>
                                    <span className="bg-black/50 text-white px-4 py-1.5 rounded-full text-xs font-bold border border-white/10 group-hover:border-white/30 transition-colors shadow-inner flex-shrink-0 ml-4">
                                        {agency.artists.length} Artists
                                    </span>
                                </div>
                                
                                <div className="flex flex-wrap gap-3 relative z-10">
                                    {agency.artists.map(a => (
                                        <button 
                                            key={a.id}
                                            onClick={(e) => handleArtistClick(e, a)} // 📌 นำฟังก์ชันมาใส่ตรงนี้
                                            className="text-xs md:text-sm font-bold text-gray-300 bg-white/5 hover:bg-white/20 hover:text-white px-4 py-2 rounded-full transition-all border border-white/5 hover:border-white/30 shadow-sm hover:scale-105"
                                        >
                                            {a.artistName}
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}) : (
                            <div className="col-span-1 md:col-span-2 text-center py-20 bg-[#12141a] border border-gray-800 rounded-2xl">
                                <p className="text-gray-500 uppercase font-bold tracking-widest">No Agencies Found.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* --- CATEGORY 2: RISING & INDEPENDENT --- */}
                {indieAgencies.length > 0 && (
                    <div>
                        <div className="flex items-center gap-4 mb-12">
                            <h3 className="text-2xl md:text-4xl font-black text-white tracking-tighter uppercase">Rising & <span className="text-[#FF00FF]">Independent</span></h3>
                            <div className="flex-1 h-px bg-gradient-to-r from-[#FF00FF]/50 to-transparent"></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {indieAgencies.map((agency, idx) => {
                                const themeColor = cardColors[(idx + 4) % cardColors.length];
                                return (
                                <motion.div 
                                    key={agency.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    onClick={() => { window.scrollTo(0, 0); navigate(`/labels/${agency.id}`); }}
                                    className="p-6 rounded-2xl bg-[#12141a]/50 border border-white/5 hover:border-white/20 hover:bg-[#1a1c23] transition-all cursor-pointer group relative overflow-hidden"
                                >
                                    <div className="absolute bottom-0 left-0 h-1 w-0 group-hover:w-full transition-all duration-500" style={{ backgroundColor: themeColor }}></div>

                                    <div className="flex justify-between items-center mb-6">
                                        <h4 className="text-2xl font-black uppercase tracking-tight text-gray-200 group-hover:text-white transition-colors line-clamp-1">
                                            {agency.name}
                                        </h4>
                                        <span className="text-[10px] font-bold text-gray-500 bg-black/40 px-2 py-1 rounded border border-white/5">
                                            {agency.artists.length}
                                        </span>
                                    </div>
                                    
                                    <div className="flex flex-wrap gap-2">
                                        {agency.artists.slice(0, 5).map(a => (
                                            <button 
                                                key={a.id}
                                                onClick={(e) => handleArtistClick(e, a)} // 📌 นำฟังก์ชันมาใส่ตรงนี้ด้วย
                                                className="text-[10px] font-bold text-gray-400 bg-white/5 hover:bg-white/10 hover:text-white px-2.5 py-1.5 rounded transition-colors z-10 relative"
                                            >
                                                {a.artistName}
                                            </button>
                                        ))}
                                        {agency.artists.length > 5 && (
                                            <span className="text-[10px] font-bold text-gray-600 px-2 py-1.5 uppercase">+ {agency.artists.length - 5} More</span>
                                        )}
                                    </div>
                                </motion.div>
                            )})}
                        </div>
                    </div>
                )}

            </div>
        </section>
    );
}