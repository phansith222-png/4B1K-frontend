import React from 'react';
import Reveal from '../Reveal'; // Add Import

export default function BottomTextSection({ artist }) {
    return (
        <section className="relative w-full h-[30vh] md:h-[40vh] overflow-hidden flex items-end justify-center bg-gradient-to-t from-[#FF007F]/10 to-[#0B0C10] pointer-events-none">
            <Reveal effect="fade-up">
                <h1 className="text-[13vw] leading-none font-black text-transparent bg-clip-text bg-gradient-to-t from-gray-800 to-[#0B0C10] tracking-tighter opacity-80 select-none whitespace-nowrap uppercase mb-[-2vw]">
                    {artist.artistName}
                </h1>
            </Reveal>
        </section>
    );
}
