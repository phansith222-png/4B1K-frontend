import React from 'react';
import { motion } from 'framer-motion';

export default function BottomTextSection() {
    return (
        <section className="relative w-full h-[30vh] md:h-[40vh] overflow-hidden flex items-end justify-center bg-gradient-to-t from-[#00E5FF]/5 to-transparent z-0 border-t border-white/5">
            <motion.h1 
                initial={{ y: 100, opacity: 0 }}
                whileInView={{ y: 0, opacity: 0.15 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="text-[12vw] font-black font-display text-white whitespace-nowrap tracking-tighter select-none leading-none mb-[-2vw]"
            >
                ENTERTAINMENT HUB
            </motion.h1>
        </section>
    );
}