import React, { useEffect, useRef } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';

export default function Reveal({ children, delay = 0, yOffset = 50 }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.3 }); // แอนิเมชันทำงานครั้งเดียวเมื่อเลื่อนมาเห็น 30%
    const mainControls = useAnimation();

    useEffect(() => {
        if (isInView) {
            mainControls.start("visible");
        }
    }, [isInView, mainControls]);

    return (
        <div ref={ref} style={{ position: "relative", overflow: "hidden" }}>
            <motion.div
                variants={{
                    hidden: { 
                        opacity: 0, 
                        y: yOffset, 
                        scale: 0.95, 
                        filter: "blur(10px)" 
                    },
                    visible: { 
                        opacity: 1, 
                        y: 0, 
                        scale: 1, 
                        filter: "blur(0px)",
                        transition: { 
                            duration: 0.9, 
                            // 📌 คีย์เวิร์ดความสวย: Easing แบบ Bezier Curve (Ease-Out นุ่มๆ)
                            ease: [0.16, 1, 0.3, 1], 
                            delay: delay 
                        } 
                    },
                }}
                initial="hidden"
                animate={mainControls}
            >
                {children}
            </motion.div>
        </div>
    );
}