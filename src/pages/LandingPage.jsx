import React, { useState, useEffect } from 'react';
import { useScroll, useTransform } from 'framer-motion';

// Import Components ที่เราแยกไว้
import BackgroundEffects from '../components/LandingPageComponent/BackgroundEffects';
import HeroSection from '../components/LandingPageComponent/HeroSection';
import FeatureSection from '../components/LandingPageComponent/FeatureSection';
import EventShowcase from '../components/LandingPageComponent/EventShowcase';
import ArtistShowcase from '../components/LandingPageComponent/ArtistShowcase';

export default function LandingPage() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const { scrollY } = useScroll();
  
  // Parallax & Opacity สำหรับหน้า Hero
  const yImage = useTransform(scrollY, [0, 500], [0, -100]);
  const opacityHero = useTransform(scrollY, [0, 400], [1, 0]);

  // ติดตามตำแหน่งเมาส์สำหรับแสง Glow
  useEffect(() => {
    const handleMouseMove = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-[#0B0C10] text-white font-sans selection:bg-[#00E5FF] selection:text-black overflow-x-hidden relative">
      
      {/* 1. Background Effects (Lasers & Particles) */}
      <BackgroundEffects mousePos={mousePos} />

      {/* 2. Hero Section */}
      <HeroSection yImage={yImage} opacityHero={opacityHero} />

      {/* 3. Features Section */}
      <FeatureSection />

      {/* 4. Random Events Section */}
      <EventShowcase />

      {/* 5. Random Artists Section */}
      <ArtistShowcase />

    </div>
  );
}