import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function HeroCtaButtons() {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-xl mx-auto mt-8 mb-12 relative z-20"
        >
            <Link 
                to="/register" 
                className="w-full sm:w-auto bg-white text-black font-black px-10 py-4 rounded-full text-sm hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.2)] tracking-widest uppercase text-center"
            >
                Join the Community
            </Link>
            <Link 
                to="/new-event" 
                className="w-full sm:w-auto bg-[#1A1C23]/80 border border-white/10 text-white font-bold px-10 py-4 rounded-full text-sm hover:bg-white/10 hover:border-white/30 backdrop-blur-md transition-all tracking-widest uppercase text-center"
            >
                Explore Events
            </Link>
        </motion.div>
    );
}
