import React from 'react';
import { motion } from 'framer-motion';
import { UI_CONFIG } from '../config/constants';

/**
 * 🌀 PageTransition
 * Handles the smooth fade-in/out of the page content.
 * The black loading curtain is now handled by GlobalLoadingOverlay for better timing.
 */
export default function PageTransition({ children }) {
    return (
        <motion.div
            initial="initial"
            animate="animate"
            exit="exit"
            className="relative w-full min-h-screen"
            variants={{
                initial: {
                    opacity: 1
                },
                animate: {
                    opacity: 1,
                    transition: { duration: 0.3, ease: "easeOut" }
                },
                exit: {
                    opacity: 0,
                    transition: { duration: 0.2, ease: "easeIn" }
                }
            }}
        >
            {children}
        </motion.div>
    );
}
