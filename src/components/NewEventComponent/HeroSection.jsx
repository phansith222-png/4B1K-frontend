import React from 'react';
import Reveal from '../Reveal';

export default function HeroSection() {
    return (
        <Reveal effect="fade-up">
            <section className="mb-24 text-center md:text-left mt-8">
                <span className="text-[#00E5FF] font-black text-xs md:text-sm uppercase tracking-[0.4em] mb-4 block">Live Music</span>
                <h1 className="text-5xl md:text-7xl lg:text-[6.5rem] font-black tracking-tighter mb-8 text-white uppercase leading-[0.9]">
                    Concert <br className="hidden md:block" /><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] via-[#7000FF] to-[#FF007F]">Events</span>
                </h1>
                <p className="text-gray-400 max-w-2xl text-sm md:text-lg font-medium leading-relaxed tracking-wide mx-auto md:mx-0 border-l-[3px] border-[#00E5FF] pl-6 py-2">
                    Discover live performances, concerts, and exclusive fan meetings across Thailand. Find your favorite artists and secure your spot today.
                </p>
            </section>
        </Reveal>
    );
}
