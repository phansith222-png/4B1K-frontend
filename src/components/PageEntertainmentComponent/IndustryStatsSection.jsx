import React from 'react';
import { motion } from 'framer-motion';

export default function IndustryStatsSection({ agencies, totalArtists }) {
    return (
        <section className="relative w-full py-20 px-6 bg-[#0B0C10] z-10 border-t border-white/5">
            <div className="w-full max-w-5xl mx-auto bg-[#12141a] border border-white/5 p-8 md:p-12 rounded-[2rem] flex flex-col md:flex-row items-center gap-12 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#7000FF] opacity-[0.05] blur-[80px] rounded-full pointer-events-none" />
                
                <div className="relative flex-shrink-0">
                    <div className="w-40 h-40 md:w-48 md:h-48 rounded-full border-2 border-gray-800 flex items-center justify-center relative shadow-[0_0_30px_rgba(0,0,0,0.8)]">
                        <div className="absolute inset-0 rounded-full border border-white/5 m-4 animate-pulse"></div>
                        <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-[#0B0C10] border-2 border-[#7000FF]/40 flex items-center justify-center z-10 shadow-inner">
                            <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-[#00E5FF]" />
                        </div>
                    </div>
                </div>
                
                <div className="flex-1 w-full relative z-10">
                    <span className="text-[#00E5FF] tracking-widest uppercase text-xs font-black border border-[#00E5FF]/30 px-3 py-1 rounded bg-[#00E5FF]/5">Market Analysis</span>
                    <h4 className="text-3xl md:text-4xl font-black text-white mt-4 tracking-tight uppercase">Thai Industry Dominance</h4>
                    
                    <div className="w-full bg-gray-800 h-2 mt-8 relative rounded-full overflow-hidden">
                        <motion.div 
                            initial={{ width: 0 }}
                            whileInView={{ width: '100%' }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className="absolute inset-0 bg-gradient-to-r from-[#00E5FF] via-[#7000FF] to-[#FF007F]" 
                        />
                    </div>

                    <div className="flex justify-between text-gray-400 mt-4 text-[10px] md:text-xs font-black tracking-widest uppercase flex-wrap gap-4">
                        {agencies.slice(0, 3).map((ag, idx) => {
                            const percentage = totalArtists > 0 ? Math.round((ag.artists.length / totalArtists) * 100) : 0;
                            return (
                                <div key={idx} className="flex flex-col gap-1">
                                    <span className={idx === 0 ? "text-white" : ""}>{ag.name}</span>
                                    <span className={idx === 0 ? "text-[#00E5FF]" : "text-gray-500"}>{percentage}% Share</span>
                                </div>
                            )
                        })}
                        {agencies.length === 0 && <span>No Data Available</span>}
                    </div>
                </div>
            </div>
        </section>
    );
}