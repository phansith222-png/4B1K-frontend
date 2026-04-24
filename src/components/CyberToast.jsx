import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CyberToastContext = createContext();

export const useCyberToast = () => useContext(CyberToastContext);

export const CyberToastProvider = ({ children }) => {
    const [toast, setToast] = useState(null);

    const showToast = useCallback((message, type = 'success') => {
        setToast({ message, type, id: Date.now() });
    }, []);

    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => {
                setToast(null);
            }, 2500); // Slightly shorter duration
            return () => clearTimeout(timer);
        }
    }, [toast]);

    return (
        <CyberToastContext.Provider value={{ showToast }}>
            {children}
            <AnimatePresence>
                {toast && (
                    <div className="fixed inset-0 z-[200] pointer-events-none flex items-center justify-center">
                        {/* Smooth Edge Glow */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                            className={`absolute inset-0 z-0 transition-colors duration-1000 ${
                                toast.type === 'error' 
                                    ? 'shadow-[inset_0_0_150px_rgba(255,0,0,0.2)] border-[4px] border-red-500/10' 
                                    : 'shadow-[inset_0_0_150px_rgba(0,229,255,0.2)] border-[4px] border-[#00E5FF]/10'
                            }`}
                        />
                        
                        {/* Center Content - More smooth and less "stiff" */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
                            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
                            transition={{ 
                                duration: 0.6, 
                                ease: [0.22, 1, 0.36, 1]
                            }}
                            className="relative z-10"
                        >
                            <div className="bg-black/40 backdrop-blur-3xl px-12 py-8 rounded-[3rem] border border-white/5 shadow-[0_30px_100px_rgba(0,0,0,0.5)]">
                                <motion.h2 
                                    initial={{ y: 20 }}
                                    animate={{ y: 0 }}
                                    className={`text-3xl md:text-5xl font-black uppercase italic tracking-tighter text-center ${
                                        toast.type === 'error' ? 'text-red-500' : 'text-[#00E5FF]'
                                    }`}
                                    style={{
                                        textShadow: toast.type === 'error' ? '0 0 20px rgba(239,68,68,0.5)' : '0 0 20px rgba(0,229,255,0.5)'
                                    }}
                                >
                                    {toast.message}
                                </motion.h2>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </CyberToastContext.Provider>
    );
};
