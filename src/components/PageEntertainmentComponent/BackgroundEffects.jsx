import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

export default function BackgroundEffects() {
    const particles = useMemo(() => Array.from({ length: 15 }).map((_, i) => ({
        id: i,
        size: Math.random() * 400 + 200,
        x: Math.random() * 100,
        y: Math.random() * 100,
        duration: Math.random() * 20 + 10,
        color: i % 2 === 0 ? '#00E5FF' : '#7000FF',
    })), []);

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Syncopate:wght@400;700&family=Inter:wght@300;400;700;900&display=swap');
                body { font-family: 'Inter', sans-serif; }
                .font-display { font-family: 'Syncopate', sans-serif; }

                .dark-grain {
                    position: fixed; inset: 0; opacity: 0.03; pointer-events: none; z-index: 100;
                    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
                }
            `}</style>

            <div className="dark-grain" />

            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                {particles.map((p) => (
                    <motion.div
                        key={p.id}
                        className="absolute rounded-full blur-[120px] opacity-[0.08] mix-blend-screen"
                        style={{ width: p.size, height: p.size, left: `${p.x}%`, top: `${p.y}%`, backgroundColor: p.color }}
                        animate={{ x: [0, 50, -50, 0], y: [0, -30, 30, 0] }}
                        transition={{ duration: p.duration, repeat: Infinity, ease: "easeInOut" }}
                    />
                ))}
            </div>
        </>
    );
}
