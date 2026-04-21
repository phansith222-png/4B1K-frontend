import React from 'react';
import { motion } from 'framer-motion';

export default function PageTransition({ children }) {
    return (
        <motion.div
            initial="initial"
            animate="animate"
            exit="exit"
            className="relative w-full h-full"
        >
            {/* 🎬 1. ตัวเนื้อหาเว็บ (ค่อยๆ เลื่อนขึ้นมานุ่มๆ ตอนโหลดเสร็จ) */}
            <motion.div
                variants={{
                    initial: { opacity: 0, y: 15 },
                    animate: { 
                        opacity: 1, y: 0, 
                        // หน่วงเวลา 0.2s ให้หน้าจอ Loading เฟดหายไปก่อน เนื้อหาค่อยโชว์
                        transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 } 
                    },
                    exit: { 
                        opacity: 0, y: -15, 
                        transition: { duration: 0.3, ease: "easeOut" } 
                    }
                }}
                className="w-full h-full"
            >
                {children}
            </motion.div>

            {/* 🎬 2. หน้าจอ Loading (แบบไร้ม่าน เฟดเข้า-ออกอย่างเดียว) */}
            <motion.div
                // z-[9999] บังทุกสิ่งในเว็บ, pointer-events-none เพื่อไม่ให้บังการคลิกตอนจางหายไปแล้ว
                className="fixed inset-0 z-[9999] bg-[#0B0C10] flex flex-col items-center justify-center pointer-events-none"
                variants={{
                    // 📌 1. เริ่มต้นหน้าใหม่: จอต้องดำสนิท (opacity: 1) เพื่อบังรอยต่อ
                    initial: { opacity: 1 }, 
                    
                    // 📌 2. พอหน้าเว็บพร้อม: ให้จอดำค่อยๆ เฟดจางหายไป เผยให้เห็นเว็บ
                    animate: { 
                        opacity: 0, 
                        transition: { duration: 0.6, ease: "easeInOut", delay: 0.1 } 
                    }, 
                    
                    // 📌 3. ตอนกดลิงก์เปลี่ยนหน้า: จอดำเฟดกลับมาบังหน้าจอ (เอาไว้ซ่อนจังหวะกระตุก)
                    exit: { 
                        opacity: 1, 
                        transition: { duration: 0.4, ease: "easeInOut" } 
                    } 
                }}
            >
                {/* ลายเส้น Noise ให้พื้นหลังไม่ดูดำสนิทจนเกินไป */}
                <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/%3E%3C/svg%3E')]"></div>

                {/* แอนิเมชันตอนโหลด (คลื่นเสียง + โลโก้) */}
                <div className="flex flex-col items-center gap-6 relative z-10">
                    <div className="flex gap-2 items-center justify-center h-12">
                        {[...Array(5)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="w-2 bg-[#00E5FF] rounded-full"
                                animate={{ height: ["20%", "100%", "20%"] }}
                                transition={{ 
                                    duration: 0.8, 
                                    repeat: Infinity, 
                                    delay: i * 0.05, 
                                    ease: "easeInOut" 
                                }}
                            />
                        ))}
                    </div>
                    <h1 className="text-white text-sm font-black tracking-[0.5em] uppercase">
                        Loading <span className="text-[#FF007F]">4B1K</span>
                    </h1>
                </div>
            </motion.div>
        </motion.div>
    );
}