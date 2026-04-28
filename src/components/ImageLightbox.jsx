import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import useUIStore from '../stores/uiStore';
import { createPortal } from 'react-dom';

export default function ImageLightbox() {
    const { 
        lightboxImages, 
        currentLightboxIndex, 
        nextLightboxImage, 
        prevLightboxImage, 
        closeLightbox 
    } = useUIStore();

    const currentImage = lightboxImages[currentLightboxIndex];

    // Lock scroll when open
    useEffect(() => {
        const container = document.getElementById('main-scroll-container');
        if (container && currentImage) {
            container.style.overflow = 'hidden';
            return () => { container.style.overflow = 'auto'; };
        }
    }, [currentImage]);

    // Keyboard support
    useEffect(() => {
        if (!currentImage) return;
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowRight') nextLightboxImage();
            if (e.key === 'ArrowLeft') prevLightboxImage();
            if (e.key === 'Escape') closeLightbox();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentImage, nextLightboxImage, prevLightboxImage, closeLightbox]);

    return createPortal(
        <AnimatePresence>
            {currentImage && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={closeLightbox}
                    className="fixed inset-0 z-[999] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-10 cursor-zoom-out"
                >
                    {/* Navigation Buttons */}
                    {lightboxImages.length > 1 && (
                        <>
                            <button
                                onClick={(e) => { e.stopPropagation(); prevLightboxImage(); }}
                                className="absolute left-4 md:left-10 z-[1000] p-3 rounded-full bg-white/5 hover:bg-white/10 text-white transition-all hover:scale-110 active:scale-90"
                            >
                                <ChevronLeft size={36} strokeWidth={2} />
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); nextLightboxImage(); }}
                                className="absolute right-4 md:right-10 z-[1000] p-3 rounded-full bg-white/5 hover:bg-white/10 text-white transition-all hover:scale-110 active:scale-90"
                            >
                                <ChevronRight size={36} strokeWidth={2} />
                            </button>
                            
                            {/* Counter */}
                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/50 text-xs font-bold tracking-widest uppercase">
                                {currentLightboxIndex + 1} / {lightboxImages.length}
                            </div>
                        </>
                    )}

                    <motion.div
                        key={currentImage} // Force re-animation on image change
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        className="relative max-w-full max-h-full flex items-center justify-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={currentImage}
                            alt="Full preview"
                            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-[0_0_80px_rgba(0,0,0,0.8)] select-none pointer-events-none"
                        />
                        
                        <button
                            onClick={closeLightbox}
                            className="absolute -top-12 right-0 md:-top-16 md:-right-16 text-white/40 hover:text-white transition-all p-2 hover:scale-110 active:scale-95"
                        >
                            <X size={40} strokeWidth={2.5} />
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>,
        document.body
    );
}
