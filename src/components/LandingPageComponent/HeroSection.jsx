import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Zap, Play } from 'lucide-react';

export default function HeroSection() {
  return (
    <main className="relative z-20 min-h-screen flex flex-col items-center justify-center pt-32 px-6 text-center">
      
      {/* --- ส่วนข้อความ --- */}
      <div className="flex flex-col items-center z-30 pointer-events-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 bg-[#1A1C23]/60 border border-white/10 px-6 py-2.5 rounded-full mb-10 backdrop-blur-md shadow-[0_0_20px_rgba(198,255,0,0.1)]"
        >
          <Zap size={16} className="text-[#c6ff00] animate-pulse" />
          <span className="text-[10px] md:text-xs font-black tracking-[0.3em] uppercase text-[#c6ff00]">Ultimate Concert Hub</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-[12vw] md:text-[8vw] font-black leading-[0.85] tracking-tighter mb-10 text-white"
        >
          CONNECT. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] via-[#c6ff00] to-[#d000ff] drop-shadow-2xl">
            4B1K
          </span>
        </motion.h1>

        {/* <motion.p 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.4 }}
          className="text-gray-400 text-sm md:text-xl max-w-2xl mx-auto mb-16 font-medium leading-relaxed"
        >
          Your all-in-one platform for live music experiences. Find your squad, secure your tickets, and share the unforgettable moments.
        </motion.p> */}

        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-xl mx-auto"
        >
          <Link 
            to="/register" 
            className="w-full sm:w-auto bg-gradient-to-r from-[#c6ff00] to-[#a3d900] text-black font-black px-10 py-4 rounded-full text-sm md:text-base hover:scale-105 transition-transform shadow-[0_0_30px_rgba(198,255,0,0.3)] tracking-widest uppercase"
          >
            Join the Community
          </Link>
          <Link 
            to="/new-event" 
            className="w-full sm:w-auto bg-[#1A1C23]/80 border border-white/10 text-white font-bold px-10 py-4 rounded-full text-sm md:text-base hover:bg-white/10 hover:border-white/30 backdrop-blur-md transition-all tracking-widest uppercase"
          >
            Explore Events
          </Link>
        </motion.div>
      </div>

      {/* 📌 ส่วนรูปภาพ/วิดีโอ (ปรับ Delay ให้เหลือ 0.3 วินาที และเด้งไวขึ้น) */}
      <motion.div 
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.3 }}
        className="mt-16 md:mt-24 w-full max-w-6xl relative group z-10 pointer-events-auto"
      >
        <div className="absolute -inset-2 bg-gradient-to-r from-[#d000ff] via-[#00E5FF] to-[#c6ff00] rounded-[3rem] blur-2xl opacity-20 group-hover:opacity-40 transition duration-1000"></div>
        <div className="relative rounded-[2.5rem] overflow-hidden border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.8)] bg-black">
          
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C10] via-black/20 to-transparent z-10 opacity-90 pointer-events-none" />
          
          {/* 🎬 ใช้แท็ก <video> แทน <img> */}
          <video 
            src="https://assets.mixkit.co/videos/preview/mixkit-crowd-cheering-in-a-concert-with-stage-lights-22161-large.mp4" 
            autoPlay 
            loop 
            muted 
            playsInline
            className="w-full h-[40vh] md:h-[65vh] object-cover scale-105 group-hover:scale-100 transition-transform duration-[3s] ease-out opacity-80 group-hover:opacity-100"
          />
          
          {/* ปุ่ม WATCH RECAP */}
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/10 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-all duration-500 cursor-pointer">
            <div className="w-20 h-20 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(255,255,255,0.5)] group-hover:scale-110 transition-transform">
              <Play className="text-black ml-1" size={30} fill="black" />
            </div>
            <p className="mt-6 font-black tracking-[0.3em] text-xs text-white drop-shadow-md">WATCH FULL RECAP</p>
          </div>

        </div>
      </motion.div>

    </main>
  );
}