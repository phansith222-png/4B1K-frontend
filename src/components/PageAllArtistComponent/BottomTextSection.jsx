import React from 'react';
import { motion } from 'framer-motion';

export default function BottomTextSection() {
    return (
        <section className="relative w-full h-[30vh] md:h-[40vh] flex items-end justify-center overflow-hidden bg-gradient-to-t from-white/5 to-transparent border-t border-white/5">
            <motion.h1 
                whileInView={{ y: 0, opacity: 0.1 }} 
                initial={{ y: 50, opacity: 0 }} 
                transition={{ duration: 1 }} 
                className="text-[12vw] font-black text-white whitespace-nowrap tracking-tighter leading-none mb-[-2vw] uppercase"
            >
                ARTISTS ARCHIVE
            </motion.h1>
        </section>
    );
}