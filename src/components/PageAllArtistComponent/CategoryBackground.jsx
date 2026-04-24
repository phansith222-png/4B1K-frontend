import React from 'react';
import { motion } from 'framer-motion';

export default function CategoryBackground({ keyword, isPlaying = false }) {
    const beatTransition = {
        duration: isPlaying ? 0.5 : 8,
        repeat: Infinity,
        ease: "easeInOut"
    };

    if (keyword === 'pop') {
        return (
            <div className={`absolute inset-0 overflow-hidden pointer-events-none opacity-50 transition-all duration-1000 ${isPlaying ? 'scale-110' : 'scale-100'}`}>
                {/* Floating Soft Orbs */}
                <motion.div animate={{ x: [0, 100, 0], y: [0, 50, 0], scale: isPlaying ? [1, 1.3, 1] : [1, 1.1, 1] }} transition={{ duration: isPlaying ? 2 : 15, repeat: Infinity }} className="absolute top-10 -left-20 w-[500px] h-[500px] bg-gradient-to-br from-[#FF00FF] to-transparent rounded-full blur-[120px]" />
                <motion.div animate={{ x: [0, -80, 0], y: [0, -40, 0], scale: isPlaying ? [1, 1.2, 1] : [1, 1.05, 1] }} transition={{ duration: isPlaying ? 2.5 : 18, repeat: Infinity }} className="absolute bottom-10 -right-20 w-[600px] h-[600px] bg-gradient-to-tr from-[#00E5FF] to-transparent rounded-full blur-[120px]" />
                
                {/* Bouncing Bubbles */}
                {[...Array(6)].map((_, i) => (
                    <motion.div key={i} className="absolute rounded-full border border-white/10 backdrop-blur-[2px]"
                        style={{ width: 100 + i * 20, height: 100 + i * 20, left: `${20 + i * 15}%`, top: `${10 + (i % 3) * 20}%` }}
                        animate={{ y: isPlaying ? [0, -60, 0] : [0, -40, 0], opacity: [0.1, 0.3, 0.1] }}
                        transition={{ duration: isPlaying ? 0.6 + i * 0.1 : 8 + i, repeat: Infinity, ease: "easeInOut" }}
                    />
                ))}
            </div>
        );
    }
    if (keyword === 'rock') {
        return (
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-60">
                {/* Rising Red Smoke */}
                <div className={`absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#D3131F]/20 to-transparent transition-opacity ${isPlaying ? 'opacity-100' : 'opacity-40'}`} />
                
                {/* Intense Embers */}
                {[...Array(25)].map((_, i) => (
                    <motion.div key={i} className="absolute bg-[#D3131F] rounded-full"
                        style={{ width: Math.random() * 6 + 2, height: Math.random() * 6 + 2, left: `${Math.random() * 100}%`, bottom: '-5%', boxShadow: '0 0 15px #D3131F' }}
                        animate={{ 
                            y: [0, -1200], 
                            opacity: [0, 1, 0.5, 0], 
                            x: [0, Math.random() * 200 - 100], 
                            scale: isPlaying ? [1, 2, 0.5] : [1, 1.5, 0.5] 
                        }}
                        transition={{ duration: isPlaying ? Math.random() * 2 + 2 : Math.random() * 4 + 4, repeat: Infinity, delay: Math.random() * 5, ease: "easeOut" }}
                    />
                ))}

                {/* Beat Flash */}
                <motion.div animate={{ opacity: isPlaying ? [0, 0.1, 0] : 0 }} transition={{ duration: 0.4, repeat: Infinity }} className="absolute inset-0 bg-[#D3131F]" />
            </div>
        );
    }
    if (keyword === 'r&b') {
        return (
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-50">
                {/* Silk Wave Gradients */}
                <motion.div 
                    animate={{ 
                        borderRadius: ["40% 60% 70% 30%", "60% 40% 30% 70%", "40% 60% 70% 30%"],
                        rotate: [0, 360],
                        scale: isPlaying ? [1, 1.2, 1] : [1, 1.1, 1]
                    }} 
                    transition={{ duration: isPlaying ? 10 : 25, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-1/4 -left-1/4 w-[150%] h-[150%] bg-[radial-gradient(circle_at_center,rgba(216,59,182,0.15)_0%,transparent_50%)]"
                />
                
                {/* Elegant Stars */}
                {[...Array(20)].map((_, i) => (
                    <motion.div key={i} className="absolute bg-[#d83bb6] rounded-full"
                        style={{ width: Math.random() * 5 + 1, height: Math.random() * 5 + 1, left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, boxShadow: '0 0 15px #d83bb6' }}
                        animate={{ opacity: isPlaying ? [0, 1, 0] : [0, 0.5, 0], scale: isPlaying ? [0, 1.5, 0] : [0, 1, 0] }}
                        transition={{ duration: isPlaying ? 0.8 : Math.random() * 5 + 3, repeat: Infinity, delay: Math.random() * 2 }}
                    />
                ))}
            </div>
        );
    }
    if (keyword === 'edm') {
        return (
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
                {/* Digital Grid Pulse */}
                <div className={`absolute inset-0 bg-[linear-gradient(rgba(0,229,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,229,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px] transition-all duration-300 ${isPlaying ? 'opacity-100 scale-105' : 'opacity-40 scale-100'}`} />
                
                {/* Laser Beams */}
                {[...Array(isPlaying ? 8 : 4)].map((_, i) => (
                    <motion.div key={i} 
                        className="absolute w-full h-[1px] bg-[#00E5FF] blur-[2px]"
                        style={{ top: `${20 + i * (isPlaying ? 10 : 20)}%` }}
                        animate={{ x: ['-100%', '100%'], opacity: isPlaying ? [0, 0.8, 0] : [0, 0.5, 0] }}
                        transition={{ duration: isPlaying ? 0.5 + i * 0.1 : 2 + i, repeat: Infinity, delay: i * 0.2, ease: "linear" }}
                    />
                ))}

                {/* Center Glow Pulse */}
                <div className={`absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(112,0,255,0.4)_0%,transparent_70%)] ${isPlaying ? 'animate-[pulse_0.5s_infinite]' : 'animate-pulse'}`} />
            </div>
        );
    }
    // Hip Hop (Urban Night & Golden Bling)
    if (keyword === 'hip hop') {
        return (
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-50">
                {/* Deep Urban Glows */}
                <motion.div 
                    animate={{ scale: isPlaying ? [1, 1.4, 1] : [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }} 
                    transition={{ duration: isPlaying ? 2 : 8, repeat: Infinity }}
                    className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#FF00FF]/20 rounded-full blur-[150px]" 
                />

                {/* Floating Platform Theme Shimmers */}
                {[...Array(15)].map((_, i) => (
                    <motion.div key={i} className="absolute"
                        style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
                        animate={{ 
                            y: isPlaying ? [0, -50, 0] : [0, -20, 0],
                            rotate: isPlaying ? [0, 180, 0] : [0, 45, 0],
                            opacity: [0, 1, 0],
                            scale: isPlaying ? [0.5, 1.5, 0.5] : [0.5, 1, 0.5]
                        }}
                        transition={{ duration: isPlaying ? 0.8 : Math.random() * 3 + 2, repeat: Infinity, delay: Math.random() * 2 }}
                    >
                        <div 
                            className="w-4 h-4 rotate-45" 
                            style={{ 
                                background: i % 2 === 0 ? '#00E5FF' : '#7000FF',
                                boxShadow: `0 0 20px ${i % 2 === 0 ? '#00E5FF' : '#7000FF'}`,
                                borderRadius: '2px'
                            }} 
                        />
                    </motion.div>
                ))}

                {/* Platform Theme Light Streaks */}
                {[...Array(8)].map((_, i) => (
                    <motion.div key={i} 
                        className="absolute h-[1px] w-full"
                        style={{ 
                            top: `${10 + i * 12}%`,
                            background: `linear-gradient(90deg, transparent, ${i % 2 === 0 ? '#00E5FF' : '#7000FF'}, transparent)`,
                            opacity: isPlaying ? 0.6 : 0.2
                        }}
                        animate={{ x: ['-100%', '100%'] }}
                        transition={{ duration: isPlaying ? 0.4 : 1.5, repeat: Infinity, delay: i * 0.1, repeatDelay: isPlaying ? 0.5 : 2 }}
                    />
                ))}

                {/* Beat Ripple */}
                {isPlaying && (
                    <motion.div 
                        animate={{ scale: [0.8, 2], opacity: [0.3, 0] }}
                        transition={{ duration: 1, repeat: Infinity, ease: "easeOut" }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border-[2px] border-white/5 rounded-full"
                    />
                )}
            </div>
        );
    }
    return null;
}
