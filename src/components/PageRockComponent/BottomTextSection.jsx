import React from 'react';
import Reveal from '../Reveal'; // Add Import

export default function BottomTextSection({ artist }) {
    return (
        <section className="relative w-full h-[30vh] md:h-[40vh] overflow-hidden flex items-end justify-center bg-gradient-to-t from-[#D3131F]/10 to-[#050505] pointer-events-none">
            {/* Wrap large text with Reveal */}
            <Reveal effect="fade-up">
                <h1 className="text-[11vw] leading-none font-black text-transparent bg-clip-text bg-gradient-to-t from-gray-800 to-[#050505] tracking-tighter select-none whitespace-nowrap opacity-60 uppercase pb-4">
                    {artist.artistName}
                </h1>
            </Reveal>
        </section>
    );
}
