import React from 'react';
import { motion } from 'framer-motion';

export default function HeroHeadline() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-center px-4 max-w-4xl mx-auto flex flex-col items-center"
        >
            <br />
            <br />


            <h1 className="text-[clamp(2.5rem,5vw,4.5rem)] font-black leading-[1.1] tracking-tighter text-white mb-6">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-[#7000FF]">Community
                    <br></br>Concert & Music</span>
            </h1>

            <p className="text-gray-400 text-[clamp(1rem,1.5vw,1.2rem)] leading-relaxed max-w-2xl mx-auto font-medium">
                Discover your favorite artists, secure tickets for live events, and connect with fans. Everything you need, right here.
            </p>
        </motion.div>
    );
}
