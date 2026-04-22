import React, { useEffect, useRef } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';

export default function Reveal({ children, delay = 0, yOffset = 50, overflow = "hidden" }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.3 }); // แอนิเมชันทำงานครั้งเดียวเมื่อเลื่อนมาเห็น 30%
    const mainControls = useAnimation();

    useEffect(() => {
        if (isInView) {
            mainControls.start("visible");
        }
    }, [isInView, mainControls]);

    return (
        <div ref={ref} style={{ position: "relative", overflow }}>
            <motion.div
                variants={{
                    hidden: { 
                        opacity: 0, 
                        y: yOffset, 
                        scale: 0.98,
                    },
                    visible: { 
                        opacity: 1, 
                        y: 0, 
                        scale: 1,
                        transition: { 
                            duration: 0.8, 
                            ease: [0.16, 1, 0.3, 1], 
                            delay: delay 
                        } 
                    },
                }}
                style={{ willChange: 'transform, opacity' }}
                initial="hidden"
                animate={mainControls}
            >
                {children}
            </motion.div>
        </div>
    );
}