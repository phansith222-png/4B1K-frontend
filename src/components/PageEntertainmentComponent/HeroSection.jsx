import React from 'react';
import { motion } from 'framer-motion';

export default function HeroSection({ navigate }) {
    return (
        <section className="relative w-full min-h-screen flex flex-col justify-center items-center py-20 px-6 z-10 overflow-hidden">
            <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
                
                <motion.div 
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="w-full md:col-span-7 flex flex-col items-start z-20"
                >
                    <motion.span 
                        initial={{ letterSpacing: "0.2em", opacity: 0 }}
                        animate={{ letterSpacing: "0.5em", opacity: 1 }}
                        transition={{ duration: 1 }}
                        className="text-[#00E5FF] font-bold tracking-[0.5em] text-sm md:text-lg mb-6 block uppercase drop-shadow-lg"
                    >
                        Thailand Entertainment Hub
                    </motion.span>
                    
                    <h1 className="text-6xl md:text-8xl lg:text-[9rem] font-black leading-[0.85] text-white tracking-tighter mb-10 font-display">
                        THAILAND <br/> MUSIC <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] via-[#7000FF] to-[#FF00FF] drop-shadow-[0_0_30px_rgba(112,0,255,0.6)]">LABELS</span>
                    </h1>
                    
                    <p className="mt-8 text-gray-400 text-lg md:text-xl max-w-xl leading-relaxed mb-12">
                        ศูนย์รวมค่ายเพลงและศิลปินไทยทุกแนวทาง ค้นพบศิลปินคนโปรดและสำรวจอุตสาหกรรมดนตรีไทยในที่เดียว
                    </p>

                    <div className="flex flex-wrap gap-6">
                        <motion.button 
                            whileHover={{ scale: 1.05 }}
                            onClick={() => document.getElementById('labels-section').scrollIntoView({ behavior: 'smooth' })}
                            className="bg-gradient-to-r from-[#00E5FF] to-[#7000FF] text-white px-12 py-4 rounded-full font-bold uppercase tracking-widest text-sm shadow-[0_10px_30px_rgba(0,229,255,0.4)]"
                        >
                            Explore Hub
                        </motion.button>
                        <motion.button 
                            whileHover={{ color: "#00E5FF", borderColor: "#00E5FF", backgroundColor: "rgba(0,229,255,0.1)" }}
                            onClick={() => navigate('/artists')}
                            className="px-12 py-4 rounded-full font-bold uppercase tracking-widest text-sm border border-white/20 transition-all bg-[#0B0C10]/50 backdrop-blur-md"
                        >
                            All Artists
                        </motion.button>
                    </div>
                </motion.div>

                <div className="w-full md:col-span-5 relative flex justify-center md:justify-end z-10">
                    <div className="relative w-[70%] aspect-[3/4] border border-[#00E5FF]/30 rounded-2xl translate-x-10 translate-y-10 opacity-40 shadow-[0_0_30px_rgba(0,229,255,0.2)]" />
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="absolute top-0 right-0 w-[90%] aspect-[3/4] rounded-2xl overflow-hidden border-[10px] border-[#12141a] shadow-[0_30px_60px_rgba(0,0,0,0.9)] group"
                    >
                        <img
                            src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=2000&auto=format&fit=crop"
                            alt="Recording Studio"
                            className="w-full h-full object-cover brightness-75 group-hover:scale-110 transition-transform duration-[10s]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C10] via-transparent to-transparent opacity-90" />
                    </motion.div>
                </div>
            </div>
        </section>
    );
}