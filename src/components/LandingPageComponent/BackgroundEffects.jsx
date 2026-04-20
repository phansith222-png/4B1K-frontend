import React, { useCallback } from 'react';
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";

export default function BackgroundEffects({ mousePos }) {
  const particlesInit = useCallback(async engine => {
    await loadSlim(engine);
  }, []);

  return (
    <>
      <style>{`
        @keyframes laser-sweep {
          0% { transform: translate(-50%, -50%) rotate(-25deg); opacity: 0; }
          30% { opacity: 0.15; }
          70% { opacity: 0.15; }
          100% { transform: translate(-50%, -50%) rotate(25deg); opacity: 0; }
        }
        @keyframes laser-sweep-reverse {
          0% { transform: translate(-50%, -50%) rotate(25deg); opacity: 0; }
          30% { opacity: 0.1; }
          70% { opacity: 0.1; }
          100% { transform: translate(-50%, -50%) rotate(-25deg); opacity: 0; }
        }
        .laser-container { position: fixed; inset: 0; z-index: 1; pointer-events: none; mix-blend-mode: screen; overflow: hidden; }
        .laser-beam {
          position: absolute; top: -10%; width: 100px; height: 150vh;
          filter: blur(40px);
          transform-origin: top center; 
        }
      `}</style>

      {/* Dynamic Crowd Particles */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          fullScreen: { enable: true, zIndex: 0 },
          particles: {
            number: { value: 80, density: { enable: true, area: 1000 } },
            color: { value: ["#c6ff00", "#00E5FF", "#d000ff", "#ffffff"] },
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

      {/* Ambient Multi-Color Lasers */}
      <div className="laser-container">
        <div className="laser-beam" style={{ left: '20%', animation: 'laser-sweep 12s infinite ease-in-out', background: 'linear-gradient(to bottom, transparent, rgba(208,0,255,0.6) 50%, transparent)' }}></div>
        <div className="laser-beam" style={{ left: '50%', animation: 'laser-sweep-reverse 15s infinite ease-in-out', background: 'linear-gradient(to bottom, transparent, rgba(0,229,255,0.5) 50%, transparent)' }}></div>
        <div className="laser-beam" style={{ left: '80%', animation: 'laser-sweep 10s infinite ease-in-out 2s', background: 'linear-gradient(to bottom, transparent, rgba(198,255,0,0.4) 50%, transparent)' }}></div>
        <div className="laser-beam" style={{ left: '35%', animation: 'laser-sweep-reverse 18s infinite ease-in-out 5s', background: 'linear-gradient(to bottom, transparent, rgba(255,0,127,0.4) 50%, transparent)' }}></div>
      </div>

      {/* Mouse Glow */}
      <div 
        className="fixed inset-0 z-10 pointer-events-none transition-opacity duration-700 ease-out"
        style={{ background: `radial-gradient(600px at ${mousePos.x}px ${mousePos.y}px, rgba(198, 255, 0, 0.03), transparent 80%)` }}
      />
    </>
  );
}