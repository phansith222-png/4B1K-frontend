import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UI_CONFIG } from '../config/constants';

/**
 * 🎬 GlobalLoadingOverlay
 * Optimizing for ZERO-FRAME data leakage.
 */
export default function GlobalLoadingOverlay({ locationKey }) {
    const [isVisible, setIsVisible] = useState(false);
    const lastKey = useRef(locationKey);

    useEffect(() => {
        if (locationKey !== lastKey.current) {
            lastKey.current = locationKey;
            setIsVisible(true);
        }
    }, [locationKey]);

    useEffect(() => {
        let timer;
        if (isVisible) {
            timer = setTimeout(() => {
                setIsVisible(false);
            }, UI_CONFIG.GLOBAL_LOADER_DURATION);
        }
        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [isVisible]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    // ⚡ INSTANT FADE IN: No duration on initial/animate for opacity 1
                    // to ensure it covers the screen the VERY frame it mounts.
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ exit: { duration: 0.3, ease: "easeInOut" } }}
                    className="fixed inset-0 z-[10000] bg-[#0B0C10] flex flex-col items-center justify-center pointer-events-auto"
                >
                    {/* Background noise/grain */}
                    <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/%3E%3C/svg%3E')]"></div>

                    <style>{`
                        @keyframes loadingBar { 0%,100%{height:20%;opacity:0.3} 50%{height:100%;opacity:1} }
                        @keyframes textPulse { 0%,100%{opacity:1;filter:brightness(1)} 50%{opacity:0.7;filter:brightness(1.5)} }
                    `}</style>

                    <div className="flex flex-col items-center gap-8 relative z-10">
                        <div className="flex gap-3 items-center justify-center h-16">
                            {[0, 1, 2, 3, 4].map(i => (
                                <div
                                    key={i}
                                    className="w-1.5 bg-[#00E5FF] rounded-full shadow-[0_0_15px_rgba(0,229,255,0.5)]"
                                    style={{
                                        height: '20%',
                                        animation: `loadingBar 1s ease-in-out infinite`,
                                        animationDelay: `${i * 0.15}s`,
                                    }}
                                />
                            ))}
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <h1 className="text-white text-base font-black tracking-[0.8em] uppercase ml-[0.8em]" style={{ animation: 'textPulse 2s ease-in-out infinite' }}>
                                Loading <span className="text-[#FF007F]">4B1K</span>
                            </h1>
                            <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
