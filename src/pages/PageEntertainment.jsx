import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllArtists } from '../api/artist';

// นำเข้า Components ย่อย
import BackgroundEffects from '../components/PageEntertainmentComponent/BackgroundEffects';
import PageLoader from '../components/PageLoader';
import { SkeletonHero, SkeletonGrid } from '../components/Skeleton';
import HeroSection from '../components/PageEntertainmentComponent/HeroSection';
import TaglineSection from '../components/PageEntertainmentComponent/TaglineSection';
import LabelsCategorySection from '../components/PageEntertainmentComponent/LabelsCategorySection';
import IndustryStatsSection from '../components/PageEntertainmentComponent/IndustryStatsSection';
import BottomTextSection from '../components/PageEntertainmentComponent/BottomTextSection';
import TopChartsSection from '../components/PageEntertainmentComponent/TopChartsSection';
import Reveal from '../components/Reveal';
import BackButton from '../components/BackButton';
import { usePlayerStore } from '../stores/playerStore';

import { getArtistById } from '../api/artist';
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
        controls,
        playSongs,
        songs: globalSongs,
        artist: globalArtist
    } = usePlayerStore();

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
                // Logs removed

                // ── Fetch Songs for Top Charts (Database Only) ─────────────
                const chartArtists = allArtistsList.slice(0, 12);

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
                        artistId: artist.id || artist._id,
                        artistName,
                        coverImage: s.coverImage || artist.profileImage || artist.artistImage || "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=100&auto=format&fit=crop"
                    }));
                    allSongs = [...allSongs, ...songsWithArtist];
                });

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

    // ── Render ────────────────────────────────────────────────────────────
    return (
        <div className="bg-[#0B0C10] min-h-screen text-[#FFFFFF] font-sans overflow-x-hidden hide-scrollbar selection:bg-[#00E5FF] selection:text-black relative">
            <BackButton color="#00E5FF" glowColor="rgba(0, 229, 255, 0.3)" />

            {/* Background Effects - Always Renders */}
            <BackgroundEffects />

            {loading ? (
                <div className="pt-20">
                    <SkeletonHero />
                    <div className="px-6 md:px-12 mt-12">
                        <SkeletonGrid count={5} />
                    </div>
                </div>
            ) : (
                <>
                    <Reveal>
                        <HeroSection navigate={navigate} />
                    </Reveal>

                    <TopChartsSection
                        youtubeSongs={youtubeSongs}
                        spotifySongs={spotifySongs}
                        allChartSongs={allChartSongs}
                        currentSongIndex={globalArtist?.artistName === 'Top Charts' ? currentSongIndex : -1}
                        isPlaying={globalArtist?.artistName === 'Top Charts' ? isPlaying : false}
                        handleSongSelect={(idx) => {
                            if (globalArtist?.artistName !== 'Top Charts') {
                                playSongs({ artistName: 'Top Charts', profileImage: allChartSongs[idx]?.coverImage }, allChartSongs, idx);
                            } else if (controls?.handleSongSelect) {
                                controls.handleSongSelect(idx);
                            }
                        }}
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
                </>
            )}
        </div>
    );
}
