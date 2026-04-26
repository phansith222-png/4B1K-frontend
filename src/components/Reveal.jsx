import React from 'react';
import { motion } from 'framer-motion';
import { UI_CONFIG } from '../config/constants';

export default function Reveal({ children, delay = 0, yOffset = 20, overflow = "visible" }) {
    const variants = {
        hidden: { opacity: 0, y: yOffset },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: UI_CONFIG.REVEAL_ANIMATION_DURATION / 1000,
                ease: [0.25, 0.46, 0.45, 0.94],
                delay,
            },
        },
    };

    return (
        <div style={{ position: "relative", overflow }}>
            <motion.div
                variants={variants}
                initial="hidden"
                animate="visible"
                style={{ opacity: 1, willChange: 'transform, opacity' }}
            >
                {children}
            </motion.div>
        </div>
    );
}
