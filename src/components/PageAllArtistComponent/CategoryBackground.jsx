import React from 'react';
import { motion } from 'framer-motion';

export default function CategoryBackground({ keyword }) {
    if (keyword === 'pop') {
        return (
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
                <motion.div animate={{ x: [0, 50, 0], y: [0, 30, 0] }} transition={{ duration: 10, repeat: Infinity }} className="absolute -top-20 -left-20 w-96 h-96 bg-[#FF007F] rounded-full blur-[100px]" />
                <motion.div animate={{ x: [0, -50, 0], y: [0, -30, 0] }} transition={{ duration: 12, repeat: Infinity }} className="absolute bottom-0 right-0 w-96 h-96 bg-[#00F5D4] rounded-full blur-[100px]" />
            </div>
        );
    }
    if (keyword === 'rock') {
        return (
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
                {[...Array(15)].map((_, i) => (
                    <motion.div key={i} className="absolute bg-[#D3131F] rounded-full"
                        style={{ width: Math.random() * 4 + 2, height: Math.random() * 4 + 2, left: `${Math.random() * 100}%`, bottom: '-10%', boxShadow: '0 0 10px #D3131F' }}
                        animate={{ y: [0, -800], opacity: [0, 1, 0], x: [0, Math.random() * 100 - 50] }}
                        transition={{ duration: Math.random() * 5 + 5, repeat: Infinity, delay: Math.random() * 5 }}
                    />
                ))}
            </div>
        );
    }
    if (keyword === 'r&b') {
        return (
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
                {[...Array(15)].map((_, i) => (
                    <motion.div key={i} className="absolute bg-[#D4AF37] rounded-full"
                        style={{ width: Math.random() * 4 + 1, height: Math.random() * 4 + 1, left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, boxShadow: '0 0 10px #D4AF37' }}
                        animate={{ opacity: [0, 0.8, 0], scale: [1, 1.5, 1] }}
                        transition={{ duration: Math.random() * 4 + 2, repeat: Infinity, delay: Math.random() * 2 }}
                    />
                ))}
            </div>
        );
    }
    // Hip Hop & EDM (Neon Pulse)
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(112,0,255,0.2)_0%,transparent_70%)] animate-pulse" />
            <motion.div animate={{ y: [0, -20, 0] }} transition={{ duration: 5, repeat: Infinity }} className="absolute top-10 left-1/2 -translate-x-1/2 w-[80%] h-1 bg-[#00E5FF] blur-[5px]" />
        </div>
    );
}