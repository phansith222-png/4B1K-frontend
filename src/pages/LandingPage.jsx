import React, { useState, useEffect, useMemo, lazy, Suspense } from 'react';

// Lazy load heavy components
import BackgroundEffects from '../components/LandingPageComponent/BackgroundEffects';
import HeroSection from '../components/LandingPageComponent/HeroSection';
import FeatureSection from '../components/LandingPageComponent/FeatureSection';
import EventShowcase from '../components/LandingPageComponent/EventShowcase';
import ArtistShowcase from '../components/LandingPageComponent/ArtistShowcase';
import { getAllArtists } from '../api/artist';
import { getAllEvents } from '../api/event';

export default function LandingPage() {
  const [artists, setArtists] = React.useState([]);
  const [events, setEvents] = React.useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [artistRes, eventRes] = await Promise.all([
          getAllArtists(),
          getAllEvents()
        ]);
        
        const artistData = artistRes?.artists || artistRes?.data || artistRes || [];
        const eventData = eventRes?.events || eventRes?.data?.events || eventRes?.data || eventRes || [];
        
        setArtists([...artistData].sort(() => 0.5 - Math.random()));
        setEvents([...eventData].sort(() => 0.5 - Math.random()));
      } catch (err) {
        console.error("Failed to load landing page data", err);
      }
    };
    fetchData();
  }, []);

  // Pre-compute metadata to avoid expensive calculations in render loops
  const processedArtists = useMemo(() => {
    return artists.map(artist => {
      const aId = Number(artist.id);
      let path = '/artists';
      if ([1, 2, 3, 4, 5].includes(aId)) path = '/pop';
      else if ([6, 7, 8, 9, 10].includes(aId)) path = '/rock';
      else if ([16, 17, 18, 19, 20].includes(aId)) path = '/classic';
      else if ([11, 12, 13, 14, 15, 21, 22, 23, 24, 25].includes(aId)) path = '/etc';

      const randomSong = artist.songs && artist.songs.length > 0 
        ? artist.songs[Math.floor(Math.random() * artist.songs.length)] 
        : null;

      return { ...artist, path, randomSong };
    });
  }, [artists]);

  const processedEvents = useMemo(() => {
    return events.map(event => {
      let color = "#00E5FF";
      try {
        let aId = event.artistId || event.artist?.id;
        if (!aId && event.artists?.length > 0) aId = event.artists[0].artistId || event.artists[0].artist?.id;
        aId = Number(aId);
        if ([1, 2, 3, 4, 5].includes(aId)) color = "#FF007F";
        else if ([6, 7, 8, 9, 10].includes(aId)) color = "#D3131F";
        else if ([16, 17, 18, 19, 20].includes(aId)) color = "#d83bb6";
        else if ([11, 12, 13, 14, 15].includes(aId)) color = "#00E5FF";
        else if ([21, 22, 23, 24, 25].includes(aId)) color = "#7000FF";
      } catch (e) {}
      return { ...event, color };
    });
  }, [events]);

  return (
    <div className="min-h-screen bg-transparent text-white font-sans selection:bg-[#00E5FF] selection:text-black overflow-x-hidden relative">
      {/* Background Effects (Lasers & Particles) - Persistent Layer */}
      <div className="fixed inset-0 z-5 mix-blend-plus-lighter pointer-events-none">
        <BackgroundEffects intensity={2.0} />
      </div>

      {/* 2. Hero Section */}
      <HeroSection artists={processedArtists} events={processedEvents} />

      {/* 3. Random Events Section */}
      <EventShowcase events={processedEvents.slice(0, 6)} />

      {/* 4. Random Artists Section */}
      <ArtistShowcase artists={processedArtists.slice(0, 6)} />

      {/* 5. Features Section (How to use) Moved to bottom */}
      <FeatureSection />
    </div>
  );
}
