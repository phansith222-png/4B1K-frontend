import React from 'react';
import { motion } from 'framer-motion';

export default function CategoryBackground({ keyword, isPlaying = false, artist = null }) {
    const beatTransition = {
        duration: isPlaying ? 0.5 : 8,
        repeat: Infinity,
        ease: "easeInOut"
    };

    // 🎨 Reusable Background Artist Banners Layer
    const ArtistBanners = artist ? (
        <div className="absolute inset-0 overflow-hidden opacity-10 mix-blend-overlay pointer-events-none">
            {/* Large Faded Profile Image */}
            <motion.div 
                animate={{ 
                    scale: isPlaying ? [1.1, 1.2, 1.1] : [1, 1.05, 1],
                    opacity: isPlaying ? [0.1, 0.15, 0.1] : [0.05, 0.08, 0.05]
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-[10%] -right-[10%] w-[80%] h-[120%] z-0"
            >
                <img 
                    src={artist.profileImage} 
                    alt="" 
                    className="w-full h-full object-cover grayscale opacity-50 blur-[2px]"
                />
                {/* Decorative geometric frames */}
                <div className="absolute inset-0 border-[40px] border-white/5 m-20" />
            </motion.div>

            {/* Secondary Faded Banner */}
            <motion.div 
                animate={{ 
                    y: [0, -30, 0],
                    opacity: [0.03, 0.06, 0.03]
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-[5%] left-[5%] w-[40%] h-[40%] z-0"
            >
                 <img 
                    src={artist.profileImage} 
                    alt="" 
                    className="w-full h-full object-cover grayscale opacity-40 blur-[5px] rotate-[-10deg]"
                />
            </motion.div>
        </div>
    ) : null;

    if (keyword === 'pop') {
        return (
            <div className={`absolute inset-0 overflow-hidden pointer-events-none transition-all duration-1000 ${isPlaying ? 'scale-110' : 'scale-100'}`}>
                {/* Unified Blend Mask */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0B0C10]/40 to-transparent z-0" />
                {ArtistBanners}

                {/* Floating Soft Orbs (Original) */}
                <motion.div animate={{ x: [0, 100, 0], y: [0, 50, 0], scale: isPlaying ? [1, 1.3, 1] : [1, 1.1, 1] }} transition={{ duration: isPlaying ? 2 : 15, repeat: Infinity }} className="absolute top-10 -left-20 w-[500px] h-[500px] bg-gradient-to-br from-[#FF00FF] to-transparent rounded-full blur-[120px] opacity-40" />
                <motion.div animate={{ x: [0, -80, 0], y: [0, -40, 0], scale: isPlaying ? [1, 1.2, 1] : [1, 1.05, 1] }} transition={{ duration: isPlaying ? 2.5 : 18, repeat: Infinity }} className="absolute bottom-10 -right-20 w-[600px] h-[600px] bg-gradient-to-tr from-[#00E5FF] to-transparent rounded-full blur-[120px] opacity-40" />
                
                {/* Bouncing Bubbles (Original) */}
                {[...Array(6)].map((_, i) => (
                    <motion.div key={i} className="absolute rounded-full border border-white/10"
                        style={{ width: 100 + i * 20, height: 100 + i * 20, left: `${20 + i * 15}%`, top: `${10 + (i % 3) * 20}%` }}
                        animate={{ y: isPlaying ? [0, -60, 0] : [0, -40, 0], opacity: [0.05, 0.15, 0.05] }}
                        transition={{ duration: isPlaying ? 0.6 + i * 0.1 : 8 + i, repeat: Infinity, ease: "easeInOut" }}
                    />
                ))}

                {/* New Faded Bouncing Orbs - Subtle & Distant */}
                {[...Array(5)].map((_, i) => (
                    <motion.div key={`faded-${i}`} className="absolute rounded-full bg-white/5 blur-[40px]"
                        style={{ width: 150 + i * 50, height: 150 + i * 50, left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
                        animate={{ y: [0, -100, 0], opacity: [0.02, 0.08, 0.02] }}
                        transition={{ duration: 15 + i * 2, repeat: Infinity, ease: "easeInOut", delay: i * 1 }}
                    />
                ))}

                {/* 🫧 New Bubble Field - Reacts to Music */}
                {[...Array(20)].map((_, i) => {
                    const size = Math.random() * 30 + 15;
                    return (
                        <motion.div key={`field-${i}`} className="absolute rounded-full border-2 border-white/20 bg-white/5 shadow-[inset_0_0_8px_rgba(255,255,255,0.2)]"
                            style={{ 
                                width: size, 
                                height: size, 
                                left: `${Math.random() * 100}%`, 
                                bottom: `${10 + Math.random() * 80}%` 
                            }}
                            animate={{ 
                                y: isPlaying ? [0, -30, 0] : [0, -150, 0],
                                x: isPlaying ? 0 : [0, (Math.random() - 0.5) * 40, 0],
                                opacity: isPlaying ? [0.2, 0.6, 0.2] : [0.1, 0.4, 0.1],
                                scale: isPlaying ? [1, 1.15, 1] : [1, 1.1, 1]
                            }}
                            transition={{ 
                                duration: isPlaying ? 0.6 : (Math.random() * 10 + 10), 
                                repeat: Infinity, 
                                ease: isPlaying ? "easeInOut" : "linear",
                                delay: isPlaying ? (i * 0.05) : (i * 0.5)
                            }}
                        />
                    );
                })}
            </div>
        );
    }
    if (keyword === 'rock') {
        return (
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Unified Blend Mask */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-transparent z-0" />
                {ArtistBanners}
                
                {/* Organic Smoke/Fog Layers - Optimized */}
                <div className="absolute inset-0 opacity-40 mix-blend-screen">
                    <motion.div 
                        animate={{ 
                            opacity: [0.15, 0.25, 0.15],
                            y: [0, -20, 0]
                        }} 
                        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute -bottom-[5%] -left-[5%] w-[110%] h-[70%] bg-[radial-gradient(ellipse_at_bottom,rgba(211,19,31,0.15),transparent_70%)] blur-[100px]" 
                    />
                </div>

                {/* Rising Embers - Natural Flow */}
                {[...Array(30)].map((_, i) => (
                    <motion.div key={`ember-${i}`} className="absolute rounded-full"
                        style={{ 
                            width: Math.random() * 3 + 1, 
                            height: Math.random() * 3 + 1, 
                            left: `${Math.random() * 100}%`, 
                            bottom: '-5%', 
                            backgroundColor: '#D3131F',
                            boxShadow: '0 0 8px #D3131F, 0 0 12px rgba(211, 19, 31, 0.4)',
                            filter: 'blur(0.5px)'
                        }}
                        animate={{ 
                            bottom: '110%',
                            x: [0, Math.sin(i) * 50, Math.cos(i) * 50],
                            opacity: [0, 0.8, 0.8, 0]
                        }}
                        transition={{ 
                            duration: Math.random() * 8 + 7, 
                            repeat: Infinity, 
                            ease: "linear",
                            delay: Math.random() * 10
                        }}
                    />
                ))}

                {/* Steady Lava Glow (No Flicker) */}
                <motion.div 
                    animate={{ opacity: isPlaying ? 0.25 : 0.15 }}
                    transition={{ duration: 5, ease: "easeInOut" }}
                    className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(211,19,31,0.2)_0%,transparent_70%)]"
                />
            </div>
        );
    }
    if (keyword === 'r&b') {
        return (
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Unified Blend Mask */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0B0C10]/40 to-transparent z-0" />
                {ArtistBanners}

                {/* Soul Pulse Aura (Soft breathing background) */}
                <motion.div 
                    animate={{ opacity: isPlaying ? [0.15, 0.3, 0.15] : 0.1 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(216,59,182,0.1)_0%,transparent_70%)] blur-[100px]"
                />

                {/* Fireflies (Natural Drifting - Magical Warm Glow) */}
                {[...Array(35)].map((_, i) => (
                    <motion.div key={`firefly-${i}`} className="absolute rounded-full"
                        style={{ 
                            width: Math.random() * 3 + 2, 
                            height: Math.random() * 3 + 2, 
                            left: `${Math.random() * 100}%`, 
                            top: `${Math.random() * 100}%`, 
                            backgroundColor: '#e2ffad',
                            boxShadow: '0 0 10px #e2ffad, 0 0 15px rgba(226, 255, 173, 0.3)',
                            filter: 'blur(1.2px)',
                            opacity: 0.2
                        }}
                        animate={{ 
                            opacity: [0.2, 0.7, 0.2],
                            x: [0, Math.random() * 100 - 50, 0],
                            y: [0, Math.random() * 100 - 50, 0],
                        }}
                        transition={{ 
                            duration: Math.random() * 8 + 12, 
                            repeat: Infinity, 
                            ease: "easeInOut",
                            delay: Math.random() * 10
                        }}
                    />
                ))}

                {/* Realistic Shooting Stars (Organic Diagonal Flow) */}
                {[...Array(2)].map((_, i) => (
                    <motion.div key={`star-${i}`} 
                        className="absolute pointer-events-none"
                        style={{ 
                            top: -100, 
                            left: -100, 
                            rotate: '38deg',
                            opacity: 0,
                        }}
                        animate={{ 
                            top: ['-10%', '90%'],
                            left: ['-5%', '95%'],
                            opacity: [0, 1, 0.8, 0]
                        }}
                        transition={{ 
                            duration: 4.5, 
                            repeat: Infinity, 
                            repeatDelay: 10, // 10 seconds gap between appearances
                            delay: Math.random() * 15 + (i * 8),
                            ease: [0.16, 1, 0.3, 1] 
                        }}
                    >
                        {/* The Streak (Tapered Tail) */}
                        <div 
                            className="w-[450px] h-[1px] bg-gradient-to-r from-transparent via-white/50 to-[#f9c1db]"
                            style={{ filter: 'blur(0.5px)' }}
                        />
                        {/* The Head (Glowing Core) */}
                        <div 
                            className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-white rounded-full"
                            style={{ boxShadow: '0 0 10px 2px #fff, 0 0 20px 4px rgba(249, 193, 219, 0.4)' }}
                        />
                    </motion.div>
                ))}

                {/* Drifting Soul Clouds */}
                <motion.div 
                    animate={{ x: ['-20%', '20%'], opacity: [0.05, 0.1, 0.05] }} 
                    transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(112,0,255,0.08)_0%,transparent_50%)] blur-[100px]"
                />

                {/* Simplified Texture */}
                <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay bg-noise pointer-events-none" />
            </div>
        );
    }
    if (keyword === 'edm') {
        return (
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Unified Blend Mask */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-transparent z-0" />
                {ArtistBanners}
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
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Unified Blend Mask */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0B0C10]/40 to-transparent z-0" />
                {ArtistBanners}
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
