import React from 'react';
import { motion } from 'framer-motion';

export default function BottomTextSection({ artist }) {
    return (
        <section className="relative w-full h-[30vh] md:h-[40vh] overflow-hidden flex items-end justify-center bg-gradient-to-t from-[#D4AF37]/10 to-transparent pointer-events-none z-10">
            <motion.h1 
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 0.15 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="text-[13vw] leading-none font-classic font-black text-white tracking-tighter select-none whitespace-nowrap uppercase mb-[-2vw]"
            >
                {artist.artistName}
            </motion.h1>
        </section>
    );
}