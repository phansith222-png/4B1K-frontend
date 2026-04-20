import React from 'react';
import { motion } from 'framer-motion';

export default function HeroSection({ floatingNotes }) {
    return (
        <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden border-b border-white/5">
            {/* Background Ambient */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0B0C10] via-[#12141a] to-[#0B0C10] z-0"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-[#FF007F] via-[#2B5AE8] to-[#00E5FF] rounded-full blur-[150px] opacity-10 pointer-events-none"></div>

            <div className="max-w-7xl w-full mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center justify-between gap-16 mt-20 md:mt-0">
                
                {/* ฝั่งข้อความ */}
                <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left z-20">
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="text-[#00E5FF] font-black text-sm uppercase tracking-[0.4em] mb-4 block">The Ultimate Directory</span>
                        <h1 className="text-6xl md:text-8xl lg:text-[130px] font-black italic tracking-tighter leading-[0.8] text-white drop-shadow-2xl">
                            VOICES <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF007F] to-[#00E5FF]">OF SIAM</span>
                        </h1>
                        <p className="mt-8 text-gray-400 text-sm md:text-base tracking-widest uppercase leading-relaxed max-w-lg border-l-2 border-[#00E5FF] pl-4">
                            Explore over 100+ active artists across all major labels and independent scenes. The heartbeat of Thailand's music industry.
                        </p>
                    </motion.div>

                    <motion.button 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
                        className="mt-12 flex items-center gap-3 text-[#FF007F] font-bold uppercase tracking-widest text-xs hover:text-white transition-colors group"
                    >
                        <span className="w-10 h-10 rounded-full border border-[#FF007F] flex items-center justify-center group-hover:bg-[#FF007F] transition-all">
                            <svg className="w-4 h-4 text-current" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                        </span>
                        Scroll to Explore
                    </motion.button>
                </div>

                {/* ฝั่งกราฟิก (แผ่นไวนิลขยับได้และตัวโน้ตดนตรี) */}
                <div className="w-full md:w-1/2 flex justify-center md:justify-end relative h-[400px] md:h-[600px]">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.8, rotate: -20 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
                    >
                        <div className="w-[280px] h-[280px] md:w-[450px] md:h-[450px] hero-vinyl relative rounded-full flex items-center justify-center">
                            <div className="w-1/3 h-1/3 rounded-full bg-gradient-to-br from-[#FF007F] to-[#00E5FF] flex items-center justify-center p-2 shadow-inner z-10">
                                <div className="w-full h-full rounded-full bg-[#111] flex items-center justify-center border-2 border-white/20">
                                    <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-white shadow-[0_0_15px_white]"></div>
                                </div>
                            </div>
                            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/10 to-transparent pointer-events-none mix-blend-overlay"></div>
                        </div>
                    </motion.div>

                    {/* ตัวโน้ตดนตรีลอยออกมา */}
                    {floatingNotes.map((note) => (
                        <motion.div
                            key={note.id}
                            className="absolute text-white/50 text-shadow-md z-0 font-bold"
                            style={{
                                fontSize: note.size,
                                left: `40%`,
                                top: `50%`,
                                textShadow: '0 0 10px rgba(0, 229, 255, 0.5)'
                            }}
                            animate={{
                                y: [-50, -200, -300], 
                                x: [0, note.left - 50, note.left - 100], 
                                opacity: [0, 1, 1, 0], 
                                rotate: [0, 45, -45, 90] 
                            }}
                            transition={{
                                duration: note.duration,
                                delay: note.delay,
                                repeat: Infinity,
                                ease: "easeOut"
                            }}
                        >
                            {note.symbol}
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
}