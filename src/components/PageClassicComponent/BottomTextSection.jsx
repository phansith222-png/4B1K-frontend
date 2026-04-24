import React from 'react';
import Reveal from '../Reveal'; 

export default function BottomTextSection({ artist }) {
    return (
        <section className="relative w-full h-[30vh] md:h-[40vh] overflow-hidden flex items-end justify-center bg-gradient-to-t from-[#9b2d96]/20 to-transparent pointer-events-none z-10">
            <Reveal delay={0.2} effect="fade-up">
                <h1 className="text-[13vw] leading-none font-classic font-black text-[#30294e]/80 tracking-tighter select-none whitespace-nowrap uppercase mb-[-2vw]">
                    {artist.artistName}
                </h1>
            </Reveal>
        </section>
    );
}
