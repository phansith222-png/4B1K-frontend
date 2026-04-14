import React, { useState, useEffect, useCallback } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Users, Ticket, MessageSquare, ArrowRight, Zap, Play } from 'lucide-react';
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";

export default function LandingPage() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const { scrollY } = useScroll();
  
  // Parallax & Opacity Effects
  const yImage = useTransform(scrollY, [0, 500], [0, -100]);
  const opacityHero = useTransform(scrollY, [0, 400], [1, 0]);

  // Particle Logic
  const particlesInit = useCallback(async engine => {
    await loadSlim(engine);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-[#020202] text-white font-sans selection:bg-[#c6ff00] selection:text-black overflow-x-hidden relative">
      
      {/* --- [CSS IN JS] สำหรับ Laser System --- */}
      <style>{`
        @keyframes laser-scan {
          0% { transform: translate(-50%, -50%) rotate(-35deg); opacity: 0; }
          20% { opacity: 0.8; }
          80% { opacity: 0.8; }
          100% { transform: translate(-50%, -50%) rotate(35deg); opacity: 0; }
        }
        .laser-container { position: fixed; inset: 0; z-index: 5; pointer-events: none; }
        .laser-beam {
          position: absolute; top: 40%; left: 50%; width: 2px; height: 120vh;
          background: linear-gradient(to bottom, transparent, #d000ff 50%, transparent);
          box-shadow: 0 0 20px 2px rgba(208, 0, 255, 0.8);
          transform-origin: top center; animation: laser-scan 8s infinite ease-in-out;
        }
      `}</style>

      {/* 🌌 1. DYNAMIC CROWD (Particles) */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          fullScreen: { enable: true, zIndex: 0 },
          particles: {
            number: { value: 120, density: { enable: true, area: 800 } },
            color: { value: ["#c6ff00", "#ffffff", "#d000ff"] },
            opacity: { value: { min: 0.1, max: 0.4 }, animation: { enable: true, speed: 1 } },
            size: { value: { min: 1, max: 3 } },
            move: { enable: true, speed: 0.8, direction: "top", random: true },
          },
          interactivity: {
            events: { onHover: { enable: true, mode: "bubble" } },
            modes: { bubble: { distance: 200, size: 6, duration: 2, opacity: 0.8 } }
          }
        }}
        className="fixed inset-0 pointer-events-none"
      />

      {/* 💜 2. PURPLE LASER SYSTEM */}
      <div className="laser-container">
        <div className="laser-beam" style={{ left: '20%', animationDelay: '0s', background: '#d000ff' }}></div>
        <div className="laser-beam" style={{ left: '50%', animationDelay: '-2s', background: '#9d00ff', width: '3px' }}></div>
        <div className="laser-beam" style={{ left: '80%', animationDelay: '-4s', background: '#ff00ea' }}></div>
      </div>

      {/* 🚀 3. MOUSE GLOW LAYER */}
      <div 
        className="fixed inset-0 z-10 pointer-events-none transition-opacity duration-500"
        style={{
          background: `radial-gradient(700px at ${mousePos.x}px ${mousePos.y}px, rgba(198, 255, 0, 0.05), transparent 80%)`
        }}
      />

      {/* ⚡ 4. MAIN CONTENT SECTION */}
      <motion.main 
        style={{ opacity: opacityHero }}
        className="relative z-20 min-h-screen flex flex-col items-center justify-center pt-24 px-4 text-center"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-6 py-2 rounded-full mb-10 backdrop-blur-2xl"
        >
          <Zap size={16} className="text-[#c6ff00] animate-pulse" />
          <span className="text-xs font-black tracking-[0.4em] uppercase text-[#c6ff00]">Ultimate Concert Hub</span>
        </motion.div>

        {/* Epic Title */}
        <motion.h1 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-[13vw] md:text-[9vw] font-black leading-[0.8] tracking-tighter mb-10"
        >
          CONNECT. <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c6ff00] via-white to-[#d000ff] drop-shadow-[0_0_30px_rgba(198,255,0,0.3)]">
            4B1K
          </span>
         
        </motion.h1>

        {/* Subtitle */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-gray-400 text-lg md:text-2xl max-w-3xl mx-auto mb-16 font-light leading-relaxed italic"
        >
          ... <br className="hidden md:block" />
        
        </motion.p>

        {/* CTA Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col md:flex-row items-center gap-6 w-full max-w-2xl mx-auto"
        >
          <div className="relative flex-grow w-full group">
            <input 
              type="text"
              placeholder="Who are you stanning?"
              className="w-full bg-white/5 border border-white/10 px-8 py-5 rounded-3xl outline-none focus:border-[#c6ff00]/50 transition-all text-xl backdrop-blur-3xl"
            />
          </div>
          <Link 
            to="/register" 
            className="w-full md:w-auto bg-[#c6ff00] text-black font-black px-12 py-5 rounded-3xl text-xl hover:bg-white transition-all shadow-[0_0_40px_rgba(198,255,0,0.4)] active:scale-95 whitespace-nowrap"
          >
            START SING UP →
          </Link>
        </motion.div>

        {/* Hero Stage Image */}
        <motion.div 
          style={{ y: yImage }}
          className="mt-32 w-full max-w-6xl relative group"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-[#d000ff] to-[#c6ff00] rounded-[50px] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
          <div className="relative rounded-[45px] overflow-hidden border border-white/10">
            <div className="absolute inset-0 bg-gradient-to-t from-[#020202] via-transparent to-transparent z-10" />
            <img 
              src="https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=2070&auto=format&fit=crop" 
              className="w-full h-[60vh] object-cover scale-105 group-hover:scale-100 transition-transform duration-[2s]"
              alt="Concert Energy"
            />
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-all">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-black">
                <Play fill="black" />
              </div>
              <p className="mt-4 font-black tracking-widest text-sm">WATCH RECAP</p>
            </div>
          </div>
        </motion.div>
      </motion.main>

      {/* 💎 5. FEATURES GRID */}
      <section className="relative z-20 py-40 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <FeatureCard 
            icon={<Users className="text-[#c6ff00]" />}
            title="SQUAD FINDER"
            desc="แมตช์กลุ่มเพื่อนตามศิลปินและโซนที่นั่ง ให้การไปคอนของคุณไม่เหงาอีกต่อไป"
          />
          <FeatureCard 
            icon={<Ticket className="text-[#d000ff]" />}
            title="WAR ROOM"
            desc="ห้องจำลองกดบัตรและเทคนิคการจองที่แม่นยำที่สุด พร้อมระบบแจ้งเตือนทันที"
          />
          <FeatureCard 
            icon={<MessageSquare className="text-blue-400" />}
            title="AFTER PARTY"
            desc="พื้นที่แชร์รูปภาพ คลิปวิดีโอ และรีวิวความประทับใจหลังจบโชว์กับคนคอเดียวกัน"
          />
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <motion.div 
      whileHover={{ y: -15, backgroundColor: 'rgba(255,255,255,0.08)' }}
      className="p-12 rounded-[45px] bg-white/5 border border-white/5 backdrop-blur-xl transition-all group"
    >
      <div className="mb-8 p-4 bg-white/5 w-fit rounded-2xl group-hover:scale-110 transition-transform">
        {React.cloneElement(icon, { size: 40 })}
      </div>
      <h3 className="text-2xl font-black mb-4 tracking-tight">{title}</h3>
      <p className="text-gray-400 leading-relaxed text-lg">{desc}</p>
    </motion.div>
  );
}