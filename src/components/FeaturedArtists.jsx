import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Reveal from './Reveal';
import { getAllArtists } from '../api/artist';
import { GENRE_ARTIST_IDS } from '../constants/genreArtistIds';

export default function FeaturedArtists({ genre = 'pop' }) {
    const navigate = useNavigate();
    const [artists, setArtists] = useState([]);
    const [loading, setLoading] = useState(true);

    // ── Theme Mapping ──────────────────────────────────────────────────
    const theme = useMemo(() => {
        const themes = {
            pop: {
                primary: '#FF007F',
                secondary: '#00F5D4',
                gradient: 'from-[#FF007F] via-[#7000FF] to-[#00F5D4]',
                glow: 'rgba(255, 0, 127, 0.2)',
                accent: '#00F5D4'
            },
            rock: {
                primary: '#D3131F',
                secondary: '#1A1A1A',
                gradient: 'from-[#D3131F] via-[#7A0C12] to-[#D3131F]',
                glow: 'rgba(211, 19, 31, 0.2)',
                accent: '#D3131F'
            },
            classic: {
                primary: '#d83bb6',
                secondary: '#f9c1db',
                gradient: 'from-[#d83bb6] via-[#9b2d96] to-[#f9c1db]',
                glow: 'rgba(216, 59, 182, 0.2)',
                accent: '#d83bb6'
            },
            etc: {
                primary: '#2B5AE8',
                secondary: '#CEFF67',
                gradient: 'from-[#2B5AE8] via-[#1A3BA8] to-[#CEFF67]',
                glow: 'rgba(43, 90, 232, 0.2)',
                accent: '#CEFF67'
            }
        };
        return themes[genre] || themes.pop;
    }, [genre]);

    useEffect(() => {
        const fetchArtists = async () => {
            try {
                const res = await getAllArtists();
                let data = [];
                if (Array.isArray(res)) data = res;
                else if (res?.data && Array.isArray(res.data)) data = res.data;
                else if (res?.artists && Array.isArray(res.artists)) data = res.artists;
                
                // สุ่มมา 6 คน
                const shuffled = data.sort(() => 0.5 - Math.random());
                setArtists(shuffled.slice(0, 6));
            } catch (error) {
                console.error("❌ Failed to fetch artists", error);
            } finally {
                setLoading(false);
            }
        };
        fetchArtists();
    }, []);

    const getArtistPath = (artist) => {
        const id = Number(artist.id);
        const type = (artist.type || "").toLowerCase();

        if (GENRE_ARTIST_IDS.pop.includes(id) || type.includes('pop')) return `/pop?artistId=${id}`;
        if (GENRE_ARTIST_IDS.rock.includes(id) || type.includes('rock')) return `/rock?artistId=${id}`;
        if (GENRE_ARTIST_IDS.classic.includes(id) || type.includes('classic') || type.includes('r&b') || type.includes('soul')) return `/classic?artistId=${id}`;
        return `/etc?artistId=${id}`;
    };

    if (loading || artists.length === 0) return null;

    return (
        <section className="mt-32 pb-40 w-full relative z-10 px-4 md:px-10">
            {/* Header */}
            <Reveal effect="fade-up">
                <div className="text-center mb-24">
                    <span className="text-gray-500 font-bold text-[10px] uppercase tracking-[0.6em] mb-4 block opacity-50">
                        Featured Spotlight
                    </span>
                    <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white uppercase leading-none">
                        Featured <span className={`text-transparent bg-clip-text bg-gradient-to-r ${theme.gradient}`}>{genre === 'classic' ? 'R&B' : genre.toUpperCase()} Artists</span>
                    </h2>
                </div>
            </Reveal>

            {/* Grid Layout */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-20 md:gap-x-16 md:gap-y-32 max-w-7xl mx-auto">
                {artists.map((artist, idx) => (
                    <Reveal key={artist.id || idx} delay={idx * 0.1} effect="fade-up" overflow="visible">
                        <motion.div 
                            className="flex flex-col items-center group cursor-pointer relative"
                            onClick={() => navigate(getArtistPath(artist))}
                            style={{ willChange: 'transform' }}
                            whileHover={{ y: -15 }}
                            transition={{ type: "spring", stiffness: 150, damping: 20 }}
                        >
                            {/* Artist Avatar Container */}
                            <div className="relative w-36 h-36 md:w-52 md:h-52 mb-8">
                                {/* Theme-based Outer Glow on Hover */}
                                <div 
                                    className="absolute -inset-4 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-700"
                                    style={{ background: theme.primary }}
                                ></div>
                                
                                {/* Rotating Border with Theme Colors on Hover */}
                                <div className="absolute -inset-1.5 rounded-full border border-white/5 group-hover:border-transparent transition-all duration-700">
                                    <div 
                                        className="absolute inset-0 rounded-full border-t-2 border-r-2 border-transparent transition-all duration-1000 group-hover:rotate-[180deg]"
                                        style={{ borderTopColor: theme.primary, borderRightColor: theme.secondary, willChange: 'transform' }}
                                    ></div>
                                </div>
                                
                                {/* Image Shield */}
                                <div className="w-full h-full rounded-full overflow-hidden border-[6px] border-[#0B0C10] shadow-xl transition-all duration-500 relative z-10">
                                    <img 
                                        src={artist.profileImage || artist.artistImage || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=500&auto=format&fit=crop'} 
                                        alt={artist.artistName}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out grayscale-[20%] group-hover:grayscale-0"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40 opacity-40 group-hover:opacity-10 transition-opacity duration-500"></div>
                                </div>

                                {/* Floating Badge */}
                                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-white text-black text-[9px] font-black px-4 py-1.5 rounded-full shadow-lg transform translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 z-20 uppercase tracking-[0.2em] whitespace-nowrap">
                                    View Profile
                                </div>
                            </div>

                            {/* Artist Info */}
                            <div className="text-center">
                                <h3 className={`text-lg md:text-2xl font-black tracking-widest text-white transition-all duration-500 uppercase group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r ${theme.gradient}`}>
                                    {artist.artistName}
                                </h3>
                                <div 
                                    className={`mt-3 w-8 h-1 bg-white/10 mx-auto rounded-full group-hover:w-16 bg-gradient-to-r ${theme.gradient} transition-all duration-500`}
                                ></div>
                            </div>
                        </motion.div>
                    </Reveal>
                ))}
            </div>
        </section>
    );
}
