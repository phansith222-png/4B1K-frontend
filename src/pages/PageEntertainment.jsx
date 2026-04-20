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

export default function PageEntertainment() {
    const navigate = useNavigate();
    const [agencies, setAgencies] = useState([]);
    const [totalArtists, setTotalArtists] = useState(0);
    const [loading, setLoading] = useState(true);

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

                const agencyMap = {};
                let countWithAgency = 0;

                allArtistsList.forEach(artist => {
                    if (artist.agency) {
                        countWithAgency++;
                        const agId = artist.agency.id;
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
                console.error("Error organizing agency data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAgenciesData();
    }, []);

    const cardColors = ['#00E5FF', '#FF007F', '#CEFF67', '#D4AF37', '#7000FF', '#D3131F'];
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
            
            <BackgroundEffects />
            <HeroSection navigate={navigate} />
            <TaglineSection />
            <LabelsCategorySection topAgencies={topAgencies} indieAgencies={indieAgencies} cardColors={cardColors} navigate={navigate} />
            <IndustryStatsSection agencies={agencies} totalArtists={totalArtists} />
            <BottomTextSection />

        </div>
    );
}