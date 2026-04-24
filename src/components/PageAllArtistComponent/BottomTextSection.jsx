import React, { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import useContentStore from '../../stores/contentStore';

export default function BottomTextSection() {
    const { artists, getAllArtists } = useContentStore();

    useEffect(() => {
        if (!artists || artists.length === 0) {
            getAllArtists();
        }
    }, [artists, getAllArtists]);

    // Create a long list of shuffled artist names for the infinite marquee
    const marqueeItems = useMemo(() => {
        if (!artists || artists.length === 0) return ["4B1K ARCHIVE", "ARTISTS ARCHIVE", "DISCOVER MUSIC", "STAY TUNED"];
        
        // Extract names
        const names = artists.map(a => a.artistName || "ARTIST");
        
        // Shuffle the names
        const shuffle = (array) => {
            let currentIndex = array.length, randomIndex;
            while (currentIndex !== 0) {
                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex--;
                [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
            }
            return array;
        };

        const shuffledNames = shuffle([...names]);
        
        // Return a long enough array to ensure the marquee is continuous
        // We repeat it to make sure the loop is seamless
        return [...shuffledNames, ...shuffledNames, ...shuffledNames];
    }, [artists]);

    return (
        <section className="relative w-full h-[30vh] md:h-[50vh] flex items-center overflow-hidden py-32 pointer-events-none bg-[#0B0C10] z-20">
            
            {/* The Infinite Marquee Container */}
            <div className="flex whitespace-nowrap overflow-hidden relative z-10">
                <motion.div
                    animate={{ x: ["0%", "-33.33%"] }}
                    transition={{
                        duration: 800, // Extremely slow, almost static-like motion
                        repeat: Infinity,
                        ease: "linear",
                    }}
                    className="flex gap-32 md:gap-64 items-center px-20"
                >
                    {marqueeItems.map((name, i) => (
                        <span 
                            key={i}
                            className="text-[12vw] md:text-[18vw] font-black tracking-tighter uppercase select-none leading-none transition-all duration-700"
                            style={{
                                WebkitTextStroke: "2px rgba(0, 229, 255, 0.15)",
                                textShadow: "0 0 30px rgba(112, 0, 255, 0.1)",
                                opacity: 0.25,
                                color: 'transparent',
                                background: 'linear-gradient(to bottom, #7000FF, #00E5FF)',
                                WebkitBackgroundClip: 'text',
                                backgroundClip: 'text'
                            }}
                        >
                            {name}
                        </span>
                    ))}
                </motion.div>
            </div>

            {/* Top and Bottom atmospheric gradients */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0B0C10] via-transparent to-[#0B0C10] opacity-80" />
            
            {/* Left and Right fade out */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0B0C10] via-transparent to-[#0B0C10] opacity-100" />
        </section>
    );
}
