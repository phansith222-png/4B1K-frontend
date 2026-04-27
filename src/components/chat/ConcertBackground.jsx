import React from 'react';
import { motion } from 'framer-motion';

export default function ConcertBackground() {
    return (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
            {/* 🌌 Deep Space Base */}
            <div className="absolute inset-0 bg-[#0B0C10]" />
            
            {/* 🎭 Stage Light - Top Center Spotlight */}
            <motion.div 
                animate={{ 
                    opacity: [0.1, 0.2, 0.1],
                    scale: [1, 1.2, 1],
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[120%] h-[60%] bg-[radial-gradient(ellipse_at_center,rgba(112,0,255,0.15),transparent_70%)]" 
            />

            {/* 🌈 Dynamic Concert Glows */}
            <motion.div 
                animate={{ 
                    x: [-20, 20, -20],
                    y: [-10, 10, -10],
                    opacity: [0.1, 0.15, 0.1]
                }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#00E5FF] opacity-[0.1] blur-[120px] rounded-full" 
            />
            
            <motion.div 
                animate={{ 
                    x: [20, -20, 20],
                    y: [10, -10, 10],
                    opacity: [0.1, 0.15, 0.1]
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#7000FF] opacity-[0.1] blur-[120px] rounded-full" 
            />

            {/* 🚀 Laser Beams - Subtle diagonal lines */}
            <div className="absolute inset-0 overflow-hidden">
                {[...Array(5)].map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -100, y: -100 }}
                        animate={{ 
                            opacity: [0, 0.2, 0],
                            x: ['0%', '100%'],
                            y: ['0%', '100%']
                        }}
                        transition={{ 
                            duration: 4 + i, 
                            repeat: Infinity, 
                            delay: i * 2,
                            ease: "linear"
                        }}
                        className="absolute w-[2px] h-[300px] bg-gradient-to-b from-transparent via-[#00E5FF]/40 to-transparent rotate-45"
                        style={{ left: `${i * 20}%`, top: '-20%' }}
                    />
                ))}
            </div>

            {/* 🎇 Floating Particles / Star Dust */}
            <div className="absolute inset-0">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{ 
                            x: Math.random() * 100 + '%', 
                            y: Math.random() * 100 + '%',
                            opacity: Math.random()
                        }}
                        animate={{ 
                            y: [null, '-=100'],
                            opacity: [0, 1, 0]
                        }}
                        transition={{ 
                            duration: 5 + Math.random() * 10, 
                            repeat: Infinity,
                            ease: "linear"
                        }}
                        className="absolute w-1 h-1 bg-white rounded-full blur-[1px]"
                    />
                ))}
            </div>

            {/* 🎞 Grid Texture Overlay */}
            <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] mix-blend-overlay" />
            
            {/* 🌫 Noise Texture */}
            <div className="absolute inset-0 opacity-[0.15] bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/%3E%3C/svg%3E')] mix-blend-overlay" />
        </div>
    );
}
