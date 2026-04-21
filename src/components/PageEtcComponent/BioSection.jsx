import React from 'react';
import { motion } from 'framer-motion';
import Reveal from '../Reveal'; // 📌 เพิ่ม Import

export default function BioSection({ artist }) {
    return (
        <section className="relative w-full py-20 px-6 border-b border-gray-900">
            <Reveal effect="fade-up">
                <div className="max-w-4xl mx-auto text-center relative z-10 flex flex-col gap-3">
                    <motion.h2 
                        whileHover={{ letterSpacing: '0.05em', color: '#2B5AE8' }}
                        className="text-5xl md:text-7xl font-black text-white tracking-tight cursor-default transition-all uppercase"
                    >
                        {artist.artistName}
                    </motion.h2>
                    <h2 className="text-3xl md:text-5xl font-bold text-[#2B5AE8] tracking-tight mt-4 uppercase">
                        BEATS <span className="text-gray-700 mx-2">•</span> RHYTHMS <span className="text-gray-700 mx-2">•</span> ENERGY
                    </h2>
                    <p className="text-sm md:text-lg font-medium text-gray-400 tracking-widest leading-relaxed mt-6 max-w-3xl mx-auto whitespace-pre-line">
                        {artist.biography || "No biography available. Drop the beat and let the music speak."}
                    </p>
                </div>
            </Reveal>
        </section>
    );
}