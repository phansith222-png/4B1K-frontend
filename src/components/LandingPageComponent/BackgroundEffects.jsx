import React, { useCallback, useEffect, useRef } from 'react';
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";

export default function BackgroundEffects() {
  const glowRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (glowRef.current) {
        glowRef.current.style.background = `radial-gradient(600px at ${e.clientX}px ${e.clientY}px, rgba(198, 255, 0, 0.03), transparent 80%)`;
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  const particlesInit = useCallback(async engine => {
    await loadSlim(engine);
  }, []);

  return (
    <>
      <style>{`
        /* 📌 แอนิเมชันแบบลูกตุ้ม (แกว่งซ้ายสุด ไปขวาสุด) */
        @keyframes laser-swing {
          0% { transform: translate(-50%, -50%) rotate(-35deg); }
          100% { transform: translate(-50%, -50%) rotate(35deg); }
        }

        .laser-container { position: fixed; inset: 0; z-index: 1; pointer-events: none; mix-blend-mode: screen; overflow: hidden; }
        
        .laser-beam {
          position: absolute; top: 40%; width: 60px; height: 150vh;
          filter: blur(50px); /* ความฟุ้งเบลอของแสง */
          transform-origin: top center; 
          opacity: 0.15; /* 📌 ล็อกความสว่างให้จางๆ คงที่ตลอดเวลา จะไม่มีจังหวะแสงดับหรือกะพริบ */
        }
      `}</style>

      {/* Dynamic Crowd Particles (คงเดิม) */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          fullScreen: { enable: true, zIndex: 0 },
          particles: {
            number: { value: 80, density: { enable: true, area: 1000 } },
            color: { value: ["#00E5FF", "#00E5FF", "#d000ff", "#ffffff"] },
            opacity: { value: { min: 0.05, max: 0.3 }, animation: { enable: true, speed: 0.5 } },
            size: { value: { min: 1, max: 3 } },
            move: { enable: true, speed: 0.5, direction: "top", random: true, straight: false },
          },
          interactivity: {
            events: { onHover: { enable: true, mode: "bubble" } },
            modes: { bubble: { distance: 250, size: 5, duration: 2, opacity: 0.6 } }
          }
        }}
        className="fixed inset-0 pointer-events-none"
      />

      {/* 📌 Ambient Multi-Color Lasers (ใช้ alternate เพื่อให้แกว่งไปและแกว่งกลับทันที) */}
      <div className="laser-container">
        <div className="laser-beam" style={{ left: '20%', animation: 'laser-swing 8s infinite alternate ease-in-out', background: 'linear-gradient(to bottom, transparent, rgba(208,0,255,0.8) 50%, transparent)' }}></div>
        <div className="laser-beam" style={{ left: '50%', animation: 'laser-swing 11s infinite alternate-reverse ease-in-out', background: 'linear-gradient(to bottom, transparent, rgba(0,229,255,0.7) 50%, transparent)' }}></div>
        <div className="laser-beam" style={{ left: '80%', animation: 'laser-swing 9s infinite alternate ease-in-out', background: 'linear-gradient(to bottom, transparent, rgba(198,255,0,0.6) 50%, transparent)' }}></div>
        <div className="laser-beam" style={{ left: '35%', animation: 'laser-swing 14s infinite alternate-reverse ease-in-out', background: 'linear-gradient(to bottom, transparent, rgba(255,0,127,0.6) 50%, transparent)' }}></div>
      </div>

      {/* Mouse Glow (Zero Re-render DOM Mutation) */}
      <div 
        ref={glowRef}
        className="fixed inset-0 z-10 pointer-events-none transition-opacity duration-700 ease-out"
        style={{ background: `radial-gradient(600px at -100px -100px, rgba(198, 255, 0, 0.03), transparent 80%)` }}
      />
    </>
  );
}
