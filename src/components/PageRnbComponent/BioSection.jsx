import React from 'react';
import { motion } from 'framer-motion';
import Reveal from '../Reveal'; 

export default function BioSection({ artist }) {
    return (
        <section className="relative w-full py-32 px-6 border-b border-[#9b2d96]/20 bg-gradient-to-b from-transparent to-[#30294e]/30 z-10">
            <Reveal effect="fade-up">
                <div className="max-w-4xl mx-auto text-center flex flex-col gap-8">
                    <h2 className="text-4xl md:text-6xl font-classic text-white/90 leading-relaxed drop-shadow-[0_0_20px_rgba(249,193,219,0.2)] font-light">
                        "{artist.biography ? artist.biography : 'A Vibe that Echoes through Time'}"
                    </h2>
                    <div className="w-16 h-1 bg-gradient-to-r from-transparent via-[#d83bb6] to-transparent mx-auto my-6 rounded-full shadow-[0_0_10px_#d83bb6]"></div>
                    <p className="font-sub text-lg md:text-xl text-[#b266c5] font-semibold leading-relaxed tracking-[0.2em] uppercase">
                        Neo-Soul <span className="text-[#f9c1db]/30 mx-4">•</span> R&B Rhythm <span className="text-[#f9c1db]/30 mx-4">•</span> Modern Grooves
                    </p>
                </div>
            </Reveal>
        </section>
    );
}
