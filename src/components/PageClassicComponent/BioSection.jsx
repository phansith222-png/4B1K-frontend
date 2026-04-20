import React from 'react';
import { motion } from 'framer-motion';

export default function BioSection({ artist }) {
    return (
        <section className="relative w-full py-32 px-6 border-b border-[#D4AF37]/5 bg-gradient-to-b from-transparent to-[#1e293b]/10 z-10">
            <div className="max-w-4xl mx-auto text-center flex flex-col gap-8">
                <motion.h2 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-4xl md:text-6xl font-classic italic text-white/90 leading-relaxed drop-shadow-md font-light"
                >
                    "{artist.biography ? artist.biography : 'A Voice that Echoes through Time'}"
                </motion.h2>
                <div className="w-12 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto my-6"></div>
                <p className="font-sub text-lg md:text-xl text-gray-400 font-light leading-relaxed italic tracking-[0.3em] uppercase">
                    Classic Soul <span className="text-[#D4AF37]/50 mx-4">•</span> R&B Heritage <span className="text-[#D4AF37]/50 mx-4">•</span> Modern Elegance
                </p>
            </div>
        </section>
    );
}