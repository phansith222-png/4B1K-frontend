import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllArtists } from '../api/artist';

// นำเข้า Components ย่อย
import BackgroundEffects from '../components/PageEntertainmentComponent/BackgroundEffects';
import HeroSection from '../components/PageEntertainmentComponent/HeroSection';
import TaglineSection from '../components/PageEntertainmentComponent/TaglineSection';
import LabelsCategorySection from '../components/PageEntertainmentComponent/LabelsCategorySection';
import IndustryStatsSection from '../components/PageEntertainmentComponent/IndustryStatsSection';
import BottomTextSection from '../components/PageEntertainmentComponent/BottomTextSection';
import TopChartsSection from '../components/PageEntertainmentComponent/TopChartsSection';
import Reveal from '../components/Reveal';
import BackButton from '../components/BackButton';
import { getArtistById } from '../api/artist';
import useYouTubePlayer from '../hooks/useYouTubePlayer';

const PLAYER_ID = 'yt-player-hidden-ent';

export default function PageEntertainment() {
    const navigate = useNavigate();
    const [agencies, setAgencies] = useState([]);
    const [totalArtists, setTotalArtists] = useState(0);
    const [loading, setLoading] = useState(true);
    const [youtubeSongs, setYoutubeSongs] = useState([]);
    const [spotifySongs, setSpotifySongs] = useState([]);
    const [allChartSongs, setAllChartSongs] = useState([]);

    const {
        isPlaying,
        currentSongIndex,
        handleSongSelect,
    } = useYouTubePlayer(allChartSongs, PLAYER_ID, {
        previewMode: true,
        startOffset: 45,
        previewDuration: 10
    });

    useEffect(() => {
        const fetchAgenciesData = async () => {
            try {
                setLoading(true);

                let allArtistsRes;
                try {
                    allArtistsRes = await getAllArtists();
                } catch (err) {
                    console.error("Failed to fetch all artists:", err);
                    allArtistsRes = [];
                }
                
                const allArtistsList = allArtistsRes?.artists || allArtistsRes?.data || allArtistsRes || [];
                console.log("Total Artists found:", allArtistsList.length);

                // ── Fetch Songs for Top Charts (Database Only) ─────────────
                // Limit to first 12 artists for a good sample size without overloading
                const chartArtists = allArtistsList.slice(0, 12);
                
                // ✅ FIX: Use getArtistById instead of getSongsByArtist (avoid 404)
                const detailResults = await Promise.allSettled(
                    chartArtists.map(a => getArtistById(a.id || a._id))
                );
                
                let allSongs = [];
                detailResults.forEach((res, idx) => {
                    if (res.status !== "fulfilled") return;
                    
                    const r = res.value;
                    const artist = r?.artist || r?.data || r;
                    const artistName = artist.artistName || artist.name || "Unknown Artist";
                    
                    const rawSongs = Array.isArray(artist?.songs) ? artist.songs : [];

                    const songsWithArtist = rawSongs.map((s, sIdx) => ({
                        ...s,
                        id: s.id || s._id || `s-${idx}-${sIdx}`,
                        artistName,
                        coverImage: s.coverImage || artist.profileImage || artist.artistImage || "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=100&auto=format&fit=crop"
                    }));
                    allSongs = [...allSongs, ...songsWithArtist];
                });

                console.log("Extraction complete. Total songs found:", allSongs.length);

                // Sort by popularity or views
                allSongs.sort((a, b) => {
                    const valA = Number(a.popularity || a.views || 0);
                    const valB = Number(b.popularity || b.views || 0);
                    return valB - valA;
                });

                // Group by platform
                const yt = allSongs.filter(s => s.streamUrl?.toLowerCase().includes('youtube') || s.streamUrl?.toLowerCase().includes('youtu.be'));
                const sp = allSongs.filter(s => s.streamUrl?.toLowerCase().includes('spotify'));
                
                let finalYt = yt.slice(0, 5);
                let finalSp = sp.slice(0, 5);

                // Fill logic
                if (allSongs.length > 0) {
                    if (finalYt.length < 5) {
                        const usedIds = new Set(finalYt.map(s => s.id));
                        const fillers = allSongs.filter(s => !usedIds.has(s.id)).slice(0, 5 - finalYt.length);
                        finalYt = [...finalYt, ...fillers];
                    }
                    if (finalSp.length < 5) {
                        const usedIds = new Set([...finalYt.map(s => s.id), ...finalSp.map(s => s.id)]);
                        const fillers = allSongs.filter(s => !usedIds.has(s.id)).slice(0, 5 - finalSp.length);
                        finalSp = [...finalSp, ...fillers];
                    }
                }

                setYoutubeSongs(finalYt);
                setSpotifySongs(finalSp);
                setAllChartSongs([...finalYt, ...finalSp]);

                const agencyMap = {};
                let countWithAgency = 0;

                allArtistsList.forEach(artist => {
                    if (artist.agency) {
                        countWithAgency++;
                        const agId = artist.agency.id || artist.agency._id;
                        if (!agencyMap[agId]) {
                            agencyMap[agId] = {
                                id: agId,
                                name: artist.agency.name,
                                artists: []
                            };
                        }
                        agencyMap[agId].artists.push(artist);
                    }
                });

                const sortedAgencies = Object.values(agencyMap).sort((a, b) => b.artists.length - a.artists.length);

                setAgencies(sortedAgencies);
                setTotalArtists(countWithAgency);

            } catch (error) {
                console.error("Error in PageEntertainment fetch:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAgenciesData();
    }, []);

    const cardColors = ['#00E5FF', '#FF00FF', '#7000FF', '#00F5D4', '#FF3366', '#9D4EDD'];
    const topAgencies = agencies.slice(0, 4);
    const indieAgencies = agencies.slice(4);

    if (loading) {
        return (
            <div className="bg-[#0B0C10] min-h-screen flex flex-col items-center justify-center text-[#00E5FF] relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#7000FF] opacity-20 blur-[80px] rounded-full animate-pulse"></div>
                <div className="w-16 h-16 border-4 border-gray-800 border-t-[#00E5FF] rounded-full animate-spin z-10"></div>
                <p className="mt-4 font-bold tracking-widest animate-pulse text-white z-10 uppercase text-sm">Loading Labels...</p>
            </div>
        );
    }

    return (
        <div className="bg-[#0B0C10] min-h-screen text-[#FFFFFF] font-sans overflow-x-hidden selection:bg-[#00E5FF] selection:text-black relative">
            <BackButton color="#00E5FF" glowColor="rgba(0, 229, 255, 0.3)" />
            
            <BackgroundEffects />
            <Reveal>
                <HeroSection navigate={navigate} />
            </Reveal>

            {/* 🎯 TOP CHARTS SECTION */}
            <TopChartsSection 
                youtubeSongs={youtubeSongs}
                spotifySongs={spotifySongs}
                allChartSongs={allChartSongs}
                currentSongIndex={currentSongIndex}
                isPlaying={isPlaying}
                handleSongSelect={handleSongSelect}
            />

            <Reveal>
                <TaglineSection />
            </Reveal>
            <Reveal>
                <LabelsCategorySection topAgencies={topAgencies} indieAgencies={indieAgencies} cardColors={cardColors} navigate={navigate} />
            </Reveal>
            <Reveal>
                <IndustryStatsSection agencies={agencies} totalArtists={totalArtists} />
            </Reveal>
            <Reveal>
                <BottomTextSection />
            </Reveal>

            {/* Stable hidden player container */}
            <div id={PLAYER_ID} className="absolute opacity-0 pointer-events-none w-0 h-0 overflow-hidden" />

        </div>
    );
}
