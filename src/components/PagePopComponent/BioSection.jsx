import React from 'react';
import { motion } from 'framer-motion';
import Reveal from '../Reveal'; // 📌 เพิ่ม Import

export default function BioSection({ artist }) {
    return (
        <section className="relative w-full py-24 px-6 bg-gradient-to-b from-transparent to-[#1a1528]/40 overflow-hidden border-b border-white/5">
            <Reveal effect="fade-up">
                <div className="max-w-4xl mx-auto text-center relative z-10 flex flex-col gap-4 md:gap-6">
                    <motion.h2 
                        whileHover={{ letterSpacing: '0.05em' }}
                        className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 tracking-tight cursor-default uppercase transition-all duration-500"
                    >
                        {artist.artistName}
                    </motion.h2>
                    <h2 className="text-2xl md:text-4xl font-bold text-[#FF007F] tracking-widest mt-2 cursor-default uppercase drop-shadow-[0_0_15px_rgba(255,0,127,0.3)]">
                        OFFICIAL ARTIST <span className="text-[#00F5D4] mx-3">•</span> POP MUSIC
                    </h2>
                    <p className="text-base md:text-lg font-medium text-gray-400 tracking-widest leading-relaxed mt-8 max-w-3xl mx-auto whitespace-pre-line border-t border-white/10 pt-8">
                        {artist.biography || "Biography not available at the moment. Keep streaming and supporting the artist!"}
                    </p>
                </div>
            </Reveal>
        </section>
    );
}
