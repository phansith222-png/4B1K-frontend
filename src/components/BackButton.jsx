import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const BackButton = ({ color = "#00E5FF", glowColor = "rgba(0, 229, 255, 0.4)", className = "" }) => {
    const navigate = useNavigate();

    return (
        <motion.button 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.1, x: 5, boxShadow: `0 0 20px ${glowColor}` }}
            onClick={() => navigate(-1)}
            className={`absolute z-50 flex items-center gap-3 transition-colors group bg-[#00E5FF]/5 backdrop-blur-md px-5 py-2.5 rounded-full border border-[#00E5FF]/20 ${className || 'top-24 md:top-28 left-6 md:left-12'}`}
            style={{ color: color }}
        >
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="text-xs font-black uppercase tracking-widest">Back</span>
        </motion.button>
    );
};

export default BackButton;
