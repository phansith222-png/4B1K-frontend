import React from 'react';
import { motion } from 'framer-motion';

export default function TaglineSection() {
    return (
        <section className="relative w-full py-24 px-6 border-y border-white/5 bg-gradient-to-b from-[#11131a] to-[#0B0C10] z-10">
            <div className="max-w-5xl mx-auto text-center flex flex-col gap-8">
                <motion.h2 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-4xl md:text-6xl lg:text-7xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500 uppercase tracking-tighter"
                >
                    "Unity in Diversity of Sounds"
                </motion.h2>
                <p className="text-lg md:text-2xl text-[#00E5FF] font-bold tracking-widest leading-relaxed uppercase drop-shadow-[0_0_10px_rgba(0,229,255,0.4)]">
                    Major Players <span className="text-gray-600 mx-4">|</span> Indie Spirit <span className="text-gray-600 mx-4">|</span> T-Pop Idols
                </p>
                <div className="w-24 h-1.5 bg-gradient-to-r from-[#00E5FF] to-[#7000FF] mx-auto mt-6 rounded-full" />
            </div>
        </section>
    );
}