import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Reveal from './Reveal';

export default function InfoPageLayout({ title, subtitle, children, accentColor = '#00E5FF' }) {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-[#0B0C10] text-white font-sans pt-24 pb-20 relative overflow-hidden">
            
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div 
                    className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[150px] opacity-20"
                    style={{ backgroundColor: accentColor }}
                />
                <div 
                    className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full blur-[150px] opacity-10"
                    style={{ backgroundColor: accentColor }}
                />
                <div 
                    className="absolute inset-0 opacity-[0.03]" 
                    style={{ 
                        backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                        backgroundSize: '40px 40px'
                    }}
                />
            </div>

            <main className="max-w-4xl mx-auto px-6 relative z-10">
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="mb-16 text-center"
                >
                    <h1 
                        className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4"
                        style={{ textShadow: `0 0 40px ${accentColor}40` }}
                    >
                        {title}
                    </h1>
                    <p className="text-gray-400 text-lg md:text-xl font-medium max-w-2xl mx-auto">
                        {subtitle}
                    </p>
                </motion.div>

                <Reveal>
                    <div className="bg-[#13141a]/80 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 md:p-12 shadow-2xl shadow-black/50">
                        <div className="prose prose-invert prose-lg max-w-none">
                            {children}
                        </div>
                    </div>
                </Reveal>
            </main>
        </div>
    );
}
