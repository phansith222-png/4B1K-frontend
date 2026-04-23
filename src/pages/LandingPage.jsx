import React, { useState, useEffect } from 'react';

// Import Components
import BackgroundEffects from '../components/LandingPageComponent/BackgroundEffects';
import HeroSection from '../components/LandingPageComponent/HeroSection';
import FeatureSection from '../components/LandingPageComponent/FeatureSection';
import EventShowcase from '../components/LandingPageComponent/EventShowcase';
import ArtistShowcase from '../components/LandingPageComponent/ArtistShowcase';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0B0C10] text-white font-sans selection:bg-[#00E5FF] selection:text-black overflow-x-hidden relative">
      
      {/* 1. Background Effects (Lasers & Particles) */}
      <BackgroundEffects />

      {/* 2. Hero Section */}
      <HeroSection />

      {/* 3. Random Events Section */}
      <EventShowcase />

      {/* 4. Random Artists Section */}
      <ArtistShowcase />

      {/* 5. Features Section (How to use) Moved to bottom */}
      <FeatureSection />

    </div>
  );
}