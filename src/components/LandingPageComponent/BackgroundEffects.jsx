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

        .laser-container { position: fixed; inset: 0; z-index: 99; pointer-events: none; mix-blend-mode: plus-lighter; overflow: hidden; }
        
        .laser-beam {
          position: absolute; top: -10%; width: 120px; height: 160vh;
          filter: blur(60px); 
          transform-origin: top center; 
          opacity: 0.6; /* 📌 บูสต์ความสว่างขึ้นอย่างมาก */
        }
      `}</style>

      {/* Cyber Grid Background */}
      <div className="cyber-grid" />

      {/* Dynamic Crowd Particles (เพิ่ม Interactivity ตามคำขอ) */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          fullScreen: { enable: true, zIndex: 20 },
          particles: {
            number: { value: 100, density: { enable: true, area: 800 } },
            color: { value: ["#00E5FF", "#d000ff", "#ffffff", "#7000FF"] },
            opacity: { value: 0.6, random: true },
            size: { value: { min: 1, max: 3 } },
            move: { enable: true, speed: 1.2, direction: "top", random: true, straight: false },
            shadow: {
              enable: true,
              color: "#00E5FF",
              blur: 5
            }
          },
          interactivity: {
            events: { onHover: { enable: true, mode: "bubble" } },
            modes: { bubble: { distance: 250, size: 6, duration: 2, opacity: 0.8 } }
          }
        }}
        className="fixed inset-0 pointer-events-none"
      />

      {/* 📌 Ambient Multi-Color Lasers (ปรับจุดเริ่มต้นเป็นด้านบน) */}
      <div className="laser-container">
        <div className="laser-beam" style={{ left: '20%', animation: 'laser-swing 8s infinite alternate ease-in-out', background: 'linear-gradient(to bottom, rgba(208,0,255,0.8), transparent)' }}></div>
        <div className="laser-beam" style={{ left: '50%', animation: 'laser-swing 11s infinite alternate-reverse ease-in-out', background: 'linear-gradient(to bottom, rgba(0,229,255,0.7), transparent)' }}></div>
        <div className="laser-beam" style={{ left: '80%', animation: 'laser-swing 9s infinite alternate ease-in-out', background: 'linear-gradient(to bottom, rgba(198,255,0,0.6), transparent)' }}></div>
        <div className="laser-beam" style={{ left: '35%', animation: 'laser-swing 14s infinite alternate-reverse ease-in-out', background: 'linear-gradient(to bottom, rgba(255,0,127,0.6), transparent)' }}></div>
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
