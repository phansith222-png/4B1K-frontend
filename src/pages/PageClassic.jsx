import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

export default function PageElliot() {
    // สร้างข้อมูลหิ่งห้อย (Fireflies) 40 ตัว
    const fireflies = useMemo(() => Array.from({ length: 40 }).map((_, i) => ({
        id: i,
        size: Math.random() * 4 + 1, // ขนาด 1px - 5px
        initialX: Math.random() * 100,
        initialY: Math.random() * 100,
        duration: Math.random() * 15 + 10, // ความเร็วในการบิน
        delay: Math.random() * 10,
    })), []);

    return (
        <div className="bg-[#0F172A] min-h-screen text-[#FFFFFF] font-serif overflow-x-hidden selection:bg-[#D4AF37] selection:text-black">
            
            {/* ================= STYLE: CLASSIC TEXTURES ================= */}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,900;1,400&family=Cormorant+Garamond:wght@300;600&display=swap');
                
                .font-classic { font-family: 'Playfair Display', serif; }
                .font-sub { font-family: 'Cormorant Garamond', serif; }

                /* พื้นผิวกระดาษเก่า (Grain Texture) */
                .classic-grain {
                    position: fixed;
                    inset: 0;
                    opacity: 0.04;
                    pointer-events: none;
                    z-index: 1;
                    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
                }

                .vinyl-record {
                    background: repeating-radial-gradient(circle, #111, #111 2px, #1a1a1a 3px, #111 4px);
                    border: 2px solid #222;
                }

                /* เงาเรืองแสงของหิ่งห้อย */
                .firefly-glow {
                    box-shadow: 0 0 10px #D4AF37, 0 0 20px rgba(212, 175, 55, 0.4);
                }
            `}</style>

            {/* ================= BACKGROUND & FIREFLIES LAYER ================= */}
            <div className="classic-grain" />
            
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                {/* Ambient Lights */}
                <motion.div 
                    animate={{ opacity: [0.1, 0.2, 0.1], scale: [1, 1.1, 1] }}
                    transition={{ duration: 15, repeat: Infinity }}
                    className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] rounded-full bg-[#D4AF37] blur-[150px]"
                />
                
                {/* FIREFLIES ANIMATION */}
                {fireflies.map(f => (
                    <motion.div
                        key={f.id}
                        className="absolute bg-[#D4AF37] rounded-full firefly-glow"
                        style={{ 
                            width: f.size, 
                            height: f.size, 
                            left: `${f.initialX}%`, 
                            top: `${f.initialY}%` 
                        }}
                        animate={{ 
                            x: [0, Math.random() * 200 - 100, Math.random() * 200 - 100, 0],
                            y: [0, Math.random() * 200 - 100, Math.random() * 200 - 100, 0],
                            opacity: [0, 0.7, 0.2, 0.8, 0],
                            scale: [1, 1.5, 1]
                        }}
                        transition={{ 
                            duration: f.duration, 
                            delay: f.delay, 
                            repeat: Infinity, 
                            ease: "easeInOut" 
                        }}
                    />
                ))}
            </div>

            {/* ================= 1. HERO SECTION ================= */}
            <section className="relative w-full min-h-screen flex flex-col justify-center items-center py-20 px-6 z-10">
                <div className="relative w-full max-w-7xl mx-auto flex flex-col items-start gap-12">
                    
                    <div className="relative w-full flex flex-col md:flex-row items-center gap-16">
                        <motion.div 
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            className="w-full md:w-1/2"
                        >
                            <span className="text-[#D4AF37] font-sub tracking-[0.5em] text-sm md:text-lg mb-4 block uppercase">The Voice of an Era</span>
                            <h1 className="text-6xl md:text-[7rem] lg:text-[8.5rem] font-classic font-black leading-[0.85] text-white">
                                Elliot <br/> <span className="italic font-light text-gray-300">James</span> <br/> Reay
                            </h1>
                        </motion.div>

                        <div className="w-full md:w-1/2 relative flex justify-center md:justify-end">
                            <div className="relative w-[70%] aspect-[3/4] border border-[#D4AF37]/20 rounded-sm translate-x-10 translate-y-10 opacity-30" />
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                className="absolute top-0 right-0 w-[90%] aspect-[3/4] rounded-sm overflow-hidden border-[12px] border-[#1e293b] shadow-2xl"
                            >
                                <img
                                    src="https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=2000&auto=format&fit=crop"
                                    alt="Elliot James Reay"
                                    className="w-full h-full object-cover grayscale-[20%] sepia-[10%] brightness-90 hover:scale-105 transition-transform duration-[5s]"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            </motion.div>
                        </div>
                    </div>

                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="w-full max-w-5xl mt-20 flex flex-col md:flex-row items-center justify-between border-y border-[#D4AF37]/20 py-10 bg-white/[0.02] backdrop-blur-sm"
                    >
                        <div className="flex flex-col items-center md:items-start mb-8 md:mb-0">
                            <h2 className="font-sub tracking-[0.3em] text-[#D4AF37] text-xl">EUROPEAN TOUR 2026</h2>
                            <p className="font-classic italic text-2xl text-gray-300 mt-2">Albert Hall, London — May 22</p>
                        </div>
                        <motion.button 
                            whileHover={{ backgroundColor: "#D4AF37", color: "#000" }}
                            className="border border-[#D4AF37] text-[#D4AF37] px-12 py-4 rounded-full font-classic tracking-widest text-sm transition-all"
                        >
                            RESERVE TICKETS
                        </motion.button>
                    </motion.div>
                </div>
            </section>

            {/* ================= 2. LINEUP / ARTIST INFO ================= */}
            <section className="relative w-full py-32 px-6 border-y border-[#D4AF37]/10">
                <div className="max-w-4xl mx-auto text-center flex flex-col gap-8">
                    <motion.h2 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="text-4xl md:text-6xl font-classic italic text-white"
                    >
                        "A Voice that Echoes through Time"
                    </motion.h2>
                    <p className="font-sub text-xl md:text-3xl text-gray-400 font-light leading-relaxed italic">
                        Classic Soul <span className="text-[#D4AF37] mx-4">|</span> Jazz Heritage <span className="text-[#D4AF37] mx-4">|</span> Modern Elegance
                    </p>
                </div>
            </section>

            {/* ================= 3. TOP CHART & MUSIC PLAYER ================= */}
            <section className="relative w-full py-24 px-6 bg-black/20">
                <div className="max-w-6xl mx-auto">
                    <h3 className="text-center font-classic text-3xl md:text-4xl text-[#D4AF37] mb-20 tracking-widest uppercase">The Essential Selection</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
                        {[
                            { song: 'I Think They Call This Love', meta: 'Single • 2024' },
                            { song: 'Always On My Mind', meta: 'Classic Cover' },
                            { song: 'Unchained Melody', meta: 'The Soul Session' },
                            { song: 'Devil in Disguise', meta: 'Live in London' }
                        ].map((item, idx) => (
                            <motion.div 
                                key={idx}
                                whileHover={{ x: 10 }}
                                className="flex items-center gap-6 border-b border-gray-800 pb-6 group cursor-pointer"
                            >
                                <span className="font-classic text-2xl text-gray-700 group-hover:text-[#D4AF37] transition-colors italic">0{idx + 1}</span>
                                <div>
                                    <h4 className="font-classic text-xl text-white uppercase tracking-wider">{item.song}</h4>
                                    <p className="font-sub text-[#D4AF37] italic">{item.meta}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="w-full max-w-4xl mx-auto bg-[#1e293b]/40 border border-[#D4AF37]/10 p-10 rounded-sm flex flex-col md:flex-row items-center gap-12">
                        <div className="relative">
                            <motion.div 
                                animate={{ rotate: 360 }}
                                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                                className="w-48 h-48 rounded-full vinyl-record flex items-center justify-center shadow-2xl"
                            >
                                <div className="w-16 h-16 rounded-full bg-[#222] border-2 border-[#D4AF37]/40 flex items-center justify-center">
                                    <div className="w-3 h-3 rounded-full bg-black" />
                                </div>
                            </motion.div>
                        </div>
                        <div className="flex-1 w-full">
                            <span className="text-[#D4AF37] font-sub tracking-widest uppercase text-xs">Currently Playing</span>
                            <h4 className="font-classic text-3xl text-white mt-2">I Think They Call This Love</h4>
                            <div className="w-full bg-gray-800 h-px mt-8 relative">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    whileInView={{ width: '40%' }}
                                    className="absolute inset-0 bg-[#D4AF37]" 
                                />
                            </div>
                            <div className="flex justify-between font-sub text-gray-500 mt-3 text-sm tracking-widest">
                                <span>01:42</span>
                                <span>03:58</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ================= 4. LIVE CONCERTS ================= */}
            <section className="relative w-full py-32 px-6 bg-[#0a0f1d]">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-20">
                        <h3 className="font-classic text-4xl md:text-6xl text-white">Live <br/> <span className="text-[#D4AF37] italic">Performances</span></h3>
                        <p className="font-sub text-gray-500 max-w-sm mt-6 md:mt-0 italic">Timeless atmosphere live in concert.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-1">
                        {[
                            { city: 'London', venue: 'Royal Albert Hall', date: 'MAY 22', img: '1540039120624-973056ce7ca6' },
                            { city: 'Paris', venue: 'L\'Olympia', date: 'JUN 04', img: '1470229722913-7c090be5c57d' },
                            { city: 'Rome', venue: 'Teatro dell\'Opera', date: 'JUN 18', img: '1501281668745-f7f57925c3b4' },
                            { city: 'Bangkok', venue: 'Siam Pavalai', date: 'AUG 12', img: '1533174072545-e68f8ba81232' }
                        ].map((item, idx) => (
                            <motion.div 
                                key={idx}
                                whileHover={{ y: -10 }}
                                className="relative aspect-[3/4] overflow-hidden group cursor-pointer bg-black"
                            >
                                <img src={`https://images.unsplash.com/photo-${item.img}?q=80&w=600&auto=format&fit=crop`} className="absolute inset-0 w-full h-full object-cover opacity-40 grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                                <div className="absolute bottom-0 left-0 p-8">
                                    <span className="text-[#D4AF37] font-sub text-sm tracking-widest">{item.date}</span>
                                    <h4 className="font-classic text-2xl text-white uppercase">{item.city}</h4>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ================= 5. STATISTICS ================= */}
            <section className="relative w-full py-32 px-6 bg-[#111111]">
                <div className="max-w-4xl mx-auto">
                    <h3 className="text-center font-classic text-3xl text-white mb-20 tracking-widest uppercase">Digital Reach</h3>
                    <div className="flex justify-between items-end h-64 gap-6 md:gap-12 border-b border-gray-800 pb-4">
                        {[
                            { m: 'JAN', s: 45, y: 30 },
                            { m: 'FEB', s: 65, y: 40 },
                            { m: 'MAR', s: 55, y: 70 },
                            { m: 'APR', s: 85, y: 90 },
                            { m: 'MAY', s: 75, y: 100 }
                        ].map((data, idx) => (
                            <div key={idx} className="flex-1 flex flex-col items-center gap-4">
                                <div className="w-full flex items-end justify-center gap-2 h-full">
                                    <motion.div initial={{ height: 0 }} whileInView={{ height: `${data.s}%` }} className="w-full max-w-[15px] bg-gray-700 rounded-t-sm" />
                                    <motion.div initial={{ height: 0 }} whileInView={{ height: `${data.y}%` }} className="w-full max-w-[15px] bg-[#D4AF37] rounded-t-sm shadow-[0_0_15px_#D4AF37]" />
                                </div>
                                <span className="font-sub text-gray-500 text-xs tracking-widest">{data.m}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ================= 6. BIG BOTTOM TEXT ================= */}
            <section className="relative w-full h-[40vh] flex items-end justify-center overflow-hidden bg-gradient-to-t from-[#D4AF37]/10 to-transparent">
                <motion.h1 
                    initial={{ y: 50, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 0.15 }}
                    className="text-[12vw] font-classic font-black text-white whitespace-nowrap tracking-tighter select-none"
                >
                    ELLIOT JAMES REAY
                </motion.h1>
            </section>
        </div>
    );
}