import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function ParallaxSection() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.2, 1, 1.2]);

    return (
        <section 
            ref={containerRef}
            className="relative w-full h-[60vh] md:h-[80vh] overflow-hidden my-24 border-y border-white/10"
        >
            {/* Parallax Image Background */}
            <motion.div 
                style={{ y, scale }}
                className="absolute inset-0 z-0"
            >
                <img 
                    src="/landing_parallax_bg_1776993592087.png" 
                    alt="Parallax Background" 
                    className="w-full h-[140%] object-cover opacity-60 grayscale-[30%] brightness-75"
                />
            </motion.div>

            {/* Overlays */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0B0C10] via-transparent to-[#0B0C10] z-10" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0B0C10] via-transparent to-[#0B0C10] z-10 opacity-60" />

            {/* Content Overlay */}
            <div className="relative z-20 h-full flex flex-col items-center justify-center text-center px-6">
                <motion.div style={{ opacity }}>
                    <span className="text-[#00E5FF] font-black text-xs md:text-sm uppercase tracking-[0.6em] mb-6 block">Beyond Limits</span>
                    <h2 className="text-5xl md:text-8xl font-black italic tracking-tighter text-white leading-none uppercase">
                        Feel the <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] via-[#7000FF] to-[#FF007F]">Infinite Energy</span>
                    </h2>
                    <div className="mt-12 h-px w-32 bg-gradient-to-r from-transparent via-white/40 to-transparent mx-auto" />
                    <p className="mt-10 text-gray-400 font-bold uppercase tracking-[0.3em] text-[10px] md:text-xs max-w-xl mx-auto">
                        Experience music like never before with 4B1K's immersive artist interactions.
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
